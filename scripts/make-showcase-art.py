#!/usr/bin/env python3
"""
Draws the showcase artwork: flat, duotone vector scenes with no faces, so the
example sites show nobody real. Run: python3 scripts/make-showcase-art.py
Writes public/showcase/art/*.svg (deterministic; commit the output).
"""
import math
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "showcase", "art")
os.makedirs(OUT, exist_ok=True)


def write(name, w, h, body, defs=""):
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" '
        f'preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">'
        f"<defs>{defs}</defs>{body}</svg>"
    )
    with open(os.path.join(OUT, name + ".svg"), "w") as f:
        f.write(svg)


def lin(id, stops, vertical=True):
    x2, y2 = ("0", "1") if vertical else ("1", "0")
    s = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops)
    return f'<linearGradient id="{id}" x1="0" y1="0" x2="{x2}" y2="{y2}">{s}</linearGradient>'


def rad(id, stops):
    s = "".join(f'<stop offset="{o}" stop-color="{c}" stop-opacity="{a}"/>' for o, c, a in stops)
    return f'<radialGradient id="{id}">{s}</radialGradient>'


def hills(w, h, base, color, amp, seed, n=6):
    pts = [f"0,{h}"]
    for i in range(n + 1):
        x = w * i / n
        y = base + amp * math.sin(i * 1.7 + seed) + amp * 0.5 * math.sin(i * 3.1 + seed * 2)
        pts.append(f"{x:.0f},{y:.0f}")
    pts.append(f"{w},{h}")
    return f'<polygon points="{" ".join(pts)}" fill="{color}"/>'


def person(x, base, h, fill, kind="suit", cap=False, cape=False):
    """A figure seen from behind, as a plain silhouette."""
    head = f'<circle cx="{x}" cy="{base - 0.865 * h:.0f}" r="{0.072 * h:.0f}" fill="{fill}"/>'
    neck = f'<rect x="{x - 0.022 * h:.0f}" y="{base - 0.80 * h:.0f}" width="{0.044 * h:.0f}" height="{0.05 * h:.0f}" fill="{fill}"/>'
    sh = base - 0.76 * h
    if kind == "dress":
        body = (
            f'<path d="M{x - 0.11 * h:.0f},{sh:.0f} Q{x},{sh - 0.03 * h:.0f} {x + 0.11 * h:.0f},{sh:.0f} '
            f'L{x + 0.075 * h:.0f},{base - 0.5 * h:.0f} L{x + 0.26 * h:.0f},{base:.0f} L{x - 0.26 * h:.0f},{base:.0f} '
            f'L{x - 0.075 * h:.0f},{base - 0.5 * h:.0f} Z" fill="{fill}"/>'
        )
    elif kind == "gown":
        body = (
            f'<path d="M{x - 0.13 * h:.0f},{sh:.0f} Q{x},{sh - 0.035 * h:.0f} {x + 0.13 * h:.0f},{sh:.0f} '
            f'L{x + 0.17 * h:.0f},{base:.0f} L{x - 0.17 * h:.0f},{base:.0f} Z" fill="{fill}"/>'
        )
    else:  # suit
        body = (
            f'<path d="M{x - 0.12 * h:.0f},{sh:.0f} Q{x},{sh - 0.03 * h:.0f} {x + 0.12 * h:.0f},{sh:.0f} '
            f'L{x + 0.095 * h:.0f},{base - 0.42 * h:.0f} L{x + 0.095 * h:.0f},{base:.0f} L{x + 0.012 * h:.0f},{base:.0f} '
            f'L{x},{base - 0.40 * h:.0f} L{x - 0.012 * h:.0f},{base:.0f} L{x - 0.095 * h:.0f},{base:.0f} '
            f'L{x - 0.095 * h:.0f},{base - 0.42 * h:.0f} Z" fill="{fill}"/>'
        )
    extra = ""
    if cap:
        cy = base - 0.925 * h
        extra += (
            f'<polygon points="{x - 0.14 * h:.0f},{cy:.0f} {x:.0f},{cy - 0.045 * h:.0f} {x + 0.14 * h:.0f},{cy:.0f} {x:.0f},{cy + 0.045 * h:.0f}" fill="{fill}"/>'
            f'<line x1="{x + 0.1 * h:.0f}" y1="{cy:.0f}" x2="{x + 0.13 * h:.0f}" y2="{cy + 0.1 * h:.0f}" stroke="{fill}" stroke-width="{0.012 * h:.1f}"/>'
        )
    if cape:
        extra += f'<path d="M{x - 0.13 * h:.0f},{sh:.0f} L{x - 0.19 * h:.0f},{base - 0.1 * h:.0f} L{x + 0.19 * h:.0f},{base - 0.1 * h:.0f} L{x + 0.13 * h:.0f},{sh:.0f} Z" fill="{fill}" opacity=".85"/>'
    return head + neck + body + extra


