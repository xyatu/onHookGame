import { _decorator, Component, log, math, Node } from 'cc';
import { RoleState } from './RoleState';
import { FrameAnimation } from './FrameAnimation';
import { calcAttackSpeed } from '../Util/GameUtil';
import { playOneShotById, playOneShotBySound } from '../Manager/SoundPlayer';
const { ccclass, property } = _decorator;

export enum RoleStateType {
    idle,
    attack,
    death,
    move,
}

@ccclass('RoleFSM')
export class RoleFSM extends Component {
    stateType: RoleStateType = null;

    @property(RoleState)
    state: RoleState = null;

    @property(FrameAnimation)
    animPlayer: FrameAnimation = null;

    public gameStart() {
        this.changeState(RoleStateType.idle);
    }

    public changeState(stateType: RoleStateType) {

        this.stateType = stateType;

        this.unschedule(this.playPlayerMoveSound);
        this.unschedule(this.playEnemyMoveSound);
        
        switch (this.stateType) {
            case RoleStateType.idle:
                this.animPlayer.anim = this.state.idle;
                let intervalTick: number = calcAttackSpeed(this.state.property.quickness);
                if (intervalTick < 0.1) intervalTick = 0.1;
                this.animPlayer.enterInterval(intervalTick);

                break;
            case RoleStateType.attack:
                let index: number = math.randomRangeInt(0, this.state.attack.length);
                this.animPlayer.anim = this.state.attack[index];
                let rate: number = this.state.attack[index].rate + Math.floor((this.state.property.quickness - 1400) / 500);
                if (rate > this.state.attack[index].rate) rate = this.state.attack[index].rate * 2;
                this.animPlayer.outInterval(rate);
                break;
            case RoleStateType.move:
                this.animPlayer.anim = this.state.move;
                if (this.state.isPlayer) this.schedule(this.playPlayerMoveSound, 0.25);
                else this.schedule(this.playEnemyMoveSound, this.state.move.sound.sound.getDuration() + 0.1);
                break;
            case RoleStateType.death:
                this.animPlayer.death();
                return;
        }

        this.animPlayer.Play();
    }

    playPlayerMoveSound() {
        playOneShotById(10004);
    }

    playEnemyMoveSound() {
        playOneShotBySound(this.state.move.sound);
    }
}


