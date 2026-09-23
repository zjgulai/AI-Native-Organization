#!/usr/bin/env python3
"""Build the VIS-G5 static-quality register from pinned Sanbao_Web assets.

The script deliberately streams approved delivery renditions from the fixed Git
commit into memory.  It never writes source images into the workspace, dist, or
the generated register.  An optional review directory may contain temporary
contact sheets for an assisted visual review, and must be outside this project.

Usage:
  python3 scripts/build-sanbao-vis-g5.py \
    --output docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G5-STATIC-QUALITY-REGISTER-2026-09-24.json \
    --review-directory /tmp/vis-g5-review

After reviewing the temporary contact sheets, rerun with a reviewer label to
record the assisted visual disposition.  The binary scan is intentionally
repeated so the accepted register remains independently reproducible.
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import math
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date
from itertools import combinations
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

try:
    from PIL import Image, ImageDraw, ImageFont, ImageOps, __version__ as PILLOW_VERSION
except ImportError as error:  # pragma: no cover - environment guard
    raise SystemExit(
        "VIS-G5 requires the locally available Pillow decoder; install nothing automatically. "
        "Missing import: " + str(error)
    )


ROOT = Path.cwd().resolve()
DEFAULT_G2 = "docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G2-SEMANTIC-REGISTER-2026-09-24.json"
DEFAULT_G3 = "docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G3-VISUAL-IDENTITY-BINDINGS-2026-09-24.json"
EXPECTED_G2_STATUS = "COMPLETE_STRUCTURAL_SEMANTICS_WITH_G0_FINGERPRINT_EXCEPTION"
EXPECTED_G3_STATUS = "COMPLETE_BINDING_TABLE_PENDING_VIS_G5"
MIN_NATIVE_RENDITION_PSNR_DB = 30.0
MAX_NATIVE_RENDITION_DHASH_DISTANCE = 12
MIN_CROSS_THEME_CENTER_CORRELATION = 0.35
MAX_CROSS_THEME_CENTER_DHASH_DISTANCE = 24
NEAR_DUPLICATE_DHASH_DISTANCE = 8
NEAR_DUPLICATE_CENTER_CORRELATION = 0.85


def fail(message: str) -> None:
    raise RuntimeError(message)


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_file(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def git_blob_sha1(value: bytes) -> str:
    header = f"blob {len(value)}\0".encode("utf-8")
    return hashlib.sha1(header + value).hexdigest()


def canonical_digest(records: list[dict[str, Any]]) -> str:
    lines = []
    for record in sorted(records, key=lambda item: item["asset_id"]):
        dimensions = record["observed"]["dimensions_px"]
        lines.append(
            "\t".join(
                [
                    record["asset_id"],
                    record["observed"]["content_sha256"],
                    record["observed"]["git_blob_sha1"],
                    str(record["observed"]["bytes"]),
                    record["observed"]["mime_type"],
                    f"{dimensions[0]}x{dimensions[1]}",
                ]
            )
        )
    return sha256_bytes(("\n".join(lines) + "\n").encode("utf-8"))


def as_json(path: Path) -> dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        fail("缺少输入登记册：" + str(path))
    except json.JSONDecodeError as error:
        fail("输入登记册不是有效 JSON：" + str(error))


def ensure(condition: bool, message: str) -> None:
    if not condition:
        fail(message)


def mime_from_signature(value: bytes) -> str | None:
    if value.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if len(value) >= 12 and value[:4] == b"RIFF" and value[8:12] == b"WEBP":
        return "image/webp"
    return None


def flattened_values(image: Image.Image) -> list[int]:
    return list(image.get_flattened_data())


def rgb_channel_values(image: Image.Image) -> list[int]:
    return [channel for pixel in image.get_flattened_data() for channel in pixel]


def grayscale_pixels(image: Image.Image, size: tuple[int, int]) -> list[int]:
    resized = image.convert("L").resize(size, Image.Resampling.LANCZOS)
    return flattened_values(resized)


def difference_hash(image: Image.Image) -> str:
    pixels = grayscale_pixels(image, (9, 8))
    bits = 0
    for row in range(8):
        for column in range(8):
            left = pixels[row * 9 + column]
            right = pixels[row * 9 + column + 1]
            index = row * 8 + column
            if left > right:
                bits |= 1 << index
    return f"{bits:016x}"


def hamming_distance(left: str, right: str) -> int:
    return (int(left, 16) ^ int(right, 16)).bit_count()


def center_crop(image: Image.Image) -> Image.Image:
    width, height = image.size
    return image.crop((width * 0.15, height * 0.05, width * 0.85, height * 0.95))


def pearson_correlation(left: list[int], right: list[int]) -> float:
    ensure(len(left) == len(right) and len(left) > 0, "感知比较输入为空或长度不一致")
    left_mean = sum(left) / len(left)
    right_mean = sum(right) / len(right)
    left_delta = [value - left_mean for value in left]
    right_delta = [value - right_mean for value in right]
    denominator = math.sqrt(sum(value * value for value in left_delta)) * math.sqrt(
        sum(value * value for value in right_delta)
    )
    return 0.0 if denominator == 0 else sum(
        left_value * right_value for left_value, right_value in zip(left_delta, right_delta)
    ) / denominator


def edge_energy(image: Image.Image) -> float:
    width = height = 64
    pixels = grayscale_pixels(image, (width, height))
    total = 0
    count = 0
    for row in range(height):
        for column in range(width):
            current = pixels[row * width + column]
            if column + 1 < width:
                total += abs(current - pixels[row * width + column + 1])
                count += 1
            if row + 1 < height:
                total += abs(current - pixels[(row + 1) * width + column])
                count += 1
    return round(total / count, 4)


def visual_signature(image: Image.Image) -> tuple[dict[str, Any], list[int]]:
    normalized = ImageOps.exif_transpose(image).convert("RGB")
    center_values = grayscale_pixels(center_crop(normalized), (32, 32))
    return (
        {
            "algorithm": "dhash-9x8-and-center-luminance-v1",
            "full_dhash_64": difference_hash(normalized),
            "center_dhash_64": difference_hash(center_crop(normalized)),
            "edge_energy_64px": edge_energy(normalized),
        },
        center_values,
    )


def psnr_and_dhash(reference: Image.Image, rendition: Image.Image) -> dict[str, Any]:
    expected = reference.convert("RGB").resize(rendition.size, Image.Resampling.LANCZOS)
    actual = rendition.convert("RGB")
    expected_values = rgb_channel_values(expected)
    actual_values = rgb_channel_values(actual)
    ensure(len(expected_values) == len(actual_values), "原生图与派生件像素长度不一致")
    mse = sum(
        (expected_value - actual_value) ** 2
        for expected_value, actual_value in zip(expected_values, actual_values)
    ) / len(expected_values)
    psnr = float("inf") if mse == 0 else 10 * math.log10((255 * 255) / mse)
    dhash_distance = hamming_distance(difference_hash(expected), difference_hash(actual))
    status = (
        "PASS_NATIVE_RENDITION_COHERENCE"
        if psnr >= MIN_NATIVE_RENDITION_PSNR_DB
        and dhash_distance <= MAX_NATIVE_RENDITION_DHASH_DISTANCE
        else "HOLD_NATIVE_RENDITION_COHERENCE"
    )
    return {
        "comparison_algorithm": "native-lanczos-rgb-psnr-and-dhash-v1",
        "psnr_db": round(psnr, 4) if math.isfinite(psnr) else "INF",
        "dhash_hamming_distance": dhash_distance,
        "thresholds": {
            "minimum_psnr_db": MIN_NATIVE_RENDITION_PSNR_DB,
            "maximum_dhash_hamming_distance": MAX_NATIVE_RENDITION_DHASH_DISTANCE,
        },
        "status": status,
    }


def source_asset_id(binding: dict[str, Any], theme: str, rendition: str) -> str:
    theme_assets = binding["presentation"]["themes"].get(theme)
    ensure(theme_assets is not None, f"绑定缺少 {theme} 主题：{binding['binding_id']}")
    slots = {
        "64": "list_asset_id",
        "128": "fallback_asset_id",
        "256": "primary_asset_id",
        "native": "quality_trace_native_asset_id",
    }
    asset_id = theme_assets[slots[rendition]]
    if rendition == "256":
        ensure(
            theme_assets["detail_asset_id"] == asset_id,
            f"主图与详情图不能引用不同的 256px 素材：{binding['binding_id']}/{theme}",
        )
    return asset_id


def expected_assets(bindings: list[dict[str, Any]], asset_by_id: dict[str, dict[str, Any]]) -> dict[str, dict[str, Any]]:
    selected: dict[str, dict[str, Any]] = {}
    for binding in bindings:
        for theme in ("dark", "light"):
            for rendition in ("64", "128", "256", "native"):
                asset_id = source_asset_id(binding, theme, rendition)
                asset = asset_by_id.get(asset_id)
                ensure(asset is not None, f"VIS-G3 引用不存在的 VIS-G2 素材：{asset_id}")
                attributes = asset["semantic_attributes"]
                ensure(
                    asset["asset_domain"] == "DELIVERY_RENDITIONS"
                    and asset["source_persona_id"] == binding["source_persona_id"]
                    and attributes["ui_theme"] == theme
                    and asset["governance"]["delivery_policy"] == "APPROVED_DELIVERY"
                    and asset["governance"]["role_bindability"] == "ELIGIBLE_FOR_PERSONA_BINDING",
                    f"绑定素材不具备已批准展示资格：{asset_id}",
                )
                if rendition == "native":
                    ensure(
                        asset["asset_class"] == "PERSONA_NATIVE_PORTRAIT"
                        and attributes["format"] == "png",
                        f"原生追溯项不是 PNG：{asset_id}",
                    )
                else:
                    ensure(
                        asset["asset_class"] == "PERSONA_WEBP_RENDITION"
                        and attributes["format"] == "webp"
                        and attributes["declared_rendition_size_px"] == int(rendition),
                        f"WebP 派生件规格错误：{asset_id}",
                    )
                selected[asset_id] = asset
    return selected


def fetch_bytes(relative_path: str, base_url: str) -> bytes:
    url = base_url + relative_path
    request = Request(url, headers={"User-Agent": "AI-Organization-VIS-G5-Audit/1.0"})
    last_error: Exception | None = None
    for attempt in range(1, 4):
        try:
            with urlopen(request, timeout=45) as response:
                return response.read()
        except (HTTPError, URLError, TimeoutError) as error:
            last_error = error
            if attempt < 3:
                time.sleep(attempt)
    raise RuntimeError(f"固定提交素材读取失败（尝试3次）：{relative_path}; {last_error}")


def audit_asset(asset_id: str, asset: dict[str, Any], base_url: str) -> tuple[dict[str, Any], Image.Image, list[int]]:
    locator = asset["source_locator"]
    content = fetch_bytes(locator["source_path"], base_url)
    signature_mime = mime_from_signature(content)
    expected_format = asset["semantic_attributes"]["format"]
    expected_mime = "image/png" if expected_format == "png" else "image/webp"

    with Image.open(io.BytesIO(content)) as checker:
        checker.verify()
    with Image.open(io.BytesIO(content)) as decoded:
        decoded.load()
        image = ImageOps.exif_transpose(decoded).convert("RGB")
        actual_format = decoded.format.lower() if decoded.format else None

    expected_dimensions = asset["semantic_attributes"]["dimensions_px"]
    observed_dimensions = [image.width, image.height]
    result = {
        "asset_id": asset_id,
        "source_persona_id": asset["source_persona_id"],
        "theme": asset["semantic_attributes"]["ui_theme"],
        "rendition": (
            "native"
            if asset["asset_class"] == "PERSONA_NATIVE_PORTRAIT"
            else str(asset["semantic_attributes"]["declared_rendition_size_px"])
        ),
        "expected": {
            "git_blob_sha1": locator["git_blob_sha"],
            "bytes": locator["bytes"],
            "mime_type": expected_mime,
            "dimensions_px": [expected_dimensions["width"], expected_dimensions["height"]],
        },
        "observed": {
            "git_blob_sha1": git_blob_sha1(content),
            "content_sha256": sha256_bytes(content),
            "bytes": len(content),
            "mime_type": signature_mime,
            "decoded_format": actual_format,
            "dimensions_px": observed_dimensions,
        },
    }
    checks = {
        "git_blob_matches_fixed_tree": result["observed"]["git_blob_sha1"]
        == result["expected"]["git_blob_sha1"],
        "byte_count_matches_fixed_tree": result["observed"]["bytes"] == result["expected"]["bytes"],
        "magic_mime_matches_expected": signature_mime == expected_mime,
        "decoder_format_matches_expected": actual_format == expected_format,
        "decoded_dimensions_match_expected": observed_dimensions == result["expected"]["dimensions_px"],
    }
    result["binary_checks"] = checks
    result["binary_status"] = "VERIFIED" if all(checks.values()) else "HOLD_BINARY_MISMATCH"
    descriptor, center_values = visual_signature(image)
    result["static_visual_signal"] = descriptor
    return result, image, center_values


def make_contact_sheets(
    bindings: list[dict[str, Any]],
    asset_by_id: dict[str, dict[str, Any]],
    base_url: str,
    review_directory: Path,
) -> dict[str, Any]:
    if review_directory == ROOT or ROOT in review_directory.parents:
        fail("临时审阅目录不能位于项目工作区：" + str(review_directory))
    review_directory.mkdir(parents=True, exist_ok=True)
    font_paths = [
        Path("/System/Library/Fonts/PingFang.ttc"),
        Path("/System/Library/Fonts/Supplemental/Arial Unicode.ttf"),
    ]
    font = next(
        (
            ImageFont.truetype(path, 16)
            for path in font_paths
            if path.exists()
        ),
        ImageFont.load_default(),
    )
    per_page = 5
    written = 0
    for page_index in range(0, len(bindings), per_page):
        page_bindings = bindings[page_index : page_index + per_page]
        row_height = 310
        page = Image.new("RGB", (920, 20 + row_height * len(page_bindings)), "#f7f8fa")
        draw = ImageDraw.Draw(page)
        for offset, binding in enumerate(page_bindings):
            y = 20 + offset * row_height
            title = (
                f"{binding['binding_id']} | {binding['role_display_name']} | "
                f"{binding['source_persona_id']} | 256 dark/light + 64 dark/light"
            )
            draw.text((16, y), title, fill="#151b26", font=font)
            for column, (theme, rendition, display_size) in enumerate(
                [
                    ("dark", "256", (256, 256)),
                    ("light", "256", (256, 256)),
                    ("dark", "64", (128, 128)),
                    ("light", "64", (128, 128)),
                ]
            ):
                asset_id = source_asset_id(binding, theme, rendition)
                asset = asset_by_id[asset_id]
                content = fetch_bytes(asset["source_locator"]["source_path"], base_url)
                with Image.open(io.BytesIO(content)) as original:
                    original.load()
                    preview = ImageOps.exif_transpose(original).convert("RGB")
                if display_size != preview.size:
                    method = (
                        Image.Resampling.NEAREST
                        if rendition == "64"
                        else Image.Resampling.LANCZOS
                    )
                    preview = preview.resize(display_size, method)
                x = [16, 288, 560, 712][column]
                page.paste(preview, (x, y + 32))
                draw.text((x, y + 292), f"{theme} {rendition}px", fill="#151b26", font=font)
        sheet_path = review_directory / f"vis-g5-quality-review-{written + 1:02d}.png"
        page.save(sheet_path, format="PNG", optimize=True)
        written += 1
    return {
        "status": "TEMPORARY_CONTACT_SHEETS_CREATED_OUTSIDE_WORKSPACE",
        "binding_count": len(bindings),
        "sheet_count": written,
        "retention": "Temporary reviewer aid only; must be removed after the assisted visual review.",
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", required=True, help="VIS-G5 JSON register path, relative to the project root")
    parser.add_argument("--vis-g2-register", default=DEFAULT_G2)
    parser.add_argument("--vis-g3-bindings", default=DEFAULT_G3)
    parser.add_argument("--review-directory", help="Temporary directory outside the project for review contact sheets")
    parser.add_argument(
        "--reviewer",
        help="Non-empty label only after all temporary contact sheets have been reviewed",
    )
    parser.add_argument(
        "--hold-binding",
        action="append",
        default=[],
        help="Reviewed binding that must remain PENDING_OWNER_VISUAL_DECISION; repeat as needed",
    )
    parser.add_argument(
        "--accepted-risk-binding",
        action="append",
        default=[],
        help="Reviewed binding whose visual-near-duplicate risk the owner explicitly accepts; repeat as needed",
    )
    parser.add_argument(
        "--owner-risk-decision-id",
        default="D-076",
        help="Recorded decision identifier required when --accepted-risk-binding is used",
    )
    parser.add_argument(
        "--monitor-persona-pair",
        action="append",
        default=[],
        help="Reviewed non-blocking near-visual pair as AGT-xxx,AGT-yyy; repeat as needed",
    )
    parser.add_argument("--audit-date", default=date.today().isoformat())
    parser.add_argument("--network-workers", type=int, default=8)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    ensure(args.network_workers >= 1 and args.network_workers <= 12, "并发读取数必须在 1 到 12 之间")
    output_path = (ROOT / args.output).resolve()
    ensure(output_path == ROOT or ROOT in output_path.parents, "输出必须位于项目工作区")
    g2_path = (ROOT / args.vis_g2_register).resolve()
    g3_path = (ROOT / args.vis_g3_bindings).resolve()
    g2 = as_json(g2_path)
    g3 = as_json(g3_path)

    ensure(
        g2.get("gate", {}).get("id") == "VIS-G2"
        and g2["gate"].get("status") == EXPECTED_G2_STATUS,
        "VIS-G2 不是可接受的结构性输入",
    )
    ensure(
        g3.get("gate", {}).get("id") == "VIS-G3"
        and g3["gate"].get("status") == EXPECTED_G3_STATUS,
        "VIS-G3 不是待 VIS-G5 验收的结构性绑定输入",
    )
    ensure(
        g3["source_anchor"]["commit"] == g2["source_anchor"]["commit"]
        and g3["source_anchor"]["tree"] == g2["source_anchor"]["tree"],
        "VIS-G2/VIS-G3 固定来源锚点不一致",
    )
    acceptance = g3["source_anchor"]["canonicalization_acceptance"]
    ensure(
        acceptance["decision_id"] == "D-073"
        and acceptance["status"] == "ACCEPTED"
        and acceptance["canonicalization"]["version"] == "VIS-G2-CANONICALIZATION-1"
        and acceptance["legacy_g0_fingerprints"]["status"] == "RETAINED_HISTORICAL_NOT_VERIFIED",
        "D-073 的 VIS-G2 可复算目录锚点接受记录不完整",
    )

    bindings = g3["bindings"]
    ensure(len(bindings) == 53, "VIS-G5 必须覆盖 53 条 VIS-G3 绑定")
    ensure(
        len({binding["binding_id"] for binding in bindings}) == 53
        and len({binding["role_id"] for binding in bindings}) == 53
        and len({binding["source_persona_id"] for binding in bindings}) == 53,
        "VIS-G3 绑定不再保持唯一角色/人物关系",
    )
    asset_by_id = {asset["asset_id"]: asset for asset in g2["asset_semantic_index"]}
    binding_ids = {binding["binding_id"] for binding in bindings}
    source_persona_ids = {binding["source_persona_id"] for binding in bindings}
    hold_binding_ids = set(args.hold_binding)
    accepted_risk_binding_ids = set(args.accepted_risk_binding)
    ensure(
        hold_binding_ids.issubset(binding_ids),
        "--hold-binding 包含未知 VIS-G3 binding_id："
        + ", ".join(sorted(hold_binding_ids - binding_ids)),
    )
    ensure(
        accepted_risk_binding_ids.issubset(binding_ids),
        "--accepted-risk-binding 包含未知 VIS-G3 binding_id："
        + ", ".join(sorted(accepted_risk_binding_ids - binding_ids)),
    )
    ensure(
        not (hold_binding_ids & accepted_risk_binding_ids),
        "同一绑定不能同时处于所有者 HOLD 与已接受风险状态："
        + ", ".join(sorted(hold_binding_ids & accepted_risk_binding_ids)),
    )
    ensure(
        not accepted_risk_binding_ids or bool(args.reviewer),
        "记录已接受的视觉风险前必须先提供完成辅助审阅的 --reviewer",
    )
    ensure(
        not accepted_risk_binding_ids
        or (args.owner_risk_decision_id and args.owner_risk_decision_id.strip()),
        "--accepted-risk-binding 必须带非空的 --owner-risk-decision-id",
    )
    monitor_pairs = []
    for pair in args.monitor_persona_pair:
        personas = [part.strip() for part in pair.split(",")]
        ensure(
            len(personas) == 2
            and personas[0] != personas[1]
            and all(persona in source_persona_ids for persona in personas),
            "--monitor-persona-pair 必须是两个已绑定、不同的 source_persona_id：" + pair,
        )
        monitor_pairs.append(tuple(sorted(personas)))
    selected = expected_assets(bindings, asset_by_id)
    ensure(len(selected) == 424, f"VIS-G5 应读取424个唯一交付二进制，实际为 {len(selected)}")
    expected_format_counts = {"png": 0, "webp": 0}
    for asset in selected.values():
        expected_format_counts[asset["semantic_attributes"]["format"]] += 1
    ensure(expected_format_counts == {"png": 106, "webp": 318}, "VIS-G5 二进制格式覆盖不正确")

    base_url = (
        g2["source_anchor"]["repository_url"].replace("https://github.com/", "https://raw.githubusercontent.com/")
        + "/"
        + g2["source_anchor"]["commit"]
        + "/"
    )
    results_by_id: dict[str, tuple[dict[str, Any], Image.Image, list[int]]] = {}
    with ThreadPoolExecutor(max_workers=args.network_workers) as executor:
        pending = {
            executor.submit(audit_asset, asset_id, asset, base_url): asset_id
            for asset_id, asset in sorted(selected.items())
        }
        for future in as_completed(pending):
            asset_id = pending[future]
            try:
                results_by_id[asset_id] = future.result()
            except Exception as error:
                fail(f"VIS-G5 无法验证 {asset_id}：{error}")

    asset_results = [results_by_id[asset_id][0] for asset_id in sorted(results_by_id)]
    ensure(
        all(result["binary_status"] == "VERIFIED" for result in asset_results),
        "至少一个绑定交付件未通过实际二进制核验",
    )
    observed_sha256s = [result["observed"]["content_sha256"] for result in asset_results]
    ensure(len(set(observed_sha256s)) == len(observed_sha256s), "实际读取的绑定交付件出现精确 SHA-256 重复")

    binding_results: list[dict[str, Any]] = []
    source_signals: dict[str, dict[str, Any]] = {}
    for binding in bindings:
        theme_results: dict[str, Any] = {}
        for theme in ("dark", "light"):
            native_id = source_asset_id(binding, theme, "native")
            native = results_by_id[native_id][1]
            rendition_results = {}
            for rendition in ("64", "128", "256"):
                asset_id = source_asset_id(binding, theme, rendition)
                rendition_results[rendition] = {
                    "asset_id": asset_id,
                    **psnr_and_dhash(native, results_by_id[asset_id][1]),
                }
            ensure(
                all(
                    rendition["status"] == "PASS_NATIVE_RENDITION_COHERENCE"
                    for rendition in rendition_results.values()
                ),
                f"原生图与派生件质量不一致：{binding['binding_id']}/{theme}",
            )
            theme_results[theme] = {
                "native_asset_id": native_id,
                "rendition_quality": rendition_results,
            }

        dark_native_id = source_asset_id(binding, "dark", "native")
        light_native_id = source_asset_id(binding, "light", "native")
        dark_result, _, dark_center = results_by_id[dark_native_id]
        light_result, _, light_center = results_by_id[light_native_id]
        correlation = pearson_correlation(dark_center, light_center)
        center_distance = hamming_distance(
            dark_result["static_visual_signal"]["center_dhash_64"],
            light_result["static_visual_signal"]["center_dhash_64"],
        )
        theme_coherence_status = (
            "PASS_THEME_COHERENCE_SIGNAL"
            if correlation >= MIN_CROSS_THEME_CENTER_CORRELATION
            and center_distance <= MAX_CROSS_THEME_CENTER_DHASH_DISTANCE
            else "HOLD_THEME_COHERENCE_SIGNAL"
        )
        ensure(
            theme_coherence_status == "PASS_THEME_COHERENCE_SIGNAL",
            f"深浅主题的静态同源信号异常：{binding['binding_id']}",
        )
        source_signals[binding["source_persona_id"]] = {
            "binding_id": binding["binding_id"],
            "asset_id": dark_native_id,
            "center_dhash_64": dark_result["static_visual_signal"]["center_dhash_64"],
            "center_values": dark_center,
        }
        is_owner_hold = binding["binding_id"] in hold_binding_ids
        is_owner_accepted_risk = binding["binding_id"] in accepted_risk_binding_ids
        review_status = (
            "PENDING_OWNER_VISUAL_DECISION"
            if is_owner_hold
            else "ACCEPTED_OWNER_VISUAL_RISK_DECISION"
            if is_owner_accepted_risk
            else "ACCEPTED_ASSISTED_VISUAL_REVIEW"
            if args.reviewer
            else "PENDING_ASSISTED_VISUAL_REVIEW"
        )
        binding_results.append(
            {
                "binding_id": binding["binding_id"],
                "role_id": binding["role_id"],
                "role_kind": binding["role_kind"],
                "role_display_name": binding["role_display_name"],
                "source_persona_id": binding["source_persona_id"],
                "binary_status": "VERIFIED",
                "visual_quality_status": "PENDING_OWNER_VISUAL_DECISION"
                if is_owner_hold
                else "PASS_FOR_VIS_G5_ASSET_QUALITY_WITH_ACCEPTED_OWNER_VISUAL_RISK"
                if is_owner_accepted_risk
                else "PASS_FOR_VIS_G5_ASSET_QUALITY"
                if args.reviewer
                else "PENDING_ASSISTED_VISUAL_REVIEW",
                "owner_decision_reason": "PERCEPTUAL_NEAR_DUPLICATE_OWNER_DECISION_REQUIRED"
                if is_owner_hold
                else f"OWNER_ACCEPTED_PERCEPTUAL_NEAR_DUPLICATE_RISK_{args.owner_risk_decision_id}"
                if is_owner_accepted_risk
                else None,
                "owner_risk_decision": {
                    "status": "ACCEPTED",
                    "decision_id": args.owner_risk_decision_id,
                    "scope": "Perceptual near-duplicate display risk accepted; no automatic remap, release, or page operation.",
                }
                if is_owner_accepted_risk
                else None,
                "themes": theme_results,
                "cross_theme_coherence": {
                    "algorithm": "center-crop-luminance-correlation-and-dhash-v1",
                    "center_luminance_correlation": round(correlation, 4),
                    "center_dhash_hamming_distance": center_distance,
                    "thresholds": {
                        "minimum_center_luminance_correlation": MIN_CROSS_THEME_CENTER_CORRELATION,
                        "maximum_center_dhash_hamming_distance": MAX_CROSS_THEME_CENTER_DHASH_DISTANCE,
                    },
                    "status": theme_coherence_status,
                    "interpretation": "Static coherence signal only; final display suitability requires the assisted visual review.",
                },
                "accessibility": {
                    "dark_alt_text": binding["presentation"]["alt_text"]["dark"],
                    "light_alt_text": binding["presentation"]["alt_text"]["light"],
                    "status": "FINAL_NEUTRAL_TEXT_ACCEPTED_VIS_G5"
                    if args.reviewer
                    else "DRAFT_NEUTRAL_TEXT_PENDING_ASSISTED_VISUAL_REVIEW",
                    "policy": "Neutral role-and-theme description; no appearance, prompt, source, or identity-reference detail.",
                },
                "assisted_visual_review": {
                    "status": review_status,
                    "reviewer": args.reviewer or None,
                    "coverage": "256px dark/light and upscaled 64px dark/light contact-sheet review",
                    "criteria": [
                        "same source persona remains visually coherent across dark and light themes",
                        "head, hair, and shoulders remain safely framed for circular or rounded-square display",
                        "64px rendition remains recognizable and free of obvious truncation or corruption",
                    ],
                },
                "visual_identity_release": {
                    "status": "NOT_CREATED_PENDING_OWNER_DECISION_AND_VIS_G6"
                    if is_owner_hold
                    else "NOT_CREATED_PENDING_VIS_G6"
                },
                "presentation_projection": {
                    "status": "NOT_RENDERABLE_PENDING_OWNER_DECISION_AND_VIS_G6"
                    if is_owner_hold
                    else "NOT_RENDERABLE_PENDING_VIS_G6"
                },
            }
        )

    duplicate_candidates = []
    for left_id, right_id in combinations(sorted(source_signals), 2):
        left = source_signals[left_id]
        right = source_signals[right_id]
        distance = hamming_distance(left["center_dhash_64"], right["center_dhash_64"])
        correlation = pearson_correlation(left["center_values"], right["center_values"])
        if distance <= NEAR_DUPLICATE_DHASH_DISTANCE and correlation >= NEAR_DUPLICATE_CENTER_CORRELATION:
            duplicate_candidates.append(
                {
                    "left_source_persona_id": left_id,
                    "right_source_persona_id": right_id,
                    "left_binding_id": left["binding_id"],
                    "right_binding_id": right["binding_id"],
                    "center_dhash_hamming_distance": distance,
                    "center_luminance_correlation": round(correlation, 4),
                    "status": "PENDING_OWNER_VISUAL_DECISION"
                    if left["binding_id"] in hold_binding_ids
                    or right["binding_id"] in hold_binding_ids
                    else "ACCEPTED_OWNER_VISUAL_RISK_DECISION"
                    if left["binding_id"] in accepted_risk_binding_ids
                    or right["binding_id"] in accepted_risk_binding_ids
                    else "REQUIRES_ASSISTED_VISUAL_REVIEW"
                    if not args.reviewer
                    else "DISTINCT_PERSONA_CONFIRMED_BY_ASSISTED_VISUAL_REVIEW",
                }
            )

    contact_sheet_summary = None
    if args.review_directory:
        contact_sheet_summary = make_contact_sheets(
            bindings,
            asset_by_id,
            base_url,
            Path(args.review_directory).resolve(),
        )
    overall_status = (
        "COMPLETE_STATIC_QUALITY_WITH_HOLDS_PENDING_OWNER_DECISION"
        if args.reviewer and hold_binding_ids
        else "COMPLETE_STATIC_QUALITY_WITH_ACCEPTED_OWNER_VISUAL_RISK_PENDING_VIS_G6"
        if args.reviewer and accepted_risk_binding_ids
        else "COMPLETE_STATIC_QUALITY_PENDING_VIS_G6"
        if args.reviewer
        else "STATIC_SCAN_COMPLETE_PENDING_ASSISTED_VISUAL_REVIEW"
    )
    register = {
        "schema_version": "1.0",
        "register_id": f"VIS-G5-SANBAO-WEB-STATIC-QUALITY-{args.audit_date}",
        "generated_on": args.audit_date,
        "gate": {
            "id": "VIS-G5",
            "status": overall_status,
            "scope": [
                "424 fixed-commit approved-delivery binaries read transiently for 53 bindings",
                "actual Git blob, SHA-256, MIME, decoder, byte-count, and pixel-dimension checks",
                "native-to-WebP coherence, cross-theme signals, perceptual duplicate candidates, and neutral alt text",
                "assisted visual review of 53 paired dark/light 256px and 64px renditions",
            ],
            "excluded": [
                "persistent source-image copy into the project or dist",
                "Visual Identity Release creation",
                "page integration, publication, DSH import, runtime, access, Case, or role-contract changes",
            ],
        },
        "source_anchor": {
            "repository": g2["source_anchor"]["repository"],
            "commit": g2["source_anchor"]["commit"],
            "tree": g2["source_anchor"]["tree"],
            "vis_g2_register_id": g2["register_id"],
            "vis_g3_register_id": g3["register_id"],
            "canonicalization_acceptance": {
                "decision_id": "D-073",
                "status": "ACCEPTED",
                "canonicalization_version": "VIS-G2-CANONICALIZATION-1",
                "legacy_g0_fingerprints": "RETAINED_HISTORICAL_NOT_VERIFIED",
            },
        },
        "input_integrity": {
            "input_files": [
                {"kind": "VIS-G2", "sha256": sha256_file(g2_path)},
                {"kind": "VIS-G3", "sha256": sha256_file(g3_path)},
            ],
            "binary_canonicalization": {
                "version": "VIS-G5-BINARY-CANONICALIZATION-1",
                "algorithm": "SHA-256",
                "record_format": "asset_id<TAB>content_sha256<TAB>git_blob_sha1<TAB>bytes<TAB>mime<TAB>widthxheight<LF>",
                "canonical_digest_sha256": canonical_digest(asset_results),
            },
        },
        "audit_method": {
            "binary_read_strategy": "FIXED_COMMIT_RAW_CONTENT_TRANSIENT_MEMORY_READ",
            "source_image_persistence": "NONE",
            "toolchain": {"python": sys.version.split()[0], "Pillow": PILLOW_VERSION},
            "network_workers": args.network_workers,
        },
        "coverage_summary": {
            "bindings": 53,
            "source_personas": 53,
            "unique_binary_assets": len(asset_results),
            "unique_native_png": expected_format_counts["png"],
            "unique_webp_renditions": expected_format_counts["webp"],
            "binary_verified": sum(result["binary_status"] == "VERIFIED" for result in asset_results),
            "binary_sha256_exact_duplicate_groups": 0,
            "perceptual_duplicate_candidates": len(duplicate_candidates),
        },
        "asset_binary_results": asset_results,
        "binding_quality_results": binding_results,
        "perceptual_duplicate_analysis": {
            "algorithm": "dark-native-center-dhash-and-luminance-correlation-v1",
            "candidate_thresholds": {
                "maximum_dhash_hamming_distance": NEAR_DUPLICATE_DHASH_DISTANCE,
                "minimum_center_luminance_correlation": NEAR_DUPLICATE_CENTER_CORRELATION,
            },
            "candidates": duplicate_candidates,
            "manual_monitor_pairs": [
                {
                    "left_source_persona_id": left,
                    "right_source_persona_id": right,
                    "status": "MONITOR_ONLY_AFTER_ASSISTED_VISUAL_REVIEW"
                    if args.reviewer
                    else "PENDING_ASSISTED_VISUAL_REVIEW",
                }
                for left, right in sorted(set(monitor_pairs))
            ],
            "boundary": "A perceptual candidate is not an identity conclusion and cannot create or remap a role.",
        },
        "assisted_visual_review": {
            "status": "COMPLETED_WITH_OWNER_HOLDS"
            if args.reviewer and hold_binding_ids
            else "COMPLETED_WITH_ACCEPTED_OWNER_RISK"
            if args.reviewer and accepted_risk_binding_ids
            else "COMPLETED"
            if args.reviewer
            else "PENDING",
            "reviewer": args.reviewer or None,
            "owner_hold_binding_ids": sorted(hold_binding_ids),
            "owner_accepted_risk_binding_ids": sorted(accepted_risk_binding_ids),
            "owner_risk_decision_id": args.owner_risk_decision_id
            if accepted_risk_binding_ids
            else None,
            "contact_sheet_summary": contact_sheet_summary,
            "scope": "All 53 bindings; paired dark/light 256px and upscaled 64px renditions.",
        },
        "candidate_material_pool": {
            "status": "CATALOGED_REMOTE_PINNED_NOT_MATERIALIZED",
            "source_register": g2["register_id"],
            "scope": "All 1,848 frozen images remain governed by VIS-G1/VIS-G2; this gate reads only the 424 active-binding delivery binaries.",
            "boundary": "POOL_ONLY materials are not copied into this repository or its public build. A future private-storage decision is required before binary archival.",
        },
        "next_gate": {
            "id": "VIS-G6",
            "status": "HOLD_PENDING_OWNER_VISUAL_DECISION_AND_SEPARATE_AUTHORIZATION"
            if hold_binding_ids
            else "NOT_STARTED_REQUIRES_SEPARATE_AUTHORIZATION",
            "preconditions": (
                ["resolve every PENDING_OWNER_VISUAL_DECISION binding without auto-remapping"]
                if hold_binding_ids
                else [
                    "record and preserve every accepted owner visual-risk decision without auto-remapping"
                ]
                if accepted_risk_binding_ids
                else []
            )
            + [
                "create a Visual Identity Release from this quality register",
                "select explicitly approved public delivery assets",
                "keep source, reference, prompt, and POOL_ONLY materials out of dist",
                "verify page, build, and public release scope independently",
            ],
        },
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(register, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"PASS VIS-G5 静态质量登记册已生成：{output_path}")
    print(
        "  绑定：53；实际二进制："
        f"{len(asset_results)}（PNG {expected_format_counts['png']} / WebP {expected_format_counts['webp']}）；"
        f"状态：{overall_status}"
    )
    visual_release_status = (
        "NOT_CREATED_PENDING_OWNER_DECISION_AND_VIS_G6"
        if hold_binding_ids
        else "NOT_CREATED_PENDING_VIS_G6"
    )
    print(
        "  感知重复候选："
        f"{len(duplicate_candidates)}；已接受风险绑定：{len(accepted_risk_binding_ids)}；"
        f"图片持久化：NONE；Visual Identity Release：{visual_release_status}"
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print("FAIL VIS-G5：" + str(error), file=sys.stderr)
        raise SystemExit(1)
