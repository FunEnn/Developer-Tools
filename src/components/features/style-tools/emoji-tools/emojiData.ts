interface EmojiItem {
  char: string;
  description: string;
}

export interface EmojiCategory {
  name: string;
  emojis: EmojiItem[];
}

export const emojiData: EmojiCategory[] = [
  {
    name: "表情",
    emojis: [
      { char: "😀", description: "笑脸" },
      { char: "😂", description: "大笑" },
      { char: "😄", description: "开心" },
      { char: "😁", description: "露齿笑" },
      { char: "😆", description: "眯眼笑" },
      { char: "😅", description: "尴尬笑" },
      { char: "😂", description: "笑哭" },
      { char: "🤣", description: "笑倒" },
      { char: "🥲", description: "带泪微笑" },
      { char: "☺️", description: "含蓄笑" },
      { char: "😊", description: "害羞" },
      { char: "😇", description: "天使" },
      { char: "🙂", description: "微笑" },
      { char: "🙃", description: "倒脸" },
      { char: "😉", description: "眨眼" },
      { char: "😌", description: "放松" },
      { char: "😍", description: "爱心眼" },
      { char: "🥰", description: "幸福" },
      { char: "😘", description: "飞吻" },
      { char: "😗", description: "亲亲" },
      { char: "😟", description: "担心" },
      { char: "😕", description: "困惑" },
      { char: "🙁", description: "不高兴" },
      { char: "☹️", description: "难过" },
      { char: "😮", description: "惊讶" },
      { char: "😯", description: "吃惊" },
      { char: "😲", description: "震惊" },
      { char: "😳", description: "脸红" },
      { char: "🥺", description: "求你了" },
      { char: "😦", description: "皱眉" },
      { char: "😨", description: "害怕" },
      { char: "😰", description: "焦虑" },
      { char: "😥", description: "失望" },
      { char: "😢", description: "哭泣" },
      { char: "😭", description: "大哭" },
      { char: "😱", description: "尖叫" },
      { char: "😖", description: "烦恼" },
      { char: "😣", description: "忍耐" },
      { char: "😞", description: "沮丧" },
      { char: "😓", description: "汗" },
      { char: "🤤", description: "流口水" },
      { char: "😴", description: "睡觉" },
      { char: "😷", description: "生病" },
      { char: "🤒", description: "发烧" },
      { char: "🤕", description: "受伤" },
      { char: "🤢", description: "恶心" },
      { char: "🤮", description: "呕吐" },
      { char: "🤧", description: "打喷嚏" },
      { char: "🥵", description: "热" },
      { char: "🥶", description: "冷" },
      { char: "🤪", description: "疯狂" },
      { char: "🤓", description: "书呆子" },
      { char: "🧐", description: "单片眼镜" },
      { char: "🤠", description: "牛仔" },
      { char: "🥳", description: "派对" },
      { char: "🥸", description: "伪装" },
      { char: "😎", description: "墨镜" },
      { char: "🤡", description: "小丑" },
      { char: "👻", description: "幽灵" },
      { char: "👽", description: "外星人" }
    ],
  },
  {
    name: "动物",
    emojis: [
      { char: "🐶", description: "狗" },
      { char: "🐱", description: "猫" },
      { char: "🐭", description: "老鼠" },
      { char: "🐹", description: "仓鼠" },
      { char: "🐰", description: "兔子" },
      { char: "🦊", description: "狐狸" },
      { char: "🐻", description: "熊" },
      { char: "🐼", description: "熊猫" },
      { char: "🐨", description: "考拉" },
      { char: "🐯", description: "老虎" },
      { char: "🦁", description: "狮子" },
      { char: "🐮", description: "牛" },
      { char: "🐷", description: "猪" },
      { char: "🐸", description: "青蛙" },
      { char: "🐵", description: "猴子" },
      { char: "🐔", description: "鸡" },
    ],
  },
  {
    name: "食物",
    emojis: [
      { char: "🍎", description: "苹果" },
      { char: "🍐", description: "梨" },
      { char: "🍊", description: "橘子" },
      { char: "🍋", description: "柠檬" },
      { char: "🍌", description: "香蕉" },
      { char: "🍉", description: "西瓜" },
      { char: "🍇", description: "葡萄" },
      { char: "🍓", description: "草莓" },
      { char: "🫐", description: "蓝莓" },
      { char: "🍈", description: "哈密瓜" },
      { char: "🍒", description: "樱桃" },
      { char: "🍑", description: "桃子" },
      { char: "🥭", description: "芒果" },
      { char: "🍍", description: "菠萝" },
      { char: "🥥", description: "椰子" },
      { char: "🥝", description: "猕猴桃" },
    ],
  },
  {
    name: "心形",
    emojis: [
      { char: "❤️", description: "红心" },
      { char: "🧡", description: "橙心" },
      { char: "💛", description: "黄心" },
      { char: "💚", description: "绿心" },
      { char: "💙", description: "蓝心" },
      { char: "💜", description: "紫心" },
      { char: "🖤", description: "黑心" },
      { char: "🤍", description: "白心" },
      { char: "🤎", description: "棕心" },
      { char: "💔", description: "碎心" },
      { char: "❤️‍🔥", description: "燃烧的心" },
      { char: "❤️‍🩹", description: "包扎的心" },
      { char: "💖", description: "闪亮的心" },
      { char: "💗", description: "跳动的心" },
      { char: "💓", description: "心跳" },
      { char: "💞", description: "旋转的心" },
    ],
  },
  {
    name: "手势",
    emojis: [
      { char: "👍", description: "赞" },
      { char: "👎", description: "踩" },
      { char: "👌", description: "OK" },
      { char: "✌️", description: "胜利" },
      { char: "🤞", description: "幸运" },
      { char: "🤟", description: "我爱你" },
      { char: "🤘", description: "摇滚" },
      { char: "👊", description: "拳头" },
      { char: "🤛", description: "左拳" },
      { char: "🤜", description: "右拳" },
      { char: "👋", description: "挥手" },
      { char: "🤚", description: "手掌" },
      { char: "🖐️", description: "五指" },
      { char: "✋", description: "举手" },
      { char: "🖖", description: "瓦肯" },
      { char: "👏", description: "鼓掌" },
      { char: "🙌", description: "举双手" },
      { char: "👐", description: "张开双手" },
      { char: "🤲", description: "合掌" },
      { char: "🤝", description: "握手" },
      { char: "🙏", description: "祈祷" },
      { char: "✍️", description: "写字" },
      { char: "💪", description: "加油" },
      { char: "🦾", description: "机械臂" },
      { char: "🖕", description: "中指" },
      { char: "💅", description: "美甲" },
      { char: "🤳", description: "自拍" },
      { char: "🤌", description: "意大利手势" },
      { char: "🤏", description: "捏" },
      { char: "👈", description: "左指" },
      { char: "👉", description: "右指" },
      { char: "👆", description: "上指" },
      { char: "👇", description: "下指" },
      { char: "☝️", description: "食指" },
      { char: "🫰", description: "捏手指" },
      { char: "🫲", description: "左手" },
      { char: "🫱", description: "右手" },
      { char: "🫳", description: "手掌向下" },
      { char: "🫴", description: "手掌向上" },
      { char: "🫵", description: "指向你" },
      { char: "🫶", description: "比心" },
      { char: "🤙", description: "打电话" },
      { char: "🫸", description: "推" },
      { char: "🫷", description: "拉" },
      { char: "👋🏻", description: "白皮肤挥手" },
      { char: "👋🏼", description: "中浅皮肤挥手" },
      { char: "👋🏽", description: "中等皮肤挥手" },
      { char: "👋🏾", description: "中深皮肤挥手" },
      { char: "👋🏿", description: "深色皮肤挥手" }
    ]
  },
  {
    name: "自然",
    emojis: [
      { char: "🌸", description: "樱花" },
      { char: "💮", description: "白花" },
      { char: "🏵️", description: "玫瑰花" },
      { char: "🌹", description: "红玫瑰" },
      { char: "🥀", description: "枯萎的花" },
      { char: "🌺", description: "芙蓉" },
      { char: "🌻", description: "向日葵" },
      { char: "🌼", description: "雏菊" },
      { char: "🌷", description: "郁金香" },
      { char: "🌱", description: "幼苗" },
      { char: "🪴", description: "盆栽" },
      { char: "🌲", description: "常青树" },
      { char: "🌳", description: "落叶树" },
      { char: "🌴", description: "棕榈树" },
      { char: "🌵", description: "仙人掌" },
      { char: "🌿", description: "草药" },
    ],
  },
  {
    name: "天气",
    emojis: [
      { char: "☀️", description: "太阳" },
      { char: "🌤️", description: "晴间多云" },
      { char: "⛅", description: "多云" },
      { char: "🌥️", description: "阴天" },
      { char: "☁️", description: "云" },
      { char: "🌦️", description: "阵雨" },
      { char: "🌧️", description: "雨" },
      { char: "⛈️", description: "雷雨" },
      { char: "🌩️", description: "闪电" },
      { char: "🌨️", description: "雪" },
      { char: "⭐", description: "星星" },
      { char: "🌟", description: "闪星" },
      { char: "✨", description: "闪烁" },
      { char: "⚡", description: "闪电" },
      { char: "🌈", description: "彩虹" },
      { char: "🌪️", description: "龙卷风" },
    ],
  },
  {
    name: "物品",
    emojis: [
      { char: "💡", description: "灯泡" },
      { char: "🔦", description: "手电筒" },
      { char: "🕯️", description: "蜡烛" },
      { char: "📱", description: "手机" },
      { char: "💻", description: "笔记本" },
      { char: "⌨️", description: "键盘" },
      { char: "🖥️", description: "台式机" },
      { char: "🖨️", description: "打印机" },
      { char: "🖱️", description: "鼠标" },
      { char: "💽", description: "光盘" },
      { char: "💾", description: "软盘" },
      { char: "💿", description: "CD" },
      { char: "📀", description: "DVD" },
      { char: "🎮", description: "游戏手柄" },
      { char: "🕹️", description: "游戏摇杆" },
      { char: "🎲", description: "骰子" },
    ],
  },
];

// 获取所有表情
export const getAllEmojis = (): EmojiItem[] => {
  return emojiData.flatMap((category) => category.emojis);
};

// 根据分类获取表情
export const getEmojisByCategory = (categoryName: string): EmojiItem[] => {
  return (
    emojiData.find((category) => category.name === categoryName)?.emojis || []
  );
};

// 搜索表情
export const searchEmojis = (searchTerm: string): EmojiItem[] => {
  return getAllEmojis().filter(
    (emoji) =>
      emoji.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emoji.char.includes(searchTerm)
  );
};

// 获取所有分类名称
export const getAllCategories = (): string[] => {
  return emojiData.map((category) => category.name);
};
