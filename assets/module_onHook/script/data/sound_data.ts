export var sound_data = {
    "10001": {"ID":10001,"name":"背景音乐","path":"BGM","volumn":0.12,"isBGM":1,"isLoop":1},
    "10002": {"ID":10002,"name":"穿上装备","path":"Put","volumn":0.5,"isBGM":0,"isLoop":0},
    "10003": {"ID":10003,"name":"点击按钮","path":"Click","volumn":0.5,"isBGM":0,"isLoop":0},
    "10004": {"ID":10004,"name":"英雄脚步声","path":"JiaoBu","volumn":0.5,"isBGM":0,"isLoop":1},
    "10005": {"ID":10005,"name":"售出","path":"Sell","volumn":0.5,"isBGM":0,"isLoop":0},
    "10006": {"ID":10006,"name":"强化","path":"Blacksmith","volumn":0.5,"isBGM":0,"isLoop":0},
    "10007": {"ID":10007,"name":"英雄攻击","path":"AttHero","volumn":0.5,"isBGM":0,"isLoop":0},
    "10008": {"ID":10008,"name":"大怪移动","path":"MoveBigMan","volumn":0.5,"isBGM":0,"isLoop":0},
    "10009": {"ID":10009,"name":"大怪攻击1","path":"AttBigMan","volumn":0.5,"isBGM":0,"isLoop":0},
    "10010": {"ID":10010,"name":"大怪攻击2","path":"AttBigMan2","volumn":0.5,"isBGM":0,"isLoop":0},
    "10011": {"ID":10011,"name":"史莱姆移动","path":"MoveSlime","volumn":0.5,"isBGM":0,"isLoop":0},
    "10012": {"ID":10012,"name":"史莱姆攻击1","path":"AttSlime","volumn":0.5,"isBGM":0,"isLoop":0},
    "10013": {"ID":10013,"name":"史莱姆攻击2","path":"AttSlime2","volumn":0.5,"isBGM":0,"isLoop":0},
    "10014": {"ID":10014,"name":"史莱姆攻击3","path":"AttSlime3","volumn":0.5,"isBGM":0,"isLoop":0},
    "10015": {"ID":10015,"name":"树妖攻击1","path":"AttTree","volumn":0.5,"isBGM":0,"isLoop":0},
    "10016": {"ID":10016,"name":"树妖攻击2","path":"AttTree2","volumn":0.5,"isBGM":0,"isLoop":0},
    "10017": {"ID":10017,"name":"树妖攻击3","path":"AttTree3","volumn":0.5,"isBGM":0,"isLoop":0},
    "10018": {"ID":10018,"name":"打造","path":"DaZao","volumn":0.5,"isBGM":0,"isLoop":0},
};
export function getsound_dataById(id) {
    return sound_data[id] || null;
}
