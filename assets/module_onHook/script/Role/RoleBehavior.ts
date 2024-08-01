import { _decorator, Component, log, Node } from 'cc';
import { RoleState } from './RoleState';
import { RoleManager } from '../Manager/RoleManager';
import { DamageEvent } from './DamageEvent';
import { DamageComp } from './DamageComp';
import { FrameAnimation, FrameCallback } from './FrameAnimation';
const { ccclass, property } = _decorator;

@ccclass('RoleBehavior')
export class RoleBehavior extends Component {

    @property(RoleState)
    roleState: RoleState = null;

    protected onLoad(): void {
        this.getComponent(FrameAnimation).bindFrameCallback(new FrameCallback(7, this, this.attack));
    }

    attack(self: RoleBehavior) {
        RoleManager.inst.attack(self.roleState.isPlayer)
    }
}


