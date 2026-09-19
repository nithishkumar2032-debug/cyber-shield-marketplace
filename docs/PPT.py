# -*- coding: utf-8 -*-
"""Fill the official SIH 2026 template with Cyber Shield content, plus an infographic twin."""
from __future__ import annotations

import copy
import os
import shutil
from typing import Iterable

from lxml import etree
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Emu, Inches, Pt

TEMPLATE = r"c:\Users\nithi\Downloads\SIH2026-IDEA-Presentation-Format (3).pptx"
ORIGINAL = r"c:\Users\nithi\OneDrive\Desktop\SIH2026.pptx"
BACKUP = r"c:\Users\nithi\OneDrive\Desktop\SIH2026_original_backup.pptx"
OUT_OFFICIAL = r"c:\Users\nithi\OneDrive\Desktop\SIH2026.pptx"
OUT_INFO = r"c:\Users\nithi\OneDrive\Desktop\SIH2026_Infographics.pptx"
IMG_TRADE = r"C:\Users\nithi\.cursor\projects\empty-window\assets\sih_direct_trade_illustration.png"
IMG_PIPE = r"C:\Users\nithi\.cursor\projects\empty-window\assets\sih_pipeline_icons_crop.png"

NAVY = RGBColor(0x0B, 0x3A, 0x67)
BLUE = RGBColor(0x00, 0x70, 0xC0)
BLUE_DK = RGBColor(0x00, 0x55, 0x96)
SAFFRON = RGBColor(0xE8, 0x6A, 0x12)
GREEN = RGBColor(0x1B, 0x8A, 0x4A)
TEAL = RGBColor(0x0E, 0x7C, 0x7B)
RED = RGBColor(0xC0, 0x39, 0x2B)
DARK = RGBColor(0x1F, 0x2A, 0x37)
GRAY = RGBColor(0x5B, 0x67, 0x75)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
PALE_BLUE = RGBColor(0xE8, 0xF3, 0xFC)
PALE_ORANGE = RGBColor(0xFD, 0xEE, 0xDC)
PALE_GREEN = RGBColor(0xE4, 0xF5, 0xEA)
PALE_NAVY = RGBColor(0xE7, 0xEE, 0xF6)
PALE_RED = RGBColor(0xFB, 0xEA, 0xEA)
GOLD = RGBColor(0xF4, 0xC4, 0x30)
ROW_ALT = RGBColor(0xF7, 0xFA, 0xFC)

TEAM = "Cyber Shield"
IDEA_TITLE = "Direct Farm Bulk Crop Procurement (B2B)"
PS_ID = "SIH26033"
PS_TITLE = "Multiple intermediaries reduce farmers' earnings and increase consumer prices"
THEME = "Agriculture & Rural Development"
CATEGORY = "Software"
LEAD = "Kenan Aaron"


def emu(inches: float) -> int:
    return int(Inches(inches))


def set_solid(shape, color: RGBColor, line=None, line_pt: float = 0.75):
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    if line is None:
        shape.line.fill.background()
    else:
        shape.line.color.rgb = line
        shape.line.width = Pt(line_pt)


def round_corners(shape, adj: float = 0.12):
    try:
        shape.adjustments[0] = adj
    except Exception:
        pass


def _set_run_font(run, name, size, bold, color):
    run.font.name = name
    run.font.size = Pt(size) if size else None
    run.font.bold = bold
    if color is not None:
        run.font.color.rgb = color
    rPr = run._r.get_or_add_rPr()
    latin = rPr.find(qn("a:latin"))
    if latin is None:
        latin = etree.SubElement(rPr, qn("a:latin"))
    latin.set("typeface", name)
    ea = rPr.find(qn("a:ea"))
    if ea is None:
        ea = etree.SubElement(rPr, qn("a:ea"))
    ea.set("typeface", name)
    cs = rPr.find(qn("a:cs"))
    if cs is None:
        cs = etree.SubElement(rPr, qn("a:cs"))
    cs.set("typeface", name)


def clear_tf(tf):
    tf.clear()
    tf.word_wrap = True


def add_runs(p, runs: Iterable[dict], default_name="Arial", default_size=13, default_color=DARK):
    first = True
    for spec in runs:
        if first and p.runs:
            run = p.runs[0]
            first = False
        else:
            run = p.add_run()
            first = False
        run.text = spec.get("t", "")
        _set_run_font(
            run,
            spec.get("name", default_name),
            spec.get("size", default_size),
            spec.get("bold", False),
            spec.get("color", default_color),
        )


def write_paras(shape, paras: list[dict], anchor="t", margin=(0.08, 0.06, 0.08, 0.06)):
    tf = shape.text_frame
    clear_tf(tf)
    tf.auto_size = None
    tf.margin_left = Inches(margin[0])
    tf.margin_right = Inches(margin[2])
    tf.margin_top = Inches(margin[1])
    tf.margin_bottom = Inches(margin[3])
    bodyPr = tf._txBody.find(qn("a:bodyPr"))
    if bodyPr is not None:
        bodyPr.set("anchor", {"t": "t", "ctr": "ctr", "b": "b"}.get(anchor, "t"))
    for i, para in enumerate(paras):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.level = para.get("level", 0)
        p.alignment = para.get("align", PP_ALIGN.LEFT)
        p.space_before = Pt(para.get("sb", 0))
        p.space_after = Pt(para.get("sa", 3))
        if para.get("line"):
            p.line_spacing = para["line"]
        runs = para.get("runs")
        if runs is None:
            runs = [{
                "t": para.get("t", ""),
                "size": para.get("size", 13),
                "bold": para.get("bold", False),
                "color": para.get("color", DARK),
                "name": para.get("name", "Arial"),
            }]
        add_runs(
            p,
            runs,
            default_name=para.get("name", "Arial"),
            default_size=para.get("size", 13),
            default_color=para.get("color", DARK),
        )


