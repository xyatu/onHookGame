import { _decorator, Component, instantiate, Label, Node, Prefab, RichText } from 'cc';
import { Equipment, regionToString, TestregionToString } from '../Structure/Equipment';
import { setColor, setOutline } from '../Util/GameUtil';
import { GameConfig } from '../data/GameConfig';
import { EquipmentState } from './EquipmentState';
const { ccclass, property } = _decorator;

@ccclass('EquipInfo')
export class EquipInfo extends Component {
    @property(Label)
    equipName: Label = null;

    @property(Label)
    region: Label = null;

    @property(RichText)
    fighting: RichText = null;

    @property(Node)
    equipmentIconBox: Node = null;
    @property(Node)
    up: Node = null;
    @property(Node)
    down: Node = null;

    @property(Label)
    base1Name: Label = null;
    @property(Label)
    base1val: Label = null;
    @property(Label)
    base1Strengthen: Label = null;

    @property(Label)
    base2Name: Label = null;
    @property(Label)
    base2val: Label = null;
    @property(Label)
    base2Strengthen: Label = null;

    @property(Label)
    special1Name: Label = null;
    @property(Label)
    special1val: Label = null;
    @property(Label)
    special1Strengthen: Label = null;

    @property(Label)
    special2Name: Label = null;
    @property(Label)
    special2val: Label = null;
    @property(Label)
    special2Strengthen: Label = null;

    @property(Prefab)
    equipment: Prefab = null;

    resetInfo(equipment: Equipment, isUp: boolean): EquipmentState {
        let e: Equipment = equipment;

        this.equipName.string = `${e.name}${equipment.nameSuffix}`;
        this.region.string = regionToString(e.region);
        this.fighting.string = setOutline(
            setColor(e.fighting.toString(), GameConfig.fightingColor), GameConfig.outlineColor, GameConfig.fightingOutlineWidth);
        let equipNode = instantiate(this.equipment);
        this.equipmentIconBox.addChild(equipNode);
        equipNode.getComponent(EquipmentState).setStyle(e.region, e.quality, e.id, false, false);
        if (e.region === 0 || e.region === 4 || e.region === 5) {
            if (e.equipmentProperty.attack <= 0) {
                this.base1Name.node.active = false;
                this.base1val.node.active = false;
            }
            else {
                this.base1Name.string = '攻击:';
                this.base1val.string = e.equipmentProperty.attack.toString();
            }
            if (e.equipmentProperty.quickness <= 0) {
                this.base2Name.node.active = false;
                this.base2val.node.active = false;
            }
            else {
                this.base2Name.string = '敏捷:';
                this.base2val.string = e.equipmentProperty.quickness.toString();
            }
            if (e.strengthenLevel > 0) {
                this.base1Strengthen.string = `+${e.strengthenProperty.attack}`;
                this.base2Strengthen.string = `+${e.strengthenProperty.quickness}`;
            }
            else {
                this.base1Strengthen.string = ``;
                this.base2Strengthen.string = ``;
            }
        }
        else {
            if (e.equipmentProperty.hp <= 0) {
                this.base1Name.node.active = false;
                this.base1val.node.active = false;
            }
            else {
                this.base1Name.string = '生命:';
                this.base1val.string = e.equipmentProperty.hp.toString();
            }
            if (e.equipmentProperty.defense) {
                this.base2Name.node.active = false;
                this.base2val.node.active = false;
            }
            else {
                this.base2Name.string = '防御:';
                this.base2val.string = e.equipmentProperty.defense.toString();
            }
            if (e.strengthenLevel > 0) {
                this.base1Strengthen.string = `+${e.strengthenProperty.hp}`;
                this.base2Strengthen.string = `+${e.strengthenProperty.defense}`;
            }
            else {
                this.base1Strengthen.string = ``;
                this.base2Strengthen.string = ``;
            }
        }

        if (e.region === 0 || e.region === 4) {
            if (e.equipmentProperty.crit <= 0) {
                this.special1Name.node.active = false;
                this.special1val.node.active = false;
            }
            else {
                this.special1Name.string = '暴击:';
                this.special1val.string = e.equipmentProperty.crit.toString();
            }
            if (e.equipmentProperty.hit <= 0) {
                this.special2Name.node.active = false;
                this.special2val.node.active = false;
            }
            else {
                this.special2Name.string = '命中:';
                this.special2val.string = e.equipmentProperty.hit.toString();
            }
            if (e.strengthenLevel > 0) {
                this.special1Strengthen.string = `+${e.strengthenProperty.crit}`;
                this.special2Strengthen.string = `+${e.strengthenProperty.hit}`;
            }
            else {
                this.special1Strengthen.string = ``;
                this.special2Strengthen.string = ``;
            }
        }
        else {
            if (e.equipmentProperty.dodge <= 0) {
                this.special1Name.node.active = false;
                this.special1val.node.active = false;
            }
            else {
                this.special1Name.string = '闪避:';
                this.special1val.string = e.equipmentProperty.dodge.toString();
            }

            if (e.equipmentProperty.tenacity <= 0) {
                this.special2Name.node.active = false;
                this.special2val.node.active = false;
            } else {
                this.special2Name.string = '坚韧:';
                this.special2val.string = e.equipmentProperty.tenacity.toString();
            }
            if (e.strengthenLevel > 0) {
                this.special1Strengthen.string = `+${e.strengthenProperty.dodge}`;
                this.special2Strengthen.string = `+${e.strengthenProperty.tenacity}`;
            }
            else {
                this.special1Strengthen.string = ``;
                this.special2Strengthen.string = ``;
            }
        }

        if (isUp === null) {
            this.down.active = false;
            this.up.active = false;
        }
        else if (isUp) {
            this.up.active = true;
            this.down.active = false;
        }
        else {
            this.down.active = true;
            this.up.active = false;
        }

        return equipNode.getComponent(EquipmentState);
    }

}


