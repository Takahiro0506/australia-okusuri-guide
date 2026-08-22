-- Supabase の SQL Editor で実行してください。
-- 「薬剤師に相談する」機能(/consult)で使う英文カードの部品テーブルです。
--
-- clause_type の4種類:
--   symptom  … Step1(症状・複数選択)。applies_to_category に親カテゴリの
--              slug(cold/stomach/head_fever/allergy/skin)が入る
--   duration … Step2(いつから・単一選択)。全カテゴリ共通なので
--              applies_to_category は null
--   context  … Step3(状況・希望・複数選択)。全カテゴリ共通なので
--              applies_to_category は null
--   fixed    … 選択式ステップには一切表示しない特殊行。カード生成時に
--              選択状態と無関係に無条件で末尾へ追加する
--              (例: "Could you recommend something suitable?")。
--              他の3種類とアプリ側の扱いが異なる点に注意。
--
-- 実際のシードデータ(症状・期間・状況の選択肢および fixed 文)は
-- 別途 CSV から投入します。このファイルには DDL と投入例1行のみを含みます。

drop table if exists public.phrase_clauses cascade;

create table public.phrase_clauses (
  id uuid primary key default gen_random_uuid(),
  clause_type text not null check (
    clause_type in ('symptom', 'duration', 'context', 'fixed')
  ),
  -- 親カテゴリの slug のみを許可(子カテゴリでは分けない)。
  -- null は全カテゴリ共通(duration / context / fixed で使用)。
  applies_to_category text check (
    applies_to_category is null
    or applies_to_category in ('cold', 'stomach', 'head_fever', 'allergy', 'skin')
  ),
  label_ja text not null,
  -- 店員さんに見せる英文カードに直接載る文なので、日本語の混入を
  -- 機械的に弾く(過去に brand_name_en / active_ingredient で
  -- 同種の混入バグが発生しているため)。印字可能ASCII(0x20-0x7E)のみ許可し、
  -- 改行・タブなど制御文字は通さない。
  text_en text not null check (text_en ~ '^[\x20-\x7E]+$'),
  sort_order int not null default 0,
  is_active boolean not null default true,
  last_reviewed_date date,
  created_at timestamptz default now()
);

comment on table public.phrase_clauses is
  'is_active を切り替える際は last_reviewed_date も必ず同時に更新する。';

create index idx_phrase_clauses_type_category
  on public.phrase_clauses(clause_type, applies_to_category);

alter table public.phrase_clauses enable row level security;

-- is_active = false の行は公開側から見えないようにする
-- (将来LINEログインでauthenticatedユーザーが増えても読めるよう、
-- products / symptom_categories と同様に anon + authenticated 両方を許可)
create policy "active phrase clauses are readable"
  on public.phrase_clauses
  for select
  to anon, authenticated
  using (is_active = true);

-- 投入例(1行)。実際のシードは別途 CSV から生成します。
insert into public.phrase_clauses
  (clause_type, applies_to_category, label_ja, text_en, sort_order, is_active, last_reviewed_date)
values
  ('symptom', 'cold', '喉が痛い', 'I have a sore throat.', 1, true, current_date);
