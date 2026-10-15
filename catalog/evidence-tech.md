# 技术与文具新品证据（2026-10-14）

新增32个独立商品记录：12款不同型号或功能/尺寸的CASIO计算器、20个MUJI文具产品。29个公开标价不超过100元；3个超100元计算器均提供实际用途条件。isNew表示本次新加入目录，未声称为品牌刚上市新品。全部physical_tested=false。

实际核对官方域名：www.casio.com.cn、www.muji.com.cn。MUJI商品图域名img.muji.com.cn；不将图片域名作为独立价格证据。

## 核对方法与边界

CASIO完整打开产品页，使用页面“基本信息/价格”及规格，不使用相关产品栏替代目标产品价格。没有用颜色重复凑数；MX-120B与MX-12B功能和机身同类、fx-350CN CW II与fx-82CN CW II功能相同仅配色有别，均排除。DY-120与GY-120是不同机身尺寸型号，分别保留，不保留同一型号其他颜色。

小米商品搜索摘要与完整打开后的product_id目标不一致（数据线19601实际打开平板；巨能写10050189实际打开微蒸烤），未采纳其价格或产品。

MUJI官方商城页面为JS外壳，搜索摘要不能完成核验。读取该商城公开前端使用的同源公开产品数据接口，未使用用户登录、账号凭据或私人数据。接口按网站公开请求格式访问；记录请求参数id与provinceCd=31，以上海配送区域为价格与库存口径。商品规格来自完整data对象，价格来自明确所选SKU.price，未使用系列最低价/初上市价。官网原文偶见不合理材质字段（例如白板笔盖材料），这类字段没有转为产品规格。未确认的包装张数、尺寸明确列为限制。

商城来源URL是正常可浏览的商品页；接口URL需网站公开客户端请求格式才能加载。抓取JSON为可重现中间证据位于scratch；下表及逐条摘录保存所采用字段和快照哈希。

## 逐条核对

