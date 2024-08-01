import { _decorator, Button, Color, Component, Label, log, Node, Sprite } from 'cc';
import { BackpackManager } from '../Manager/BackpackManager'
const { ccclass, property } = _decorator;

export enum EquipState {
    unEquip,
    equip,
    exchange,
}

@ccclass('OptionsComp')
export class OptionsComp extends Component {
    @property(Label)
    strengthen: Label = null;
    @property(Node)
    strengthenBtn: Node = null;
    @property(Label)
    disassemble: Label = null;
    @property(Node)
    disassembleBtn: Node = null;
    @property(Label)
    equip: Label = null;
    @property(Node)
    equipBtn: Node = null;
    @property(Label)
    lock: Label = null;
    @property(Node)
    lockBtn: Node = null;

    isLock: boolean = false;
    equipState: EquipState = EquipState.unEquip;


    setIsEquipStyle() {
        this.equip.string = '卸下';
    }

    setHaveEquipStyle() {
        this.equip.string = '替换';
    }

    setNotHaveEquipStyle() {
        this.equip.string = '穿戴';
    }

    setLockStyle(isLock: boolean) {
        if (isLock) {
            this.setIsLockStyle();
        }
        else {
            this.setNotLockStyle();
        }
    }

    setIsLockStyle() {
        this.isLock = true;
        this.lock.string = '解锁';

        this.disassembleBtn.getComponent(Sprite).color = new Color(150, 150, 150, 255);
        this.disassembleBtn.getComponent(Button).interactable = false;
    }

    setNotLockStyle() {
        this.isLock = false;
        this.lock.string = '锁定';

        this.disassembleBtn.getComponent(Sprite).color = new Color(255, 255, 255, 255);
        this.disassembleBtn.getComponent(Button).interactable = true;
    }

    doStrengthen() {
        log('强化！')
    }

    doDisassemble() {
        log('分解！')
        BackpackManager.inst.onSale(false);

        this.unSelect();
    }

    doEquip() {
        if (this.equipState === EquipState.unEquip) {
            BackpackManager.inst.onEquipmentUnEquip();
            log('卸下！')
        }
        else if (this.equipState === EquipState.equip) {
            BackpackManager.inst.onEquipmentEquip();
            log('装备！')
        }
        else if (this.equipState === EquipState.exchange) {
            BackpackManager.inst.onExchangeEquip();
            BackpackManager.inst.onEquipmentEquip();
            log('替换！')
        }

        this.unSelect();
    }

    doLock() {
        log('锁定！')
        if (this.isLock) {
            BackpackManager.inst.onEquipmentUnLock();
        }
        else {
            BackpackManager.inst.onEquipmentLock();
        }
        this.unSelect();
    }

    unSelect() {
        BackpackManager.inst.onEquipmentUnSelect();
    }

}


