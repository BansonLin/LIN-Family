# 林家出遊手冊(lin-family-outing)

## 一句話定位
林家週末親子出遊的「情境決策引擎」:依當天天氣與孩子當前年齡,10 秒內輸出 2–3 個最適景點與就近雨天備案。這不是景點清單,是決策工具。

## 最高原則(必須遵守,優先於一切)
1. **禁止捏造**:每個評分與設施資訊必須附 evidence(來源連結+日期);查不到就標「待確認」,不得推測給分。
2. **禁止違規抓取**:不得撰寫繞過網站防護的爬蟲、不得批量抓取 Google Maps 評論(違反平台條款)。資料取得僅限:WebSearch / WebFetch 閱讀公開網頁、官方網站、政府開放資料。
3. **孩子個資保護**:config/family.json 的內容不得出現在 index.html、commit message 或任何輸出文件;本 repo 必須維持 private。
4. **只做被要求的事**:不自行新增功能、檔案、依賴或抽象層。
5. **人工審核觸發**:刪除任何 venue、修改 schema、新增依賴套件之前,必須停下來先問我。

## 使用情境
- 使用者:爸媽。週末早上用手機打開 index.html,依天氣按一顆按鈕,直接得到答案。
- 地區:zone 制(2026-07-19 使用者指示延伸全台)。主圈「宜蘭」= 車程 ≤ 40 分鐘(從 config 的 home 座標估算)、日常推薦預設;其他 zone(台北、之後逐批擴充)為出遊/旅行圈,不受 40 分鐘限制,雨天備案配對限同 zone 內 15 分鐘。
- 孩子年齡:一律由 config/family.json 的出生年月即時計算;禁止在任何資料中寫死年齡。

## 五大設計痛點(所有功能必須回應)
1. 室內怕孩子吵到別人 → 室內/咖啡類場所必須有 noise_tolerance 評分與證據。
2. 戶外要能騎滑步車、放電 → ride_ok + 場地開闊度、地面材質、動線安全說明。
3. 宜蘭多雨 → 每個戶外景點必須配對車程 15 分鐘內的 rain_backup。
4. 夏季炎熱 → shade_score 遮蔭評分;「晴熱」情境優先推薦遮蔭 ≥ 2 或有戲水/室內冷氣。
5. 孩子會長大 → age_fit 依年齡帶評分;每半年執行 /age-review 研究下一個年齡帶。

## 檔案結構(scope 鎖定,不得新增未列出的頂層項目)
```
CLAUDE.md
config/family.json      # 孩子出生年月、home 座標(由我手動填,你只讀取)
data/venues.json        # 親子景點資料庫
data/places-adult.json  # 大人模式餐飲資料庫(2026-07-19 核准新增,大人 schema 見下)
.claude/commands/       # weekend / research / refresh / age-review / log
index.html              # 單檔決策頁(手機優先;親子/大人雙模式切換)
docs/decisions.md       # 重大設計決策紀錄
```

## data/venues.json schema(單筆欄位)
| 欄位 | 說明 |
|---|---|
| id / name / type | type ∈ 戶外公園、親子咖啡、親子餐廳、室內樂園、觀光工廠、其他 |
| location | 地址、座標、drive_min(從 home 出發車程分鐘) |
| weather_fit | {晴熱, 晴涼, 小雨, 大雨} 各 0–3 分 |
| shade_score | 0–3,附依據(樹蔭/遮棚/全室內) |
| ride_ok | true/false + 一句說明(滑步車/腳踏車/推車動線) |
| noise_tolerance | 0–3(0=安靜空間不宜帶幼兒;3=親子專門場所) |
| age_fit | {"0-2","2-4","4-6","6-9"} 各 0–3 分 + 一句具體理由 |
| facilities | 尿布台、兒童椅、哺乳室、停車、廁所 |
| rain_backup_id | 就近雨天備案的 venue id(戶外類必填;找不到標「無備案」並降權) |
| evidence | [{url, source_type: blog/官網/news/實測, date, 摘要}],≥ 2 筆獨立來源才可入庫 |
| family_log | [{date, 評分 1–5, 心得}] 林家實測,權重高於一切網路來源 |
| last_verified | 日期;超過 6 個月 → 推薦時必須顯示「待重驗」警語 |
| status | active / closed / 待確認 |
| zone | v1.2(2026-07-19 核准):地區標記,宜蘭 / 台北 / …;既有未標者視為宜蘭 |
| games | v1.1(2026-07-19 核准,選填):適合帶去玩的遊戲名稱陣列,名稱須對應時光手冊遊戲庫 |

