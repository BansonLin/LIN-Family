# 重大設計決策紀錄

## 2026-07-19|時光手冊併入本站(使用者指示)
- 使用者提供既有「林家親子時光手冊 v3」單檔頁面,指示「另外開一個分頁,把資料結合在裡面」:以 time.html 併入本 repo(檔案結構因此在原 scope 外新增一個頂層檔案),內容維持原樣,僅於頁首加「🚗 週末出遊」入口;index.html 頁首對應加「⏳ 時光手冊」入口。
- 兩頁互為入口、風格各自獨立(符合手冊系列「時光手冊加一顆週末出遊入口按鈕」的原始構想,只是改為同站部署)。
- time.html 為使用者自製內容,內含孩子出生年月字樣(與 index.html 內嵌決策一致);部署時 dist 需同時複製 index.html 與 time.html。

## 2026-07-19|Phase 3:index.html V1 設計決策
- **排序公式具體化**:score = weather_fit(情境)× age_fit(所有孩子當前年齡帶之均值)× 新鮮度(last_verified ≤ 6 個月 = 1,超過 = 0.7 並顯示「待重驗」)。情境對映:「下雨」=(小雨+大雨)/2;「舒服」= 晴涼;「晴熱」先依「遮蔭 ≥ 2(含全室內)」分組再比分數(痛點 4);同分以車程近者優先。評分「待確認」以 0.5 計。
- **家庭資料內嵌(2026-07-19 使用者明確指示,覆寫原則 3 對 index.html 的限制)**:V1 最初以 localStorage 首次設定避免內嵌;使用者隨後指示「出生年月以及地址直接內嵌」,改為 index.html 建置時直接讀取 config/family.json 內嵌(單一資料來源),移除設定畫面。注意:部署後的公開網址將包含地址與出生年月,建議以 Cloudflare Access 設白名單保護。
- **頁面層旗標 free/meal/coffee**:「免費優先/要有餐/要有咖啡」篩選所需,依 Phase 2 研究之費用/餐飲情報推導後內嵌於頁面;schema v1 尚無 fee 欄位,結構化仍待 v2 核准。
- **資料清理**:移除 age_fit 理由中 12 處寫死年齡與暱稱的字句(違反「禁止寫死年齡」與原則 3),改為年齡帶通用表述。
- **產生方式**:index.html 由 data/venues.json 產生(內嵌決策所需精簡欄位,不含 evidence);venues.json 更新後需重新產生 index.html(已知限制)。
- **V1.1(2026-07-19,應使用者要求豐富介面)**:卡片增加費用短摘要(頁面層濃縮,結構化 fee 欄位仍待 schema v2)、設施列(尿布台/兒童椅/哺乳室/停車/廁所 ✓✗?—)、滑步車標示、兩個孩子各自年齡帶分數、Google Maps 導航連結、「詳細」展開(四情境天氣分、全年齡帶理由、遮蔭/聲量依據、地址);新增「📚 全部景點」依類別瀏覽模式與類別色彩。互動以 headless Chromium 實測通過。

## 2026-07-19|schema v1(data/venues.json)
- 單筆欄位依 CLAUDE.md「data/venues.json schema」定義:id / name / type / location / weather_fit / shade_score / ride_ok / noise_tolerance / age_fit / facilities / rain_backup_id / evidence / family_log / last_verified / status。
- 入庫門檻:evidence ≥ 2 筆獨立來源;查不到的欄位標「待確認」,禁止推測給分。
- family_log(林家實測)權重高於一切網路來源;last_verified 超過 6 個月推薦時必須顯示「待重驗」。
- 修改 schema 或刪除 venue 前必須先經人工審核(CLAUDE.md 最高原則 5)。

## 2026-07-19|Phase 2 種子研究:估算方法與資料表示法
- **研究工具限制**:本環境網路政策封鎖 WebFetch 與地理編碼 API,證據蒐集僅用 WebSearch(可讀取搜尋結果內容);evidence 日期查得到發文日期就記,查不到記「檢索 {日期}」。
- **home 座標**:查無門牌級公開座標,以可回溯地標(歪仔歪橋、大洲魚寮)按門牌線性內插推定,聚落級精度(±400-800m),依據記於 config note。
- **drive_min 估算法**:home 與景點座標之直線距離 ×1.35(道路係數)÷ 45km/h,四捨五入取分鐘、下限 3;景點座標查無公開數值者標「待確認」。戶外景點的 rain_backup 配對同法(≤15 分鐘);武淵公園無座標,依地理相鄰(武淵村緊鄰羅東鎮)配對木育森林。此為估算值,林家實測後以 /log 回饋修正。
- **欄位表示法(schema v1 實作細節,非 schema 變更)**:shade_score/noise_tolerance 記 {score, basis};ride_ok 記 {ok, note}(語意=「自帶滑步車/推車是否適合」,館方租借體驗記於 note);facilities 各項記 {value, note},value ∈ true/false/待確認/不適用;age_fit 各年齡帶記 {score, reason}。
- **待決事項(需人工核准,原則 5)**:schema v1 無 fee(費用)欄位,但 index.html 規格的「免費優先」篩選需要它;建議 schema v2 增列 fee。費用情報目前保存在各筆 evidence 摘要與本次研究紀錄中,未寫入結構化欄位。

## 2026-07-19|config/family.json 實際資料入庫
- repo 目前為 public,與 CLAUDE.md 最高原則 3(repo 必須維持 private)不符;已向使用者揭露風險,使用者明確回覆「直接提交上去沒關係」,故實際家庭資料直接入庫。
- 若日後將 repo 轉為 private,請注意歷史 commit 中的內容在公開期間已可能被外部快取。
- home 的 lat/lng 依欄位 note 約定,留待 Phase 2 依地址查證填入。
