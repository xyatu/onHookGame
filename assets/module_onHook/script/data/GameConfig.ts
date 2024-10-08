import { size, v3 } from "cc";

export class GameConfig {
    public static qualityWeight = {
        1: 512,
        2: 128,
        3: 32,
        4: 8,
        5: 1,
    };

    public static backpackSize: number = 32;

    public static baseInterval = 1.5;//seconds
    public static baseRate = 8;

    public static resetDataTime: number = 3;

    public static createPrice: number = 1000;

    public static qualityPriceCrit: number[] = [1, 2, 4, 8, 20]

    public static fightingColor: string = 'ed9367';
    public static goldColor: string = 'c7a98a';
    public static outlineColor: string = '000000';
    public static fightingOutlineWidth: number = 2;
    public static goldOutlineWidth: number = 2;
}

export const enemyPosAndSize = [
    { pos: v3(0, 0, 0), size: size(800, 440) },
    { pos: v3(200, 25, 0), size: size(900, 500) },
    { pos: v3(-100, 10, 0), size: size(1000, 1600) },
]