def add_box(slide, left, top, width, height, fill, line=None, adj=0.1):
    sh = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, emu(left), emu(top), emu(width), emu(height))
    round_corners(sh, adj)
    set_solid(sh, fill, line)
    return sh


def add_rect(slide, left, top, width, height, fill, line=None):
    sh = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, emu(left), emu(top), emu(width), emu(height))
    set_solid(sh, fill, line)
    return sh


def add_oval(slide, left, top, width, height, fill, line=None):
    sh = slide.shapes.add_shape(MSO_SHAPE.OVAL, emu(left), emu(top), emu(width), emu(height))
    set_solid(sh, fill, line)
    return sh


def add_tb(slide, left, top, width, height, paras, anchor="t", margin=(0.06, 0.04, 0.06, 0.04)):
    tb = slide.shapes.add_textbox(emu(left), emu(top), emu(width), emu(height))
    write_paras(tb, paras, anchor=anchor, margin=margin)
    return tb


def add_card(slide, left, top, width, height, header, bullets, header_fill=BLUE, body_fill=WHITE, header_size=12):
    add_box(slide, left, top, width, height, body_fill, line=RGBColor(0xD6, 0xE3, 0xF0), adj=0.08)
    add_rect(slide, left, top, width, 0.42, header_fill)
    add_tb(
        slide,
        left,
        top,
        width,
        0.42,
        [{"t": header, "size": header_size, "bold": True, "color": WHITE, "align": PP_ALIGN.CENTER, "sa": 0}],
        anchor="ctr",
        margin=(0.08, 0.02, 0.08, 0.02),
    )
    paras = []
    for b in bullets:
        if isinstance(b, str):
            paras.append({"t": b, "size": 11, "color": DARK, "sa": 5, "line": 1.05})
        else:
            paras.append(b)
    add_tb(slide, left + 0.04, top + 0.44, width - 0.08, height - 0.5, paras, anchor="t")


def delete_slide(prs, index: int):
    sldIdLst = prs.slides._sldIdLst
    sldId = list(sldIdLst)[index]
    rId = sldId.get(qn("r:id"))
    prs.part.drop_rel(rId)
    sldIdLst.remove(sldId)


def delete_shape(shape):
    el = shape._element
    el.getparent().remove(el)


def find_shapes(slide):
    return {s.name: s for s in slide.shapes}


def set_team_oval(slide):
    for s in slide.shapes:
        if s.has_text_frame and "Your Team Name" in (s.text_frame.text or ""):
            write_paras(
                s,
                [{"t": TEAM, "size": 10, "bold": True, "color": DARK, "align": PP_ALIGN.CENTER, "name": "Arial", "sa": 0}],
                anchor="ctr",
                margin=(0.04, 0.04, 0.04, 0.04),
            )
            return


def set_title(slide, text, size=26):
    for s in slide.shapes:
        if s.name.startswith("Title") and s.has_text_frame:
            # Sit to the right of the team oval and left of the SIH logo.
            s.left = Inches(1.82)
            s.top = Inches(0.10)
            s.width = Inches(8.70)
            s.height = Inches(0.95)
            write_paras(
                s,
                [{
                    "t": text,
                    "size": size,
                    "bold": True,
                    "color": NAVY,
                    "name": "Times New Roman",
                    "sa": 0,
                    "align": PP_ALIGN.LEFT,
                }],
                anchor="ctr",
                margin=(0.06, 0.02, 0.06, 0.02),
            )
            return s


def clone_template(dest: str) -> Presentation:
    if os.path.abspath(TEMPLATE) != os.path.abspath(dest):
        shutil.copyfile(TEMPLATE, dest)
    return Presentation(dest)


def fill_title_page(prs: Presentation):
    slide = prs.slides[0]
    for s in slide.shapes:
        if s.name == "TextBox 9" or (
            s.has_text_frame and "Problem Statement ID" in (s.text_frame.text or "")
        ):
            lines = [
                ("Problem Statement ID – ", PS_ID),
                ("Problem Statement Title – ", PS_TITLE),
                ("Theme – ", THEME),
                ("PS Category – ", CATEGORY),
                ("Team ID – ", "(enter SIH portal Team ID)"),
                ("Team Name – ", f"{TEAM}   |   Lead: {LEAD}"),
            ]
            paras = [{"t": "", "size": 6, "sa": 0}]
            for label, value in lines:
                paras.append({
                    "sa": 10,
                    "line": 1.08,
                    "runs": [
                        {"t": label, "size": 16, "bold": True, "color": NAVY, "name": "Arial"},
                        {"t": value, "size": 15, "bold": False, "color": DARK, "name": "Arial"},
                    ],
                })
            write_paras(s, paras, anchor="t", margin=(0.08, 0.05, 0.08, 0.05))
            break


def style_content_title(prs):
    titles = [
        IDEA_TITLE,
        "TECHNICAL APPROACH",
        "FEASIBILITY AND VIABILITY",
        "IMPACT AND BENEFITS",
        "RESEARCH AND REFERENCES",
    ]
    sizes = [20, 28, 24, 28, 24]
    for i, (title, size) in enumerate(zip(titles, sizes), start=1):
        slide = prs.slides[i]
        set_title(slide, title, size=size)
        set_team_oval(slide)


