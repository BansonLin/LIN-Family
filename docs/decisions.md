# 重大設計決策紀錄

## 2026-07-19|v3 需求單執行(P0-0 ~ P2-7 批次一)
- **P0-0 隱私止血**:config/family.json 刪除住家地址字串(runtime 未使用)、出生日期降精度為 YYYY-MM、座標推定 note 移除路巷/村名;index.html 的 FAMILY 內嵌僅剩暱稱+出生年月。repo 轉 private 為使用者端動作(待執行)。
- **P0-1 情境卡**:6 張(午睡後快閃/雨天放電/大人也要休息/祖孫同行/整日遠征/吃飯順便玩),一鍵=預組合篩選+排序權重,全部由現有欄位組裝;「整日遠征」的「鄰近有食」暫以 meal/coffee 旗標近似(無對應欄位)。理由句引擎:首行={天氣依據}·車程·遮蔭·最強年齡帶理由,次行「注意」=最弱年齡帶(同分時省略)。空結果顯示逐條件試算的放寬建議。
- **P0-2 陪伴心法分頁**:依需求單最終稿全文上線(三原則/前中後SOP/等待救援包10招/話術表/特殊狀態)。
- **P1-3 schema v1.1**:使用者於 v3 需求單核准新增選填欄 games(名稱對應時光手冊遊戲庫);已掛 11 筆;卡片「帶什麼玩」連 time.html,time.html「戶外共同放電」加「去哪?」回連。
- **P1-4 PWA**:manifest.json+icon(建置產出)+Service Worker(stale-while-revalidate,快取兩頁與資產);離線可開。
- **P1-5 產線自動化**:build.js+template.html 入 repo,wrangler build command=`node build.js`,一鍵由 data/venues.json+config/family.json 產出 dist/(同步 repo 根 index.html);費用/免費/餐飲旗標為頁面層映射(結構化仍待 schema v2)。
- **P2-6 QA**:老司G 停車 false 與 evidence「好停車」矛盾→修正為 true 附註;武淵雨備維持地理配對待實測;3 筆 drive 待確認留待 /log 回填。
- **P2-7 批次一(10 筆)**:免費戲水×3(冬山河親水/武荖坑/蘇澳冷泉)、農場×3(宜農/斑比/張美阿嬤)、市區免費×2(幾米廣場/羅東文化工場)、大型半日×2(傳藝中心/梅花湖)。流程=研究代理→對抗查證代理(逐筆重查來源真實性/獨立性/2025-2026 營運),全數通過;重要修正:張美阿嬤之樹懶屬分家後另營之樹懶餐廳(已自理由移除)、幸福轉運站室內館 2021 歇業(幾米適齡分數下修)、蘇澳冷泉 2026-04 風災後全面復園、武荖坑每年 5 月中-6 月底例行休園。5 筆查無公開座標(誠實 null),drive 待確認。
- **分類呈現**:新增「農場動物」分頁(宜農/斑比/張美),室內雨天改藍色系;venue type 欄位不變,分組為頁面層邏輯。
- 候選清單剩餘(批次二待指示):中興文創、羅東李科永圖書館、宜蘭美術館、望龍埤、台北線 3-5 筆。

## 2026-07-19|index.html V2:改採時光手冊操作邏輯(使用者反饋 V1.1 不好用)
- 視覺與互動全面對齊時光手冊:紙感底色、LXGW WenKai 標題(Google Fonts,離線退回系統字體)、孩子年齡卡、「今天去哪裡?」篩選列(天氣/條件/車程三組 chip)、置頂 sticky 分頁導覽。
- 分頁:戶外公園/咖啡餐廳/室內雨天/雨天攻略(備案配對表+大雨 3 分清單)/資料來源(每景點 evidence 全文連結+待實測清單)。
- 新增資料上頁面:完整費用敘述、evidence 出處(URL/類型/日期/摘要)、車程篩選(15/30 分內)。排序公式不變。
- 三情境排序與全部互動經 headless Chromium 實測通過。

## 2026-07-19|部署:Cloudflare Workers 接 GitHub 自動部署
- 使用者選擇 Workers「Continue with GitHub」流程,repo 新增 wrangler.jsonc(檔案結構 scope 外的部署設定檔):assets 目錄 dist/,build 指令僅複製 index.html 與 time.html——確保 config/、data/ 不上公開網址。
- 之後每次 push 到生產分支即自動重新部署。

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