def flower(cx, cy, r, petal, heart, n=8):
    ps = "".join(
        f'<ellipse cx="{cx}" cy="{cy - r * 0.62:.1f}" rx="{r * 0.2:.1f}" ry="{r * 0.46:.1f}" fill="{petal}" transform="rotate({i * 360 / n:.1f} {cx} {cy})"/>'
        for i in range(n)
    )
    return ps + f'<circle cx="{cx}" cy="{cy}" r="{r * 0.28:.1f}" fill="{heart}"/>'


def star(cx, cy, r, fill, op=1):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" opacity="{op}"/>'


def sun_scene(w, h, sky, sun_c, sun_x, sun_y, sun_r):
    defs = lin("sky", sky) + rad("glow", [(0, sun_c, 0.9), (1, sun_c, 0)])
    body = f'<rect width="{w}" height="{h}" fill="url(#sky)"/>'
    body += f'<circle cx="{sun_x}" cy="{sun_y}" r="{sun_r * 3.4}" fill="url(#glow)"/>'
    body += f'<circle cx="{sun_x}" cy="{sun_y}" r="{sun_r}" fill="{sun_c}"/>'
    return defs, body


# ---------------------------------------------------------------- covers (1800x1200)
W, H = 1800, 1200

# wedding walk at golden hour
defs, body = sun_scene(W, H, [(0, "#f6d9a8"), (0.55, "#f0a56a"), (1, "#a8553a")], "#fff3d6", 1180, 640, 120)
body += hills(W, H, 760, "#8a4b36", 40, 1) + hills(W, H, 860, "#5e3028", 30, 3) + hills(W, H, 960, "#2d1714", 22, 5)
body += person(760, 1010, 430, "#1d0f0d", "suit") + person(930, 1010, 410, "#1d0f0d", "dress")
write("wedding-walk", W, H, body, defs)

# wedding arch at dusk (sage)
defs = lin("sky", [(0, "#dfe6d3"), (1, "#a9bb98")]) + rad("glow", [(0, "#fff6d8", 0.95), (1, "#fff6d8", 0)])
body = f'<rect width="{W}" height="{H}" fill="url(#sky)"/>'
body += f'<circle cx="900" cy="560" r="520" fill="url(#glow)"/>'
body += '<path d="M560,1200 V560 A340,340 0 0 1 1240,560 V1200 Z" fill="#fff6d8"/>'
body += '<path d="M610,1200 V570 A290,290 0 0 1 1190,570 V1200 Z" fill="#e8cf8d"/>'
body += hills(W, H, 1000, "#5f7a54", 25, 2) + hills(W, H, 1070, "#3f5a3a", 18, 4)
for i, x in enumerate([260, 380, 1420, 1540]):
    body += flower(x, 930 + (i % 2) * 40, 54, "#fff6d8", "#d9a73a")
body += person(830, 1090, 400, "#26331f", "suit") + person(980, 1090, 385, "#26331f", "dress")
write("wedding-arch", W, H, body, defs)

# graduates throwing caps at dusk
defs, body = sun_scene(W, H, [(0, "#1c2b52"), (0.6, "#6a5a8e"), (1, "#e9a46e")], "#ffe3b0", 900, 760, 90)
body += hills(W, H, 900, "#1a1f3c", 24, 2) + f'<rect y="1000" width="{W}" height="200" fill="#10132a"/>'
xs = [300, 470, 640, 810, 980, 1150, 1320, 1490]
for i, x in enumerate(xs):
    body += person(x, 1090, 420 - (i % 3) * 14, "#0b0d1f", "gown", cap=(i % 3 == 1))
