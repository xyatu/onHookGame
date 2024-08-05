import { _decorator, Animation, animation, color, Component, Node, Sprite } from 'cc';
import { DamageComp } from './DamageComp';
import { RoleState } from './RoleState';
import { FrameAnimation } from './FrameAnimation';
import { RoleFSM, RoleStateType } from './RoleFSM';
import { RoleManager } from '../Manager/RoleManager';
import { GameManager } from '../Manager/GameManager';
import { BackpackManager } from '../Manager/BackpackManager';
import { RoleBehavior } from './RoleBehavior';
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

    @property(Animation)
    deathAnim: Animation = null;

    gameStart() {
        this.stateMachine.gameStart();
        this.animPlayer.gameStart();
    }

    moveIn() {

        this.getComponent(RoleBehavior).moveTo();
    }

    changeToAttack() {
        if (this.checkTargetLife(this.state.isPlayer)) this.stateMachine.changeState(RoleStateType.attack);
    }

    changeToIdle() {
        this.stateMachine.changeState(RoleStateType.idle);
    }

    changeToMove() {
        this.stateMachine.changeState(RoleStateType.move);
    }

    changeToDeath() {
        this.deathAnim.play();

        this.stateMachine.changeState(RoleStateType.death);
    }

    checkTargetLife(isPlayer: boolean) {
        let target: RoleManagerComp = isPlayer ? RoleManager.inst.getEnemy() : RoleManager.inst.getPlayer();
        return target.state.isLife;
    }

    changeGold(gold: number) {
        BackpackManager.inst.onChangeGold(gold);
    }

}


