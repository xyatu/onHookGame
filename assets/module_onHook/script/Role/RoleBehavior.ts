import { _decorator, Component, log, Node, Sprite, tween, v3, Vec3 } from 'cc';
import { RoleState } from './RoleState';
import { RoleManager } from '../Manager/RoleManager';
import { DamageEvent } from './DamageEvent';
import { DamageComp } from './DamageComp';
import { FrameAnimation, FrameCallback } from './FrameAnimation';
import { RoleManagerComp } from './RoleManagerComp';
import { RoleFSM, RoleStateType } from './RoleFSM';
import { enemyPosAndSize } from '../data/GameConfig';
import { GameManager } from '../Manager/GameManager';
import { playOneShotById, playOneShotBySound } from '../Manager/SoundPlayer';
const { ccclass, property } = _decorator;

@ccclass('RoleBehavior')
export class RoleBehavior extends Component {

    @property(RoleState)
    roleState: RoleState = null;

    @property(Node)
    hpBar: Node = null;

    protected onLoad(): void {
        this.node.getChildByName('Sprite').getComponent(FrameAnimation).bindFrameCallback(new FrameCallback(4, this, this.attack));
    }

    attack(self: RoleBehavior) {
        if (self.getComponent(RoleFSM).stateType === RoleStateType.attack) {
            RoleManager.inst.attack(self.roleState.isPlayer);

            if (self.roleState.isPlayer) {
                playOneShotById(10007);
            }
            else {
                playOneShotBySound(self.node.getChildByName('Sprite').getComponent(FrameAnimation).currentAnim.sound);
            }

        }
    }

    move() {
        RoleManager.inst.resetPos(this.roleState.isPlayer);
        GameManager.inst.death(this.roleState.isPlayer);

        this.moveTo();
    }


    moveTo() {

        this.hpBar.active = false;

        this.getComponent(RoleManagerComp).changeToMove();
        this.node.getComponent(Sprite).color.set(255, 255, 255, 255);
        tween(this.node)
            .to(3, { position: v3(0, 0, this.node.position.z) })
            .call(() => {
                RoleManager.inst.reFight();

                this.hpBar.active = true;
                this.roleState.life();
                this.getComponent(RoleManagerComp).changeToIdle();
            })
            .start();
    }
}


