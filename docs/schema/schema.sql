-- Supabase の SQL Editor で実行してください。
-- カテゴリ構成・実商品データは products_review_v8.xlsx に基づいています。
--
-- 親子カテゴリ構成:
--   風邪の症状(cold)        → 風邪(複合症状) / 喉の痛み / 咳 (子3つ)
--   お腹の不調(stomach)      → 子カテゴリなし(商品は親に直接紐付く)
--   頭痛・発熱(head_fever)   → 子カテゴリなし
--   アレルギー・花粉症(allergy) → 子カテゴリなし
--   擦り傷・虫刺され・日焼け(skin) → 擦り傷 / 虫刺され / 日焼け (子3つ)
--
-- v5 で caution_flags の年齢表記は大部分削除され(アプリ全体の免責文言に
-- 「成人向け」の一文を追加する方針に統一)、確認列は全30件 OK のため
-- is_active はすべて true にしています。v6 では残っていた単独の年齢表記
-- (Difflam Sore Throat Spray / Buscopan / Panadol の caution_flags)も
-- 空欄になり、caution_flags は null にしています。v8 では active_ingredient に
-- 混入していた日本語(8件: 上記/配合/相当 などの表現)を英語表記に修正済みです。
-- 生成には scripts/generate_products_seed.py を使用しています
-- (brand_name_en / active_ingredient への日本語混入を警告する機能つき)。
-- last_reviewed_date は xlsx に日付列がなかったため、このシード投入日を暫定値として
-- 入れています。実際のレビュー日が分かり次第 UPDATE してください。

drop table if exists public.products cascade;
drop table if exists public.symptom_categories cascade;

create table public.symptom_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (
    slug in (
      'cold', 'cold_combined', 'cold_throat', 'cold_cough',
      'stomach',
      'head_fever',
      'allergy',
      'skin', 'skin_scratch', 'skin_insect_bite', 'skin_sunburn'
    )
  ),
  -- 親カテゴリは null、子カテゴリは親の slug を入れる
  parent_slug text references public.symptom_categories(slug),
  name_ja text not null,
  sort_order int not null,
  created_at timestamptz not null default now()
);

create index idx_symptom_categories_parent_slug
  on public.symptom_categories(parent_slug);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.symptom_categories(id),
  brand_name_en text not null,       -- 店頭の実物表記、英語のみ
  description_ja text,               -- 日本語の説明
  active_ingredient text,
  caution_flags text[],              -- 例: ['妊娠中注意','子供不可','眠気あり']
  state_note text,                   -- 州ごとの差異(任意)
  last_reviewed_date date not null,
  source_note text,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.symptom_categories enable row level security;
alter table public.products enable row level security;

-- 一般公開情報のため、誰でも参照可能にする(書き込みはダッシュボード/管理者のみ)
create policy "symptom_categories are publicly readable"
  on public.symptom_categories
  for select
  to anon, authenticated
  using (true);

-- is_active = false の商品は公開側から見えないようにする
create policy "active products are publicly readable"
  on public.products
  for select
  to anon, authenticated
  using (is_active = true);

-- 親カテゴリ(5つ、CLAUDE.md の初期カテゴリ)
insert into public.symptom_categories (slug, parent_slug, name_ja, sort_order) values
  ('cold', null, '風邪の症状', 1),
  ('stomach', null, 'お腹の不調', 2),
  ('head_fever', null, '頭痛・発熱', 3),
  ('allergy', null, 'アレルギー・花粉症', 4),
  ('skin', null, '擦り傷・虫刺され・日焼け', 5);

-- 子カテゴリ(商品はこの粒度に紐付ける)
insert into public.symptom_categories (slug, parent_slug, name_ja, sort_order) values
  ('cold_combined', 'cold', '風邪(複合症状)', 1),
  ('cold_throat', 'cold', '喉の痛み', 2),
  ('cold_cough', 'cold', '咳', 3),

  ('skin_scratch', 'skin', '擦り傷', 1),
  ('skin_insect_bite', 'skin', '虫刺され', 2),
  ('skin_sunburn', 'skin', '日焼け', 3);

-- 商品データ(products_review_v8.xlsx より、2026-08-22 時点)
insert into public.products
  (category_id, brand_name_en, description_ja, active_ingredient, caution_flags, state_note, last_reviewed_date, source_note, is_active)
