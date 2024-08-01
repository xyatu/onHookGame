export var sound_data = {
    "10001": {"ID":10001,"name":"音效","path":"put","volumn":1,"isBGM":0,"isLoop":0},
    "10002": {"ID":10002,"name":"背景音乐","path":"bdm1","volumn":1,"isBGM":1,"isLoop":1},
};
export function getsound_dataById(id) {
    return sound_data[id] || null;
}
