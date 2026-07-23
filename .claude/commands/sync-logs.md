---
description: 把 App 回報的林家實測(GitHub issue 或貼上的 JSON)吃進 family_log
argument-hint: "(留空=讀 GitHub family-log issues;或直接貼上 App 複製的 JSON)"
---

把「林家實測・順手回報」的資料吃進資料庫。來源二擇一:
- 若「$ARGUMENTS」含 JSON(使用者從 App 複製貼上)→ 直接解析。
- 否則 → 用 GitHub MCP 列出 repo `BansonLin/LIN-Family` 中 label = `family-log` 的 open issues,解析每則 body 的 ```json 區塊。

每筆回報格式:`{id, kind:"kids"|"adult", name, date, rating 1–5, scores?, note, ts}`;`scores` 為選填細項星等(親子:放電/友善/舒適;大人:食物/氣氛/CP值,各 1–5)。餐食回報格式:`{id, kind:"recipe", name, date, accept:{big? 1–5, lil? 1–5}, note, ts}`。逐筆處理:

1. **定位**:kind=kids → 在 `data/venues.json` 依 id 找;kind=adult → 在 `data/places-adult.json` 依 id 找;kind=recipe → 在 `data/recipes.json` 依 id 找。**找不到就停下回報該筆,不得自行新增 venue/食譜**(禁止捏造)。
2. **去重**:若該 venue 的 family_log 已有相同 `ts` 的項目 → 跳過(冪等,重跑安全)。
3. **寫入**:於該 venue 的 family_log 追加 `{date, 評分: rating, 心得: note, ts}`;若回報含 `scores` 則一併寫入 `細項: scores`(鍵名原樣保留)。adult 若無 family_log 欄位則先建 `[]`(大人 schema 補 family_log,與親子一致)。kind=recipe → 追加 `{date, 姊姊接受度: accept.big, 弟弟接受度: accept.lil, 備註: note, ts}`(缺哪個孩子就省略該鍵)。林家實測權重高於一切網路來源。細項可作對應欄位的核對線索(如 舒適=1 且心得提到太曬 → 檢視 shade_score)。
4. **更新**:last_verified 取 max(原值, 該筆 date);kind=recipe 免(食譜庫無此欄)。
5. **連動**(比照 /log):note 若提到設施/噪音/遮蔭/歇業等變化,同步修正對應欄位,並在 evidence 加 `source_type: 實測` 一筆;若提到已歇業,status 改對應值並停下向我確認。
6. **收尾**:`node build.js` 重建 dist 驗證無誤 → commit(訊息含吃進筆數,勿含任何孩子個資)→ push。GitHub 來源者:成功吃進後將該 issue 以「已同步」留言並 close。

完成即停止,輸出:✅ 吃進的 venue 與評分、⚠️ 找不到/需確認的筆數、下一步建議一行。