for i, (cx, cy, rot) in enumerate([(330, 330, -20), (620, 220, 14), (900, 420, -8), (1180, 260, 22), (1450, 370, -16), (760, 150, 10), (1020, 130, -26)]):
    body += f'<g transform="rotate({rot} {cx} {cy})"><polygon points="{cx - 60},{cy} {cx},{cy - 22} {cx + 60},{cy} {cx},{cy + 22}" fill="#0b0d1f"/><line x1="{cx + 44}" y1="{cy}" x2="{cx + 56}" y2="{cy + 50}" stroke="#e8c36a" stroke-width="5"/></g>'
write("graduation-caps", W, H, body, defs)

# graduation steps and columns
defs = lin("sky", [(0, "#cfd8ea"), (1, "#f2ead8")])
body = f'<rect width="{W}" height="{H}" fill="url(#sky)"/>'
body += '<polygon points="500,430 900,250 1300,430" fill="#f7f1e2"/><rect x="500" y="430" width="800" height="60" fill="#e8dfc8"/>'
for x in range(540, 1300, 130):
    body += f'<rect x="{x}" y="490" width="62" height="470" fill="#fbf7ec"/><rect x="{x - 8}" y="470" width="78" height="26" fill="#e8dfc8"/>'
for i in range(7):
    body += f'<rect x="{360 - i * 24}" y="{960 + i * 34}" width="{1080 + i * 48}" height="34" fill="{"#d9cfb4" if i % 2 else "#e9e0c8"}"/>'
body += person(760, 985, 300, "#1b2a4a", "gown", cap=True) + person(1000, 985, 300, "#1b2a4a", "gown", cap=True)
body += '<rect x="0" y="1140" width="1800" height="60" fill="#c9bf9f"/>'
write("graduation-gate", W, H, body, defs)

# birthday cake
defs = lin("bg", [(0, "#ffe9c9"), (1, "#f7b98c")]) + rad("glow", [(0, "#fff0b0", 0.9), (1, "#fff0b0", 0)])
body = f'<rect width="{W}" height="{H}" fill="url(#bg)"/><circle cx="900" cy="470" r="470" fill="url(#glow)"/>'
for i in range(12):
    x = 120 + i * 150
    body += f'<line x1="0" y1="90" x2="{W}" y2="90" stroke="#a8553a" stroke-width="3"/>'
    body += f'<polygon points="{x - 38},92 {x + 38},92 {x},{200 + (i % 3) * 20}" fill="{["#d9573a", "#2f7a52", "#e8b53a"][i % 3]}"/>'
body += f'<rect y="900" width="{W}" height="300" fill="#8a3a2a"/>'
body += '<ellipse cx="900" cy="905" rx="520" ry="50" fill="#fff6e4"/>'
for j, (cw, ch, col, y) in enumerate([(560, 170, "#fff6e4", 735), (440, 150, "#f2b8a0", 585), (320, 130, "#fff6e4", 455)]):
    body += f'<rect x="{900 - cw / 2}" y="{y}" width="{cw}" height="{ch}" rx="20" fill="{col}"/>'
    drip = "".join(f'<ellipse cx="{900 - cw / 2 + 40 + k * 70}" cy="{y + 6}" rx="26" ry="{22 + (k * 7) % 22}" fill="{"#d9573a" if j != 1 else "#fff6e4"}" opacity=".9"/>' for k in range(int(cw / 70)))
    body += drip
for k, x in enumerate([820, 900, 980]):
    body += f'<rect x="{x - 7}" y="320" width="14" height="110" fill="{["#2f7a52", "#e8b53a", "#d9573a"][k]}"/>'
    body += f'<ellipse cx="{x}" cy="296" rx="16" ry="30" fill="#ffd36a"/><ellipse cx="{x}" cy="302" rx="8" ry="18" fill="#fff3b0"/>'
