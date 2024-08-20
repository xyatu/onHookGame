import { AudioClip } from "cc";
import { tgxAudioMgr } from "../../../core_tgx/tgx";
import { DataGetter } from "../Util/DataGetter";
import { getsound_dataById } from "../data/sound_data";
import { Sound } from "../Structure/Anim";

class SoundManager {
    loopSound: AudioClip[] = [];
}

export function playSound(id: number) {
    let bgm: {} = getsound_dataById(id);

    tgxAudioMgr.inst.play(DataGetter.inst.getRes(AudioClip, bgm['path']), bgm['volumn'], bgm['isLoop']);
}

export function playOneShotById(id: number) {
    let audio: {} = getsound_dataById(id);

    tgxAudioMgr.inst.playOneShot(DataGetter.inst.getRes(AudioClip, audio['path']), audio['volumn']);
}

export function playOneShotBySound(sound: Sound) {
    tgxAudioMgr.inst.playOneShot(sound.sound, sound.volumn);
}