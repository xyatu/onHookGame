import { _decorator, Component, log, Node } from 'cc';
import { RoleState } from './RoleState';
import { FrameAnimation } from './FrameAnimation';
import { calcAttackSpeed } from '../Util/GameUtil';
const { ccclass, property } = _decorator;

export enum RoleStateType {
    idle,
    attack,
    death,
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

        switch (this.stateType) {
            case RoleStateType.idle:
                this.animPlayer.anim = this.state.idle;
                let intervalTick: number = calcAttackSpeed(this.state.property.quickness);
                if (intervalTick < 0.1) intervalTick = 0.1;
                this.animPlayer.enterInterval(intervalTick);

                break;
            case RoleStateType.attack:
                this.animPlayer.anim = this.state.attack;
                let rate: number = this.state.attack.rate + Math.floor((this.state.property.quickness - 1400) / 500);
                this.animPlayer.outInterval(rate)
                break;
            case RoleStateType.death:
                this.animPlayer.anim = this.state.death;
                break;
        }

        this.animPlayer.Play();
    }
}


