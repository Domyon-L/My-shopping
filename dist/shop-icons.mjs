export const SHOP_ICON_PATHS=[
 'M4 5h16v12H4z M8 21h8 M12 17v4',
 'M8 3 3 7l3 5 2-1v10h8V11l2 1 3-5-5-4-4 2z',
 'M3 16c5 0 8-2 11-8l4 3v4l3 2v3H3z',
 'M8 4h8v5l2 2v10H6V11l2-2z M9 14h6 M10 2h4',
 'M3 11 12 3l9 8 M5 9v12h14V9 M9 21v-7h6v7',
 'M4 6h16v14H4z M8 3h8v3 M4 10h16',
 'm12 3 9 5v10l-9 5-9-5V8z M3 8l9 5 9-5 M12 13v10',
 'M9 3h6v6h6v6h-6v6H9v-6H3V9h6z',
 'M7 3h10v3l2 3v12H5V9l2-3z M5 12h14',
 'M4 18 15 7 M2 16l4 4 M14 4l6 6 M16 2l6 6 M6 14l4 4',
 'M5 3h14v18H5z M9 7h6 M9 11h6 M9 15h4'
];
const types=['数码科技','服饰穿搭','鞋履配件','个护美妆','家居生活','生活精选','玩具潮玩','健康常备','食品饮品','运动户外','学习办公'];
export function shopIcon(type){return `<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="${SHOP_ICON_PATHS[Math.max(0,types.indexOf(type))]}"/></svg>`;}