write("birthday-cake", W, H, body, defs)

# birthday balloons
defs = lin("bg", [(0, "#cfe6e0"), (1, "#f7efd8")])
body = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
for i, (x, y, r, col) in enumerate([(420, 420, 150, "#d9573a"), (640, 300, 170, "#e8b53a"), (880, 400, 160, "#2f7a52"), (1130, 280, 175, "#d9573a"), (1360, 430, 150, "#e8b53a"), (1560, 320, 130, "#2f7a52")]):
    body += f'<line x1="{x}" y1="{y + r * 1.25:.0f}" x2="{900 + (x - 900) * 0.2:.0f}" y2="1080" stroke="#8a6a50" stroke-width="3"/>'
    body += f'<ellipse cx="{x}" cy="{y}" rx="{r * 0.85:.0f}" ry="{r:.0f}" fill="{col}"/><ellipse cx="{x - r * 0.3:.0f}" cy="{y - r * 0.35:.0f}" rx="{r * 0.14:.0f}" ry="{r * 0.28:.0f}" fill="#fff" opacity=".35"/>'
    body += f'<polygon points="{x},{y + r:.0f} {x - 14},{y + r + 24:.0f} {x + 14},{y + r + 24:.0f}" fill="{col}"/>'
body += hills(W, H, 1020, "#7ca38a", 20, 6) + f'<rect y="1090" width="{W}" height="110" fill="#5c8368"/>'
body += person(860, 1140, 380, "#243b30", "dress") + person(1010, 1140, 410, "#243b30", "suit")
write("birthday-balloons", W, H, body, defs)

# christening doorway
defs = lin("bg", [(0, "#f3ecdc"), (1, "#e2d6bd")]) + rad("glow", [(0, "#fffbe9", 1), (1, "#fffbe9", 0)])
body = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
body += '<rect x="360" y="160" width="1080" height="1040" fill="#d9cdb0"/>'
body += '<path d="M600,1200 V520 A300,300 0 0 1 1200,520 V1200 Z" fill="#fffbe9"/>'
body += '<path d="M600,1200 V520 A300,300 0 0 1 1200,520 V1200 Z" fill="url(#glow)"/>'
body += '<path d="M640,1200 V530 A260,260 0 0 1 1160,530 V1200 Z" fill="#7a4f32"/><line x1="900" y1="270" x2="900" y2="1200" stroke="#5a3822" stroke-width="8"/>'
for x in (760, 1040):
    body += f'<circle cx="{x}" cy="760" r="12" fill="#d9a73a"/>'
body += '<rect x="360" y="1100" width="1080" height="100" fill="#cbbd9c"/>'
body += '<path d="M800,1100 Q900,1010 1000,1100 L1050,1200 L750,1200 Z" fill="#fffbe9"/>'
body += '<circle cx="900" cy="150" r="56" fill="#d9a73a"/><circle cx="900" cy="150" r="34" fill="#f3ecdc"/>'
write("christening-door", W, H, body, defs)

# christening woven cloth
defs = lin("bg", [(0, "#faf5e8"), (1, "#eee3c8")])
body = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
for y in range(0, H, 28):
    body += f'<line x1="0" y1="{y}" x2="{W}" y2="{y}" stroke="#e3d6b6" stroke-width="2"/>'
for x in range(0, W, 28):
    body += f'<line x1="{x}" y1="0" x2="{x}" y2="{H}" stroke="#eadfc3" stroke-width="1.5"/>'
# Two colours never sit side by side: stacked green, gold and red would read as a flag.
body += '<rect y="150" width="1800" height="70" fill="#2f6b4f"/><rect y="236" width="1800" height="8" fill="#d9a73a"/>'
body += '<rect y="930" width="1800" height="70" fill="#2f6b4f"/><rect y="1016" width="1800" height="8" fill="#d9a73a"/>'
for i in range(14):
    x = 90 + i * 128
    body += f'<polygon points="{x},330 {x + 44},400 {x},470 {x - 44},400" fill="none" stroke="#d9a73a" stroke-width="5"/><polygon points="{x},350 {x + 28},400 {x},450 {x - 28},400" fill="#2f6b4f" opacity=".85"/>'
    body += f'<polygon points="{x},750 {x + 44},820 {x},890 {x - 44},820" fill="none" stroke="#b0463a" stroke-width="5"/>'