values
  (
    (select id from public.symptom_categories where slug = 'cold_combined'),
    'Demazin Cold & Flu Relief Day + Night',
    '発熱・鼻づまり・喉の痛みなど複数症状に効く総合感冒薬。昼夜で成分が異なる',
    'Day: Paracetamol 500mg, Phenylephrine hydrochloride 5mg / Night: Paracetamol 500mg, Phenylephrine hydrochloride 5mg, Chlorphenamine maleate 2mg',
    ARRAY['Day非眠気', 'Night剤は眠気の可能性あり']::text[],
    null,
    date '2026-08-22',
    'Chemist Warehouse商品ページ',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'cold_combined'),
    'Nurofen Cold and Flu Multi-Symptom Relief',
    '発熱・鼻づまり・喉の痛みに効く鎮痛系感冒薬',
    'Ibuprofen 200mg, Phenylephrine hydrochloride 5mg',
    ARRAY['非眠気タイプ', '胃腸に負担の可能性(NSAID)']::text[],
    null,
    date '2026-08-22',
    'Chemist Warehouse商品ページ',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'cold_throat'),
    'Difflam Sore Throat Spray',
    '喉の痛み・口内炎に効く鎮痛スプレー',
    'Benzydamine hydrochloride',
    null,
    null,
    date '2026-08-22',
    'Chemist Warehouse商品ページ',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'cold_throat'),
    'Betadine Sore Throat Gargle',
    '殺菌成分入りのうがい薬、喉の痛みに(Isoginの代替候補として提案)',
    'Povidone-iodine 1% w/v (Ready To Use)',
    ARRAY['甲状腺疾患のある方は要相談']::text[],
    null,
    date '2026-08-22',
    'Chemist Warehouse商品ページ',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'cold_cough'),
    'Duro-Tuss Dry Cough Liquid Forte',
    '乾いた咳(痰の絡まない咳)用の鎮咳シロップ',
    'Dextromethorphan hydrobromide monohydrate',
    ARRAY['非眠気']::text[],
    null,
    date '2026-08-22',
    'Chemist Warehouse商品ページ',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'cold_cough'),
    'Duro-Tuss Chesty Cough Liquid Forte',
    '痰が絡む咳用の去痰シロップ',
    'Bromhexine hydrochloride 8mg, Guaiphenesin 200mg',
    ARRAY['糖尿病の方も使用可とされる']::text[],
    null,
    date '2026-08-22',
    'Chemist Warehouse商品ページ',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'stomach'),
    'Gastro-Stop',
    '下痢の症状を抑えるカプセル(豪州で1位の下痢止めブランド)',
    'Loperamide 2mg',
    ARRAY['症状が48時間以上続く場合は要受診']::text[],
    null,
    date '2026-08-22',
    'Chemist Warehouse商品ページ',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'stomach'),
    'Buscopan',
    '胃・腹部のけいれん痛を和らげる錠剤',
    'Hyoscine butylbromide 10mg',
    null,
    null,
    date '2026-08-22',
    'Chemist Warehouse / Buscopan公式サイト',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'head_fever'),
    'Panadol',
    '頭痛・発熱に効く鎮痛解熱剤、胃に優しい',
    'Paracetamol 500mg',
    null,
    null,
    date '2026-08-22',
    'Chemist Warehouse商品ページ',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'head_fever'),
    'Nurofen',
    '頭痛・発熱・炎症に効く鎮痛剤',
    'Ibuprofen 200mg',
    ARRAY['胃腸に負担の可能性(NSAID)']::text[],
    null,
    date '2026-08-22',
    'Chemist Warehouse商品ページ',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'allergy'),
    'Telfast',
    '非眠気タイプの花粉症・アレルギー薬、効果は最大24時間',
    'Fexofenadine hydrochloride 180mg',
    ARRAY['非眠気']::text[],
    null,
    date '2026-08-22',
    'Chemist Warehouse商品ページ',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'allergy'),
    'Claratyne',
    '24時間効果の非眠気タイプ抗ヒスタミン薬',
    'Loratadine 10mg',
    ARRAY['非眠気']::text[],
    null,
    date '2026-08-22',
    'Chemist Warehouse商品ページ',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'skin_insect_bite'),
    'Soov Bite',
    '虫刺され・虫刺傷の痛みとかゆみを抑えるジェル',
    'Lidocaine hydrochloride 3%, Cetrimide 0.5%',
    ARRAY['湿疹・皮膚炎には使用不可']::text[],
    null,
    date '2026-08-22',
    'Chemist Warehouse商品ページ',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'skin_scratch'),
    'Bepanthen Antiseptic Cream',
    '傷・虫刺され・日焼けなど幅広く使える抗菌クリーム',
    'Dexpanthenol',
    ARRAY['赤ちゃんにも使用可とされる']::text[],
    null,
    date '2026-08-22',
    'Chemist Warehouse / Bepanthen公式サイト',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'skin_sunburn'),
    'Crystasoothe Burn Gel',
    '日焼け・軽度のやけどを冷却・保護するアロエ配合ジェル',
    'Aloe vera, Carbomer 980NF',
    ARRAY['年齢制限の記載なし']::text[],
    null,
    date '2026-08-22',
    'Chemist Warehouse商品ページ',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'cold_combined'),
    'Codral PE Day & Night Tablets 48 Pack',
    '頭痛・発熱・喉の痛み・鼻づまりや鼻水など、風邪の複数症状を昼夜に分けて和らげる',
    'Day: Paracetamol 500mg, Phenylephrine hydrochloride 5mg / Night: Paracetamol 500mg, Phenylephrine hydrochloride 5mg, Chlorpheniramine maleate 2mg',
    ARRAY['Dayは非眠気', 'Night剤は眠気の可能性あり', '他のパラセタモール製品と併用しない']::text[],
    null,
    date '2026-08-22',
    'https://www.chemistwarehouse.com.au/buy/85158/codral-pe-day-night-tablets-48-pack',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'cold_combined'),
    'Dimetapp Cough Cold & Flu Day & Night 48 Capsules',
    '発熱・頭痛・体の痛み・鼻づまり・乾いた咳などを昼夜に分けて和らげる総合感冒薬',
    'Day: Paracetamol 500mg, Dextromethorphan HBr 10mg, Phenylephrine HCl 5mg / Night: Paracetamol 500mg, Dextromethorphan HBr 10mg, Chlorpheniramine maleate 2mg',
    ARRAY['Night剤は眠気の可能性あり', '他のパラセタモール製品と併用しない']::text[],
    null,
    date '2026-08-22',
    'https://www.chemistwarehouse.com.au/buy/124587/dimetapp-cough-cold-flu-day-night-48-capsules',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'cold_throat'),
    'Strepsils Throat Lozenges Soothing Honey & Lemon 36 Pack',
    '喉の不快感を和らげる、抗菌成分入りの定番トローチ',
    'Dichlorobenzyl alcohol 1.2mg, Amylmetacresol 600micrograms',
    ARRAY['糖類を含む', '症状が続く場合は要相談']::text[],
    null,
    date '2026-08-22',
    'https://www.chemistwarehouse.com.au/buy/53953/strepsils-sore-throat-lozenges-antibacterial-honey-lemon-36-pack',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'cold_throat'),
    'Difflam Sore Throat Sugar Free Honey & Lemon 16 Lozenges',
    '炎症による喉の痛みや腫れを和らげる、抗炎症・抗菌タイプのトローチ',
    'Benzydamine hydrochloride 3mg, Cetylpyridinium chloride 1.33mg',
    ARRAY['抗炎症薬へのアレルギーがある方は使用不可', '過量で下痢の可能性']::text[],
    null,
    date '2026-08-22',
    'https://www.chemistwarehouse.com.au/buy/41060/difflam-sore-throat-sugar-free-honey-and-lemon-16-lozenges',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'cold_cough'),
    'Bisolvon Chesty Forte Oral Cough Liquid 200mL',
    '胸に絡む痰を薄めて出しやすくする、非眠気タイプの去痰シロップ',
    'Bromhexine hydrochloride 8mg/5mL',
    ARRAY['症状が続く場合は要相談']::text[],
    null,
    date '2026-08-22',
    'https://www.chemistwarehouse.com.au/buy/130410/bisolvon-chesty-forte-200ml',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'cold_cough'),
    'Bisolvon Dry Cough Oral Liquid 200mL',
    '痰の絡まない乾いた刺激性の咳を抑えるシロップ',
    'Dextromethorphan hydrobromide 10mg/5mL',
    ARRAY['眠気が出る可能性あり', '他の鎮咳薬や一部の抗うつ薬との併用は要相談']::text[],
    null,
    date '2026-08-22',
    'https://www.chemistwarehouse.com.au/buy/31691/bisolvon-dry-oral-liquid-200ml-cough-liquid',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'stomach'),
    'Mylanta 2Go Antacid Double Strength Tablets Lemon Mint 48 Pack',
    '胸やけ・消化不良・胃の不快感・ガスを和らげる携帯用のチュアブル制酸薬',
    'Magnesium hydroxide 400mg, Aluminium hydroxide 400mg, Simethicone 40mg',
    ARRAY['他の薬と2時間あける', '腎疾患がある方は要相談', '14日を超えて連用しない']::text[],
    null,
    date '2026-08-22',
    'https://www.chemistwarehouse.com.au/buy/59433/mylanta-2go-antacid-double-strength-tablets-lemon-mint-48-pack',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'stomach'),
    'Hydralyte Electrolyte Effervescent Orange 20 Tablets',
    '嘔吐・下痢や発汗などで失われた水分と電解質の補給を助ける発泡タブレット',
    'Glucose 1.62g, Citric acid 672mg, Sodium, Potassium (per tablet)',
    ARRAY['腎疾患または心臓・血圧の薬を使用中の方は要相談']::text[],
    null,
    date '2026-08-22',
    'https://www.chemistwarehouse.com.au/buy/61149/hydralyte-electrolyte-effervescent-orange-20-tablets',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'head_fever'),
    'Panadol Rapid Paracetamol Pain Relief 32 Caplets',
    '頭痛・筋肉痛・歯痛・風邪に伴う痛みや発熱を素早く和らげる鎮痛解熱剤',
    'Paracetamol 500mg',
    ARRAY['他のパラセタモール製品と併用しない', '用量超過は重い肝障害の危険']::text[],
    null,
    date '2026-08-22',
    'https://www.chemistwarehouse.com.au/buy/145676/panadol-rapid-32-caplets',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'head_fever'),
    'Nurofen Zavance Fast Pain Relief Tablets 24 Pack',
    '頭痛・筋肉痛・歯痛などの痛みや炎症、発熱を和らげる速効タイプの鎮痛剤',
    'Ibuprofen sodium dihydrate 256mg (equivalent to Ibuprofen 200mg)',
    ARRAY['胃潰瘍・腎臓・心臓の問題がある方は使用不可', 'NSAID']::text[],
    null,
    date '2026-08-22',
    'https://www.chemistwarehouse.com.au/buy/75994/nurofen-zavance-fast-pain-relief-tablets-200mg-ibuprofen-24-pack',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'allergy'),
    'Zyrtec 10mg 10 Tablets',
    'くしゃみ・鼻水・鼻のかゆみ・目のかゆみや涙目を最大24時間和らげる抗ヒスタミン薬',
    'Cetirizine hydrochloride 10mg',
    ARRAY['眠気が出る可能性あり', '肝臓・腎臓疾患がある方は要相談']::text[],
    null,
    date '2026-08-22',
    'https://www.chemistwarehouse.com.au/buy/151105/zyrtec-10mg-10-tablets',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'allergy'),
    'Demazin Allergy & Hayfever 10 Tablets',
    'くしゃみ・鼻水・目のかゆみや涙目を24時間和らげる非眠気タイプの抗ヒスタミン薬',
    'Loratadine 10mg',
    ARRAY['1日1回', '症状が5日以上続く場合は要相談']::text[],
    null,
    date '2026-08-22',
    'https://www.chemistwarehouse.com.au/buy/138343/demazin-allergy-hayfever-10-tablets',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'skin_insect_bite'),
    'Stingose Spray Pack 100mL',
    '虫刺されや植物による刺激の痛み・かゆみ・腫れを和らげる応急処置スプレー',
    'Aluminium sulfate 200mg/mL（20% w/v）',
    ARRAY['外用のみ', '目に入れない', '症状が続く場合は要相談']::text[],
    null,
    date '2026-08-22',
    'https://www.chemistwarehouse.com.au/buy/31254/stingose-spray-pack-100ml',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'skin_scratch'),
    'Savlon Antiseptic Cream for Cuts Grazes Bites 50g',
    '切り傷・擦り傷・水ぶくれ・虫刺されなどに使える抗菌クリーム',
    'Chlorhexidine hydrochloride 1mg/g, Cetrimide 5mg/g',
    ARRAY['深い傷や頭・首の開放創には使用不可', '外用のみ']::text[],
    null,
    date '2026-08-22',
    'https://www.chemistwarehouse.com.au/buy/31228/savlon-antiseptic-cream-for-cuts-grazes-bites-50g',
    true
  ),
  (
    (select id from public.symptom_categories where slug = 'skin_sunburn'),
    'Ego Soov Antiseptic Cream 50g',
    '日焼けや軽いやけどの痛みを和らげ、感染予防を助ける抗菌クリーム',
    'Lidocaine hydrochloride 1% w/w, Cetrimide 1% w/w, Chlorhexidine gluconate 0.2% w/w',
    ARRAY['外用のみ', '目に入れない', '軽いやけどは先に冷水で冷やす', '刺激が出たら中止']::text[],
    null,
    date '2026-08-22',
    'https://www.chemistwarehouse.com.au/buy/31143-ego-soov-antiseptic-cream-50g',
    true
  );

