# -*- coding: utf-8 -*-
"""Assemble the single-file app."""
import base64, io, json, os, re, urllib.parse
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(ROOT)
OUT = os.path.join(REPO, "反假通.html")

def b64(path, mime):
    with open(path, "rb") as f:
        return "data:%s;base64,%s" % (mime, base64.b64encode(f.read()).decode())

# icon at 192 for inline use (keeps file small, plenty for 46px logo / 180px touch icon)
im = Image.open(os.path.join(ROOT, "assets", "icon.jpg")).convert("RGB").resize((192, 192), Image.LANCZOS)
buf = io.BytesIO()
im.save(buf, "JPEG", quality=88, optimize=True)
ICON_URI = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()

assets = {
    "__ICON_URI__": ICON_URI,
    "__MASCOT_URI__": b64(os.path.join(ROOT, "assets", "mascot.webp"), "image/webp"),
    "__GREAT_URI__": b64(os.path.join(ROOT, "assets", "great.webp"), "image/webp"),
    "__OK_URI__": b64(os.path.join(ROOT, "assets", "ok.webp"), "image/webp"),
    "__BAD_URI__": b64(os.path.join(ROOT, "assets", "bad.webp"), "image/webp"),
    "__EMPTY_URI__": b64(os.path.join(ROOT, "assets", "empty.webp"), "image/webp"),
}

data = json.load(open(os.path.join(ROOT, "questions.json"), encoding="utf-8"))
qs = []
for q in data["questions"]:
    opts = [re.sub(r"[\s；;。，,、]+$", "", o) for o in q["options"]]
    item = {"i": q["id"], "t": q["type"], "q": q["stem"], "o": opts, "a": q["answer"]}
    if q.get("flag"):
        item["f"] = q["flag"]
    qs.append(item)

bank_json = json.dumps(qs, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
assert len(qs) == 868

manifest = {
    "name": "反假通 · 货币反假刷题",
    "short_name": "反假通",
    "description": "868 题货币反假题库，离线刷题与模拟考试",
    "start_url": "./",
    "display": "standalone",
    "background_color": "#0B3B6F",
    "theme_color": "#0B3B6F",
    "lang": "zh-CN",
}
manifest_uri = "data:application/manifest+json;charset=utf-8," + urllib.parse.quote(
    json.dumps(manifest, ensure_ascii=False), safe="")

html = open(os.path.join(ROOT, "template.html"), encoding="utf-8").read()
css = open(os.path.join(ROOT, "styles.css"), encoding="utf-8").read()
js = open(os.path.join(ROOT, "app.js"), encoding="utf-8").read()

html = html.replace("/*__CSS__*/", css)
html = html.replace("/*__JS__*/", js)
html = html.replace("__BANK_JSON__", bank_json)
html = html.replace("__MANIFEST_URI__", manifest_uri)
for k, v in assets.items():
    html = html.replace(k, v)

for token in ["__ICON_URI__", "__MASCOT_URI__", "__GREAT_URI__", "__OK_URI__", "__BAD_URI__", "__EMPTY_URI__", "__BANK_JSON__", "__MANIFEST_URI__"]:
    assert token not in html, token

open(OUT, "w", encoding="utf-8").write(html)

print("questions:", len(qs), "bank KB:", round(len(bank_json.encode()) / 1024, 1))
print("html KB:", round(os.path.getsize(OUT) / 1024, 1))
print("written:", OUT)