body += flower(900, 600, 110, "#fffbe9", "#d9a73a") + '<circle cx="900" cy="600" r="150" fill="none" stroke="#d9a73a" stroke-width="4"/>'
write("christening-cloth", W, H, body, defs)

# ---------------------------------------------------------------- gallery pieces (1200x1500)
GW, GH = 1200, 1500


def bg(c1, c2):
    return lin("g", [(0, c1), (1, c2)]), f'<rect width="{GW}" height="{GH}" fill="url(#g)"/>'


defs, body = bg("#f4e4c8", "#e0b98a")
body += '<circle cx="520" cy="760" r="230" fill="none" stroke="#c99a3c" stroke-width="34"/><circle cx="700" cy="760" r="230" fill="none" stroke="#e8c36a" stroke-width="34"/>'
body += '<polygon points="610,540 650,600 570,600" fill="#fff3d0"/>'
body += '<ellipse cx="600" cy="1060" rx="400" ry="110" fill="#6a3d2a"/><ellipse cx="600" cy="1030" rx="400" ry="100" fill="#8a4f35"/><ellipse cx="600" cy="1010" rx="300" ry="60" fill="#a2603f"/>'
write("rings", GW, GH, body, defs)

defs, body = bg("#3a2418", "#150c08")
body += '<ellipse cx="600" cy="1260" rx="420" ry="60" fill="#0b0604"/>'
body += '<path d="M470,1240 Q430,1000 520,860 L520,720 L680,720 L680,860 Q770,1000 730,1240 Z" fill="#c4742e"/><path d="M480,1230 Q450,1010 530,870" fill="none" stroke="#e8a458" stroke-width="12"/>'
body += '<rect x="500" y="660" width="200" height="70" rx="20" fill="#9a5421"/><path d="M700,760 Q840,760 820,900" fill="none" stroke="#c4742e" stroke-width="34"/>'
body += '<path d="M540,640 Q520,560 560,500 Q540,440 580,380" fill="none" stroke="#f1d9b0" stroke-width="10" opacity=".5"/><path d="M640,640 Q660,560 620,500 Q650,430 610,370" fill="none" stroke="#f1d9b0" stroke-width="10" opacity=".4"/>'
for x in (230, 970):
    body += f'<path d="M{x - 70},1200 L{x - 55},1090 L{x + 55},1090 L{x + 70},1200 Z" fill="#f4e7d0"/><ellipse cx="{x}" cy="1090" rx="55" ry="14" fill="#6a3b1c"/>'
write("coffee-jebena", GW, GH, body, defs)

defs, body = bg("#f0dcb5", "#c88a4a")
body += '<ellipse cx="600" cy="1180" rx="440" ry="70" fill="#7a4a24" opacity=".5"/>'
body += '<path d="M200,700 Q600,560 1000,700 L920,1120 Q600,1200 280,1120 Z" fill="#9a5a2a"/>'
for r in range(6):
    body += f'<path d="M{230 + r * 8},{760 + r * 56} Q600,{650 + r * 58} {970 - r * 8},{760 + r * 56}" fill="none" stroke="{"#e8c36a" if r % 2 else "#5e2f14"}" stroke-width="14"/>'
body += '<path d="M240,700 Q600,420 960,700 Z" fill="#b5703a"/><path d="M300,680 Q600,470 900,680" fill="none" stroke="#e8c36a" stroke-width="12"/><circle cx="600" cy="500" r="46" fill="#7a4a24"/>'
write("mesob", GW, GH, body, defs)

defs, body = bg("#cfe0c4", "#7ea36f")
for i, (x, y, r) in enumerate([(380, 520, 150), (780, 420, 170), (560, 900, 190), (900, 1000, 140), (300, 1150, 130)]):
    body += f'<line x1="{x}" y1="{y + r * 0.3:.0f}" x2="{x - 20 + i * 8}" y2="1500" stroke="#3f6a3a" stroke-width="10"/>' + flower(x, y, r, "#f7d84a", "#9a5a1a")
