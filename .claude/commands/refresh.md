---
description: 重驗 last_verified 超過 6 個月的 venue(歇業/改裝/價格)
---

執行季度重驗(遵守 CLAUDE.md 最高原則):

1. 讀取 data/venues.json,列出 last_verified 距今超過 6 個月的所有 venue。
2. 逐一以 WebSearch / 官網重驗:是否歇業、改裝、價格或設施變動。
3. 有變動 → 更新對應欄位與 evidence,last_verified 填今日;查不到近況 → status 改「待確認」。
4. 疑似歇業者僅將 status 標為 closed;**刪除任何 venue 前必須停下來先問我**(最高原則 5)。

完成即停止,輸出:✅ 重驗結果清單、⚠️ 待確認清單、下一步建議一行。
