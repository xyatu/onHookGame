import { _decorator, Component, Node } from 'cc';
import { DamageComp } from './DamageComp';
import { RoleState } from './RoleState';
import { FrameAnimation } from './FrameAnimation';
import { RoleFSM, RoleStateType } from './RoleFSM';
import { RoleManager } from '../Manager/RoleManager';
import { GameManager } from '../Manager/GameManager';
import { BackpackManager } from '../Manager/BackpackManager';
const { ccclass, property } = _decorator;

@ccclass('RoleManagerComp')
export class RoleManagerComp extends Component {
    @property(DamageComp)
    damageComp: DamageComp = null;

    @property(RoleState)
    state: RoleState = null;

    @property(FrameAnimation)
    animPlayer: FrameAnimation = null;

    @property(RoleFSM)
    stateMachine: RoleFSM = null;

    gameStart() {
        this.stateMachine.gameStart();
        this.animPlayer.gameStart();
    }

    changeToAttack() {
        if (this.checkTargetLife(this.state.isPlayer)) this.stateMachine.changeState(RoleStateType.attack);
    }

    changeToIdle() {
        this.stateMachine.changeState(RoleStateType.idle);
    }

    changeToDeath() {
        this.stateMachine.changeState(RoleStateType.death);

        GameManager.inst.death(this.state.isPlayer);
    }

    checkTargetLife(isPlayer: boolean) {
        let target: RoleManagerComp = isPlayer ? RoleManager.inst.getEnemy() : RoleManager.inst.getPlayer();
        return target.stateMachine.stateType !== RoleStateType.death;
    }

    changeGold(gold: number) {
        BackpackManager.inst.onChangeGold(gold);
    }

}