# ---------------------------------------------------------------------------
# Official (template-faithful) body copy
# ---------------------------------------------------------------------------
def fill_official(prs: Presentation):
    fill_title_page(prs)
    style_content_title(prs)

    # Slide 2 — Proposed solution
    s2 = prs.slides[1]
    for sh in list(s2.shapes):
        if sh.name == "TextBox 8":
            delete_shape(sh)
    add_tb(
        s2, 0.35, 1.18, 12.6, 0.36,
        [{"t": "Proposed Solution (Describe your Idea/Solution/Prototype)", "size": 16, "bold": True, "color": BLUE, "name": "Arial", "sa": 0}],
        anchor="ctr",
    )
    add_card(
        s2, 0.35, 1.58, 4.15, 5.18,
        "Detailed explanation of the proposed solution",
        [
            {"t": "B2B farm-gate wholesale exchange connecting farmers directly with companies — not a reseller.", "size": 12, "sa": 7, "line": 1.05},
            {"t": "100% of order value is locked in an independent partner-bank escrow before the truck leaves for the farm.", "size": 12, "sa": 7, "line": 1.05},
            {"t": "Software never touches, pools, or diverts funds — bank is trustee; platform only instructs release.", "size": 12, "sa": 7, "line": 1.05},
            {"t": "Digital land, weight, grade and payout trail for central/state supervision and farmer accountability.", "size": 12, "sa": 7, "line": 1.05},
            {"t": "Goal: raise farmer share of the consumer rupee and cut consumer prices by removing unauthorized layers.", "size": 12, "sa": 4, "line": 1.05},
        ],
        header_fill=BLUE,
        header_size=11,
    )
    add_card(
        s2, 4.62, 1.58, 4.15, 5.18,
        "How it addresses the problem",
        [
            {"t": "RBI TOP study: tomato farmers keep ~33% and onion farmers ~36% of the consumer price; 64–67% is absorbed by agents and markups.", "size": 12, "sa": 7, "line": 1.05},
            {"t": "ICAR-CIPHET: 11.6–22.2% post-harvest loss when pickup is stalled; distress sales at ₹5–₹10/kg vs ~₹30/kg retail.", "size": 12, "sa": 7, "line": 1.05},
            {"t": "Today transit rot is dumped on the farmer because buyers pay only after city-gate delivery.", "size": 12, "sa": 7, "line": 1.05},
            {"t": "Our fix: pre-funded escrow + farm-gate weighment + instant bank credit + legal risk transfer at loading.", "size": 12, "sa": 4, "line": 1.05},
        ],
        header_fill=SAFFRON,
        header_size=11,
    )
    add_card(
        s2, 8.89, 1.58, 4.15, 5.18,
        "Innovation and uniqueness of the solution",
        [
            {"t": "1. Regulated partner-bank escrow — platform has zero float; no private cash diversion.", "size": 12, "sa": 8, "line": 1.05},
            {"t": "2. Deterministic lot splitting — distance, truck capacity and AGMARK grade (not opaque ML prices). Example: 10 MT → 6 MT processor + 4 MT retail, no double-booking.", "size": 12, "sa": 8, "line": 1.05},
            {"t": "3. Bluetooth legal-metrology scale streams gross/tare to farmer & driver phones; one-time handover code transfers transit liability and releases payout before the truck departs.", "size": 12, "sa": 4, "line": 1.05},
        ],
        header_fill=GREEN,
        header_size=11,
    )

    # Slide 3 — Technical approach
    s3 = prs.slides[2]
    for sh in list(s3.shapes):
        if sh.name == "TextBox 8":
            delete_shape(sh)
    add_tb(
        s3, 0.35, 1.16, 12.6, 0.32,
        [{"t": "Technologies to be used  ·  Methodology and process for implementation", "size": 14, "bold": True, "color": BLUE, "sa": 0}],
        anchor="ctr",
    )
    # tech table
    rows = [
        ("Layer", "Stack"),
        ("Web frontend", "React.js, Next.js, TailwindCSS, HTML5 Canvas / Web APIs, offline service workers"),
        ("Mobile apps", "Flutter (Dart) — Android/iOS field-officer inspection & driver dispatch"),
        ("Backend APIs", "FastAPI (Python 3.11) & Node.js (TypeScript) — high-concurrency REST"),
        ("Data layer", "PostgreSQL 15 (relational + ACID audit trails), Redis 7 (matching queue / cache)"),
        ("Intelligence", "XGBoost, Scikit-Learn, Pandas, GeoPandas, Google Maps JavaScript & Places API"),
        ("Field hardware", "Model-approved Bluetooth digital scales + farmer/driver smartphones"),
        ("Govt / bank rails", "State e-Patta APIs, penny-drop account check, partner-bank escrow APIs"),
    ]
    tbl_shape = s3.shapes.add_table(len(rows), 2, emu(0.35), emu(1.50), emu(12.6), emu(2.55))
    tbl = tbl_shape.table
    tbl.columns[0].width = emu(2.35)
    tbl.columns[1].width = emu(10.25)
    for r, (a, b) in enumerate(rows):
        for c, val in enumerate((a, b)):
            cell = tbl.cell(r, c)
            cell.text = val
            fill = cell.fill
            fill.solid()
            fill.fore_color.rgb = BLUE if r == 0 else (PALE_BLUE if r % 2 == 0 else WHITE)
            for p in cell.text_frame.paragraphs:
                p.alignment = PP_ALIGN.LEFT
                for run in p.runs:
                    run.font.name = "Arial"
                    run.font.size = Pt(11 if r else 12)
                    run.font.bold = True if (r == 0 or c == 0) else False
                    run.font.color.rgb = WHITE if r == 0 else DARK
            cell.text_frame.word_wrap = True
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE

    steps = [
        ("1", "Farmer lists harvest", "Crop, tonnage, harvest date. e-Patta land + yield bounds checked in the background."),
        ("2", "Match & split lots", "Nearby bulk demand grouped by distance; lots split into POs with no double-booking."),
        ("3", "Buyer funds escrow", "Full order value into partner-bank escrow. Bank confirm → digital pickup pass."),
        ("4", "Weigh & handover", "BLE scale writes gross/tare to the app. Farmer + driver confirm with one-time code."),
        ("5", "Instant bank payout", "Platform instructs the bank; farmer is credited before the truck leaves the village road."),
    ]
    x = 0.35
    w = 2.42
    gap = 0.12
    for i, (n, h, body) in enumerate(steps):
        left = x + i * (w + gap)
        add_box(s3, left, 4.18, w, 2.55, WHITE, line=RGBColor(0xD0, 0xE4, 0xF5), adj=0.08)
        ov = add_oval(s3, left + 0.12, 4.30, 0.38, 0.38, BLUE)
        write_paras(ov, [{"t": n, "size": 12, "bold": True, "color": WHITE, "align": PP_ALIGN.CENTER, "sa": 0}], anchor="ctr", margin=(0, 0, 0, 0))
        add_tb(s3, left + 0.54, 4.30, w - 0.62, 0.40, [{"t": h, "size": 11, "bold": True, "color": NAVY, "sa": 0}], anchor="ctr")
        add_tb(s3, left + 0.10, 4.76, w - 0.20, 1.85, [{"t": body, "size": 11, "color": DARK, "sa": 0, "line": 1.08}], anchor="t")

    # Slide 4 — Feasibility
    s4 = prs.slides[3]
    for sh in list(s4.shapes):
        if sh.name == "TextBox 8":
            delete_shape(sh)
    add_card(
        s4, 0.35, 1.28, 4.15, 5.48,
        "Analysis of the feasibility of the idea",
        [
            {"t": "Uses existing rails: scheduled-bank escrow, legal-metrology BLE scales, e-Patta, penny-drop KYC — no new statute required.", "size": 12, "sa": 8, "line": 1.05},
            {"t": "MVP is software + commodity Bluetooth scales already in the market; no custom silicon.", "size": 12, "sa": 8, "line": 1.05},
            {"t": "Farmers/FPOs pay 0%. Buyers fund operations via a 0.5% infrastructure fee on completed orders.", "size": 12, "sa": 8, "line": 1.05},
            {"t": "Digital handover certificate designed for Section 65B / BSA evidentiary use at the farm gate.", "size": 12, "sa": 4, "line": 1.05},
        ],
        header_fill=BLUE,
        header_size=11,
    )
    add_card(
        s4, 4.62, 1.28, 4.15, 5.48,
        "Potential challenges and risks",
        [
            {"t": "Listed tonnage heavier than actual farm-gate weight.", "size": 12, "sa": 8, "line": 1.05},
            {"t": "Grade / quality disagreement during loading.", "size": 12, "sa": 8, "line": 1.05},
            {"t": "Heat / traffic spoilage after the truck leaves.", "size": 12, "sa": 8, "line": 1.05},
            {"t": "Rain or weather damage before loading.", "size": 12, "sa": 8, "line": 1.05},
            {"t": "Destination quality disputes after transit.", "size": 12, "sa": 8, "line": 1.05},
            {"t": "Farmer name vs bank-account mismatch at payout.", "size": 12, "sa": 4, "line": 1.05},
        ],
        header_fill=SAFFRON,
        header_size=11,
    )
    add_card(
        s4, 8.89, 1.28, 4.15, 5.48,
        "Strategies for overcoming these challenges",
        [
            {"t": "Auto-recalc: pay exact weighed tonnes; unused escrow returns to buyer (e.g. 10 MT listed → 9.2 MT paid).", "size": 12, "sa": 7, "line": 1.05},
            {"t": "Visual AGMARK parameters locked at booking; crate count adjusted on the spot before handover token.", "size": 12, "sa": 7, "line": 1.05},
            {"t": "Custody + risk transfer at loading — transit rot is buyer logistics, not a farmer deduction.", "size": 12, "sa": 7, "line": 1.05},
            {"t": "Digital crate tally for pre-load weather damage; remaining escrow released without freezing the order.", "size": 12, "sa": 7, "line": 1.05},
            {"t": "Penny-drop + e-Patta match before listing so payout cannot fail at the gate.", "size": 12, "sa": 4, "line": 1.05},
        ],
        header_fill=GREEN,
        header_size=11,
    )

    # Slide 5 — Impact
    s5 = prs.slides[4]
    for sh in list(s5.shapes):
        if sh.name == "TextBox 8":
            delete_shape(sh)
    kpis = [
        ("18–25%", "Higher farmer returns", "Skips 6–10% mandi commission, unloading cuts and cash-discount penalties (Dalwai Committee Vol. IV)."),
        ("Nil", "Spoilage deductions", "Transit risk moves to the buyer at loading — no heat/delay cuts from the farmer."),
        ("< 3 s", "Farm-gate payout", "Replaces 15–30 day customary delays; credit before the truck leaves the village."),
        ("₹1,200+ Cr", "Trade formalized / yr", "Bank-verified deals for 1.5 lakh+ farmers across 38 Tamil Nadu districts (Agri-Marketing Policy Note 5)."),
    ]
    for i, (n, h, b) in enumerate(kpis):
        left = 0.35 + i * 3.22
        add_box(s5, left, 1.22, 3.10, 2.22, WHITE, line=RGBColor(0xD0, 0xE4, 0xF5), adj=0.1)
        add_rect(s5, left, 1.22, 0.12, 2.22, BLUE if i % 2 == 0 else GREEN)
        add_tb(s5, left + 0.22, 1.28, 2.78, 0.62, [{"t": n, "size": 22, "bold": True, "color": BLUE if i % 2 == 0 else GREEN, "sa": 0}], anchor="ctr")
        add_tb(s5, left + 0.22, 1.86, 2.78, 0.36, [{"t": h, "size": 12, "bold": True, "color": NAVY, "sa": 0}], anchor="t")
        add_tb(s5, left + 0.22, 2.22, 2.78, 1.10, [{"t": b, "size": 11, "color": DARK, "sa": 0, "line": 1.05}], anchor="t")

    add_tb(
        s5, 0.35, 3.52, 12.6, 0.32,
        [{"t": "Potential impact on the target audience   ·   Benefits of the solution (social, economic, environmental)", "size": 13, "bold": True, "color": BLUE, "sa": 0}],
        anchor="ctr",
    )
    add_card(
        s5, 0.35, 3.88, 6.28, 2.88,
        "Potential impact on the target audience",
        [
            {"t": "Farmers / FPOs: full crop value, instant bank credit, no middleman float, 0% platform fee.", "size": 12, "sa": 6, "line": 1.05},
            {"t": "Companies / processors / retailers: graded lots, pre-funded certainty, farm-gate telemetry, fewer quality fights.", "size": 12, "sa": 6, "line": 1.05},
            {"t": "Consumers: fewer unauthorized markups between farm and retail.", "size": 12, "sa": 6, "line": 1.05},
            {"t": "State agri departments: immutable production and price logs without paper surveys.", "size": 12, "sa": 3, "line": 1.05},
        ],
        header_fill=NAVY,
        header_size=12,
    )
    add_card(
        s5, 6.78, 3.88, 6.20, 2.88,
        "Benefits — social · economic · environmental · governance",
        [
            {"t": "Social: dignity of on-time payment; women/smallholders not stuck waiting on agents.", "size": 12, "sa": 6, "line": 1.05},
            {"t": "Economic: 0% farmer commission; 0.5% buyer fee funds servers, bank APIs and scale calibration without recurring subsidy.", "size": 12, "sa": 6, "line": 1.05},
            {"t": "Environmental: faster pickup cuts avoidable rotting of perishable vegetables.", "size": 12, "sa": 6, "line": 1.05},
            {"t": "Governance: clean audit trail vs informal cash mandi deals.", "size": 12, "sa": 3, "line": 1.05},
        ],
        header_fill=GREEN,
        header_size=12,
    )

    # Slide 6 — Research
    s6 = prs.slides[5]
    for sh in list(s6.shapes):
        if sh.name == "TextBox 8":
            delete_shape(sh)
    add_tb(
        s6, 0.35, 1.16, 12.6, 0.30,
        [{"t": "Details / Links of the reference and research work", "size": 14, "bold": True, "color": BLUE, "sa": 0}],
        anchor="ctr",
    )
    refs = [
        "1. RBI, DEPR — Vegetables Inflation in India: Tomato, Onion and Potato (TOP). Farmer share of consumer rupee ~33% (tomato) and ~36% (onion).",
        "2. MoA&FW, GoI — Committee on Doubling Farmers' Income (Dalwai Committee), Vol. IV. Intermediary cuts and commission spreads.",
        "3. ICAR–CIPHET — Assessment of Quantitative Harvest and Post-Harvest Losses of Major Crops in India. Vegetable handling/decay 11.62–22.23%.",
        "4. DMI, GoI — Agmarknet daily arrivals & modal prices (data.gov.in open series) for transparent distance/grade matching inputs.",
        "5. Government of Tamil Nadu — Agri-Marketing & Agri-Business Policy Note (Demand No. 5) and SFAC State FPO Registry (1.5 lakh+ commercial vegetable growers).",
    ]
    add_box(s6, 0.35, 1.50, 12.60, 2.70, PALE_BLUE, line=RGBColor(0xC5, 0xDC, 0xF0), adj=0.06)
    add_tb(s6, 0.50, 1.55, 12.30, 2.58, [{"t": r, "size": 12, "color": DARK, "sa": 5, "line": 1.05} for r in refs], anchor="t")

    add_tb(
        s6, 0.35, 4.26, 12.6, 0.28,
        [{"t": "How this compares with current alternatives (uniqueness evidence)", "size": 13, "bold": True, "color": NAVY, "sa": 0}],
        anchor="ctr",
    )
    comps = [
        ("Mandi agents", "Unrecorded bids, manual scale cuts, delayed cash, no farmer recourse."),
        ("Agritech resellers", "Buy low / sell high (e.g. private aggregators); profit stays in company accounts."),
        ("Central e-NAM", "Farmer must haul to APMC yards; no guaranteed price; no farm-gate scale telemetry."),
        ("Our exchange", "Pre-funded scheduled-bank escrow, zero reseller float, deterministic split, payout at loading."),
    ]
    for i, (h, b) in enumerate(comps):
        left = 0.35 + i * 3.22
        fill = GREEN if i == 3 else WHITE
        hfill = GREEN if i == 3 else BLUE
        tcol = WHITE if i == 3 else DARK
        hcol = WHITE
        add_box(s6, left, 4.58, 3.10, 2.18, fill, line=GREEN if i == 3 else RGBColor(0xD0, 0xE4, 0xF5), adj=0.1)
        add_tb(s6, left, 4.64, 3.10, 0.42, [{"t": h, "size": 13, "bold": True, "color": hcol if i == 3 else NAVY, "align": PP_ALIGN.CENTER, "sa": 0}], anchor="ctr")
        add_tb(s6, left + 0.10, 5.08, 2.90, 1.55, [{"t": b, "size": 12, "color": tcol if i == 3 else DARK, "align": PP_ALIGN.CENTER, "sa": 0, "line": 1.08}], anchor="t")