## data/places-adult.json schema(大人模式・2026-07-19 核准新增)
定位:出差臨時想找咖啡/晚餐(小孩不在身邊)、兩人約會、朋友聚餐、喝一杯宵夜的決策工具。孩子個資與親子欄位一律不出現在此檔。
| 欄位 | 說明 |
|---|---|
| id / name / type | type ∈ 咖啡廳、餐廳、餐酒館、居酒屋、火鍋、燒肉、甜點店、早午餐、其他 |
| zone / district | zone 目前皆台北;district 為行政區(信義/大安/中山/內湖/松山…),大人模式以行政區定位,不需 drive_min |
| location | {address, lat, lng, coord_basis};座標可為 null(以行政區定位) |
| price_band | {level 1–4, per_person 文字, basis};1=平價<300、2=小資300–600、3=中高600–1200、4=高級>1200 |
| meal_type | 陣列:晚餐/咖啡/甜點/酒/宵夜/早午餐(供篩選) |
| scene_fit | {solo, date, group, late} 各 {score 0–3, reason 具體理由} 對應四情境卡 |
| vibe | 短標籤陣列(安靜可久坐/有插座/氣氛佳…) |
| open_late / reservation / work_ok | {value, basis/note};打烊時間、訂位政策、可否久坐辦公(插座) |
| signature | 招牌一句(菜/飲/氛圍),選填 |
| evidence | [{url, source_type, date, 摘要}],≥ 2 筆獨立網域來源才可入庫 |
| last_verified / status | 同親子庫規則 |

**大人 scene_fit 評分基準**:solo(出差一人)3=有吧檯/單人友善且可久坐辦公;date(兩人約會)3=氣氛/隱私/燈光俱佳;group(朋友聚餐)3=多人/包廂/可分食且好聊;late(喝一杯宵夜)3=營業至深夜且有酒或宵夜。

## 評分基準(所有研究必須用同一把尺)
- **noise_tolerance**:3=官方明示親子友善或設遊戲區;2=評論多見家庭客;1=一般客群混合;0=官網或評論強調安靜、成人向。
- **shade_score**:3=全室內或全遮棚;2=大面積樹蔭/半棚;1=零星遮蔭;0=無遮蔽。
- **age_fit**:依設施與安全性判斷,理由必須具體(例:有 0–2 專屬軟墊區;滑步車坡道適合 2–4)。

## 研究 SOP(/research 與 /age-review 共用)
1. WebSearch:「{景點} 親子」「{景點} 小孩 心得」「宜蘭 遛小孩 {類型} {目前年份}」;優先閱讀台灣親子部落格與官方網站。
2. 每筆 venue 至少 2 個獨立來源;Google Maps 僅引用官方頁面公開資訊,禁止批量抓取評論。
3. 將關鍵情報摘錄進 evidence:吵不吵、遮蔭、推車、雨天、停車、適齡線索。
4. 為每個戶外 venue 配對 rain_backup(車程 15 分鐘內)。
5. 完成後輸出「待實測確認清單」。

## index.html 規格
- 單一檔案、資料內嵌(手機可離線)、手機優先版面。
- 首頁三鍵:☀️ 晴熱 / 🌧 下雨 / 🍃 舒服。按下後依 weather_fit × age_fit × 資料新鮮度排序,輸出 2–3 張推薦卡。
- 推薦卡內容:車程、遮蔭、聲量容忍、適齡理由一句、last_verified、林家上次評價、雨天備案(戶外卡必附)。
- 次要篩選:免費優先 / 要有餐 / 要有咖啡。
- 禁止:登入、後端、資料庫、任何非必要框架。

## 週期指令(.claude/commands/)
- **/weekend**:WebSearch 中央氣象署宜蘭週末預報 → 讀 config 計算孩子年齡 → 輸出週六/週日各 2–3 個推薦+備案+一句理由。
- **/research {景點名}**:依研究 SOP 新增或更新單一 venue。
- **/refresh**:列出 last_verified 超過 6 個月的 venue,逐一重驗(歇業、改裝、價格)。
- **/age-review**:每半年執行。計算每個孩子未來 6 個月將進入的年齡帶 → 研究新增 5–10 個該年齡帶高分景點 → 將全年齡帶 age_fit ≤ 1 的景點標記「畢業」。
- **/log {景點} {1–5} {心得}**:寫入 family_log 並更新 last_verified。

## 停止條件(每次任務)
- 完成指令定義的產出即停止,輸出:✅ 完成項目、⚠️ 待確認清單、下一步建議一行。
- 單次 /research 或 /age-review 最多處理 10 個 venue,超過先停下回報。
