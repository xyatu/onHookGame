import { AudioClip, SpriteFrame } from "cc";

export enum AnimType {
    idle,
    attack,
    death,
}

export class Sound {
    sound: AudioClip = null;
    isBGM: boolean = false;
    isLoop: boolean = false;
    volumn: number = 0;
}

export class Anim {
    type: AnimType = AnimType.idle;
    sound: Sound = new Sound();
    soundRate: number = 0;
    rate: number = 0;
    isLoop: boolean = false;
    anim: SpriteFrame[] = [];
}