# ---------------------------------------------------------------------------
# Infographic twin
# ---------------------------------------------------------------------------
def fill_infographic(prs: Presentation):
    fill_title_page(prs)
    style_content_title(prs)

    # Title page extra illustration under the fields if space; skip to avoid covering mascot.

    # Slide 2
    s2 = prs.slides[1]
    for sh in list(s2.shapes):
        if sh.name == "TextBox 8":
            delete_shape(sh)
    add_tb(
        s2, 0.30, 1.12, 12.7, 0.32,
        [{"t": "Proposed Solution (Describe your Idea/Solution/Prototype)", "size": 13, "bold": True, "color": BLUE, "sa": 0}],
        anchor="ctr",
    )

    # problem strip — full width so nothing sits under the SIH logo
    probs = [
        ("33–36%", "Farmer share of consumer rupee (RBI TOP)", RED, PALE_RED),
        ("64–67%", "Captured by agents & markups", SAFFRON, PALE_ORANGE),
        ("11.6–22.2%", "Post-harvest loss from delayed pickup", NAVY, PALE_NAVY),
        ("₹5–₹10/kg", "Distress sale vs ~₹30/kg retail", BLUE, PALE_BLUE),
    ]
    for i, (n, l, c, bg) in enumerate(probs):
        left = 0.30 + i * 3.22
        add_box(s2, left, 1.46, 3.08, 1.48, bg, line=c, adj=0.12)
        add_tb(s2, left, 1.50, 3.08, 0.62, [{"t": n, "size": 20, "bold": True, "color": c, "align": PP_ALIGN.CENTER, "sa": 0}], anchor="ctr")
        add_tb(s2, left + 0.10, 2.12, 2.88, 0.70, [{"t": l, "size": 12, "color": DARK, "align": PP_ALIGN.CENTER, "sa": 0, "line": 1.05}], anchor="t")

    flow = [
        ("FARMER", "List harvest + e-Patta check"),
        ("MATCH", "Split lots by distance / grade"),
        ("BANK", "100% escrow before truck moves"),
        ("GATE", "BLE weigh + handover code"),
        ("PAYOUT", "Bank credit before departure"),
    ]
    add_tb(s2, 0.30, 3.12, 12.7, 0.26, [{"t": "How it addresses the problem — farm-gate settlement instead of mandi float", "size": 12, "bold": True, "color": NAVY, "sa": 0}], anchor="ctr")
    for i, (h, b) in enumerate(flow):
        left = 0.30 + i * 2.52
        add_box(s2, left, 3.42, 2.22, 1.28, WHITE, line=BLUE, adj=0.12)
        add_rect(s2, left, 3.42, 2.22, 0.32, BLUE)
        add_tb(s2, left, 3.42, 2.22, 0.32, [{"t": h, "size": 11, "bold": True, "color": WHITE, "align": PP_ALIGN.CENTER, "sa": 0}], anchor="ctr", margin=(0.02, 0.01, 0.02, 0.01))
        add_tb(s2, left + 0.06, 3.76, 2.10, 0.88, [{"t": b, "size": 12, "color": DARK, "align": PP_ALIGN.CENTER, "sa": 0, "line": 1.05}], anchor="ctr")
        if i < 4:
            ar = s2.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, emu(left + 2.24), emu(3.88), emu(0.24), emu(0.22))
            set_solid(ar, SAFFRON)

    uniques = [
        ("01", "Partner-bank escrow", "Platform never holds or pools money. Bank is trustee of 100% order value."),
        ("02", "Deterministic lot split", "Distance + capacity + AGMARK — not a black-box price model. No double-booking."),
        ("03", "BLE handover + risk shift", "Legal-metrology scale → phones. One-time code transfers transit liability and releases pay."),
    ]
    add_tb(s2, 0.30, 4.78, 12.7, 0.24, [{"t": "Innovation and uniqueness of the solution", "size": 12, "bold": True, "color": GREEN, "sa": 0}], anchor="ctr")
    for i, (n, h, b) in enumerate(uniques):
        left = 0.30 + i * 4.28
        add_box(s2, left, 5.06, 4.12, 1.70, PALE_GREEN, line=GREEN, adj=0.1)
        ov = add_oval(s2, left + 0.12, 5.20, 0.46, 0.46, GREEN)
        write_paras(ov, [{"t": n, "size": 10, "bold": True, "color": WHITE, "align": PP_ALIGN.CENTER, "sa": 0}], anchor="ctr", margin=(0, 0, 0, 0))
        add_tb(s2, left + 0.66, 5.22, 3.30, 0.40, [{"t": h, "size": 13, "bold": True, "color": NAVY, "sa": 0}], anchor="ctr")
        add_tb(s2, left + 0.14, 5.68, 3.84, 0.95, [{"t": b, "size": 12, "color": DARK, "sa": 0, "line": 1.05}], anchor="t")

    # Slide 3
    s3 = prs.slides[2]
    for sh in list(s3.shapes):
        if sh.name == "TextBox 8":
            delete_shape(sh)
    add_tb(s3, 0.30, 1.12, 12.7, 0.26, [{"t": "Methodology and process for implementation (working pipeline)", "size": 13, "bold": True, "color": BLUE, "sa": 0}], anchor="ctr")
    if os.path.exists(IMG_PIPE):
        s3.shapes.add_picture(IMG_PIPE, emu(0.45), emu(1.38), emu(12.40), emu(1.72))

    steps = [
        ("1  List", "Crop, MT, date + e-Patta yield check"),
        ("2  Match", "Spatial demand grouping; split POs"),
        ("3  Escrow", "Buyer funds bank; pickup pass issued"),
        ("4  Weigh", "BLE scale + dual-phone handover code"),
        ("5  Pay", "Bank credit before truck departure"),
    ]
    for i, (h, b) in enumerate(steps):
        left = 0.30 + i * 2.58
        add_box(s3, left, 3.18, 2.46, 1.12, WHITE, line=BLUE, adj=0.12)
        add_tb(s3, left, 3.20, 2.46, 0.38, [{"t": h, "size": 12, "bold": True, "color": BLUE, "align": PP_ALIGN.CENTER, "sa": 0}], anchor="ctr")
        add_tb(s3, left + 0.06, 3.56, 2.34, 0.68, [{"t": b, "size": 11, "color": DARK, "align": PP_ALIGN.CENTER, "sa": 0}], anchor="t")

    add_tb(s3, 0.30, 4.40, 12.7, 0.24, [{"t": "Technologies to be used (languages, frameworks, hardware)", "size": 13, "bold": True, "color": NAVY, "sa": 0}], anchor="ctr")
    tech = [
        (SAFFRON, "WEB", "React · Next.js · Tailwind · offline PWA"),
        (BLUE, "MOBILE", "Flutter — officer & driver apps"),
        (NAVY, "API", "FastAPI + Node/TS REST"),
        (GREEN, "DATA", "PostgreSQL 15 · Redis 7"),
        (TEAL, "INTEL", "XGBoost · GeoPandas · Maps"),
        (RGBColor(0x6C, 0x34, 0x8D), "RAILS", "e-Patta · penny-drop · bank escrow · BLE scales"),
    ]
    for i, (c, h, b) in enumerate(tech):
        left = 0.30 + (i % 6) * 2.15
        add_box(s3, left, 4.68, 2.05, 2.02, WHITE, line=c, adj=0.12)
        add_rect(s3, left, 4.68, 2.05, 0.38, c)
        add_tb(s3, left, 4.68, 2.05, 0.38, [{"t": h, "size": 12, "bold": True, "color": WHITE, "align": PP_ALIGN.CENTER, "sa": 0}], anchor="ctr", margin=(0.02, 0, 0.02, 0))
        add_tb(s3, left + 0.06, 5.12, 1.93, 1.48, [{"t": b, "size": 13, "color": DARK, "align": PP_ALIGN.CENTER, "sa": 0, "line": 1.08}], anchor="ctr")

    # Slide 4
    s4 = prs.slides[3]
    for sh in list(s4.shapes):
        if sh.name == "TextBox 8":
            delete_shape(sh)
    cols = [
        (BLUE, "FEASIBLE BECAUSE", [
            "Scheduled-bank escrow already exists — no new financial licence for the app.",
            "Legal-metrology BLE scales are COTS hardware.",
            "e-Patta + penny-drop are live state/bank APIs.",
            "0% farmer fee; 0.5% buyer fee funds ops.",
            "65B / BSA-ready digital handover at the gate.",
            "Pilot path: 1 district FPO + 1 institutional buyer + 1 partner bank.",
            "Farm-gate driver app works with cached handover if signal drops.",
        ]),
        (SAFFRON, "CHALLENGES & RISKS", [
            "Listed MT > actual weighed MT.",
            "Grade fight during loading.",
            "Heat/traffic rot after departure.",
            "Rain damage before loading.",
            "City-gate quality claims later.",
            "Name vs account mismatch.",
        ]),
        (GREEN, "MITIGATION STRATEGY", [
            "Pay weighed MT; leftover escrow auto-refund (10 → 9.2 MT).",
            "AGMARK rules locked at booking; crate count edited on-spot.",
            "Risk transfers at load — transit is buyer logistics.",
            "Crate tally for weather; order not frozen.",
            "Farm-gate certificate ends destination blame-shift.",
            "Penny-drop vs e-Patta before listing.",
        ]),
    ]
    add_tb(s4, 0.30, 1.14, 12.7, 0.26, [{"t": "Analysis of feasibility  ·  Potential challenges and risks  ·  Strategies for overcoming them", "size": 13, "bold": True, "color": BLUE, "sa": 0}], anchor="ctr")
    for i, (c, h, items) in enumerate(cols):
        left = 0.30 + i * 4.30
        add_box(s4, left, 1.46, 4.14, 5.28, WHITE, line=c, adj=0.06)
        add_rect(s4, left, 1.46, 4.14, 0.48, c)
        add_tb(s4, left, 1.46, 4.14, 0.48, [{"t": h, "size": 13, "bold": True, "color": WHITE, "align": PP_ALIGN.CENTER, "sa": 0}], anchor="ctr")
        paras = []
        for j, it in enumerate(items, 1):
            paras.append({
                "sa": 8,
                "line": 1.05,
                "runs": [
                    {"t": f"{j}.  ", "size": 12, "bold": True, "color": c},
                    {"t": it, "size": 12, "bold": False, "color": DARK},
                ],
            })
        add_tb(s4, left + 0.12, 2.04, 3.90, 4.55, paras, anchor="t")

    # Slide 5
    s5 = prs.slides[4]
    for sh in list(s5.shapes):
        if sh.name == "TextBox 8":
            delete_shape(sh)
    add_tb(s5, 0.30, 1.12, 12.7, 0.26, [{"t": "Potential impact on the target audience", "size": 14, "bold": True, "color": BLUE, "sa": 0}], anchor="ctr")
    kpis = [
        (BLUE, "18–25%", "HIGHER RETURNS", "Mandi 6–10% cuts and cash discounts removed (Dalwai Vol. IV)."),
        (GREEN, "ZERO", "SPOILAGE CUTS", "Transit risk leaves the farmer at the moment of loading."),
        (SAFFRON, "INSTANT", "BANK CREDIT", "Vs 15–30 day wait; paid before the truck rolls."),
        (NAVY, "₹1,200+ Cr", "FORMAL TRADE / YR", "1.5 lakh+ farmers · 38 TN districts · bank statements."),
    ]
    for i, (c, n, h, b) in enumerate(kpis):
        left = 0.30 + i * 3.22
        add_box(s5, left, 1.44, 3.08, 2.35, WHITE, line=c, adj=0.1)
        add_oval(s5, left + 1.16, 1.52, 0.18, 0.18, c)
        add_tb(s5, left, 1.72, 3.08, 0.58, [{"t": n, "size": 22, "bold": True, "color": c, "align": PP_ALIGN.CENTER, "sa": 0}], anchor="ctr")
        add_tb(s5, left, 2.28, 3.08, 0.36, [{"t": h, "size": 11, "bold": True, "color": NAVY, "align": PP_ALIGN.CENTER, "sa": 0}], anchor="ctr")
        add_tb(s5, left + 0.12, 2.64, 2.84, 1.02, [{"t": b, "size": 12, "color": DARK, "align": PP_ALIGN.CENTER, "sa": 0, "line": 1.05}], anchor="t")

    add_tb(s5, 0.30, 3.88, 12.7, 0.26, [{"t": "Benefits of the solution (social, economic, environmental) + sustainability", "size": 13, "bold": True, "color": GREEN, "sa": 0}], anchor="ctr")
    bens = [
        (GREEN, "SOCIAL", "On-time dignity of payment for smallholders; no waiting on commission agents."),
        (BLUE, "ECONOMIC", "0% farmer / FPO fee. 0.5% buyer infrastructure fee funds hosting, bank APIs, scale calibration — no recurring subsidy."),
        (SAFFRON, "ENVIRONMENT", "Faster funded pickup reduces avoidable rotting of tomatoes, onions and other perishables."),
        (NAVY, "GOVERNANCE", "Immutable digital logs give agri departments live production and price truth, not paper estimates."),
    ]
    for i, (c, h, b) in enumerate(bens):
        left = 0.30 + i * 3.22
        add_box(s5, left, 4.18, 3.08, 2.55, WHITE, line=c, adj=0.1)
        add_rect(s5, left, 4.18, 3.08, 0.40, c)
        add_tb(s5, left, 4.18, 3.08, 0.40, [{"t": h, "size": 13, "bold": True, "color": WHITE, "align": PP_ALIGN.CENTER, "sa": 0}], anchor="ctr")
        add_tb(s5, left + 0.10, 4.66, 2.88, 1.92, [{"t": b, "size": 13, "color": DARK, "align": PP_ALIGN.CENTER, "sa": 0, "line": 1.08}], anchor="ctr")

    # Slide 6
    s6 = prs.slides[5]
    for sh in list(s6.shapes):
        if sh.name == "TextBox 8":
            delete_shape(sh)
    add_tb(s6, 0.30, 1.12, 12.7, 0.24, [{"t": "Landscape check  ·  then the official research trail", "size": 13, "bold": True, "color": BLUE, "sa": 0}], anchor="ctr")
    comps = [
        (GRAY, "MANDI AGENTS", "Unrecorded bids\nManual scale cuts\nDelayed cash\nZero recourse"),
        (SAFFRON, "PRIVATE RESELLERS", "Buy low, sell high\nFloat in company books\nFarmer is a supplier\nnot a counterparty"),
        (BLUE, "e-NAM PORTAL", "Haul to APMC yards\nNo guaranteed price\nNo farm-gate BLE scale\nFarmer bears logistics"),
        (GREEN, "CYBER SHIELD", "Bank escrow first\nZero reseller float\nDeterministic split\nPay at farm gate"),
    ]
    for i, (c, h, b) in enumerate(comps):
        left = 0.30 + i * 3.22
        bg = PALE_GREEN if i == 3 else WHITE
        add_box(s6, left, 1.40, 3.08, 2.55, bg, line=c, adj=0.1)
        add_rect(s6, left, 1.40, 3.08, 0.42, c)
        add_tb(s6, left, 1.40, 3.08, 0.42, [{"t": h, "size": 12, "bold": True, "color": WHITE, "align": PP_ALIGN.CENTER, "sa": 0}], anchor="ctr")
        add_tb(s6, left + 0.10, 1.90, 2.88, 1.90, [{"t": b.replace("\n", "  •  "), "size": 13, "color": DARK, "align": PP_ALIGN.CENTER, "sa": 0, "line": 1.15}], anchor="ctr")

    add_tb(s6, 0.30, 4.04, 12.7, 0.24, [{"t": "Details / Links of the reference and research work", "size": 13, "bold": True, "color": NAVY, "sa": 0}], anchor="ctr")
    refs = [
        ("RBI DEPR", "Vegetables Inflation in India (TOP) — farmer share ~33% tomato / ~36% onion."),
        ("Dalwai Vol. IV", "MoA&FW Committee on Doubling Farmers' Income — intermediary cuts & commissions."),
        ("ICAR–CIPHET", "National harvest / post-harvest loss study — vegetables 11.62–22.23%."),
        ("Agmarknet / DMI", "Daily arrivals & modal prices on data.gov.in — live matching inputs."),
        ("TN Policy Note 5", "Agri-Marketing & SFAC FPO registry — 1.5 lakh+ commercial vegetable growers."),
    ]
    for i, (h, b) in enumerate(refs):
        top = 4.32 + i * 0.48
        add_box(s6, 0.30, top, 12.70, 0.44, PALE_BLUE if i % 2 == 0 else WHITE, line=RGBColor(0xC5, 0xDC, 0xF0), adj=0.08)
        add_rect(s6, 0.30, top, 0.12, 0.44, BLUE)
        add_tb(
            s6, 0.52, top, 12.36, 0.44,
            [{"sa": 0, "runs": [
                {"t": f"{i+1}. {h}  —  ", "size": 12, "bold": True, "color": NAVY},
                {"t": b, "size": 12, "bold": False, "color": DARK},
            ]}],
            anchor="ctr",
            margin=(0.04, 0.04, 0.04, 0.04),
        )


