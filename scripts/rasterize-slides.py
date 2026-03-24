#!/usr/bin/env python3
"""
Rasterize PDF/PPTX slides into WebP images for Astro assets.

Usage:
  python scripts/rasterize-slides.py content-sources/slides/my-deck.pdf
  python scripts/rasterize-slides.py content-sources/slides/my-deck.pptx --verify
"""

from __future__ import annotations

import argparse
import math
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import fitz  # pymupdf
from PIL import Image

TARGET_SIZE = 1280
WEBP_QUALITY = 85
WARN_MAX_BYTES = 2 * 1024 * 1024
WARN_MAX_PAGES = 20


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Convert PDF/PPTX slides to WebP")
    parser.add_argument("source", help="Path to source PDF or PPTX")
    parser.add_argument(
        "--verify",
        action="store_true",
        help="Print the first rendered slide path for visual verification",
    )
    return parser.parse_args()


def require_supported_file(path: Path) -> None:
    if not path.exists():
        raise FileNotFoundError(f"Source file not found: {path}")
    if path.suffix.lower() not in {".pdf", ".pptx"}:
        raise ValueError("Only .pdf and .pptx files are supported")


def format_bytes(size: int) -> str:
    if size < 1024:
        return f"{size} B"
    if size < 1024 * 1024:
        return f"{size / 1024:.0f} KB"
    return f"{size / (1024 * 1024):.2f} MB"


def check_libreoffice_available() -> str | None:
    for cmd in ("libreoffice", "soffice"):
        if shutil.which(cmd):
            return cmd
    return None


def convert_pptx_to_pdf(pptx_path: Path, temp_dir: Path) -> Path:
    office_cmd = check_libreoffice_available()
    if office_cmd is None:
        raise RuntimeError(
            "LibreOffice not found. Install LibreOffice (headless) or convert PPTX to PDF manually."
        )

    command = [
        office_cmd,
        "--headless",
        "--convert-to",
        "pdf",
        "--outdir",
        str(temp_dir),
        str(pptx_path),
    ]
    proc = subprocess.run(command, capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(
            f"LibreOffice conversion failed.\nSTDOUT:\n{proc.stdout}\nSTDERR:\n{proc.stderr}"
        )

    converted = temp_dir / f"{pptx_path.stem}.pdf"
    if not converted.exists():
        raise RuntimeError("LibreOffice did not produce the expected PDF output")
    return converted


def target_dimensions(width: int, height: int) -> tuple[int, int]:
    if width <= 0 or height <= 0:
        return width, height

    is_portrait = height > width
    scale = TARGET_SIZE / (height if is_portrait else width)
    if scale >= 1:
        return width, height

    out_w = max(1, int(math.floor(width * scale)))
    out_h = max(1, int(math.floor(height * scale)))
    return out_w, out_h


def render_pdf(pdf_path: Path, output_dir: Path, verify: bool) -> tuple[int, int]:
    doc = fitz.open(pdf_path)
    if doc.page_count == 0:
        raise RuntimeError("The source PDF has no pages")

    output_dir.mkdir(parents=True, exist_ok=True)
    total_bytes = 0
    first_slide_path: Path | None = None

    for index in range(doc.page_count):
        page_no = index + 1
        page = doc[index]
        rect = page.rect
        target_w, target_h = target_dimensions(int(rect.width), int(rect.height))
        scale = min(target_w / rect.width, target_h / rect.height)
        matrix = fitz.Matrix(scale, scale)
        pix = page.get_pixmap(matrix=matrix, alpha=False)

        output_file = output_dir / f"slide-{page_no:02d}.webp"
        pil_image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        pil_image.save(output_file, "WEBP", quality=WEBP_QUALITY, method=6)

        slide_size = output_file.stat().st_size
        total_bytes += slide_size

        if first_slide_path is None:
            first_slide_path = output_file

        print(
            f"  -> Pagina {page_no}/{doc.page_count} -> {output_file.as_posix()} ({format_bytes(slide_size)})"
        )

    page_count = doc.page_count
    doc.close()

    print(f"  -> {page_count} paginas procesadas. Total: {format_bytes(total_bytes)}")
    if page_count > WARN_MAX_PAGES or total_bytes > WARN_MAX_BYTES:
        print(
            "WARN: salida grande detectada (mas de 20 paginas o 2 MB). "
            "Considera dividir el documento o reducir calidad."
        )

    if verify and first_slide_path is not None:
        print(f"VERIFY: revisa visualmente la primera slide en {first_slide_path.as_posix()}")

    return page_count, total_bytes


def print_frontmatter(slug: str, total_pages: int, source_type: str) -> None:
    print("\nFrontmatter para copiar en tu MDX:")
    print("---")
    print("slides:")
    print(f'  src: "{slug}"')
    print(f'  alt: "Presentacion {slug}"')
    print(f"  sourceType: {source_type}")
    print("---")
    print(f"(Nota: {total_pages} paginas rasterizadas como slide-01.webp …)")


def main() -> int:
    args = parse_args()
    source_path = Path(args.source).resolve()
    project_root = Path(__file__).resolve().parent.parent
    output_dir = project_root / "src" / "assets" / "slides" / source_path.stem

    try:
        require_supported_file(source_path)
        print(f"Procesando: {source_path.name}")

        if source_path.suffix.lower() == ".pptx":
            with tempfile.TemporaryDirectory(prefix="slides-") as tmp_dir_name:
                tmp_dir = Path(tmp_dir_name)
                pdf_path = convert_pptx_to_pdf(source_path, tmp_dir)
                total_pages, _ = render_pdf(pdf_path, output_dir, args.verify)
            print_frontmatter(source_path.stem, total_pages, "pptx")
        else:
            total_pages, _ = render_pdf(source_path, output_dir, args.verify)
            print_frontmatter(source_path.stem, total_pages, "pdf")

        return 0
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
