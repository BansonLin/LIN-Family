---
description: 寫入林家實測回饋並更新 last_verified
argument-hint: "{景點} {1–5} {心得}"
---

解析參數「$ARGUMENTS」為:景點名、評分(1–5)、心得一句。

1. 在 data/venues.json 找到該景點(找不到 → 停下回報,不得自行新增)。
2. 於 family_log 追加 {date: 今日, 評分, 心得};林家實測權重高於一切網路來源。
3. 更新該 venue 的 last_verified 為今日;心得若提及設施/噪音/遮蔭變化,同步修正對應欄位並在 evidence 加註 source_type: 實測。

完成即停止,輸出:✅ 已寫入的 venue 與內容、下一步建議一行。