def export_pdf(pptx_path: str, pdf_path: str):
    import comtypes.client  # type: ignore
    powerpoint = None
    presentation = None
    try:
        powerpoint = comtypes.client.CreateObject("PowerPoint.Application")
        powerpoint.Visible = 1
        presentation = powerpoint.Presentations.Open(pptx_path, WithWindow=False)
        # 32 = ppSaveAsPDF
        presentation.SaveAs(pdf_path, 32)
    finally:
        if presentation is not None:
            presentation.Close()
        if powerpoint is not None:
            powerpoint.Quit()


def main():
    if os.path.exists(ORIGINAL) and not os.path.exists(BACKUP):
        shutil.copyfile(ORIGINAL, BACKUP)
        print("backed up original ->", BACKUP)

    # Official
    if os.path.exists(OUT_OFFICIAL):
        os.remove(OUT_OFFICIAL)
    shutil.copyfile(TEMPLATE, OUT_OFFICIAL)
    prs = Presentation(OUT_OFFICIAL)
    fill_official(prs)
    delete_slide(prs, 6)  # drop instructions slide
    prs.save(OUT_OFFICIAL)
    print("saved official", OUT_OFFICIAL, "slides", len(prs.slides))

    # Infographic
    if os.path.exists(OUT_INFO):
        os.remove(OUT_INFO)
    shutil.copyfile(TEMPLATE, OUT_INFO)
    prs2 = Presentation(OUT_INFO)
    fill_infographic(prs2)
    delete_slide(prs2, 6)
    prs2.save(OUT_INFO)
    print("saved infographic", OUT_INFO, "slides", len(prs2.slides))


if __name__ == "__main__":
    main()
