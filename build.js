#!/usr/bin/env node
// 產線腳本(P1-5):node build.js 一鍵由 data/venues.json + config/family.json + template.html 產出 dist/
// dist 僅含公開頁面與 PWA 資產;config/ 與 data/ 不會被部署
const fs = require('fs');
const path = require('path');
const R = __dirname;
const DIST = path.join(R, 'dist');
const TODAY = new Date().toISOString().slice(0, 10);

const venues = JSON.parse(fs.readFileSync(path.join(R, 'data/venues.json'), 'utf8'));
const fam = JSON.parse(fs.readFileSync(path.join(R, 'config/family.json'), 'utf8'));

// 頁面層資料(fee 尚非 schema 欄位,結構化待 schema v2)
const FEE_SHORT = {
  "luodong-sports-park": "免門票・停車 30–50 元/次",
  "dongshan-river-eco-ark": "門票 30 元(未滿 6 歲/未滿 115cm 免)・停車 50 元",
  "yilan-sports-park": "免費入園",
  "longtan-lake-scenic-area": "免門票・停車 50 元/次",
  "wuyuan-water-fire-park": "全免費・24 小時開放",
  "shuilu-kids-cafe": "門票 300 元可折 200(100–120cm 半票 200)",
  "lanyang-estuary-kids-restaurant": "低消每人一餐/飲(100cm 以下免低消)",
  "gitu-cafe-manor": "低消每人一杯飲料或一份餐點・停車免費",
  "lao-si-g-tea-coffee": "低消每人 100 元・可餵魚",
  "amaze-rabbit-maze-jiaoxi-bath": "門票 350 元可全折(6 歲以下 50 元不可折)",
  "lucky-art-crayon-castle": "250 元含 4 項 DIY(可折部分消費)",
  "anyo-museum": "250 元可全折(未滿 3 歲免)",
  "wooderful-life-luodong": "免費參觀・木作 DIY 另計",
  "hsus-legend-vinegar-factory": "免門票・兩層樓溜滑梯免費",
  "lanyang-museum": "常設展 100 元(未滿 6 歲/未滿 115cm 免)",
  "dongshanriver-water-park": "平時免門票(童玩節 7/4–8/16 需門票,未滿 6 歲免)",
  "wulaokeng-scenic-area": "全票 80 元・停車 50 元(綠博期間另計)",
  "suao-cold-spring-park": "泡腳與公園免費・大眾池 120/60 元",
  "yi-nong-ranch": "150 元(5 歲以下免)含羊奶+飼料",
  "bambi-land": "200 元含飼料(0–5 歲免)",
  "grandma-zhang-mei-farm": "200 元含餵食(2–4 歲 50 元)",
  "jimmy-square": "免費・24 小時開放",
  "luodong-cultural-working-house": "免門票・停車 30 元/時",
  "ncfta-yilan": "150 元(未滿 6 歲/115cm 以下免)・縣民 100",
  "meihua-lake": "免費入園・停車約 100 元/次",
  "chung-hsing-cultural-park": "免費入園・停車 30 元/時",
  "luodong-likoyung-library": "免費入館(休館日多,出發前確認)",
  "yilan-art-museum": "50 元(未滿 6 歲/縣民免)",
  "wanglongpi": "免門票・停車免費",
  "taipei-zoo": "100 元(未滿 6 歲免)・市民 60",
  "taipei-childrens-amusement-park": "入園 30 元(6 歲以下免)・設施 20–30 元/項",
  "ntsec": "常設展 120 元(未滿 6 歲或 115cm 以下免)",
  "taipei-astronomical-museum": "展示館 40 元(學齡前免)",
  "daan-forest-park": "免費・24 小時開放",
  "juzhixiang": "免門票・DIY 150 元起",
  "xihe-sandaime": "100 元可全折(120cm 以下免)",
  "yutu-pencil-school": "200 元含 DIY(3 歲以下免)・預約制",
  "jiaoxi-tangweigou": "泡腳免費・大眾湯 80 元",
  "paoma-historic-trail-park": "免費・光雕秀免費",
  "jianiao-garden": "100 元可全折(100cm 以下免)",
  "xingbao-scallion-farm": "拔蔥+蔥派 DIY 約 220 元・預約制",
  "guangxing-farm": "入園 100/200 可折・控窯 800 起・預約制",
  "yilanbing-museum": "免門票・牛舌餅 DIY 180 元",
  "sabelina": "250 元含印畫 DIY(3 歲以下免)"
};
const FEE_FULL = {
  "luodong-sports-park": "免門票;附設停車場收費時間08:00–21:00,小客車平日30元/次、假日50元/次(官方收費辦法);17:00後僅設籍宜蘭縣民眾憑國民身分證免費停車,部落格所稱「每次計3小時、17時後免費」以現場公告為準",
  "dongshan-river-eco-ark": "門票每人30元(單一費率,2017/7/1起實施)。免費:設籍宜蘭縣民、身高未滿115cm或未滿6歲兒童、身障者及陪同1人;17:00-22:00免費入園(部分園區不開放)。停車另計:小客車50元/機車20元/大客車100元(身障停車證免費)。園內神秘河道電動小船:日航每人75元(滿3歲-未滿12歲半票35元、未滿3歲免費)、包船8人600元、夜航包船約1200元;水上自行車為第三方付費行程。注意勿與冬山車站橋下『冬山舊河道電動小船』(100/50)混淆。",
  "yilan-sports-park": "免費入園(戶外公園,部落格明稱「無料景點」);園內室內游泳池、國民運動中心等場館使用另行收費(收費標準見宜蘭國民運動中心官網 yilansports.com.tw,金額待確認)。",
  "longtan-lake-scenic-area": "免門票;停車小客車50元/次、大客車100元/次(18:00–次日08:00免費;悠活園區停車可消費折抵)。註:2025年委外台塑生醫經營後規劃湖畔餐廳/市集,收費制度變動風險低但建議定期複查",
  "wuyuan-water-fire-park": "免費(免門票、免費停車、24小時開放)",
  "shuilu-kids-cafe": "全票 NT$300(120cm以上,可折抵館內消費200元);半票 NT$200(100-120cm,部分來源載 65 歲以上與身障亦適用,可折抵100元);身高 100cm 以下免費(另有近期來源寫 110cm 以下免票,標準略有出入、以現場為準)。每張門票含飼料兌換券及踩踩飛車(小火車)體驗一次;免費停車場。以上票價於本次對抗查證由多來源交叉再確認。",
  "lanyang-estuary-kids-restaurant": "無門票。低消:每人一份餐點或飲品,100 公分以下免低消(多來源含政府平台一致);主餐(義大利麵/燉飯/日式咖哩等)約 NT$300 上下(部落格 2025 菜單,價格可能異動);任兩份主餐+NT$400 可升級套餐(麵包x2+主廚濃湯x2+任選飲品x2+甜點蜂蜜吐司/鬆餅擇一,約每人+200);均消約 NT$360-600 為部落格推估;不收服務費;僅收現金(無刷卡)。",
  "gitu-cafe-manor": "免門票/無入園費;低消每人一杯飲料或一份餐點(單點約 NT$100-380);禁帶外食與寵物。停車免費。(fonfood 與 tinalife 2026-07-19 重查一致)",
  "lao-si-g-tea-coffee": "免門票(餐廳型態);每人低消 NT$100(2025-03 部落格資訊);用餐後店家提供魚飼料可餵魚(原稱『自由打賞』之打賞機制待確認);有部落格稱僅收現金(現況待確認)。",
  "amaze-rabbit-maze-jiaoxi-bath": "門票350元(13歲以上)、250元(7-12歲),皆可全額折抵消費;6歲以下(學齡前)50元保險清潔費,不可折抵。室內限時約120分鐘(每組2小時,含參觀與用餐),戶外不限時。免費停車。(2026-07-19 經 kafu.tw 2026 文與多來源複驗一致)",
  "lucky-art-crayon-castle": "全票250元(含4項DIY,可折抵館內消費;折抵金額各來源記載80–100元不等,以現場為準);宜蘭縣民票235元、愛心票125元;未滿3歲及65歲以上免門票陪同入場(無DIY);彩虹溜滑梯另計:單次體驗150元、持門票加購100元(限滿6歲、體重未滿100kg)",
  "anyo-museum": "全票250元(官網公告,2026-07-01起生效),可全額折抵館內消費(DIY/用餐/伴手禮,射擊體驗除外);未滿3歲、70歲以上、身障者+陪同1人免費;宜蘭縣民平日免費。暑期加碼:憑2026童玩節票根免費入館(至8/31)。註:部落格舊資料載全票200元屬改版前票價,以官網250元為準;滑步車租借另約200-300元、收涎抓周方案優惠價1500元(原價1800)。",
  "wooderful-life-luodong": "免門票免費參觀、免預約(僅羅東門市免費,其他分店收費);付費項目:木作DIY(音樂盒、相框等,依品項計價,每日16:30截止)與商品販售;停車另計(周邊付費停車場1小時60元、平日上限100元)",
  "hsus-legend-vinegar-factory": "免門票、免低消入館;兩層樓旋轉溜滑梯免費無限次(約2~12歲、限重約50kg);三層樓白金溜滑梯需滿8歲或身高130cm以上,憑館內消費發票/捐發票玩——換算規則各來源不一(每30元一次/滿100元一張玩一次/一張300元發票玩10次),以現場公告為準,發票捐宜蘭在地社福團體;醋醋小火車、旋轉木馬、娛樂機台為投幣付費;DIY 體驗(優酪乳手工皂等)另收費(價格待確認);停車免費。",
  "lanyang-museum": "常設展全票 NT$100,身高未滿 115 公分或未滿 6 歲免費(須一位購票大人陪同);官方售票 FAQ 另列全票 NT$200(推測為含特展票種,細項待確認);兒童考古探索廳另購票 NT$50/場(45 分鐘,現場抽號);停車另計(委外收費停車場,機車免費)。",
  "dongshanriver-water-park": "平時免門票,僅收停車費(小客車50/機車20/大客車100);電動小船需另付費(票價據TravelKing為單程全票75/優待票35,2026-07-19未能再確認,以現場公告為準);童玩節期間(2026/7/4-8/16)需門票:個人券假日350/平日250、兒童券假日200/平日100,未滿6歲或身高未滿115公分免費",
  "wulaokeng-scenic-area": "非綠博期間:全票80/優待票60(30人以上團體、軍警公教學生)/半票40(110cm以上兒童、65歲以上),宜蘭縣民憑證及身障免費;另有部落格(桃桃's)載全票100,以現場公告為準。停車小客車50/機車20/大客車100。綠博期間門票另計(2026年平日全票150、假日250,縣民100)",
  "suao-cold-spring-park": "泡腳區與公園免費;大眾池全票120元/半票60元(3-12歲、65歲以上;「130cm以下半票」為舊制70/40元時代標準,已過時),蘇澳鎮民平日免費假日半票;傳統湯屋單人300元/多人每人200元,冷熱雙泉(VIP)湯屋雙人約850元、頂級湯屋(含烤箱)雙人約1200元;公有停車場08:00-17:00收費(機車20元/小型車50元/大型車100元/次),其餘時段免費;以現場公告為準",
  "yi-nong-ranch": "全票150元(13-65歲)、半票100元(6-12歲、66歲以上、身障者),5歲(含)以下免費;門票含鮮羊奶(或飲料)+牧草飼料;停車免費",
  "bambi-land": "全票200元(含一份飼料);優待票50元(6-12歲、65歲以上、身障者及必要陪同1名);0-5歲免費;飼料餵完可加購,禁止自帶食物餵食",
  "grandma-zhang-mei-farm": "5歲以上200元(含入園+餵食草料1份;部分來源稱另含甜點飲品,內含物各來源不一需現場確認);2-4歲清潔費50元;65歲以上或身心障礙150元;DIY體驗套票350元(含門票+草料+食農DIY+田園拔菜,需預約);浴衣租借大人100元、120cm以下小孩50元",
  "jimmy-square": "幾米廣場免費、24小時開放;幸福轉運站戶外區過往免費,官方旅遊網現列夏令(5-10月)週四至週二9:30-18:00、冬令9:00-17:30、週三休館,惟營運現況有矛盾證據、以電洽為準;室內收費現況待確認(幾米團隊時期僅球池收費約100-150元,2021年後易主);周邊停車每小時20-50元(後站停車場最近、假日易滿)",
  "luodong-cultural-working-house": "免門票免費參觀(特殊展覽視主辦單位是否售票);附設停車場每小時30元(10分鐘內免費,平日上限150元、假日上限180元)",
  "ncfta-yilan": "全票150元、優惠票120元(6歲以上學生)、宜蘭縣民100元、敬老票75元、未滿6歲或115公分以下免費;年卡350元(縣民年卡250元、敬老年卡100元);停車前30分鐘免費、每小時30元、當日上限60元;DIY另計(如手機架DIY 200元、月河遊船3-12歲100元、未滿3歲免費)",
  "meihua-lake": "免費入園。停車費記載不一:2026 年來源載計次收費一次100元(較新);較早親子部落格載每小時50元、租車可折抵,以現場公告為準。遊湖船全票75元/半票35元;人力協力車約200-300元、四輪電輔車約300-500元/輛",
  "chung-hsing-cultural-park": "免費入園(戶外與展館皆免門票);停車費小客車30元/時(週一至四上限90元、週五至日及國定假日上限150元)、大客車60元/時、機車20元/次、自行車免費;手作DIY課程與部分特展依各工坊/活動公告另計(興工一場染布體驗約250-350元,其餘價格待確認)",
  "luodong-likoyung-library": "免費入館(玩全台灣旅遊網景點頁與文化部博物之島館舍資料均載明免費)",
  "yilan-art-museum": "全票50元;身高未滿115公分或未滿6歲兒童免費、設籍宜蘭縣縣民免費;優待票30元(團體30人以上);持蘭陽博物館常設展票根優惠30元(檢索 2026-07-19,依官網購票資訊頁)",
  "wanglongpi": "免門票、停車免費;周邊自費項目:花田村湖畔咖啡簡餐、窯烤披薩DIY約250元起、魚飼料(2024 年資訊,價格待重驗);另有望龍埤鵝肉攤低消20元麵食",
  "taipei-zoo": "全票100元、優待票50元、臺北市民票60元、團體票70元;未滿6歲免費(2024-04-01調漲後現行價,CNA與官網雙源證實);遊園列車每趟5元(學齡前免費,悠遊卡或投幣);娃娃車租借每次50元(押證件或押金1000元);園外停車場另計費",
  "taipei-childrens-amusement-park": "入園全票30元、7-12歲優待票15元、6歲以下免費;大型設施15項(編號1-13+K1/K2)每項20-30元,一日樂Fun券200元暢玩編號1-13(星光票140元,16:00後),小型委外設施50-80元;2026暑期水樂園300元、水陸聯票480元;停車平日30元/時、假日40元/時",
  "ntsec": "常設展(3–6F)全票120元、學生/一般團體90元(2026-01-01起,凍漲16年後首次調漲);未滿6歲或身高115公分以下兒童、65歲以上免費(修正:原稿僅載115公分以下)。兒童益智探索館另購票全票60元、2歲以下免費、每場限售220張(2025年報導稱兒童館收費不在此波調漲內,實際票價建議現場確認);空中腳踏車、3D劇場另計;地下停車場收費",
  "taipei-astronomical-museum": "展示館全票40元、臺北市民20元(可刷悠遊卡);宇宙劇場100元、宇宙探險70元;學齡前兒童、在校學生免費入展示館;1樓特展免費",
  "daan-forest-park": "免費入園;附設地下停車場計時收費(假日白天約 40 元/時、平日白天約 20 元/時、夜間 10 元/時,半小時計費)",
  "juzhixiang": "入園免門票、免費停車、販賣部外免費熱金棗茶;DIY另計:金棗/金橘蜜餞DIY約150-200元/份(ETtoday實測150元/約20分)、金桔(季節限定)果醬DIY約900元/3罐、香桔酥DIY約700元/6片;玻璃屋咖啡館餐點/飲品多在100元上下。價格以現場/官網為準。",
  "xihe-sandaime": "普通票100元(可全額折抵館內消費/體驗,含50元抵用券+50元體驗券);優待票50元(65歲以上、身心障礙者及陪同1位);120公分以下兒童免費入館。DIY另計,如小魚飯糰小卷約150元。免費停車。",
  "yutu-pencil-school": "2026一般票200元（含導覽+鉛筆DIY），半票/敬老/身障100元，3歲以下免費；不參加活動、僅逛福利社（販售區）免門票。票價已由先前150元調漲為200元",
  "jiaoxi-tangweigou": "戶外泡腳池免費;湯圍風呂(大眾湯)全票80元、優待票60元(軍公教/身障/110cm以上學生)、半票40元(65歲以上);溫泉魚SPA約成人70-80元、兒童(4歲~國小六年級)60元、部分攤商未滿4歲免費。90cm以下兒童禁入湯屋。",
  "paoma-historic-trail-park": "免費：免門票、免停車費；夜間『山光脈動』光雕秀亦免費（curly.com.tw、walkerland.com.tw、宜蘭勁好玩官網）。",
  "jianiao-garden": "門票每人100元,可全額折抵消費(飼料/DIY/餐飲,折抵不找零);100公分以下由家長陪同免費入場。親子DIY約160–380元。",
  "xingbao-scallion-farm": "付費預約制(2026 各通路價,以官網/現場為準):蔥田導覽+拔蔥+蔥派DIY+伴手禮券 約220元/人;純動物互動(迷你驢/梅花鹿,含牧草+50元抵用券)約200-220元/人;三星蔥+動物雙體驗套票 約380元/人;未滿7歲免入園費,2-4歲現場清潔費50元(可折抵、無專屬體驗材料)",
  "guangxing-farm": "入園門票:3-12歲$100(可折抵$50)、12歲以上$200(可折抵$150),票券可折抵場內消費並合併使用;摸蜆體驗$200/人(限3歲以上);焢窯每窯約$800-900(含場地、指導、柴火、食材;多數來源列$800-900,少數列$750起,以現場梯次為準);彩繪陶瓷小豬撲滿$180/人、發光燈泡生態瓶$200/缸;餵食飼料$10/包;附免費停車場。查證 2026-07-19,焢窯價格已依多數來源修正為$800-900範圍。",
  "yilanbing-museum": "入館免門票、免費停車;牛舌餅DIY每人180元(2026現行值,舊資料150元;可帶回6片超薄宜蘭餅、體驗約60-80分鐘,4歲以下可由一位家長陪同);2樓3D彩繪館憑館內消費發票免費參觀,僅週六、日開放。",
  "sabelina": "全票NT$250(一般遊客,含印畫DIY素材抵用券與商品/紀念品抵用券,商品可折抵150元或換紀念品);愛心票NT$100(65歲以上及身心障礙者,含DIY抵用券);3歲以下免票(不含DIY體驗)。導覽採預約制(場次約10:00、14:00),停車免費。"
};
const FREE = new Set(["luodong-sports-park","yilan-sports-park","longtan-lake-scenic-area","wuyuan-water-fire-park","wooderful-life-luodong","hsus-legend-vinegar-factory","jimmy-square","luodong-cultural-working-house","meihua-lake","suao-cold-spring-park","chung-hsing-cultural-park","luodong-likoyung-library","wanglongpi","daan-forest-park","juzhixiang","jiaoxi-tangweigou","paoma-historic-trail-park","yilanbing-museum"]);
const MEAL = new Set(["shuilu-kids-cafe","lanyang-estuary-kids-restaurant","amaze-rabbit-maze-jiaoxi-bath","gitu-cafe-manor","anyo-museum","ncfta-yilan","jianiao-garden"]);
const COFFEE = new Set(["shuilu-kids-cafe","gitu-cafe-manor","lao-si-g-tea-coffee","amaze-rabbit-maze-jiaoxi-bath","bambi-land","luodong-cultural-working-house","meihua-lake","yi-nong-ranch","chung-hsing-cultural-park","juzhixiang","jianiao-garden","xingbao-scallion-farm"]);

