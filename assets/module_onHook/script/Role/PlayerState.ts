import { _decorator, Component, Node, size, Sprite, SpriteFrame, UITransform, v3 } from 'cc';
import { RoleState } from './RoleState';
import { RoleProperty } from '../Manager/RoleManager';
import { Anim, AnimType } from '../Structure/Anim';
import { generateSopund } from '../Util/GameUtil';
import { getsound_dataById } from '../data/sound_data';
import { FrameAnimation, FrameCallback } from './FrameAnimation';
const { ccclass, property } = _decorator;

@ccclass('PlayerState')
export class PlayerState extends Component {
    @property(SpriteFrame)
    moveSpriteFrames: SpriteFrame[] = [];
    moveSoundId: number = 0;
    moveSoundRate: number = 0;
    moveRate: number = 8;
    moveLoop: boolean = true;

    @property(SpriteFrame)
    attackSpriteFrames: SpriteFrame[] = [];
    attackSoundId: number = 0;
    attackSoundRate: number = 0;
    attackRate: number = 8;
    attackLoop: boolean = true;

    @property(SpriteFrame)
    idleSpriteFrames: SpriteFrame[] = [];
    idleSoundId: number = 0;
    idleSoundRate: number = 0;
    idleRate: number = 8;
    idleLoop: boolean = true;

    @property(Node)
    weapon: Node = null;

    @property(Node)
    attackEff: Node = null;
    @property(SpriteFrame)
    effSpriteFrames: SpriteFrame[] = [];

    @property(Sprite)
    hand: Sprite = null;


    @property(FrameAnimation)
    animPlayer: FrameAnimation = null;

    @property(SpriteFrame)
    idlehand: SpriteFrame[] = [];
    @property(SpriteFrame)
    movehand: SpriteFrame[] = [];

    attackWeapon = [
        { pos: v3(79, 157, 0), rot: v3(180, 180, 6) },
        { pos: v3(75, 160, 0), rot: v3(180, 180, 6) },
        { pos: v3(386, 256, 0), rot: v3(180, 180, 142) },
        { pos: v3(348, 38, 0), rot: v3(180, 180, 253) },
        { pos: v3(346, 44, 0), rot: v3(180, 180, 262) },
    ]

    idleWeapon = [
        { pos: v3(244, 98, 0), rot: v3(0, 0, -39) },
        { pos: v3(244, 102, 0), rot: v3(0, 0, -39) },
        { pos: v3(238, 102, 0), rot: v3(0, 0, -39) },
        { pos: v3(238, 98, 0), rot: v3(0, 0, -39) },
    ]

    moveWeapon = [
        { pos: v3(244, 98, 0), rot: v3(0, 0, -39) },
        { pos: v3(244, 108, 0), rot: v3(0, 0, -39) },
        { pos: v3(237, 103, 0), rot: v3(0, 0, -39) },
        { pos: v3(242, 98, 0), rot: v3(0, 0, -39) },
        { pos: v3(251, 108, 0), rot: v3(0, 0, -39) },
        { pos: v3(251, 102, 0), rot: v3(0, 0, -39) },
    ]

    attackEffList = [
        { pos: v3(-237, 324, 0), rot: v3(0, 0, 0), size: size(434, 286) },
        { pos: v3(42, 338, 0), rot: v3(0, 0, 0), size: size(350, 470) },
        { pos: v3(60, 190, 0), rot: v3(0, 0, 0), size: size(240, 150) },
    ]

    moveAnim: Anim = null;
    attackAnim: Anim = null;
    idleAnim: Anim = null;

    protected onLoad(): void {
        this.animPlayer.registAllFrameCallback(this, this.weaponMove);
    }

    weaponMove(self: PlayerState, index: number) {
        self.weapon.active = true;
        self.attackEff.active = false;
        if (self.animPlayer.isAttack()) {
            self.hand.enabled = false;
            self.weapon.setSiblingIndex(0);
            if (index >= 0 && index < self.attackWeapon.length) {
                self.weapon.setPosition(self.attackWeapon[index].pos);
                self.weapon.setRotationFromEuler(self.attackWeapon[index].rot)
                if (index >= 2) {
                    self.attackEff.active = true;
                    self.attackEff.getComponent(Sprite).spriteFrame = self.effSpriteFrames[index - 2];
                    self.attackEff.setPosition(self.attackEffList[index - 2].pos);
                    self.attackEff.setRotationFromEuler(self.attackEffList[index - 2].rot);
                    self.attackEff.getComponent(UITransform).setContentSize(self.attackEffList[index - 2].size);
                }
                else {
                    self.attackEff.active = false;
                }
                return;
            }
        }
        else if (self.animPlayer.isIdle()) {
            if (index >= 0 && index < self.idleWeapon.length) {
                self.hand.enabled = true;
                self.weapon.setSiblingIndex(1);
                self.weapon.setPosition(self.idleWeapon[index].pos);
                self.weapon.setRotationFromEuler(self.idleWeapon[index].rot)
                self.hand.spriteFrame = self.idlehand[index];
                return;
            }
        } else if (self.animPlayer.isMove()) {
            if (index >= 0 && index < self.moveWeapon.length) {
                self.hand.enabled = true;
                self.weapon.setSiblingIndex(1);
                self.weapon.setPosition(self.moveWeapon[index].pos);
                self.weapon.setRotationFromEuler(self.moveWeapon[index].rot)
                self.hand.spriteFrame = self.movehand[index];
                return;
            }
        }
    }

    private generateAnim(type: AnimType, soundId: number, soundRate: number, rate: number, isLoop: boolean, spriteFrames: SpriteFrame[]): Anim {
        let result: Anim = new Anim();
        result.type = type;
        result.sound = generateSopund(getsound_dataById(soundId));
        result.soundRate = soundRate;
        result.rate = rate;
        result.isLoop = isLoop;
        result.anim = spriteFrames;
        return result;
    }

    public resetState(roleProperty: RoleProperty) {
        this.moveAnim = this.generateAnim(AnimType.move, this.moveSoundId, this.moveSoundRate, this.moveRate, this.moveLoop, this.moveSpriteFrames);
        this.idleAnim = this.generateAnim(AnimType.idle, this.idleSoundId, this.idleSoundRate, this.idleRate, this.idleLoop, this.idleSpriteFrames);
        this.attackAnim = this.generateAnim(AnimType.attack, this.attackSoundId, this.attackSoundRate, this.attackRate, this.attackLoop, this.attackSpriteFrames);
        let rs: RoleState = this.getComponent(RoleState);
        rs.resetState(roleProperty, this.idleAnim, this.attackAnim, null, null, this.moveAnim);
    }
}