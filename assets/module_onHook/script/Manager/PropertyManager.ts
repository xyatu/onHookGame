import { _decorator, Component, Label, log, Node, RichText } from 'cc';
import { EventManager } from './EventManager';
import { Equipment } from '../Structure/Equipment';
import { PropertyComp } from '../Component/PropertyComp';
import { setColor, setOutline } from '../Util/GameUtil';
import { GameConfig } from '../data/GameConfig';
import { RoleManager } from './RoleManager';
const { ccclass, property } = _decorator;

export class PlayerProperty {
    attack: number = 10;
    quickness: number = 300;
    hit: number = 10;
    crit: number = 10;
    defense: number = 1;
    hp: number = 1000;
    dodge: number = 10;
    tenacity: number = 1;
    attackSpeed: number = 0;
    fighting: number = 0;
    gold: number = 10000000000;

    equipments: Set<Equipment> = new Set<Equipment>();

    addProperty(equpment: Equipment, isAdd: boolean) {
        if (isAdd) {
            this.equipments.add(equpment);
        }
        else {
            this.equipments.delete(equpment);
        }
        this.resetProperty();
    }

    resetProperty() {
        this.attack = 10;
        this.quickness = 300;
        this.hit = 10;
        this.crit = 10;
        this.defense = 1;
        this.hp = 1000;
        this.dodge = 10;
        this.tenacity = 1;
        this.attackSpeed = 0;
        this.fighting = 0;

        this.equipments.forEach(e => {
            this.attack += e.equipmentProperty.attack + e.strengthenProperty.attack
            this.quickness += e.equipmentProperty.quickness + e.strengthenProperty.quickness
            this.hit += e.equipmentProperty.hit + e.strengthenProperty.hit
            this.crit += e.equipmentProperty.crit + e.strengthenProperty.crit
            this.defense += e.equipmentProperty.defense + e.strengthenProperty.defense
            this.hp += e.equipmentProperty.hp + e.strengthenProperty.hp
            this.dodge += e.equipmentProperty.dodge + e.strengthenProperty.dodge
            this.tenacity += e.equipmentProperty.tenacity + e.strengthenProperty.tenacity
            this.calcAttackSpeed();
            this.fighting += e.fighting;
        })
    }

    addGold(gold: number) {
        this.gold += gold;
    }

    calcAttackSpeed() {
        this.attackSpeed = 1.5 - (1.5 * this.quickness * (1 - this.quickness / (this.quickness + 100)) * 0.01);
        this.attackSpeed = Math.floor(this.attackSpeed * 100) / 100;
    }
}

@ccclass('PropertyManager')
export class PropertyManager extends Component {

    public static inst: PropertyManager = null;

    @property(RichText)
    fightingUI: RichText = null;
    @property(RichText)
    goldUI: RichText = null;
    @property(PropertyComp)
    propertry: PropertyComp = null;

    playerProperty: PlayerProperty = new PlayerProperty();

    protected onLoad(): void {
        PropertyManager.inst = this;
    }

    public gameStart() {
        this.resetAllUI();
    }

    changeProperty(euqipment: Equipment, isAdd: boolean) {
        this.onEE_changeData(euqipment, isAdd);
        this.resetPropertyUI();
    }

    changeGold(gold: number) {
        this.onCG_changeData(gold);
        this.resetGoldUI();
    }

    showPlayerProperty() {
        this.propertry.node.active = true;
        this.resetPropertyUI();
        this.resetPlayerProperty();
    }

    resetPlayerProperty() {
        this.playerProperty.resetProperty();
        this.resetAllUI();
        this.propertry.resetProperty(this.playerProperty);
        RoleManager.inst.resetPlayerProperty();
    }

    //In Data==================================================
    private onEE_changeData(equipment: Equipment, isAdd: boolean) {
        this.playerProperty.addProperty(equipment, isAdd);
        // log(`${isAdd ? '增加' : '减少'}玩家属性数据`)
    }

    private onCG_changeData(gold: number) {
        this.playerProperty.addGold(gold);
    }


    //In UI==================================================
    private resetAllUI() {
        this.resetPropertyUI();
        this.resetGoldUI();
    }

    private resetPropertyUI() {
        // log(`刷新玩家属性数据UI`)
        this.propertry.resetProperty(this.playerProperty);
        this.fightingUI.string = setOutline(
            setColor(this.playerProperty.fighting.toString(), GameConfig.fightingColor), GameConfig.outlineColor, GameConfig.fightingOutlineWidth)
    }

    private resetGoldUI() {
        // log(`刷新玩家金币数据UI`)
        this.goldUI.string = setOutline(
            setColor(this.playerProperty.gold.toString(), GameConfig.goldColor), GameConfig.outlineColor, GameConfig.goldOutlineWidth);
    }
}


