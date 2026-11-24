# -*- coding: utf-8 -*-
"""Parse the 货币反假 docx question bank into structured JSON."""
import json, os, re, sys
from collections import Counter
from docx import Document

if len(sys.argv) < 2:
    sys.exit("usage: python parse_bank.py <题库.docx>")
SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "questions.json")

SECTION = {"单选": ("single", "s"), "多选": ("multiple", "m"), "判断": ("judge", "j"), "案例": ("case", "c")}
Q_RE = re.compile(r"^\s*(\d{1,4})\s*[、.．]\s*(.*)$")
OPT_RE = re.compile(r"^\s*([A-F])\s*[\s\u00a0\u3000]*\s*(.+)$")
ANS_RE = re.compile(r"^\s*正确答案\s*[：:]\s*([A-F√×对错]{1,6})\s*$")

doc = Document(SRC)
lines = [p.text.replace("\u00a0", " ").strip() for p in doc.paragraphs]
lines = [t for t in lines if t and not t.startswith("窗体")]

questions, errors = [], []
cur_sec = None
sec_count = Counter()
buf = []  # current question lines

def flush():
    global buf, cur_sec
    if not buf:
        return
    if cur_sec is None:
        errors.append(("no-section", buf[0][:40]))
        buf = []
        return
    typ, pre = SECTION[cur_sec]
    m = Q_RE.match(buf[0])
    if not m:
        errors.append(("bad-stem", buf[0][:60]))
        buf = []
        return
    num = int(m.group(1))
    stem_parts, opts, ans = [m.group(2).strip()], [], None
    last_kind = "stem"
    for ln in buf[1:]:
        am = ANS_RE.match(ln)
        if am:
            ans = am.group(1)
            last_kind = "ans"
            continue
        om = OPT_RE.match(ln)
        if om and (not opts or ord(om.group(1)) == ord(opts[-1][0]) + 1):
            opts.append((om.group(1), om.group(2).strip()))
            last_kind = "opt"
        else:
            if last_kind == "opt":
                opts[-1] = (opts[-1][0], opts[-1][1] + ln)
            elif last_kind == "stem":
                stem_parts.append(ln)
            # ignore text after answer
    stem = "".join(stem_parts).strip()

    if typ == "judge":
        opts = [("A", "正确"), ("B", "错误")]
        if ans in ("√", "对", "正确"):
            ans = "A"
        elif ans in ("×", "错", "错误"):
            ans = "B"
    if typ == "single" and ans and len(ans) > 1:
        # tolerate a single-answer key on a single-choice question
        ans = ans[:1]

    severe, flag = [], None
    if not stem:
        severe.append("empty-stem")
    if len(opts) < 2:
        severe.append("few-options")
    if not ans:
        severe.append("no-answer")
    keys = [k for k, _ in opts]
    if severe:
        errors.append((f"{typ}-{num}", severe, stem[:40]))
        buf = []
        return
    expected = [chr(65 + i) for i in range(len(opts))]
    if typ in ("single", "multiple", "case") and keys != expected:
        flag = "opt-order"
    if any(c not in keys for c in ans):
        flag = "ans-range"
    if typ == "single" and len(ans) != 1:
        flag = flag or "single-multi"

    qid = f"{pre}{num}"
    q = {"id": qid, "type": typ, "stem": stem, "options": [t for _, t in opts], "answer": ans}
    if flag:
        q["flag"] = flag
    questions.append(q)
    sec_count[typ] += 1
    buf = []

for ln in lines:
    if ln in SECTION:
        flush()
        cur_sec = ln
        continue
    if Q_RE.match(ln):
        flush()
        buf = [ln]
    elif buf:
        buf.append(ln)
flush()

# validations
ids = Counter(q["id"] for q in questions)
dups = [i for i, c in ids.items() if c > 1]
stems = Counter(q["stem"] for q in questions)
dup_stems = [s for s, c in stems.items() if c > 1]
ans_dist = Counter(q["answer"] for q in questions)

report = {
    "total": len(questions),
    "by_type": dict(sec_count),
    "errors": errors[:50],
    "error_count": len(errors),
    "duplicate_ids": dups,
    "duplicate_stems": len(dup_stems),
    "answer_dist": dict(ans_dist.most_common(12)),
    "flags": {q["id"]: q["flag"] for q in questions if q.get("flag")},
    "option_counts": dict(Counter(len(q["options"]) for q in questions)),
    "chars": sum(len(q["stem"]) + sum(len(o) for o in q["options"]) for q in questions),
}
with open(OUT, "w", encoding="utf-8") as f:
    json.dump({"questions": questions, "report": report}, f, ensure_ascii=False, indent=1)

print(json.dumps(report, ensure_ascii=False, indent=2))
print("wrote", OUT)
