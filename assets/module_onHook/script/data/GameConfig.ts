export class GameConfig {
    public static backpackSize: number = 32 + 6;

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