import { math } from "cc";
import { equipment_data, getequipment_dataById } from "./equipment_data";

export var strengthen_data = {
    "1": { "level": 1, "val": 0.1, "successRate": 1, "weapon": 500, "shield": 200, "helmet": 300, "armor": 400, "earrings": 300, "rings": 400 },
    "2": { "level": 2, "val": 0.31, "successRate": 1, "weapon": 1390, "shield": 560, "helmet": 840, "armor": 1120, "earrings": 840, "rings": 1120 },
    "3": { "level": 3, "val": 0.78, "successRate": 1, "weapon": 3120, "shield": 1250, "helmet": 1880, "armor": 2500, "earrings": 1880, "rings": 2500 },
    "4": { "level": 4, "val": 1.63, "successRate": 0.95, "weapon": 5700, "shield": 2280, "helmet": 3400, "armor": 4580, "earrings": 3400, "rings": 4580 },
    "5": { "level": 5, "val": 2.98, "successRate": 0.85, "weapon": 8940, "shield": 3570, "helmet": 5360, "armor": 7150, "earrings": 5360, "rings": 7150 },
    "6": { "level": 6, "val": 4.95, "successRate": 0.7, "weapon": 12370, "shield": 4950, "helmet": 7420, "armor": 9900, "earrings": 7420, "rings": 9900 },
    "7": { "level": 7, "val": 7.66, "successRate": 0.6, "weapon": 19150, "shield": 7660, "helmet": 11490, "armor": 15320, "earrings": 11490, "rings": 15320 },
    "8": { "level": 8, "val": 11.23, "successRate": 0.5, "weapon": 28070, "shield": 11230, "helmet": 16840, "armor": 22460, "earrings": 16840, "rings": 22460 },
    "9": { "level": 9, "val": 15.78, "successRate": 0.4, "weapon": 39450, "shield": 15780, "helmet": 23670, "armor": 31560, "earrings": 23670, "rings": 31560 },
    "10": { "level": 10, "val": 21.43, "successRate": 0.35, "weapon": 64290, "shield": 25720, "helmet": 38570, "armor": 51430, "earrings": 38570, "rings": 51430 },
    "11": { "level": 11, "val": 28.3, "successRate": 0.3, "weapon": 99050, "shield": 39620, "helmet": 59430, "armor": 79240, "earrings": 59430, "rings": 79240 },
    "12": { "level": 12, "val": 36.51, "successRate": 0.25, "weapon": 146040, "shield": 58410, "helmet": 87620, "armor": 116830, "earrings": 87620, "rings": 116830 },
    "13": { "level": 13, "val": 46.18, "successRate": 0.2, "weapon": 207810, "shield": 83120, "helmet": 124680, "armor": 166240, "earrings": 124680, "rings": 166240 },
    "14": { "level": 14, "val": 57.43, "successRate": 0.18, "weapon": 287150, "shield": 114860, "helmet": 172290, "armor": 229720, "earrings": 172290, "rings": 229720 },
    "15": { "level": 15, "val": 70.38, "successRate": 0.15, "weapon": 404680, "shield": 161800, "helmet": 242800, "armor": 323700, "earrings": 242800, "rings": 323700 },
    "16": { "level": 16, "val": 85.15, "successRate": 0.13, "weapon": 553470, "shield": 221390, "helmet": 332080, "armor": 442780, "earrings": 332080, "rings": 442780 },
    "17": { "level": 17, "val": 101.86, "successRate": 0.11, "weapon": 763950, "shield": 305580, "helmet": 458370, "armor": 611160, "earrings": 458370, "rings": 611160 },
    "18": { "level": 18, "val": 120.63, "successRate": 0.08, "weapon": 1145980, "shield": 458390, "helmet": 687590, "armor": 916700, "earrings": 687590, "rings": 916700 },
    "19": { "level": 19, "val": 141.58, "successRate": 0.06, "weapon": 1769750, "shield": 707900, "helmet": 1061850, "armor": 1415800, "earrings": 1061850, "rings": 1415800 },
    "20": { "level": 20, "val": 164.83, "successRate": 0.04, "weapon": 2472450, "shield": 988980, "helmet": 1483470, "armor": 1977960, "earrings": 1483470, "rings": 1977960 },
};
export function getstrengthen_dataById(id) {
    return strengthen_data[id] || null;
}

export function getRandomEquipment() {
    let keys: string[] = Object.keys(equipment_data);
    let random: number = math.randomRangeInt(0, keys.length);
    return getequipment_dataById(keys[random]);
}
