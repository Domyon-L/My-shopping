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
 'M5 3h14v18H5z M9 7h6 M9 11h6 M9 15h4',
 'M6 10h10l2 11H4z M9 10V4h7 M11 4V2 M7 15h8',
 'M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16 M12 7a5 5 0 1 0 0 10a5 5 0 1 0 0-10',
 'M8 4h8v3H8z M5 7h14v14H5z M9 7v14 M15 7v14',
 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z'
];
const typeIcons={'清洁纸品':11,'家居日用':4,'餐厨水具':12,'个护美妆':3,'服饰鞋包':1,'学习办公':10,'数码家电':0,'运动户外':9,'食品饮品':8,'出行工具':13,'玩具文娱':6,'健康用品':7};
export function shopIcon(type){return `<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="${SHOP_ICON_PATHS[typeIcons[type]??14]}"/></svg>`;}
