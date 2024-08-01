import { _decorator, Component, log, Node, tween, TweenAction } from 'cc';
import { RoleState } from './RoleState';
import { DamageEvent } from './DamageEvent';
import { RoleProperty } from '../Manager/RoleManager';
import { BackpackManager } from '../Manager/BackpackManager';
import { calcCrit, calcHit, clacDamage } from '../Util/GameUtil';
const { ccclass, property } = _decorator;

@ccclass('DamageComp')
export class DamageComp extends Component {

    @property(RoleState)
    roleState: RoleState = null;

    /**
     * 伤害施加
     * @param damageTarget 伤害目标
     * @param damageEvent 伤害附加事件
     * @param damageCauser 伤害来源
     */
    applyDamage(damageTarget: DamageComp, damageEvent: DamageEvent, damageCauser: DamageComp) {
        let damageVal: number = 0;  //HOOK 伤害计算

        //目标属性
        let tp: RoleProperty = damageTarget.roleState.property;
        //自身属性
        let cp: RoleProperty = damageCauser.roleState.property;
        let hit: number = calcHit(cp.hit, tp.dodge);
        log(`${this.roleState.isPlayer ? '你' : '怪物'}的最终命中率为${hit}`);
        if (Math.random() < hit) {

            damageVal = clacDamage(cp.attack, tp.defense);

            let crit: number = calcCrit(cp.crit, tp.tenacity);
            log(`${this.roleState.isPlayer ? '你' : '怪物'}的最终暴击率为${crit}`);

            if (Math.random() < crit) {
                damageVal *= 2;
                log(`${this.roleState.isPlayer ? '你' : '怪物'}触发了暴击`);
            }
            else {
                log(`${this.roleState.isPlayer ? '你' : '怪物'}没有触发暴击`);
            }

            damageVal = Math.floor(damageVal);
            if (damageVal < 1) damageVal = 1;

        }
        else {
            log(`${this.roleState.isPlayer ? '你' : '怪物'}的攻击被闪避了`)
            return;
        }

        damageTarget.takeDamage(damageEvent, damageVal, damageCauser);
    }

    /**
     * 伤害接受事件
     * @param damageEvent 伤害附加事件
     * @param damageVal 伤害值
     * @param damageCauser 伤害来源
     */
    private takeDamage(damageEvent: DamageEvent, damageVal: number, damageCauser: DamageComp) {
        this.roleState.onHpChange(-damageVal);        
        log(`${this.roleState.isPlayer ? '怪物对你' : '你对怪物'}造成了${damageVal}点伤害`)
    }
}


