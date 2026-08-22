-- Supabase の SQL Editor で実行してください。
-- symptom_categories に親子構造(parent_slug)を追加し、products は変更なし。

drop table if exists public.products cascade;
drop table if exists public.symptom_categories cascade;

create table public.symptom_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (
    slug in (
      'throat', 'throat_pain', 'throat_cough', 'throat_runny_nose',
      'stomach', 'stomach_general',
      'head_fever', 'head_fever_headache', 'head_fever_fever',
      'allergy', 'allergy_general', 'allergy_hayfever',
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
  ('throat', null, '喉の痛み・咳・鼻水', 1),
  ('stomach', null, 'お腹の不調', 2),
  ('head_fever', null, '頭痛・発熱', 3),
  ('allergy', null, 'アレルギー・花粉症', 4),
  ('skin', null, '擦り傷・虫刺され・日焼け', 5);

-- 子カテゴリ(商品はこの粒度に紐付ける)
insert into public.symptom_categories (slug, parent_slug, name_ja, sort_order) values
  ('throat_pain', 'throat', '喉の痛み', 1),
  ('throat_cough', 'throat', '咳', 2),
  ('throat_runny_nose', 'throat', '鼻水', 3),

  ('stomach_general', 'stomach', 'お腹の不調', 1),

  ('head_fever_headache', 'head_fever', '頭痛', 1),
  ('head_fever_fever', 'head_fever', '発熱', 2),

  ('allergy_general', 'allergy', 'アレルギー', 1),
  ('allergy_hayfever', 'allergy', '花粉症', 2),

  ('skin_scratch', 'skin', '擦り傷', 1),
  ('skin_insect_bite', 'skin', '虫刺され', 2),
  ('skin_sunburn', 'skin', '日焼け', 3);
