# Slide rasterization script

## Prerequisites

- Python 3.10+
- `pymupdf`
- `Pillow`
- `python-pptx`
- LibreOffice (only needed for `.pptx` input)

Install Python packages:

```bash
pip install pymupdf Pillow python-pptx
```

## Usage

```bash
python scripts/rasterize-slides.py content-sources/slides/mi-presentacion.pdf
python scripts/rasterize-slides.py content-sources/slides/mi-presentacion.pptx --verify
```

## Output

- Source files stay in `content-sources/slides/` (ignored by git)
- Generated slides are written to `src/assets/slides/<slug>/slide-XX.webp`
- Script prints a frontmatter block to paste into MDX

## Quality and safety checks

- Adaptive resolution:
  - landscape pages: max width `1280px`
  - portrait pages: max height `1280px`
- WebP quality: `85`
- Warning shown if output exceeds `20` pages or `2 MB`
- `--verify` prints first generated slide path for quick visual inspection