const slim = venues.map(v => ({
  id: v.id, name: v.name, type: v.type,
  zone: v.zone || '宜蘭',
  address: v.location.address,
  drive: v.location.drive_min,
  shade: v.shade_score.score,
  shade_basis: v.shade_score.basis,
  noise: v.noise_tolerance.score,
  noise_basis: v.noise_tolerance.basis,
  ride: { ok: v.ride_ok.ok, note: v.ride_ok.note },
  fac: v.facilities,
  fee: FEE_SHORT[v.id] || '待確認',
  fee_full: FEE_FULL[v.id] || '',
  evidence: v.evidence,
  games: v.games || [],
  weather_fit: v.weather_fit,
  age_fit: Object.fromEntries(Object.entries(v.age_fit).map(([b, a]) => [b, { score: a.score, reason: a.reason }])),
  rain_backup_id: v.rain_backup_id,
  family_log: v.family_log,
  last_verified: v.last_verified,
  status: v.status,
  flags: { free: FREE.has(v.id), meal: MEAL.has(v.id), coffee: COFFEE.has(v.id) },
}));

const family = { children: fam.children.map(c => ({ nickname: c.nickname, birth: String(c.birth).slice(0, 7) })) };

let html = fs.readFileSync(path.join(R, 'template.html'), 'utf8');
html = html.replace('__VENUES__', JSON.stringify(slim))
  .replace('__FAMILY__', JSON.stringify(family))
  .replaceAll('__BUILD_DATE__', TODAY)
  .replace('__N__', String(slim.length));

fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, 'index.html'), html);
for (const f of ['time.html', 'icon-192.png', 'icon-512.png']) fs.copyFileSync(path.join(R, f), path.join(DIST, f));

fs.writeFileSync(path.join(DIST, 'manifest.json'), JSON.stringify({
  name: '林家出遊手冊', short_name: '出遊手冊',
  start_url: './index.html', scope: './', display: 'standalone',
  background_color: '#F7F3EC', theme_color: '#2E7D74',
  icons: [
    { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
}, null, 2));

const CACHE = 'lin-family-' + Date.now();
fs.writeFileSync(path.join(DIST, 'sw.js'), [
  'const C = ' + JSON.stringify(CACHE) + ';',
  "const ASSETS = ['./', './index.html', './time.html', './manifest.json', './icon-192.png', './icon-512.png'];",
  "self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });",
  "self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });",
  "self.addEventListener('fetch', e => {",
  "  if (e.request.method !== 'GET') return;",
  "  e.respondWith(caches.match(e.request).then(cached => {",
  "    const fresh = fetch(e.request).then(r => { if (r && r.ok && new URL(e.request.url).origin === location.origin) { const cl = r.clone(); caches.open(C).then(x => x.put(e.request, cl)); } return r; }).catch(() => cached);",
  "    return cached || fresh;",
  "  }));",
  "});",
].join('\n'));

console.log('dist/ 產出完成:index.html(' + (html.length / 1024).toFixed(1) + 'KB,' + slim.length + ' 筆)+ time.html + manifest + sw + icons');
