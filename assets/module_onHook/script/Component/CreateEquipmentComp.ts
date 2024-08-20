import { _decorator, Component, EventHandler, EventTouch, log, Node, size, UITransform } from 'cc';
import { PropertyManager } from '../Manager/PropertyManager';
import { GameConfig } from '../data/GameConfig';
import { tgxUIAlert } from '../../../core_tgx/tgx';
import { BackpackManager } from '../Manager/BackpackManager';
import { GameManager } from '../Manager/GameManager';
import { Equipment } from '../Structure/Equipment';
import { EquipInfo } from './EquipInfo';
import { EquipmentState } from './EquipmentState';
import { SaveGame } from '../Util/SaveGameUtil';
import { playOneShotById } from '../Manager/SoundPlayer';
const { ccclass, property } = _decorator;

@ccclass('CreateEquipmentComp')
export class CreateEquipmentComp extends Component {

    @property(Node)
    base: Node = null;

    @property(Node)
    finishHasOld: Node = null;

    @property(Node)
    finishNoOld: Node = null;

    @property(EquipInfo)
    newInfo: EquipInfo = null;

    @property(EquipInfo)
    newInfoAlone: EquipInfo = null;

    @property(EquipInfo)
    oldInfo: EquipInfo = null;

    newEquipment: Equipment = null;
    newES: EquipmentState = null;
    newIndex: number = -1;
    oldEquipment: Equipment = null;

    protected onEnable(): void {
        this.base.active = true;
        this.finishHasOld.active = false;
        this.finishNoOld.active = false;

        this.newEquipment = null;
        this.newES = null;
        this.oldEquipment = null;
    }

    protected onDisable(): void {

        this.base.active = true;
        this.finishHasOld.active = false;
        this.finishNoOld.active = false;

        this.newEquipment = null;
        this.newES = null;
        this.oldEquipment = null;
    }

    private createEquipment() {
        log('打造')

        if (PropertyManager.inst.playerProperty.gold < GameConfig.createPrice) {
            tgxUIAlert.show(`金币不足`);
            return;
        }
        else if (BackpackManager.inst.backpackIsFull()) {
            tgxUIAlert.show(`背包已满`);
            return;
        }
        else {
            this.createSuccess();
        }
    }

    private createSuccess() {
        BackpackManager.inst.onChangeGold(-GameConfig.createPrice);
        this.base.active = false;
        let equipment: Equipment = GameManager.inst.spawnEquipment();
        this.setFinishiStyle(equipment);


        this.newIndex = BackpackManager.inst.pickupEquipmentData(this.newEquipment);

        this.newES.index = this.newIndex;

        SaveGame.saveGame();
    }

    private setFinishiStyle(equipment: Equipment) {
        let bm = BackpackManager.inst;
        this.newEquipment = equipment;
        if (bm.haveEquipByRegion(equipment.region)) {
            this.finishHasOld.active = true;
            this.oldEquipment = bm.getEquipByRegion(equipment.region);

            this.newES = this.newInfo.resetInfo(this.newEquipment, this.newEquipment.fighting > bm.getEquipByRegion(equipment.region).fighting);
            this.oldInfo.resetInfo(bm.getEquipByRegion(equipment.region), equipment.fighting <= bm.getEquipByRegion(equipment.region).fighting);
        }
        else {
            this.finishNoOld.active = true;

            this.newES = this.newInfoAlone.resetInfo(equipment, true);
        }
    }

    private exchangeEquip(event: EventTouch, args: any) {
        if (args === '0') {
            BackpackManager.inst.onEquipmentEquip(this.newES);
        }
        else if (args === '1') {
            BackpackManager.inst.pickupEquipmentUI(this.newES.index);
            BackpackManager.inst.exchangeNew();
        }

        this.hideThis();
    }

    private hideThis() {
        this.node.active = false;
    }

    private onCloseClick() {
        BackpackManager.inst.pickupEquipmentUI(this.newES.index);

        this.hideThis();
    }

    private backBase() {
        BackpackManager.inst.pickupEquipmentUI(this.newES.index);
        this.base.active = true;
        this.finishHasOld.active = false;
        this.finishNoOld.active = false;

        this.newEquipment = null;
        this.newES = null;
        this.oldEquipment = null;
    }
}


