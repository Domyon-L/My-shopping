# 星空轮廓参考

2026-10-12：在外层入口及进入通道加入北斗七星、白羊座的星点与连线。中央搜索和通道消失点保持开放；手机调整两组图案的尺寸与位置。星群整体缓慢漂移，通道中按背景的放大比例移动；星点轻微明暗变化。

轮廓为自行编写的归一化装饰坐标，参考常见星图形状；未复用参考照片，也未按用户地点、日期或观测方向计算天球位置。星点大小为视觉层级，不表示精确星等。白羊座使用 41 Arietis、Hamal、Sheratan、Mesarthim 四个主要星点的折线。

参考资料：

- NASA APOD，The Big Dipper，2011-06-24：https://science.nasa.gov/image-article/apod-2011-june-24-the-big-dipper/ 。核对北斗七星斗勺结构与星名；照片未用于网站。
- IAU 星座星图，Aries：https://iauarchive.eso.org/static/public/constellations/pdf/ARI.pdf 。参考白羊座主要星点的相对轮廓。原星图署名为 IAU / Sky & Telescope。

实现文件：`dist/constellations.mjs`。由 `night-sky.mjs` 在极光层后绘制，同一函数供入口与通道使用。未增加页面文字注释或插入购物主页。
