#!/usr/bin/env python3
"""products_review_*.xlsx から supabase/schema.sql 用の INSERT INTO products
SQL を生成するスクリプト。

使い方:
    pip install pandas openpyxl   # 未インストールの場合のみ
    python3 scripts/generate_products_seed.py data/products_review_vN.xlsx

標準出力に SQL が出力されるので、supabase/schema.sql の
「-- 商品データ(...)」以降のブロックを手動で置き換えてください
(symptom_categories の insert 文はこのスクリプトでは生成しません)。

brand_name_en と active_ingredient は「店員さんに見せる」画面で
英語のみ表示する前提のフィールドのため、このスクリプトは両列に
日本語(ひらがな・カタカナ・漢字)が含まれていないかをチェックし、
見つかった場合は警告を標準エラー出力に表示します(処理は止めません)。
"""

import datetime
import re
import sys

import pandas as pd

CATEGORY_TO_SLUG = {
    "風邪(複合症状)": "cold_combined",
    "喉の痛み": "cold_throat",
    "咳": "cold_cough",
    "お腹の不調": "stomach",
    "頭痛・発熱": "head_fever",
    "アレルギー・花粉症": "allergy",
    "擦り傷": "skin_scratch",
    "虫刺され": "skin_insect_bite",
    "日焼け": "skin_sunburn",
}

# ひらがな・カタカナ・漢字(CJK統合漢字 + 拡張A)の範囲
JAPANESE_CHAR_PATTERN = re.compile(
    r"[぀-ヿ㐀-䶿一-鿿]"
)

# このフィールドは英語のみが前提(店員さんに見せる画面で使用)
ENGLISH_ONLY_COLUMNS = ["brand_name_en(店頭表記)", "active_ingredient"]


def sql_escape(value):
    return str(value).replace("'", "''")


def to_sql_string_or_null(value):
    if pd.isna(value):
        return "null"
    text = str(value).strip()
    if text == "":
        return "null"
    return f"'{sql_escape(text)}'"


def to_sql_text_array_or_null(value):
    if pd.isna(value):
        return "null"
    text = str(value).strip()
    if text == "":
        return "null"
    parts = [p.strip() for p in text.split("/")]
    parts = [p for p in parts if p]
    escaped = ", ".join(f"'{sql_escape(p)}'" for p in parts)
    return f"ARRAY[{escaped}]::text[]"


def check_english_only_columns(df):
    """brand_name_en / active_ingredient への日本語混入を警告するだけで、処理は止めない。"""
    warnings = []
    for i, row in df.iterrows():
        for column in ENGLISH_ONLY_COLUMNS:
            value = row[column]
            if pd.isna(value):
                continue
            text = str(value)
            if JAPANESE_CHAR_PATTERN.search(text):
                warnings.append(
                    f"  行{i} [{row['brand_name_en(店頭表記)']}] "
                    f"{column} に日本語が含まれています: {text}"
                )
    if warnings:
        print(
            "⚠ 警告: 英語のみのはずの列に日本語が見つかりました"
            "(店員さんに見せる画面に表示されるため要確認):",
            file=sys.stderr,
        )
        for w in warnings:
            print(w, file=sys.stderr)
        print(file=sys.stderr)
    return warnings


def main():
    if len(sys.argv) != 2:
        print(
            "使い方: python3 scripts/generate_products_seed.py <xlsxファイルパス>",
            file=sys.stderr,
        )
        sys.exit(1)

    xlsx_path = sys.argv[1]
    df = pd.read_excel(xlsx_path, header=1)

    check_english_only_columns(df)

    today = datetime.date.today().isoformat()
    rows_sql = []
    unknown_categories = set()
    not_ok_rows = []

    for _, row in df.iterrows():
        category_ja = str(row["カテゴリ"]).strip()
        slug = CATEGORY_TO_SLUG.get(category_ja)
        if slug is None:
            unknown_categories.add(category_ja)
            continue

        brand_name_en = to_sql_string_or_null(row["brand_name_en(店頭表記)"])
        description_ja = to_sql_string_or_null(row["description_ja(下書き)"])
        active_ingredient = to_sql_string_or_null(row["active_ingredient"])
        caution_flags = to_sql_text_array_or_null(row["caution_flags(下書き)"])
        state_note = to_sql_string_or_null(row["state_note(州差異があれば)"])
        source_note = to_sql_string_or_null(row["source_note"])

        kakunin = row["確認"]
        is_ok = not pd.isna(kakunin) and str(kakunin).strip() == "OK"
        if not is_ok:
            not_ok_rows.append(str(row["brand_name_en(店頭表記)"]))
        is_active = "true" if is_ok else "false"

        rows_sql.append(
            "  (\n"
            f"    (select id from public.symptom_categories where slug = '{slug}'),\n"
            f"    {brand_name_en},\n"
            f"    {description_ja},\n"
            f"    {active_ingredient},\n"
            f"    {caution_flags},\n"
            f"    {state_note},\n"
            f"    date '{today}',\n"
            f"    {source_note},\n"
            f"    {is_active}\n"
            "  )"
        )

    if unknown_categories:
        print(f"⚠ 警告: 未知のカテゴリ値: {unknown_categories}", file=sys.stderr)
    if not_ok_rows:
        print(
            f"確認列が OK でない行(is_active=false): {not_ok_rows}",
            file=sys.stderr,
        )

    sql = (
        "insert into public.products\n"
        "  (category_id, brand_name_en, description_ja, active_ingredient, "
        "caution_flags, state_note, last_reviewed_date, source_note, is_active)\n"
        "values\n" + ",\n".join(rows_sql) + ";\n"
    )
    print(sql)


if __name__ == "__main__":
    main()
