#!/usr/bin/env python3
"""Generate fake project preview PNGs for the portfolio (decorative placeholders)."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 750
FONT_PATH = "/System/Library/Fonts/Supplemental/Arial.ttf"
OUT = Path(__file__).resolve().parents[1] / "Assets" / "screenshots"


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_PATH, size)


def dark_gradient(img: Image.Image, draw: ImageDraw.ImageDraw, top: tuple, bottom: tuple) -> None:
    for y in range(H):
        t = y / (H - 1) if H > 1 else 0
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        draw.line([(0, y), (W, y)], fill=(r, g, b))


def browser_chrome(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int]) -> None:
    draw.rounded_rectangle([0, 0, W, 52], radius=0, fill=(11, 18, 32))
    draw.rectangle([0, 52, W, 54], fill=accent)
    # traffic lights
    cx, cy = 24, 26
    for i, c in enumerate(((239, 68, 68), (234, 179, 8), (34, 197, 94))):
        x = cx + i * 22
        draw.ellipse([x - 6, cy - 6, x + 6, cy + 6], fill=c)
    f = font(16)
    draw.text((120, 18), "localhost · preview (placeholder)", font=f, fill=(148, 163, 184))


def weather_screenshot() -> Image.Image:
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img)
    dark_gradient(img, d, (8, 15, 32), (15, 35, 65))
    browser_chrome(d, (59, 130, 246))
    f_lg, f_sm = font(38), font(20)
    d.text((80, 120), "Austin", font=f_lg, fill=(248, 250, 252))
    d.text((80, 185), "72°F · Partly sunny", font=f_sm, fill=(147, 197, 253))
    # “chart”
    d.rounded_rectangle([80, 260, 520, 420], radius=12, fill=(15, 23, 42), outline=(37, 99, 235), width=1)
    pts = []
    for i, v in enumerate([0.3, 0.45, 0.5, 0.35, 0.55, 0.6, 0.42]):
        x = 100 + i * 52
        y = 400 - v * 120
        pts.append((x, y))
    d.line(pts, fill=(59, 130, 246), width=3)
    for p in pts:
        d.ellipse([p[0] - 5, p[1] - 5, p[0] + 5, p[1] + 5], fill=(96, 165, 250))
    d.text((80, 450), "5-day forecast", font=f_sm, fill=(148, 163, 184))
    for j, day in enumerate(["Mon", "Tue", "Wed", "Thu", "Fri"]):
        x = 80 + j * 200
        d.rounded_rectangle([x, 490, x + 160, 620], radius=8, fill=(11, 18, 32))
        d.text((x + 20, 510), day, font=f_sm, fill=(203, 213, 225))
    d.text((W - 400, H - 60), "OpenWeather API · static mock", font=font(14), fill=(71, 85, 105))
    return img


def library_screenshot() -> Image.Image:
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img)
    dark_gradient(img, d, (10, 12, 28), (20, 30, 55))
    browser_chrome(d, (16, 185, 129))
    d.text((80, 110), "Library book tracker", font=font(36), fill=(248, 250, 252))
    d.text((80, 170), "After-school program · check-outs", font=font(18), fill=(110, 231, 183))
    headers = ["Title", "Patron", "Out", "Due"]
    x0 = 80
    wcols = [320, 220, 140, 140]
    y = 240
    d.rounded_rectangle([60, 220, W - 60, 680], radius=10, fill=(9, 14, 26), outline=(31, 41, 55))
    hx = x0
    f = font(17)
    for h, colw in zip(headers, wcols):
        d.text((hx, y), h, font=f, fill=(100, 116, 139))
        hx += colw
    rows = [
        ("The Wild Robot", "M. Chen", "Apr 2", "Apr 16"),
        ("Dune (graphic)", "J. Ortiz", "Apr 8", "Apr 22"),
        ("Pride & Prejudice", "A. Smith", "Apr 10", "May 1"),
    ]
    f_body = font(16)
    for r, row in enumerate(rows):
        ry = 290 + r * 60
        hx = x0
        d.line([(60, ry + 45), (W - 60, ry + 45)], fill=(30, 41, 59))
        for c, colw in zip(row, wcols):
            d.text((hx, ry), c, font=f_body, fill=(226, 232, 240))
            hx += colw
    d.rounded_rectangle([W - 320, 120, W - 80, 180], radius=8, fill=(5, 46, 22))
    d.text((W - 300, 135), "Flask + SQLite", font=font(16), fill=(167, 243, 208))
    d.text((W - 380, H - 50), "Placeholder UI", font=font(14), fill=(71, 85, 105))
    return img


def recycling_screenshot() -> Image.Image:
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img)
    dark_gradient(img, d, (12, 10, 28), (30, 20, 45))
    browser_chrome(d, (234, 179, 8))
    d.text((80, 100), "Recycling helper", font=font(36), fill=(255, 251, 235))
    d.text((80, 160), "Hackathon build · sort & learn", font=font(18), fill=(253, 224, 71))
    cards = [("Recycling", (34, 197, 94)), ("Compost", (120, 53, 15)), ("Trash", (71, 85, 105))]
    x = 80
    for name, col in cards:
        d.rounded_rectangle([x, 240, x + 300, 480], radius=16, fill=(11, 18, 32), outline=col, width=2)
        d.text((x + 24, 280), name, font=font(22), fill=col)
        d.text((x + 24, 330), "Drag items here", font=font(15), fill=(148, 163, 184))
        x += 340
    d.rounded_rectangle([80, 520, W - 80, 640], radius=10, fill=(9, 14, 26))
    d.text((110, 550), "Plastic bottle → Recycling", font=font(18), fill=(187, 247, 208))
    d.text((110, 590), "Why: PET is curb-side recyclable in Austin.", font=font(15), fill=(100, 116, 139))
    d.text((W - 350, H - 55), "Prototype mock · not a live app", font=font(14), fill=(71, 85, 105))
    return img


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    out_map = {
        "weather-dashboard.png": weather_screenshot,
        "library-book-tracker.png": library_screenshot,
        "recycling-helper.png": recycling_screenshot,
    }
    for name, fn in out_map.items():
        path = OUT / name
        im = fn()
        im.save(path, "PNG", optimize=True)
        print("Wrote", path)


if __name__ == "__main__":
    main()