write("adey-flowers", GW, GH, body, defs)

defs, body = bg("#f7efd8", "#efe0b8")
for r in range(15):
    y = 80 + r * 96
    col = ["#2f6b4f", "#d9a73a", "#b0463a"][r % 3]
    body += f'<rect y="{y}" width="{GW}" height="30" fill="{col}" opacity=".9"/>'
    for c in range(9):
        x = 70 + c * 140
        body += f'<polygon points="{x},{y + 36} {x + 34},{y + 66} {x},{y + 96} {x - 34},{y + 66}" fill="none" stroke="{col}" stroke-width="4"/>'
write("tibeb-textile", GW, GH, body, defs)

defs, body = bg("#1b1410", "#3a2616")
for x, h in ((330, 520), (600, 700), (870, 460)):
    body += f'<rect x="{x - 60}" y="{1300 - h}" width="120" height="{h}" rx="14" fill="#f4e7d0"/>'
    body += f'<ellipse cx="{x}" cy="{1300 - h - 40}" rx="50" ry="100" fill="#ffd36a"/><ellipse cx="{x}" cy="{1300 - h - 20}" rx="26" ry="62" fill="#fff3b0"/>'
    body += f'<circle cx="{x}" cy="{1300 - h - 60}" r="200" fill="#ffd36a" opacity=".08"/>'
body += '<rect y="1300" width="1200" height="200" fill="#0e0907"/>'
write("candles", GW, GH, body, defs)

defs, body = bg("#e9efe0", "#bccaa8")
body += '<circle cx="600" cy="750" r="380" fill="none" stroke="#5a7a4a" stroke-width="4" opacity=".5"/>'
for side in (-1, 1):
    for i in range(11):
        a = math.radians(95 + i * 15) if side == -1 else math.radians(85 - i * 15)
        x, y = 600 + 380 * math.cos(a), 750 + 380 * math.sin(a)
        body += f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="18" ry="60" fill="#4f7a43" transform="rotate({math.degrees(a) + (60 if side == -1 else -60):.0f} {x:.0f} {y:.0f})"/>'
body += '<path d="M470,700 L600,630 L730,700 L600,770 Z" fill="#1b2a4a"/><path d="M520,730 V810 Q600,850 680,810 V730 L600,770 Z" fill="#26385e"/><line x1="720" y1="705" x2="740" y2="820" stroke="#d9a73a" stroke-width="8"/>'
write("laurel-cap", GW, GH, body, defs)

defs, body = bg("#f2e6cc", "#d8c39a")
body += '<path d="M240,1500 V700 A360,360 0 0 1 960,700 V1500 Z" fill="#fbf4e0"/><path d="M300,1500 V710 A300,300 0 0 1 900,710 V1500 Z" fill="#7a4f32"/>'
body += '<line x1="600" y1="410" x2="600" y2="1500" stroke="#5a3822" stroke-width="8"/><circle cx="600" cy="230" r="70" fill="#d9a73a"/><circle cx="600" cy="230" r="44" fill="#fbf4e0"/>'
write("church-arch", GW, GH, body, defs)

defs, body = bg("#fdeacb", "#f5b98d")
cols = ["#d9573a", "#2f7a52", "#e8b53a", "#2e5f9a", "#b0463a"]
for i in range(60):
    x = (i * 211) % GW
    y = (i * 337) % GH
    body += f'<rect x="{x}" y="{y}" width="{16 + (i % 4) * 8}" height="{44 + (i % 3) * 14}" rx="4" fill="{cols[i % 5]}" transform="rotate({(i * 47) % 180} {x} {y})"/>'
    if i % 3 == 0:
        body += f'<circle cx="{(x + 90) % GW}" cy="{(y + 140) % GH}" r="{12 + i % 4 * 4}" fill="{cols[(i + 2) % 5]}"/>'
write("confetti-burst", GW, GH, body, defs)

