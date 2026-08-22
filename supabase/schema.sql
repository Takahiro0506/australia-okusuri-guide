-- Supabase の SQL Editor で実行してください。
-- symptom_categories / products は既存が空のため、CLAUDE.md の設計に合わせて作り直します。

drop table if exists public.products cascade;
drop table if exists public.symptom_categories cascade;

create table public.symptom_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (
    slug in ('throat', 'stomach', 'head_fever', 'allergy', 'skin')
  ),
  name_ja text not null,
  sort_order int not null,
  created_at timestamptz not null default now()
);

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

insert into public.symptom_categories (slug, name_ja, sort_order) values
  ('throat', '喉の痛み・咳・鼻水', 1),
  ('stomach', 'お腹の不調', 2),
  ('head_fever', '頭痛・発熱', 3),
  ('allergy', 'アレルギー・花粉症', 4),
  ('skin', '擦り傷・虫刺され・日焼け', 5);
