#!/usr/bin/env python3
"""
Incremental build -> public/formatters.json
Requires: jieba, python-frontmatter
"""
import json
import hashlib
from pathlib import Path
import jieba
import frontmatter

SRC_GLOB = "wheel/resources/**/*.md"
OUT_DIR = Path("public")
OUT_FILE = OUT_DIR / "formatters.json"
CACHE_FILE = Path(".cache/formatters-cache.json")

def hash_text(s: str) -> str:
    return hashlib.sha1(s.encode("utf-8")).hexdigest()

def load_cache():
    if CACHE_FILE.exists():
        return json.loads(CACHE_FILE.read_text(encoding="utf-8"))
    return {"items": {}}

def save_cache(cache):
    CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
    CACHE_FILE.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")

def process_file(p: Path):
    raw = p.read_text(encoding="utf-8")
    h = hash_text(raw)
    fm = frontmatter.loads(raw)
    data = fm.metadata or {}
    # 将 name/description/content 以及作者名一起拼入用于分词的文本中。
    # 新的 frontmatter 中 author 字段为数组，元素形如 {"name": "xxx", "char": "xxx"}
    authors_raw = data.get("author", [])
    # 规范为列表（兼容历史字符串形式）
    if isinstance(authors_raw, list):
        authors_list = authors_raw
    elif authors_raw is None:
        authors_list = []
    else:
        authors_list = [authors_raw]

    # 提取作者姓名用于加入文本（兼容元素为字符串或对象的情况）
    author_names = []
    for a in authors_list:
        if isinstance(a, dict):
            name = a.get("name")
        else:
            name = str(a)
        if name:
            author_names.append(name)

    text = " ".join(filter(None, [data.get("name", ""), data.get("description", ""), " ".join(author_names)]))
    tokens = " ".join(jieba.cut_for_search(text))
    id_rel = str(p.relative_to(Path.cwd())).replace("\\", "/")
    rec = {
        "id": id_rel,
        "name": data.get("name",""),
        "description": data.get("description",""),
        "tags": data.get("tags", []),
        "path": "/" + id_rel.replace(".md", ".html"),
        "tokens": tokens,
        "gameversion": data.get("gameversion", []),
        # 保存为作者对象数组（兼容旧值，已在上面规范为列表）
        "author": authors_list,
        "cover": data.get("cover", ""),
        "version": data.get("version", "")
    }
    return h, rec

def main():
    cache = load_cache()
    old_items = cache.get("items", {})
    new_items = dict(old_items)  # id -> {hash, rec}

    files = list(map(Path, sorted([p for p in Path.cwd().glob(SRC_GLOB)]))) if "**" in SRC_GLOB else list(Path.cwd().glob(SRC_GLOB))
    src_ids = set(str(p.relative_to(Path.cwd())).replace("\\","/") for p in files)

    # remove deleted
    for k in list(new_items.keys()):
        if k not in src_ids:
            new_items.pop(k, None)

    for p in files:
        id_rel = str(p.relative_to(Path.cwd())).replace("\\","/")
        raw = p.read_text(encoding="utf-8")
        h = hash_text(raw)
        cached = old_items.get(id_rel)
        if cached and cached.get("hash") == h:
            continue
        # changed or new
        h2, rec = process_file(p)
        new_items[id_rel] = {"hash": h2, "rec": rec}

    final_list = [v["rec"] for v in new_items.values()]
    final_list.sort(key=lambda x: (x.get("name") or "").lower())

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_FILE.write_text(json.dumps(final_list, ensure_ascii=False), encoding="utf-8")

    save_cache({"items": new_items, "meta": {"ts": __import__("time").time()}})
    print(f"Wrote {OUT_FILE} items: {len(final_list)}")

if __name__ == "__main__":
    main()