defs, body = bg("#f7f0de", "#e4d3ae")
body += '<ellipse cx="600" cy="1200" rx="460" ry="64" fill="#8a6a40" opacity=".35"/>'
body += '<rect x="330" y="780" width="540" height="100" rx="50" fill="#fbf4e0" transform="rotate(-8 600 830)"/><rect x="330" y="780" width="70" height="100" rx="35" fill="#d9a73a" transform="rotate(-8 600 830)"/><rect x="800" y="780" width="70" height="100" rx="35" fill="#d9a73a" transform="rotate(-8 600 830)"/>'
body += '<path d="M470,880 Q600,1000 720,880" fill="none" stroke="#b0463a" stroke-width="14"/><circle cx="600" cy="960" r="36" fill="#b0463a"/>'
body += '<path d="M420,540 Q600,420 780,540 L760,700 Q600,760 440,700 Z" fill="#2f6b4f"/><path d="M450,560 Q600,470 750,560" fill="none" stroke="#d9a73a" stroke-width="10"/>'
write("keepsake", GW, GH, body, defs)

# ---------------------------------------------------------------- portraits (800x1000)
PW, PH = 800, 1000
palettes = [
    ("#cdb08a", "#f0dcc0", "#2a1a12"),
    ("#8fa68a", "#dbe6d2", "#18271a"),
    ("#d9a58f", "#f6dcd0", "#2e1b19"),
    ("#8a9ab8", "#d6deec", "#161e33"),
    ("#c9b36a", "#f2e8b8", "#2a2410"),
    ("#b08aa0", "#ecd6e2", "#2c1a26"),
]
hairs = ["bun", "short", "long", "afro", "cap", "braids"]
for i, ((c1, c2, ink), hair) in enumerate(zip(palettes, hairs), start=1):
    defs = lin("p", [(0, c2), (1, c1)])
    body = f'<rect width="{PW}" height="{PH}" fill="url(#p)"/><circle cx="400" cy="420" r="330" fill="#fff" opacity=".22"/>'
    body += f'<path d="M80,1000 Q90,720 400,690 Q710,720 720,1000 Z" fill="{ink}"/>'
    body += f'<rect x="345" y="600" width="110" height="110" fill="{ink}"/><ellipse cx="400" cy="470" rx="125" ry="150" fill="{ink}"/>'
    if hair == "bun":
        body += f'<circle cx="400" cy="270" r="62" fill="{ink}"/><path d="M262,430 Q270,300 400,300 Q530,300 538,430 Q480,340 400,340 Q320,340 262,430" fill="{ink}"/>'
    elif hair == "long":
        body += f'<path d="M250,450 Q250,290 400,290 Q550,290 550,450 L580,760 L520,760 L520,500 L280,500 L280,760 L220,760 Z" fill="{ink}"/>'
    elif hair == "afro":
        body += f'<circle cx="400" cy="380" r="205" fill="{ink}"/><ellipse cx="400" cy="480" rx="125" ry="150" fill="{ink}"/>'
    elif hair == "cap":
        body += f'<polygon points="230,330 400,265 570,330 400,395" fill="{ink}"/><rect x="330" y="330" width="140" height="40" fill="{ink}"/><line x1="560" y1="332" x2="590" y2="450" stroke="#d9a73a" stroke-width="9"/>'
    elif hair == "braids":
        body += f'<path d="M270,440 Q270,310 400,310 Q530,310 530,440 Z" fill="{ink}"/>' + "".join(f'<rect x="{262 + k * 18}" y="430" width="12" height="{260 + (k % 2) * 40}" rx="6" fill="{ink}"/>' for k in range(2)) + "".join(f'<rect x="{512 - k * 18}" y="430" width="12" height="{260 + (k % 2) * 40}" rx="6" fill="{ink}"/>' for k in range(2))
    else:
        body += f'<path d="M270,440 Q275,310 400,305 Q525,310 530,440 Q470,360 400,360 Q330,360 270,440" fill="{ink}"/>'
    write(f"portrait-{i}", PW, PH, body, defs)

print("wrote", len(os.listdir(OUT)), "files to", os.path.abspath(OUT))
