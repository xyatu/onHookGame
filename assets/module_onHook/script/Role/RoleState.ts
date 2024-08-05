import { _decorator, Component, Label, log, Node, ProgressBar } from 'cc';
import { RoleProperty } from '../Manager/RoleManager';
import { Anim } from '../Structure/Anim';
import { RoleManagerComp } from './RoleManagerComp';
const { ccclass, property } = _decorator;

@ccclass('RoleState')
export class RoleState extends Component {

    @property
    isPlayer: boolean = false;
    @property(Label)
    currentHpUI: Label = null;
    @property(Label)
    maxHpUI: Label = null;
    @property(ProgressBar)
    hpBar: ProgressBar = null;

    isLife: boolean = false;

    private currentHp: number = 0;

    public idle: Anim = null;
    public attack: Anim[] = [];
    public move: Anim = null;

    public rate: number = 8;

    private cbOnHpChange: Function;
    public property: RoleProperty = null;

    protected onLoad(): void {
        this.cbOnHpChange = this.hpChange;
    }

    public onHpChange(changeVal: number) {
        if (this.cbOnHpChange) {
            this.cbOnHpChange(changeVal);
        }
    }

    public calcInterval(): number {
        let p: RoleProperty = this.property;
        return 1.5 - 1.5 * (p.quickness * (1 - p.quickness / (p.quickness + 100)) * 0.01);
    }

    private hpChange(changeVal: number) {
        if (-changeVal > this.currentHp) changeVal = -this.currentHp;

        this.currentHp += changeVal;

        if (!this.isPlayer) this.getComponent(RoleManagerComp).changeGold(-changeVal);
        if (this.currentHp <= 0) {
            this.currentHp = 0;
            this.getComponent(RoleManagerComp).changeToDeath();
            this.isLife = false;
        }

        this.currentHpUI.string = this.currentHp.toString();
        this.hpBar.progress = this.currentHp / this.property.hp;
    }

    resetState(roleProperty: RoleProperty, idle: Anim, attack1: Anim, attack2: Anim, attack3: Anim, move: Anim) {
        this.resetProperty(roleProperty);
        this.currentHp = this.property.hp;
        this.hpBar.progress = 1;
        this.maxHpUI.string = this.property.hp.toString();
        this.currentHpUI.string = this.currentHp.toString();

        this.idle = idle;
        this.attack = [];
        if (attack1) this.attack.push(attack1);
        if (attack2) this.attack.push(attack2);
        if (attack3) this.attack.push(attack3);
        this.move = move;

        this.rate = attack1.rate;
    }

    life() {
        this.isLife = true;
    }

    resetProperty(roleProperty: RoleProperty) {
        this.property = roleProperty;
        this.hpBar.progress = this.currentHp / this.property.hp;
    }
}