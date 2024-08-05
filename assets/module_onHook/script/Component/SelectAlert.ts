import { _decorator, Component, EventTouch, Label, Node } from 'cc';
import { Equipment } from '../Structure/Equipment';
import { EquipInfo } from './EquipInfo';
import { BackpackManager } from '../Manager/BackpackManager';
import { GameManager } from '../Manager/GameManager';
import { tgxUIAlert } from '../../../core_tgx/tgx';
const { ccclass, property } = _decorator;

@ccclass('SelectAlert')
export class SelectAlert extends Component {

    @property(Node)
    equipped: Node = null;

    @property(Node)
    backpackHas: Node = null;

    @property(Node)
    backpackNo: Node = null;

    @property(EquipInfo)
    newInfo: EquipInfo = null;

    @property(EquipInfo)
    oldInfo: EquipInfo = null;

    @property(EquipInfo)
    newInfoAlone: EquipInfo = null;

    @property(EquipInfo)
    oldInfoAlone: EquipInfo = null;

    @property(Label)
    lockLabel: Label[] = [];
    @property(Node)
    saleBtn: Node[] = [];

    isLock: boolean = false;

    private hideThis() {
        BackpackManager.inst.onEquipmentUnSelect();
        this.node.active = false;
    }

    protected onEnable(): void {
        this.equipped.active = false;
        this.backpackHas.active = false;
        this.backpackNo.active = false;
    }

    public setStyle(e: Equipment, isLock: boolean, isEquip: boolean, oldE: Equipment) {
        this.isLock = isLock;
        if (isLock) {
            this.lockLabel.forEach(label => {
                label.string = '解锁';
            })

            this.saleBtn.forEach(btn => {
                btn.active = false;
            })
        }
        else {
            this.lockLabel.forEach(label => {
                label.string = '锁定';
            })

            this.saleBtn.forEach(btn => {
                btn.active = true;
            })
        }
        if (isEquip) {
            this.showEquipped(e);
        }
        else {
            this.showBackpack(e, oldE);
        }
    }

    private showEquipped(e: Equipment) {
        this.equipped.active = true;

        this.oldInfoAlone.resetInfo(e, null);
    }

    private showBackpack(e: Equipment, oldE: Equipment) {
        if (oldE) {
            this.backpackHas.active = true;
            this.newInfo.resetInfo(e, e.fighting > oldE.fighting);
            this.oldInfo.resetInfo(oldE, e.fighting <= oldE.fighting);
        }
        else {
            this.backpackNo.active = true;
            this.newInfoAlone.resetInfo(e, true);
        }
    }

    protected onDisable(): void {
        this.equipped.active = false;
        this.backpackHas.active = false;
        this.backpackNo.active = false;
    }

    private btnOnClick(event: EventTouch, arg: string) {
        let bm: BackpackManager = BackpackManager.inst;
        switch (arg) {
            case 'equip':
                bm.onEquipmentEquip();
                break;
            case 'unequip':
                if (BackpackManager.inst.backpackIsFull()) {
                    tgxUIAlert.show(`背包已满`);
                    return;
                }
                bm.onEquipmentUnEquip();
                break;
            case 'exchange':
                bm.onExchangeEquip();
                break;
            case 'lock':
                if (this.isLock) bm.onEquipmentUnLock();
                else bm.onEquipmentLock();
                break;
            case 'sale':
                bm.onSale(false);
                break;
            case 'strengthen':
                bm.onStrengthen();
                break;
        }

        this.hideThis();
    }
}


