import { AudioClip, SpriteAtlas, SpriteFrame, log, math } from "cc";
import { GameConfig } from "../data/GameConfig";
import { Anim, AnimType, Sound } from "../Structure/Anim";
import { DataGetter } from "./DataGetter";
import { getsound_dataById } from "../data/sound_data";
import { StrengthenState } from "../Structure/Equipment";
import { enemy_data, getenemy_dataById } from "../data/enemy_data";
import { equipment_data } from "../data/equipment_data";

export function calcAttackSpeed(quickness: number) {
    return GameConfig.baseInterval - GameConfig.baseInterval * (quickness * (1 - quickness / (quickness + 100)) * 0.01);
}

export function calcCrit(crit: number, tenacity: number) {
    return crit / (crit + tenacity + 50);
}

export function clacDamage(attack: number, defense: number) {
    return attack * (1 - defense / (defense + 300));
}

export function calcHit(hit: number, dodge: number) {
    return hit / (hit + dodge);
}

export function generateAnim(data: {}, type: AnimType): Anim {

    let anim: Anim = new Anim();

    anim.type = type;
    anim.sound = generateSopund(getsound_dataById(data['sound'].toString()));
    anim.soundRate = data['soundRate'];
    anim.rate = data['rate'];
    anim.isLoop = data['loop'];
    anim.anim = slicing(data['plist'], data['anim']);

    return anim;
}

function slicing(plist: string, names: string): SpriteFrame[] {
    let spriteAtlas = DataGetter.inst.getRes<SpriteAtlas>(SpriteAtlas, plist);
    let anim: SpriteFrame[] = [];
    names.split(';').forEach(name => {
        anim.push(spriteAtlas.getSpriteFrame(name));
    })

    return anim;
}

export function generateSopund(data: {}): Sound {

    if (!data) return;

    let sound: Sound = new Sound();

    sound.sound = DataGetter.inst.getRes<AudioClip>(AudioClip, data['path']);
    sound.volumn = data['volumn'];
    sound.isBGM = data['isBGM'];
    sound.isLoop = data['isLoop'];

    return sound;
}

export function setColor(str: string, color: string): string {
    return `<color = ${color}>${str}</color>`;
}

export function setOutline(str: string, color: string, width: number): string {
    return `<outline color = ${color} width = ${width}>${str}</outline>`;
}

export function stregnthenStateToString(state: StrengthenState): string {
    switch (state) {
        case StrengthenState.success:
            return '成功';
            break;
        case StrengthenState.field:
            return '失败';
            break;
        case StrengthenState.reduce:
            return '降级';
            break;
        case StrengthenState.break:
            return '损坏';
            break;
    }
}

// 创建累加权重数组
const cumulativeWeights: { quality: number, cumulativeWeight: number }[] = [];
let cumulativeSum = 0;
for (const [quality, weight] of Object.entries(GameConfig.qualityWeight)) {
    cumulativeSum += weight;
    cumulativeWeights.push({ quality: Number(quality), cumulativeWeight: cumulativeSum });
}

export function getRandomQuality() {
    const totalWeight = cumulativeWeights[cumulativeWeights.length - 1].cumulativeWeight;
    const randomNum = Math.random() * totalWeight;

    // 使用二分查找找到相应的质量
    let low = 0;
    let high = cumulativeWeights.length - 1;
    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        if (randomNum < cumulativeWeights[mid].cumulativeWeight) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }

    return cumulativeWeights[low].quality;
}
export function generateEquipment() {
    const quality = getRandomQuality();

    let allData: {}[] = Object.values(equipment_data).filter(data => data.quality === quality);
    // 根据质量生成装备的逻辑
    return allData[math.randomRangeInt(0, allData.length)];
}


export function getenemy_dataByIndex(index) {
    let keys: string[] = Object.keys(enemy_data);
    return getenemy_dataById(keys[index]);
}