import { _decorator, Color, color, Component, instantiate, log, Node, NodePool, Prefab, RichText, Sprite, tween, TweenAction, v3 } from 'cc';
import { RoleState } from './RoleState';
import { DamageEvent } from './DamageEvent';
import { RoleProperty } from '../Manager/RoleManager';
import { BackpackManager } from '../Manager/BackpackManager';
import { calcCrit, calcHit, clacDamage, setColor, setOutline } from '../Util/GameUtil';
const { ccclass, property } = _decorator;

@ccclass('DamageComp')
export class DamageComp extends Component {

    @property(RoleState)
    roleState: RoleState = null;

    @property(Node)
    textEmit: Node = null;

    @property(Prefab)
    damageText: Prefab = null;

    textPool: NodePool = new NodePool();
    poolSize: number = 30;

    private put(node: Node) {
        if (this.textPool.size() > this.poolSize) return;
        this.textPool.put(node);
    }

    private get(): Node {
        let result: Node = this.textPool.get();
        if (!result) {
            result = instantiate(this.damageText);
        }

        return result;
    }

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
            let isCrit: boolean = false;
            log(`${this.roleState.isPlayer ? '你' : '怪物'}的最终暴击率为${crit}`);

            if (Math.random() < crit) {
                damageVal *= 2;
                log(`${this.roleState.isPlayer ? '你' : '怪物'}触发了暴击`);
                isCrit = true;
            }
            else {
                log(`${this.roleState.isPlayer ? '你' : '怪物'}没有触发暴击`);
                isCrit = false;
            }

            damageVal = Math.floor(damageVal);
            if (damageVal < 1) damageVal = 1;

            damageTarget.showDamageVal(false, true, damageVal);

        }
        else {
            log(`${this.roleState.isPlayer ? '你' : '怪物'}的攻击被闪避了`)
            damageTarget.showDamageVal(true);
            return;
        }

        damageTarget.takeDamage(damageEvent, damageVal, damageCauser);
    }

    private showDamageVal(isDosge: boolean, isCrit?: boolean, damageVal?: number,) {

        const damageText: Node = this.get();

        this.textEmit.addChild(damageText);

        const text: string = isDosge ? ` 闪避` : damageVal.toString();
        const textColor: string = isCrit ? `FF0000` : `FFFFFF`;

        damageText.getComponent(RichText).string =
            setOutline(setColor(text, textColor), `000000`, 2);

        const originalPosition = damageText.position.clone();
        const jumpHeight = 100; // 跳跃高度
        const jumpDuration = 0.5; // 跳跃时间

        tween(damageText)
            .to(jumpDuration / 2, { position: v3(originalPosition.x, originalPosition.y + jumpHeight, originalPosition.z) })
            .to(jumpDuration / 2, { position: v3(originalPosition.x, originalPosition.y, originalPosition.z) })
            .call(() => {
                this.put(damageText);
            })
            .start();
    }

    /**
     * 伤害接受事件
     * @param damageEvent 伤害附加事件
     * @param damageVal 伤害值
     * @param damageCauser 伤害来源
     */
    private takeDamage(damageEvent: DamageEvent, damageVal: number, damageCauser: DamageComp) {
        this.node.getChildByName('Sprite').getComponent(Sprite).color = Color.RED;
        this.schedule(() => this.node.getChildByName('Sprite').getComponent(Sprite).color = Color.WHITE, 0.2);
        this.roleState.onHpChange(-damageVal);
        log(`${this.roleState.isPlayer ? '怪物对你' : '你对怪物'}造成了${damageVal}点伤害`)
    }
}


