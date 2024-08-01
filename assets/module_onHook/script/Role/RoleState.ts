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

    private currentHp: number = 0;

    public idle: Anim = null;
    public attack: Anim = null;
    public death: Anim = null;

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
        }

        this.currentHpUI.string = this.currentHp.toString();
        this.hpBar.progress = this.currentHp / this.property.hp;
    }

    resetState(roleProperty: RoleProperty, idle: Anim, attack: Anim, death: Anim) {
        this.resetProperty(roleProperty);
        this.currentHp = this.property.hp;
        this.hpBar.progress = 1;
        this.maxHpUI.string = this.property.hp.toString();
        this.currentHpUI.string = this.currentHp.toString();

        this.idle = idle;
        this.attack = attack;
        this.death = death;

        this.rate = attack.rate;
    }

    resetProperty(roleProperty: RoleProperty) {
        this.property = roleProperty;
        this.hpBar.progress = this.currentHp / this.property.hp;
    }
}