|目录ID|商品|确切SKU或型号|所选公开价（CNY）|来源|
|---:|---|---|---:|---|
|2123|fx-82CN CW II|fx-82CN CW II|88|[原厂页面](https://www.casio.com.cn/scientific-calculators/product.FX-82CN-CW-2/)|
|2124|MS-20UC-PK|MS-20UC-PK|88|[原厂页面](https://www.casio.com.cn/basic-calculators/product.MS-20UC-PK/)|
|2125|MX-12B-LB|MX-12B-LB|42|[原厂页面](https://www.casio.com.cn/basic-calculators/product.MX-12B-LB/)|
|2126|GY-120-RD|GY-120-RD|99|[原厂页面](https://www.casio.com.cn/basic-calculators/product.GY-120-RD/)|
|2127|AX-120B|AX-120B|59|[原厂页面](https://www.casio.com.cn/basic-calculators/product.AX-120B/)|
|2128|GX-12B|GX-12B|69|[原厂页面](https://www.casio.com.cn/basic-calculators/product.GX-12B/)|
|2129|DY-120-RDG|DY-120-RDG|99|[原厂页面](https://www.casio.com.cn/basic-calculators/product.DY-120-RDG/)|
|2130|DS-2D|DS-2D|179|[原厂页面](https://www.casio.com.cn/basic-calculators/product.DS-2D/)|
|2131|DX-120B|DX-120B|67|[原厂页面](https://www.casio.com.cn/basic-calculators/product.DX-120B/)|
|2132|FC-01A|FC-01A|99|[原厂页面](https://www.casio.com.cn/scientific-calculators/product.FC-01A/)|
|2133|fx-95CN CW II|fx-95CN CW II|128|[原厂页面](https://www.casio.com.cn/scientific-calculators/product.FX-95CN-CW-2/)|
|2134|fx-999CN CW II|fx-999CN CW II|228|[原厂页面](https://www.casio.com.cn/scientific-calculators/product.FX-999CN-CW-2/)|
|2135|凝胶中性墨水圆珠笔芯|4550344084731|4.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/72881)|
|2136|牛皮纸 杂记本|4550344864265|4.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/89180)|
|2137|凝胶中性墨水圆珠笔·笔帽式|4550344084373|7.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/72853)|
|2138|凝胶中性墨水圆珠笔·按压式|4550344084175|7.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/72824)|
|2139|塑料橡皮|4945247421347|4.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/50354)|
|2140|单面透明文件夹|4550002553210|8.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/39360)|
|2141|亚克力透明尺|4550584835841|5.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/98854)|
|2142|胶棒|4550182847901|5.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/73858)|
|2143|亚克力三角尺|4550584835810|8.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/98861)|
|2144|亚克力量角器|4550584835827|8.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/98853)|
|2145|白板笔|4550344902660|9.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/89272)|
|2146|折纸|4550002555771|9.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/39407)|
|2147|油性双头记号笔|4550002555658|9.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/39400)|
|2148|口袋自动铅笔|4550723017046|10.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/103620)|
|2149|书写顺滑油性圆珠笔|4550583768157|10.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/101301)|
|2150|口袋彩色标记笔 笔帽式|4550583693510|10.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/95700)|
|2151|按压式口袋笔 凝胶中性墨水|4550583693275|10.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/94235)|
|2152|票夹/大|4550344072912|10.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/74755)|
|2153|卷笔刀|4548076369479|10.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/6323)|
|2154|聚丙烯 笔盒 横型|4548076738879|12.0|[原厂页面](https://www.muji.com.cn/cn/store/commodity/107856)|

### 2123 fx-82CN CW II
- 具体范围：中文黑色；附硬质保护壳
- 公开价格：CNY 88；观察日2026-10-14。
- 来源：https://www.casio.com.cn/scientific-calculators/product.FX-82CN-CW-2/
- 采用规格：显示=10+2位，中文自然书写，192×63点阵；功能=计算、统计、函数表格三大应用；电源=AAA型R03（7号）电池；尺寸=162×77×13.8 mm
- 已完整打开的网页记录：turn36view0。

### 2124 MS-20UC-PK
- 具体范围：粉色，12位 Mini Just款
- 公开价格：CNY 88；观察日2026-10-14。
- 来源：https://www.casio.com.cn/basic-calculators/product.MS-20UC-PK/
- 采用规格：位数=12位；功能=时间计算、税率计算、平方根；电源=太阳能和电池；尺寸=149.5×105×22.8 mm
- 已完整打开的网页记录：turn82view3。

### 2125 MX-12B-LB
- 具体范围：浅蓝色，12位 Mini Desk款
- 公开价格：CNY 42；观察日2026-10-14。
- 来源：https://www.casio.com.cn/basic-calculators/product.MX-12B-LB/
- 采用规格：位数=12位；功能=常规百分比、独立存储器、退位键；电源=太阳能和电池；尺寸=147×106.5×29 mm
- 已完整打开的网页记录：turn46view2。

### 2126 GY-120-RD
- 具体范围：红色，金属面板台式款
- 公开价格：CNY 99；观察日2026-10-14。
- 来源：https://www.casio.com.cn/basic-calculators/product.GY-120-RD/
- 采用规格：位数=12位；功能=真人发音、总计GT、利润率计算；电源=五号LR06电池×2；尺寸=202.5×155×45.8 mm
- 已完整打开的网页记录：turn46view3。

### 2127 AX-120B
- 具体范围：12位 Compact Desk款
- 公开价格：CNY 59；观察日2026-10-14。
- 来源：https://www.casio.com.cn/basic-calculators/product.AX-120B/
- 采用规格：位数=12位；功能=总计GT、平方根、小数及舍入选择器；电源=太阳能和电池；尺寸=175.5×110.5×25 mm
- 已完整打开的网页记录：turn49view1。

### 2128 GX-12B
- 具体范围：12位台式款
- 公开价格：CNY 69；观察日2026-10-14。
- 来源：https://www.casio.com.cn/basic-calculators/product.GX-12B/
- 采用规格：位数=12位；功能=项目计数器、平方根、小数及舍入选择器；电源=太阳能和电池；尺寸=207.5×159×34.3 mm
- 已完整打开的网页记录：turn51view0。

### 2129 DY-120-RDG
- 具体范围：赤金色，金属面板台式款
- 公开价格：CNY 99；观察日2026-10-14。
- 来源：https://www.casio.com.cn/basic-calculators/product.DY-120-RDG/
- 采用规格：位数=12位；功能=真人发音、总计GT、利润率计算；电源=五号LR06电池×2；尺寸=176.5×128.5×42.6 mm
- 已完整打开的网页记录：turn51view1。

### 2130 DS-2D
- 具体范围：黑色，12位金属面板台式款
- 公开价格：CNY 179；观察日2026-10-14。
- 来源：https://www.casio.com.cn/basic-calculators/product.DS-2D/
- 采用规格：位数=12位；功能=税率计算、货币兑换、总计GT；按键=原厂标注耐用防褪色按键；电源=太阳能和电池；尺寸=188×135×36.6 mm
- 已完整打开的网页记录：turn51view3。

### 2131 DX-120B
- 具体范围：12位金属面板台式款
- 公开价格：CNY 67；观察日2026-10-14。
- 来源：https://www.casio.com.cn/basic-calculators/product.DX-120B/
- 采用规格：位数=12位；功能=总计GT、百分比、平方根、舍入选择器；电源=太阳能和电池；尺寸=175.5×129×33.2 mm
- 已完整打开的网页记录：turn78view0。

### 2132 FC-01A
- 具体范围：黑色；附滑盖式外壳
- 公开价格：CNY 99；观察日2026-10-14。
- 来源：https://www.casio.com.cn/scientific-calculators/product.FC-01A/
- 采用规格：显示=10+2位，自然格式、点阵显示；功能=分数、小数一键转换、乘方开方、对数；类型=不可编程、非图形；电源=AAA型R03电池×1
- 已完整打开的网页记录：turn82view1。

### 2133 fx-95CN CW II
- 具体范围：中文黑色；附硬质保护壳
- 公开价格：CNY 128；观察日2026-10-14。
- 来源：https://www.casio.com.cn/scientific-calculators/product.FX-95CN-CW-2/
- 采用规格：显示=10+2位，192×63点阵，中文自然书写；功能=二至四元线性方程组、二至四次多项式方程、不等式；电源=AAA型R03（7号）电池；尺寸=162×77×13.8 mm
- 已完整打开的网页记录：turn82view2。

### 2134 fx-999CN CW II
- 具体范围：中文黑色；附硬质保护壳
- 公开价格：CNY 228；观察日2026-10-14。
- 来源：https://www.casio.com.cn/scientific-calculators/product.FX-999CN-CW-2/
- 采用规格：显示=10+2位，192×63点阵，中文自然书写；功能=数值微积分、4×4矩阵、向量、方程及45行5列数据表格；电源=LR44纽扣电池与太阳能；尺寸=162×77×10.7 mm
- 已完整打开的网页记录：turn78view3。

### 2135 凝胶中性墨水圆珠笔芯
- 具体范围：0.5㎜・黑色；0.5㎜；SKU 4550344084731
- 公开价格：CNY 4.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/72881
- 采用规格：系列型号=NB12CC0A；SKU=4550344084731；规格=0.5㎜；所选款式=0.5㎜・黑色
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=72881&provinceCd=31
- 所选SKU库存观察值：622（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：faa135a2b0671c3b5fa8df0aad9781dcb3b6432a6378915e041be0aff5ea4fd5

### 2136 牛皮纸 杂记本
- 具体范围：棕色；横线 32张 A6；SKU 4550344864265
- 公开价格：CNY 4.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/89180
- 采用规格：系列型号=NA68CC1A；SKU=4550344864265；规格=横线 32张 A6；所选款式=棕色
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=89180&provinceCd=31
- 所选SKU库存观察值：1（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：54939ebf846c4beee1e11b4877bc7eb0190879ac548e979ef7beade2daca38a5

### 2137 凝胶中性墨水圆珠笔·笔帽式
- 具体范围：0.5㎜・黑色；0.5㎜；SKU 4550344084373
- 公开价格：CNY 7.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/72853
- 采用规格：系列型号=NB06CC0A；SKU=4550344084373；规格=0.5㎜；所选款式=0.5㎜・黑色
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=72853&provinceCd=31
- 所选SKU库存观察值：10241（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：4234401edac981e71e5cac019c95360a729bb6e8b15630a62d5d12f5c8d39d37

### 2138 凝胶中性墨水圆珠笔·按压式
- 具体范围：0.5㎜・黑色；0.5㎜；SKU 4550344084175
- 公开价格：CNY 7.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/72824
- 采用规格：系列型号=NB05CC0A；SKU=4550344084175；规格=0.5㎜；所选款式=0.5㎜・黑色
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=72824&provinceCd=31
- 所选SKU库存观察值：338（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：651005956852115ad245e477da3427928941539225485f3da18517fb21de5f55

### 2139 塑料橡皮
- 具体范围：黑；小/硬；SKU 4945247421347
- 公开价格：CNY 4.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/50354
- 采用规格：系列型号=E5A4228；SKU=4945247421347；规格=小/硬；所选款式=黑
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=50354&provinceCd=31
- 所选SKU库存观察值：385（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：87b17d486b8d9cffb44eb4bfd357ac3b6621d9f992df67c4cfd2dc7b21c0a315

### 2140 单面透明文件夹
- 具体范围：灰白 型号:8A65013；数量1个；SKU 4550002553210
- 公开价格：CNY 8.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/39360
- 采用规格：系列型号=8A65013；SKU=4550002553210；规格=数量1个；所选款式=灰白 型号:8A65013；材质=聚氯乙烯树脂；SKU型号=8A65013
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=39360&provinceCd=31
- 所选SKU库存观察值：38（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：dd2c734252e1e9b895a7492eee7992102856bd44ec0191bdeb400b205dec4a24

### 2141 亚克力透明尺
- 具体范围：其他；150mm；SKU 4550584835841
- 公开价格：CNY 5.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/98854
- 采用规格：系列型号=ND80CA4A；SKU=4550584835841；规格=150mm；所选款式=其他；材质=丙烯酸树脂
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=98854&provinceCd=31
- 所选SKU库存观察值：674（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：f4663608d9cce4f071cac831ce3715a211e183e4bbe85c4abeae5576a7538b90

### 2142 胶棒
- 具体范围：8g；SKU 4550182847901
- 公开价格：CNY 5.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/73858
- 采用规格：系列型号=ZE0S159；SKU=4550182847901；规格=8g；主体配方=PVP
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=73858&provinceCd=31
- 所选SKU库存观察值：190（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：2911f03a1d500dc509bf2f9d453c083837bad972365649512548e52cd9e7141c

### 2143 亚克力三角尺
- 具体范围：透明；85X85X2mm；SKU 4550584835810
- 公开价格：CNY 8.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/98861
- 采用规格：系列型号=ND1ACC4A；SKU=4550584835810；规格=85X85X2mm；所选款式=透明；材质=丙烯酸树脂
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=98861&provinceCd=31
- 所选SKU库存观察值：41（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：8cf9a5dcbfad38a9806bc0898cb8d649caf22a24b298e412fa23ce107ee2c7dd

### 2144 亚克力量角器
- 具体范围：透明；90X2mm；SKU 4550584835827
- 公开价格：CNY 8.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/98853
- 采用规格：系列型号=ND3ACC4A；SKU=4550584835827；规格=90X2mm；所选款式=透明；材质=丙烯酸树脂
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=98853&provinceCd=31
- 所选SKU库存观察值：43（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：efbc5a8325c803e21272578c8400b545df5269a77eca128e6fc713edc350fe7a

### 2145 白板笔
- 具体范围：黑色；SKU 4550344902660
- 公开价格：CNY 9.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/89272
- 采用规格：系列型号=NB0SKA2S；SKU=4550344902660；所选款式=黑色
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=89272&provinceCd=31
- 所选SKU库存观察值：1（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：9ee355cb2dff1f25be817285bd7c7fa8799dac4e5dbef236457385251638367a

### 2146 折纸
- 具体范围：SKU 4550002555771
- 公开价格：CNY 9.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/39407
- 采用规格：系列型号=8A68001；SKU=4550002555771；材质=纸
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=39407&provinceCd=31
- 所选SKU库存观察值：1（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：be6f1afb7cc535ac2800b96fbf6b0f3d53474d7c42cd198ef5cf2bc6840daf16

### 2147 油性双头记号笔
- 具体范围：黑色；细/黑色；SKU 4550002555658
- 公开价格：CNY 9.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/39400
- 采用规格：系列型号=8A63012；SKU=4550002555658；规格=细/黑色；所选款式=黑色
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=39400&provinceCd=31
- 所选SKU库存观察值：1（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：b9ea630e0a3067d6814ec4b35d7bb1f9cdb678b7bd8eae7902b128dd0a2a4298

### 2148 口袋自动铅笔
- 具体范围：半透明；0.5mm；SKU 4550723017046
- 公开价格：CNY 10.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/103620
- 采用规格：系列型号=NBI8CA6S；SKU=4550723017046；规格=0.5mm；所选款式=半透明
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=103620&provinceCd=31
- 所选SKU库存观察值：446（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：e44ada0d1b96402fb18d1edda21776e2f0a48b56a200576b0093c9b9e06b764d

### 2149 书写顺滑油性圆珠笔
- 具体范围：黑色；0.5mm；SKU 4550583768157
- 公开价格：CNY 10.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/101301
- 采用规格：系列型号=NBE01A3A；SKU=4550583768157；规格=0.5mm；所选款式=黑色
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=101301&provinceCd=31
- 所选SKU库存观察值：3（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：7237b764e544f28394355454f99149aa1c973e4b0b06028937cfa01a293152ba

### 2150 口袋彩色标记笔 笔帽式
- 具体范围：芥末黄；其他；SKU 4550583693510
- 公开价格：CNY 10.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/95700
- 采用规格：系列型号=NBG5CC4S；SKU=4550583693510；规格=其他；所选款式=芥末黄
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=95700&provinceCd=31
- 所选SKU库存观察值：1（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：bbccefdba225caf19563099b8652f527449c8b7d8c5b03c2d706d9b94e9c2a5f

### 2151 按压式口袋笔 凝胶中性墨水
- 具体范围：黑色；0.5mm；SKU 4550583693275
- 公开价格：CNY 10.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/94235
- 采用规格：系列型号=NBE1CC4S；SKU=4550583693275；规格=0.5mm；所选款式=黑色
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=94235&provinceCd=31
- 所选SKU库存观察值：1016（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：557e2258a61f2c8c1d7087cf0d09ac7a749e6fca71d0af757dfa2d5e26244625

### 2152 票夹/大
- 具体范围：银色；25mm/12个；SKU 4550344072912
- 公开价格：CNY 10.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/74755
- 采用规格：系列型号=ND16CC0A；SKU=4550344072912；规格=25mm/12个；所选款式=银色
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=74755&provinceCd=31
- 所选SKU库存观察值：11（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：590c6dbbb00262aabe7cfeb7aa2ff883c276cc407087c2c397ce44ad8e8e96c1

### 2153 卷笔刀
- 具体范围：其他；白；SKU 4548076369479
- 公开价格：CNY 10.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/6323
- 采用规格：系列型号=E3S3008；SKU=4548076369479；规格=白；所选款式=其他
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=6323&provinceCd=31
- 所选SKU库存观察值：1（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：be22caafce80e918dbc4002d017170bb35ac1ad150d3891c29d86cca300e122b

### 2154 聚丙烯 笔盒 横型
- 具体范围：深灰色；小 长170×宽51×高20 mm；SKU 4548076738879
- 公开价格：CNY 12.0；观察日2026-10-14。
- 来源：https://www.muji.com.cn/cn/store/commodity/107856
- 采用规格：系列型号=ND1MAA6S；SKU=4548076738879；规格=小 长170×宽51×高20 mm；所选款式=深灰色；材质=聚丙烯树脂
- 公开数据接口：https://www.muji.com.cn/cn/ecapi/maps/ec/commodity?id=107856&provinceCd=31
- 所选SKU库存观察值：44（只代表该地区当次返回，不承诺现货）。
- 原始JSON SHA-256：eaf0bb5685eed50a4eae54361cf6f2feb0d470990cddad3c216ee18de10ca789
