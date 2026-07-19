---
description: 依研究 SOP 新增或更新單一 venue
argument-hint: "{景點名}"
---

對「$ARGUMENTS」執行 CLAUDE.md 研究 SOP(遵守最高原則:禁止捏造、禁止違規抓取):

1. WebSearch:「{景點} 親子」「{景點} 小孩 心得」「宜蘭 遛小孩 {類型} {目前年份}」;優先閱讀台灣親子部落格與官方網站。Google Maps 僅引用官方頁面公開資訊,禁止批量抓取評論。
2. 至少 2 個獨立來源才可入庫;查不到的欄位一律標「待確認」,不得推測給分。
3. 依 schema v1 填寫完整欄位(評分基準見 CLAUDE.md),關鍵情報摘錄進 evidence:吵不吵、遮蔭、推車、雨天、停車、適齡線索。
4. 戶外類必須配對車程 15 分鐘內的 rain_backup_id;找不到標「無備案」並降權。
5. 寫入 data/venues.json 並填 last_verified 為今日。

單次最多處理 10 個 venue,超過先停下回報。完成即停止,輸出:✅ 入庫清單、⚠️ 待實測確認清單、下一步建議一行。
