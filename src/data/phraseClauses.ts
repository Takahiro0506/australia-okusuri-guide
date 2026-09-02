import type { PhraseClause } from "@/lib/types";

// supabase/phrase_clauses_seed.csv を静的化したもの。
// このCSV自体は buildConsultText.seed.test.ts が実データ検証のため直接読み込んでいるので、
// 内容を変更する場合は両方を同時に更新すること。
export const phraseClauses: PhraseClause[] = [
  // symptom / cold
  { id: "symptom-cold-10", clause_type: "symptom", applies_to_category: "cold", label_ja: "喉が痛い", text_en: "I have a sore throat.", sort_order: 10, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-cold-20", clause_type: "symptom", applies_to_category: "cold", label_ja: "唾を飲み込むと喉が痛い", text_en: "It hurts when I swallow.", sort_order: 20, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-cold-30", clause_type: "symptom", applies_to_category: "cold", label_ja: "乾いた咳が出る", text_en: "I have a dry cough.", sort_order: 30, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-cold-40", clause_type: "symptom", applies_to_category: "cold", label_ja: "痰がからむ咳が出る", text_en: "I have a cough with phlegm.", sort_order: 40, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-cold-50", clause_type: "symptom", applies_to_category: "cold", label_ja: "夜になると咳がひどくなる", text_en: "My cough gets worse at night.", sort_order: 50, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-cold-60", clause_type: "symptom", applies_to_category: "cold", label_ja: "鼻水が出る", text_en: "I have a runny nose.", sort_order: 60, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-cold-70", clause_type: "symptom", applies_to_category: "cold", label_ja: "鼻がつまっている", text_en: "I have a blocked nose.", sort_order: 70, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-cold-80", clause_type: "symptom", applies_to_category: "cold", label_ja: "声がかれている", text_en: "My voice is hoarse.", sort_order: 80, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-cold-90", clause_type: "symptom", applies_to_category: "cold", label_ja: "熱はない", text_en: "I do not have a fever.", sort_order: 90, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },

  // symptom / stomach
  { id: "symptom-stomach-10", clause_type: "symptom", applies_to_category: "stomach", label_ja: "下痢をしている", text_en: "I have diarrhoea.", sort_order: 10, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-stomach-20", clause_type: "symptom", applies_to_category: "stomach", label_ja: "吐き気がある", text_en: "I feel nauseous.", sort_order: 20, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-stomach-30", clause_type: "symptom", applies_to_category: "stomach", label_ja: "吐いてしまった", text_en: "I have been vomiting.", sort_order: 30, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-stomach-40", clause_type: "symptom", applies_to_category: "stomach", label_ja: "胃がむかむかする", text_en: "I have an upset stomach.", sort_order: 40, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-stomach-50", clause_type: "symptom", applies_to_category: "stomach", label_ja: "胸やけがする", text_en: "I have heartburn.", sort_order: 50, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-stomach-60", clause_type: "symptom", applies_to_category: "stomach", label_ja: "お腹が張っている", text_en: "I feel bloated.", sort_order: 60, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-stomach-70", clause_type: "symptom", applies_to_category: "stomach", label_ja: "お腹がしぼられるように痛い", text_en: "I have stomach cramps.", sort_order: 70, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-stomach-80", clause_type: "symptom", applies_to_category: "stomach", label_ja: "便秘している", text_en: "I am constipated.", sort_order: 80, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-stomach-90", clause_type: "symptom", applies_to_category: "stomach", label_ja: "食欲がない", text_en: "I have no appetite.", sort_order: 90, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },

  // symptom / head_fever
  { id: "symptom-head_fever-10", clause_type: "symptom", applies_to_category: "head_fever", label_ja: "頭が痛い", text_en: "I have a headache.", sort_order: 10, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-head_fever-20", clause_type: "symptom", applies_to_category: "head_fever", label_ja: "ずきずきする頭痛がする", text_en: "I have a throbbing headache.", sort_order: 20, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-head_fever-30", clause_type: "symptom", applies_to_category: "head_fever", label_ja: "頭が重い感じがする", text_en: "My head feels heavy.", sort_order: 30, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-head_fever-40", clause_type: "symptom", applies_to_category: "head_fever", label_ja: "熱がある", text_en: "I have a fever.", sort_order: 40, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-head_fever-50", clause_type: "symptom", applies_to_category: "head_fever", label_ja: "寒気がする", text_en: "I have chills.", sort_order: 50, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-head_fever-60", clause_type: "symptom", applies_to_category: "head_fever", label_ja: "体の節々が痛い", text_en: "My body aches.", sort_order: 60, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-head_fever-70", clause_type: "symptom", applies_to_category: "head_fever", label_ja: "体がだるい", text_en: "I feel tired and run down.", sort_order: 70, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },

  // symptom / allergy
  { id: "symptom-allergy-10", clause_type: "symptom", applies_to_category: "allergy", label_ja: "くしゃみが止まらない", text_en: "I cannot stop sneezing.", sort_order: 10, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-allergy-20", clause_type: "symptom", applies_to_category: "allergy", label_ja: "鼻水が止まらない", text_en: "I have a constant runny nose.", sort_order: 20, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-allergy-30", clause_type: "symptom", applies_to_category: "allergy", label_ja: "目がかゆい", text_en: "My eyes are itchy.", sort_order: 30, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-allergy-40", clause_type: "symptom", applies_to_category: "allergy", label_ja: "目が赤くなっている", text_en: "My eyes are red.", sort_order: 40, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-allergy-50", clause_type: "symptom", applies_to_category: "allergy", label_ja: "肌がかゆい", text_en: "My skin is itchy.", sort_order: 50, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-allergy-60", clause_type: "symptom", applies_to_category: "allergy", label_ja: "じんましんが出ている", text_en: "I have hives.", sort_order: 60, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-allergy-70", clause_type: "symptom", applies_to_category: "allergy", label_ja: "花粉症だと思う", text_en: "I think it is hay fever.", sort_order: 70, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },

  // symptom / skin
  { id: "symptom-skin-10", clause_type: "symptom", applies_to_category: "skin", label_ja: "擦り傷がある", text_en: "I have a graze.", sort_order: 10, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-skin-20", clause_type: "symptom", applies_to_category: "skin", label_ja: "切り傷がある", text_en: "I have a cut.", sort_order: 20, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-skin-30", clause_type: "symptom", applies_to_category: "skin", label_ja: "虫に刺された", text_en: "I have an insect bite.", sort_order: 30, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-skin-40", clause_type: "symptom", applies_to_category: "skin", label_ja: "刺されたところが腫れている", text_en: "The bite is swollen.", sort_order: 40, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-skin-50", clause_type: "symptom", applies_to_category: "skin", label_ja: "刺されたところがかゆい", text_en: "The bite is itchy.", sort_order: 50, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-skin-60", clause_type: "symptom", applies_to_category: "skin", label_ja: "日焼けで肌が赤くなっている", text_en: "I have sunburn.", sort_order: 60, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-skin-70", clause_type: "symptom", applies_to_category: "skin", label_ja: "日焼けでひりひりする", text_en: "My sunburn is stinging.", sort_order: 70, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "symptom-skin-80", clause_type: "symptom", applies_to_category: "skin", label_ja: "傷口が膿んでいるように見える", text_en: "The wound looks infected.", sort_order: 80, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },

  // duration (全カテゴリ共通)
  { id: "duration-10", clause_type: "duration", applies_to_category: null, label_ja: "今日から", text_en: "It started today.", sort_order: 10, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "duration-20", clause_type: "duration", applies_to_category: null, label_ja: "昨日から", text_en: "It started yesterday.", sort_order: 20, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "duration-30", clause_type: "duration", applies_to_category: null, label_ja: "2〜3日前から", text_en: "It started 2-3 days ago.", sort_order: 30, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "duration-40", clause_type: "duration", applies_to_category: null, label_ja: "1週間ほど前から", text_en: "It started about a week ago.", sort_order: 40, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "duration-50", clause_type: "duration", applies_to_category: null, label_ja: "2週間以上前から", text_en: "It started more than two weeks ago.", sort_order: 50, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },

  // context (全カテゴリ共通)
  { id: "context-10", clause_type: "context", applies_to_category: null, label_ja: "高血圧の薬を飲んでいる", text_en: "I am taking medication for high blood pressure.", sort_order: 10, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "context-20", clause_type: "context", applies_to_category: null, label_ja: "ほかに薬を飲んでいる", text_en: "I am taking other medication.", sort_order: 20, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "context-30", clause_type: "context", applies_to_category: null, label_ja: "薬は何も飲んでいない", text_en: "I am not taking any other medication.", sort_order: 30, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "context-40", clause_type: "context", applies_to_category: null, label_ja: "妊娠中です", text_en: "I am pregnant.", sort_order: 40, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "context-50", clause_type: "context", applies_to_category: null, label_ja: "授乳中です", text_en: "I am breastfeeding.", sort_order: 50, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "context-60", clause_type: "context", applies_to_category: null, label_ja: "薬のアレルギーがある", text_en: "I have an allergy to some medicines.", sort_order: 60, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "context-70", clause_type: "context", applies_to_category: null, label_ja: "喘息がある", text_en: "I have asthma.", sort_order: 70, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "context-80", clause_type: "context", applies_to_category: null, label_ja: "眠くならない薬がいい", text_en: "I would prefer a non-drowsy medicine.", sort_order: 80, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "context-90", clause_type: "context", applies_to_category: null, label_ja: "錠剤を飲むのが苦手", text_en: "I find tablets difficult to swallow.", sort_order: 90, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "context-100", clause_type: "context", applies_to_category: null, label_ja: "液体・シロップタイプがいい", text_en: "I would prefer a liquid or syrup.", sort_order: 100, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "context-110", clause_type: "context", applies_to_category: null, label_ja: "自分が使います", text_en: "This is for myself.", sort_order: 110, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "context-120", clause_type: "context", applies_to_category: null, label_ja: "旅行中で数日分ほしい", text_en: "I am travelling and only need enough for a few days.", sort_order: 120, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },

  // fixed (選択式ステップには表示せず、常に末尾に追加)
  { id: "fixed-10", clause_type: "fixed", applies_to_category: null, label_ja: "(固定・締めの依頼)", text_en: "Could you recommend something suitable?", sort_order: 10, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
  { id: "fixed-20", clause_type: "fixed", applies_to_category: null, label_ja: "(固定・双方向化)", text_en: "I'm not confident in English. Could you please write down your answer, or show me the product?", sort_order: 20, is_active: true, last_reviewed_date: null, created_at: "2026-08-22T00:00:00Z" },
];
