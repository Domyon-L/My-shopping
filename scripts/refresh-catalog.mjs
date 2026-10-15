import fs from 'node:fs';
import {isListed} from '../dist/catalog-core.mjs';
const DAY='2026-10-11';
const original=JSON.parse(fs.readFileSync('catalog/legacy-original.json','utf8'));
const batch=[];
function entry(id,brand,product,type,group,category,model,variant,specs,fit,limits,url,region='中国大陆',price=null,extra=[]){
  batch.push({id,brand,product,type,group,category,model,variant,specs,fit,limits,tags:fit,source:{region,urls:[{label:'品牌产品资料',url},...extra],checked_at:DAY},review:{status:'documented',checked_at:DAY,method:'型号、规格、适用限制与官方资料人工交叉核对',physical_tested:false},price:price===null?{kind:'unknown',currency:'CNY',min:null,max:null,observed_at:null,url:null}:{kind:'documented',currency:'CNY',min:price,max:price,observed_at:DAY,url},isNew:id>=1000,updated_at:DAY});
}
entry(548,'罗技 Logitech','MX Master 3S 无线鼠标','数码科技','电脑外设','鼠标','MX Master 3S','标准版；右手设计',{'传感器':'8000 DPI','滚轮':'MagSpeed 电磁滚轮','设置':'Logi Options+'},['办公','桌面'],['玻璃表面厚度需至少 4 mm；扩展设置需兼容系统及软件。','购买前核对标准版与商用版、接收器及当地售后。'],'https://www.logitech.com/zh-cn/shop/p/mx-master-3s');
entry(663,'索尼 Sony','WH-1000XM6 头戴式降噪耳机','数码科技','影音设备','头戴式耳机','WH-1000XM6','标准版；颜色单独选择',{'降噪处理器':'QN3','麦克风':'12 颗降噪麦克风','重量':'约 254 g','连接':'蓝牙 5.3 / 双设备连接'},['通勤','办公'],['部分功能需 Sound Connect App 和固件更新。','头戴式耳机需试戴确认夹持力与舒适度；不随附电源适配器。'],'https://www.sonystyle.com.cn/products/headphone/wh_1000xm6/wh_1000xm6_g_feature.html','中国大陆',null,[{label:'官方支持与规格',url:'https://www.sony.com/electronics/support/wireless-bluetooth-headphones/wh-1000xm6/specifications'}]);
entry(676,'LEGO 乐高','花植系列 典雅兰 10343','玩具潮玩','积木模型','植物积木','10343','274 片；成人拼搭',{'片数':'274','完成高度':'约 25 cm','说明书':'纸质 / LEGO Builder'},['桌面','兴趣'],['含小零件；按包装年龄要求使用。','海外资料用于核对型号，国内售价及售后单独确认。'],'https://www.lego.com/en-nl/product/mini-orchid-10343','荷兰官方资料');
entry(682,'IKEA 宜家','IKEA 365+ 玻璃食品盒 / 硅树脂盖 1 L','家居生活','餐厨水具','食品盒','092.767.73','附盖；玻璃 / 硅树脂；1.0 L',{'容量':'1.0 L','尺寸':'21 × 15 × 7 cm','盒身材质':'玻璃','盖材质':'硅树脂'},['宿舍','通勤'],['首次使用前清洗；加热与保养按此具体材质的说明。','检索页面提示地区库存待确认，不承诺有货。'],'https://www.ikea.cn/cn/zh/p/ikea-365-fu-gai-shi-pin-he-chang-fang-xing-bo-li-huo-shu-zhi-s09276773/','中国大陆',74.99);
entry(683,'IKEA 宜家','SAMLA 萨姆拉 附盖透明储物盒 5 L','家居生活','收纳整理','收纳箱','194.408.48','附盖；透明；5 L',{'容量':'5 L','尺寸':'28 × 20 × 14 cm','使用范围':'室内收纳'},['宿舍','桌面'],['不可直接接触食物，仅限室内使用。','检索页面提示地区库存待确认，不承诺有货。'],'https://www.ikea.cn/cn/zh/p/samla-box-with-lid-transparent-s19440848/','中国大陆',9.99);
entry(704,'ASICS 亚瑟士','NOVABLAST 5 男款公路跑鞋','鞋履配件','跑步运动','跑步鞋','1011B974-402','男款；标准楦；Indigo Blue / Amber',{'缓震':'FF BLAST MAX','落差':'8 mm','定位':'中性公路跑鞋','标示重量':'255 g（随尺码变化）'},['运动'],['需按脚型与尺码试穿；不替代稳定支撑鞋。','海外款号和价格不直接对应中国大陆在售配色。'],'https://www.asics.com/fi/en-fi/novablast-5/p/1011B974-402.html','芬兰官方资料');
entry(808,'Quaker 桂格','Old Fashioned Oats 传统燕麦片','食品饮品','早餐冲调','谷物麦片','Old Fashioned Oats','美国版原味传统燕麦；包装重量单独核对',{'原料定位':'全谷物燕麦','类型':'传统燕麦片；区别于 Quick Oats'},['早餐'],['按实际包装核对配料、过敏原、保质期与烹饪说明。','美国版产品资料不替代中国销售包装的标签。'],'https://www.quakeroats.com/products/hot-cereals/old-fashioned-oats-quick-oats','美国官方资料');
entry(847,'Tombow 蜻蜓','MONO AIR 修正带 CT-CA5','学习办公','学习工具','修正工具','CT-CA5','5 mm 宽 × 10 m；一次性本体',{'带长':'10 m','带宽':'5 mm','机构':'Air Touch System'},['学生','办公'],['核对 CT-CA5 型号；可换芯版、侧按版不是同一规格。','考试是否允许使用修正带需按考试规则确认。'],'https://www.tombow.com/en/products/mono-air/','日本官方资料');
entry(736,'Leatherman','Micra 迷你多功能工具','生活精选','便携工具','多功能工具','Micra','标准工具；刀套单售',{'工具数量':'10','主工具':'弹簧剪刀','随身方式':'钥匙圈挂环'},['桌面','工具'],['含刀刃；携带与运输需遵守所在地规定。','适合轻量小任务；地区保修需向销售方核对。'],'https://www.leatherman.com/collections/multi-tools/products/micra?variant=45057513259101','美国官方资料',null,[{label:'原厂保修条件',url:'https://www.leatherman.com/pages/customerservice-warranty'}]);
entry(1001,'罗技 Logitech','MX Master 4 触觉反馈无线鼠标','数码科技','电脑外设','鼠标','MX Master 4','消费标准版；区别于商用版',{'传感器':'8000 DPI','滚轮':'MagSpeed','特色':'触觉反馈 / Actions Ring'},['办公','桌面'],['Actions Ring 等扩展功能需 Logi Options+。','原生 Windows 触觉反馈需兼容 Windows 11 更新和鼠标固件。'],'https://www.logitech.com/zh-cn/shop/p/mx-master-4');
entry(1002,'Apple 苹果','AirPods Pro 3 无线降噪耳机','数码科技','影音设备','入耳式耳机','AirPods Pro 3','USB-C MagSafe 充电盒；5 种尺寸耳塞',{'芯片':'H2','单次聆听':'最长 8 小时（开启降噪，厂商测试）','防护':'耳机及充电盒 IP57','连接':'蓝牙 5.3'},['通勤','运动'],['防护性能会随磨损下降；不适用于水上活动，潮湿时不能充电。','部分功能需兼容 Apple 设备与系统；USB-C 线及适配器单购。'],'https://support.apple.com/zh-cn/125135','中国大陆',null,[{label:'官方购买与包装内容',url:'https://www.apple.com.cn/shop/buy-airpods/airpods-pro-3'}]);
entry(1003,'Apple 苹果','iPad（A16）128 GB 无线局域网版','数码科技','平板电脑','平板电脑','iPad A16','128 GB；Wi-Fi 版',{'芯片':'A16','存储':'128 GB','接口':'USB-C','屏幕':'11 英寸 Liquid Retina'},['学生','办公'],['手写笔及键盘兼容性需按具体型号确认，配件单购。','无线局域网版不能直接使用蜂窝数据；购买前核对型号和容量。'],'https://support.apple.com/zh-cn/122240');
entry(1004,'Apple 苹果','Mac mini（M4）16 GB / 256 GB','数码科技','台式电脑','迷你主机','Mac mini 2024 M4','10 核 CPU / 10 核 GPU；16 GB / 256 GB',{'芯片':'M4','内存':'16 GB 统一内存','存储':'256 GB SSD','定位':'桌面主机'},['办公','桌面'],['显示器、键盘和鼠标需另备。','内存和存储按购入配置核对，不能按传统台式机方式自行扩充内存。'],'https://support.apple.com/zh-cn/121555');
entry(1005,'CASIO 卡西欧','fx-991CN CW II 科学计算器','学习办公','学习工具','计算器','fx-991CN CW II','中文 ClassWiz；黑色；附硬质保护壳',{'显示':'中文 / 自然书写显示','电源':'LR44 + 太阳能','类型':'无编程与文本存储功能','功能':'方程 / 矩阵 / 向量 / 统计'},['学生'],['考试能否使用此型号须核对具体考试规则。','核对 II 代及黑色版本；其他后缀配色需单独核查。'],'https://www.casio.com.cn/scientific-calculators/product.FX-991CN-CW-PLUS/','中国大陆',218,[{label:'官方操作指南',url:'https://support.casio.com/global/cn/calc/manual/fx-991CNCWII_999CNCWII_cn/'}]);
entry(1006,'LEGO 乐高','花植系列 快乐盆栽 10349','玩具潮玩','积木模型','植物积木','10349','217 片；9 岁及以上',{'片数':'217','年龄':'9+','内容':'两株植物 / 两个花盆'},['桌面','兴趣'],['含小零件；年龄要求不能替代儿童监护。','新品指本次加入目录，不表示刚刚上市。'],'https://www.lego.com/zh-cn/product/happy-plants-10349');
entry(1007,'Patagonia 巴塔哥尼亚','Better Sweater 男款全拉链抓绒外套','服饰穿搭','外套','抓绒外套','25528','男款；Regular Fit；具体颜色尺码单独选择',{'面料':'100% 再生聚酯抓绒','版型':'Regular Fit','结构':'全拉链 / 立领','标示重量':'638 g'},['通勤','户外'],['针织面料可能起球，按原厂保养说明清洁。','保暖抓绒不等同于防水外壳；海外尺码和售后单独核对。'],'https://www.patagonia.com/product/mens-better-sweater-fleece-jacket/25528.html?cgid=root','美国官方资料');
entry(1008,'CeraVe 适乐肤','Moisturizing Cream 无香保湿霜（美版）','个护美妆','面部护理','乳液面霜','Moisturizing Cream US','无香乳霜配方；容量以实际包装确认',{'配方资料':'3 种神经酰胺 / 透明质酸','香型':'无香料配方（按美版官方资料）','质地':'乳霜'},['保湿'],['配方及包装可能更新，以购入版本成分表为准。','肤质适配因人而异；有不适停止使用。未把厂商宣称当作独立疗效结论。'],'https://www.cerave.com/skincare/moisturizers/moisturizing-cream/','美国官方资料');
entry(1009,'Leatherman','Skeletool 7 合 1 多功能工具','生活精选','便携工具','多功能工具','Skeletool','标准版；区别于 CX / RX',{'工具数量':'7','主要工具':'钳 / 组合刃 / 批头螺丝刀','结构':'可拆卸口袋夹'},['工具','户外'],['含刀刃，不适合儿童；携带与运输按所在地规定。','购买前核对套装批头、配件和地区保修条款。'],'https://www.leatherman.com/collections/lightweight/products/skeletool','美国官方资料',null,[{label:'原厂保修条件',url:'https://www.leatherman.com/pages/customerservice-warranty'}]);
entry(1010,'YONEX 尤尼克斯','NANOFLARE 800 PRO 羽毛球拍','运动户外','球类运动','羽毛球拍','NF-800P','4U / G5；约 83 g；不含穿线费用',{'拍杆':'硬','重量级':'4U（平均 83 g）','官方穿线范围':'20–28 lbs（4U）'},['运动'],['按 4U 与握柄规格购买；3U 参数不能直接套用。','是否穿线、批次和当地授权售后需核对，不以高磅数代表质量。'],'https://www.yonex.com/badminton/racquets/nf-800pr','国际官方资料');
entry(1011,'ZOJIRUSHI 象印','SM-SF48 不锈钢保温杯 480 mL','生活精选','饮水餐具','保温杯','SM-SF48','480 mL / 16 oz；Navy (-AD)',{'容量':'0.48 L / 16 oz','类型':'不锈钢保温杯'},['通勤'],['官方美版页面提示缺货；国内在售和地区售后另核对。','按实物说明书核对可装饮品与清洁方式。'],'https://store.zojirushi.com/products/stainless-mug-sm-sf4860','美国官方资料');
entry(1012,'IKEA 宜家','IKEA 365+ 正方形玻璃食品盒 1.2 L','家居生活','餐厨水具','食品盒','003.592.11','仅盒身；1.2 L；盖需另购',{'容量':'1.2 L','尺寸':'15 × 15 × 11 cm','材质':'耐热玻璃'},['宿舍','通勤'],['需搭配 IKEA 365+ 方形盖；与附盖 1 L 款不是同一规格。','首次使用前清洗，按官方说明加热与保养。'],'https://www.ikea.cn/cn/zh/p/ikea-365-shi-pin-he-zheng-fang-xing-bo-li-00359211/');
const priceRefresh=JSON.parse(fs.readFileSync('catalog/price-refresh.json','utf8'));
const detailContent=JSON.parse(fs.readFileSync('catalog/detail-content.json','utf8'));
for(const observation of priceRefresh.observations){
  const x=batch.find(x=>x.id===observation.id);if(!x)throw new Error('Unknown price ID');
  x.price={kind:'documented',currency:'CNY',min:observation.amount,max:observation.amount,observed_at:priceRefresh.checked_at,url:observation.url,label:observation.label,variant:observation.variant,note:observation.note};
}
for(const x of batch){if(detailContent[x.id]){const {specs,...details}=detailContent[x.id];Object.assign(x,details);if(specs)Object.assign(x.specs,specs);}}
const purchaseEvidence=JSON.parse(fs.readFileSync('catalog/purchase-evidence.json','utf8'));
for(const x of batch)if(purchaseEvidence[x.id])x.purchase=purchaseEvidence[x.id];
// Preserve earlier additions, while only the current 154-record release carries the new badge.
for(const x of batch)x.isNew=false;
const additions=['ikea-a','ikea-b','sports','tech'].flatMap(name=>{const file=JSON.parse(fs.readFileSync('catalog/additions-'+name+'.json','utf8'));return Array.isArray(file)?file:file.items;});
if(additions.length!==154)throw new Error('Expected exactly 154 newly reviewed products');
const priorIds=new Set([...original,...batch].map(x=>x.id));
if(new Set(additions.map(x=>x.id)).size!==154||additions.some(x=>priorIds.has(x.id)))throw new Error('Duplicate addition ID');
for(const x of additions){if(!isListed(x)||x.review.status!=='documented'||x.price.kind!=='documented')throw new Error('Incomplete addition '+x.id);x.isNew=true;if(purchaseEvidence[x.id])x.purchase=purchaseEvidence[x.id];}
batch.push(...additions);
const originalIds=new Set(original.map(x=>x.id));
const byId=new Map(batch.map(x=>[x.id,x]));
const items=original.map(x=>byId.get(x.id)||({id:x.id,brand:x.brand.trim(),product:x.product.trim(),type:x.type,group:x.group,category:x.category,model:null,variant:'具体型号 / 包装规格待核验',specs:{},fit:[],tags:[...new Set(x.tags||[])],limits:['缺少可核查的型号或来源，暂不纳入有据精选。'],source:{region:'待核验',urls:[],checked_at:null},review:{status:'pending',checked_at:DAY,issues:['缺少具体来源网址','原评分缺少评价样本与测试依据','历史价格未取得当期证据'],physical_tested:false},price:{kind:'historical',currency:'CNY',min:x.price.min,max:x.price.max,observed_at:x.price.updated_at,url:null},isNew:false,updated_at:DAY}));
items.push(...batch.filter(x=>!originalIds.has(x.id)));
const duplicate=items.find(x=>x.id===664);duplicate.review={status:'merged',checked_at:DAY,issues:['与 ID 548 的 MX Master 3S 为相同型号，合并展示'],aliasOf:548,physical_tested:false};
const report={reviewed_at:DAY,latest_batch_reviewed_at:'2026-10-14',target_visible_count:1000,price_reviewed_at:priceRefresh.checked_at,original_count:original.length,new_count:batch.filter(x=>x.isNew).length,total_records:items.length,visible_count:items.filter(x=>isListed(x)).length,retained_count:items.filter(x=>x.review.status!=='merged').length,hidden_count:items.filter(x=>x.review.status!=='merged'&&!isListed(x)).length,documented_count:items.filter(x=>x.review.status==='documented').length,pending_count:items.filter(x=>x.review.status==='pending').length,merged_count:1,removed_unsubstantiated_scores:original.length,documented_price_count:items.filter(x=>isListed(x)&&x.price.kind==='documented').length,historical_price_count:items.filter(x=>isListed(x)&&x.price.kind==='historical').length,method:'恢复原目录中有历史参考价的记录，保留原价格日期并明确标注历史；有据精选只收录资料完整且近期价格有来源的商品。尚无价格记录的商品暂不展示。',rejected_candidates:[{model:'3M 1100',reason:'所查美版资料面向职业防护；不直接作为日常消费新品推荐。'},{model:'Nike CW2288-111',reason:'所查网址已重定向至 IO5011-300，型号不符，未将旧款标为已核验。'}]};
if(report.visible_count!==1000)throw new Error('Visible catalogue must contain exactly 1000 products');
fs.writeFileSync('catalog/verified-batch.json',JSON.stringify(batch,null,2));
fs.writeFileSync('catalog/reviewed-catalog.json',JSON.stringify({meta:report,items},null,2));
const publicItems=items.filter(x=>isListed(x));
const publicMeta={...report,retained_ids:items.filter(x=>x.review.status!=='merged').map(x=>x.id),aliases:Object.fromEntries(items.filter(x=>x.review.status==='merged').map(x=>[x.id,x.review.aliasOf]))};
fs.writeFileSync('dist/catalog-data.js','window.CATALOG = '+JSON.stringify({meta:publicMeta,items:publicItems}).replaceAll('<','\\u003c')+';\n');
fs.writeFileSync('catalog/audit-report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report));

const brandPicks=JSON.parse(fs.readFileSync('catalog/brand-picks.json','utf8'));
fs.writeFileSync('dist/brand-data.js','window.BRAND_PICKS = '+JSON.stringify(brandPicks).replaceAll('<','\\u003c')+';\n');
