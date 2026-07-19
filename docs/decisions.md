# 重大設計決策紀錄

## 2026-07-19|schema v1(data/venues.json)
- 單筆欄位依 CLAUDE.md「data/venues.json schema」定義:id / name / type / location / weather_fit / shade_score / ride_ok / noise_tolerance / age_fit / facilities / rain_backup_id / evidence / family_log / last_verified / status。
- 入庫門檻:evidence ≥ 2 筆獨立來源;查不到的欄位標「待確認」,禁止推測給分。
- family_log(林家實測)權重高於一切網路來源;last_verified 超過 6 個月推薦時必須顯示「待重驗」。
- 修改 schema 或刪除 venue 前必須先經人工審核(CLAUDE.md 最高原則 5)。

## 2026-07-19|config/family.json 實際資料入庫
- repo 目前為 public,與 CLAUDE.md 最高原則 3(repo 必須維持 private)不符;已向使用者揭露風險,使用者明確回覆「直接提交上去沒關係」,故實際家庭資料直接入庫。
- 若日後將 repo 轉為 private,請注意歷史 commit 中的內容在公開期間已可能被外部快取。
- home 的 lat/lng 依欄位 note 約定,留待 Phase 2 依地址查證填入。
