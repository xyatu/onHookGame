import { _decorator, Component, EventTouch, instantiate, log, Node, NodeEventType, Prefab, ScrollView, v3 } from 'cc';
import { Equipment, Quality, Region } from '../Structure/Equipment';
import { EquipmentPool } from './EquipmentPool';
import { EquipmentState } from '../Component/EquipmentState';
import { EventManager } from './EventManager';
import { PropertyManager } from './PropertyManager';
import { GameConfig } from '../data/GameConfig';
import { SaveGame } from '../Util/SaveGameUtil';
const { ccclass, property } = _decorator;

export class Equipment_Bag {
    public item: Equipment = null;
    private siblingIndex: number = 0;
    public isLock: boolean = false;
    public isEquip: boolean = false;

    constructor(equipment: Equipment) {
        this.item = equipment;
    }

    set index(siblingIndex: number) {
        this.siblingIndex = siblingIndex;
    }

    get index(): number {
        return this.siblingIndex;
    }

    equip() {
        this.isEquip = true;
    }
    unEquip() {
        this.isEquip = false;
    }

    lock() {
        this.isLock = true;
    }
    unLock() {
        this.isLock = false;
    }

    toString(): string {
        const result: string =
            JSON.stringify({
                item: this.item.toString(),
                siblingIndex: this.siblingIndex,
                isLock: this.isLock,
                isEquip: this.isEquip,
            })
        return result;
    }
}

export class Backpack {
    private item: Map<number, Equipment_Bag> = new Map();

    private index: number = 0;

    private size: number = 0;

    constructor() {
        this.item = new Map();
    }

    addItem(equipment: Equipment): number {
        let index: number = this.index++;
        this.item.set(index, new Equipment_Bag(equipment));
        this.size++;
        return index;
    }

    getItem(index: number): Equipment_Bag {
        return this.item.get(index);
    }

    getAll(): Readonly<Equipment_Bag[]> {
        return Array.from(this.item.values());
    }

    getSize(): number {
        return this.size;
    }

    length(): number {
        return this.item.size;
    }

    has(index: number): boolean {
        return this.item.has(index);
    }

    swapValues(target: number, current: number) {

        if (target === current) return;

        const originalValue = this.item.get(current);

        if (target < current) {
            for (let i = current; i > target; i--) {
                this.item.set(i, this.item.get(i - 1)!); // 将前一个位置的值向后移动一位
            }
        }
        else {
            for (let i = current; i > target; i++) {
                this.item.set(i, this.item.get(i + 1)!); // 将前一个位置的值向后移动一位
            }
        }

        this.item.set(target, originalValue);
    }

    removeItemByIndex(index: number): number {
        this.item.delete(index);
        this.size--;
        return this.item.size;
    }

    removeItemByRegion(region: Region): number {
        for (const iterator of this.item) {
            if (iterator[1].item.region === region) {
                this.item.delete(iterator[0]);
            }
        }

        this.size--;
        return this.item.size;
    }

    removeItemByQuality(quality: Quality): number {
        for (const iterator of this.item) {
            if (iterator[1].item.quality === quality) {
                this.item.delete(iterator[0]);
            }
        }
        this.size--;
        return this.item.size;
    }

    getCanSaleAll(): number[] {
        let result: number[] = [];
        for (const iterator of this.item) {
            if (!iterator[1].isEquip && !iterator[1].isLock) {
                result.push(iterator[0]);
            }
        }

        return result;
    }

    equip(index: number): Equipment {
        if (this.item.has(index)) {
            this.item.get(index).equip();
            this.size--;
            return this.item.get(index).item;
        }
        return null;
    }
    unEquip(index: number): Equipment {
        if (this.item.has(index)) {
            this.item.get(index).unEquip();
            this.size++;
            return this.item.get(index).item;
        }
        return null;
    }
    isEquip(index: number): boolean {
        if (this.item.has(index)) {
            return this.item.get(index).isEquip;
        }

        return null;
    }

    lock(index: number): Equipment {
        if (this.item.has(index)) {
            this.item.get(index).lock();
            return this.item.get(index).item;
        }
        return null;
    }
    unLock(index: number): Equipment {
        if (this.item.has(index)) {
            this.item.get(index).unLock();
            return this.item.get(index).item;
        }
        return null;
    }
    isLock(index: number): boolean {
        if (this.item.has(index)) {
            return this.item.get(index).isLock;
        }
        return null;
    }

    isFirstGet(region: Region): boolean {
        let isFirstGet: number = 0;
        for (const iterator of this.item) {
            if (iterator[1].item.region === region) {
                isFirstGet++;
            }
        }

        return isFirstGet === 1;
    }
}

class EquipmentColumn {
    private item: Map<number, Equipment> = new Map();

    constructor() {
        this.item = new Map();
    }

    addItem(index: number, equipment: Equipment) {
        let targetEquip: number = this.hasEquip(equipment.region);
        if (targetEquip !== -1) {
            this.item.delete(targetEquip);
        }
        this.item.set(index, equipment);
    }

    getItemByRegion(region: Region): Equipment {
        for (const iterator of this.item) {
            if (iterator[1].region === region) {
                return iterator[1];
            }
        }
        return null;
    }

    hasEquip(region: Region): number {
        let has: number = -1;
        for (const iterator of this.item) {
            if (iterator[1].region === region) {
                has = iterator[0];
                break;
            }
        }
        return has;
    }

    removeItem(index: number) {
        this.item.delete(index);
    }

    size() {
        return this.item.size;
    }
}

@ccclass('BackpackManager')
export class BackpackManager extends Component {
    public static inst: BackpackManager = null;

    private backpack: Backpack = null;
    private equipmentColumn: EquipmentColumn = null;

    @property(Node)
    private backpackBox: Node = null;
    @property(Node)
    private equipmentColumnBox: Node = null;
    @property(Node)
    private equipmentNameBox: Node = null;

    private isSelect: number = -1;
    private selectES: EquipmentState = null;
    private strengthenES: EquipmentState = null;

    private newES: EquipmentState = null;

    protected onLoad(): void {
        BackpackManager.inst = this;
        this.backpack = new Backpack();
        this.equipmentColumn = new EquipmentColumn();
    }

    protected start(): void {
        this.eventRegister();
    }

    public backpackLength(): number {
        return this.backpack.length();
    }
    public isEquip(index: number): boolean {
        return this.backpack.isEquip(index);
    }
    public isLock(index: number): boolean {
        return this.backpack.isLock(index);
    }
    public haveEquipByES(es: EquipmentState): boolean {
        let equipment = this.backpack.getItem(es.index).item;
        return this.equipmentColumn.hasEquip(equipment.region) !== -1;
    }
    public haveEquipByRegion(region: Region): boolean {
        return this.equipmentColumn.hasEquip(region) !== -1;
    }
    public getEquipByRegion(region: Region): Equipment {
        return this.equipmentColumn.getItemByRegion(region);
    }
    public backpackIsFull() {
        return this.backpack.getSize() >= GameConfig.backpackSize;
    }

    public getBackpack(): Readonly<Backpack> {
        return this.backpack;
    }

    public gameStart() {
        this.restore(SaveGame.get().equipments);
    }

    //In Data==================================================

    private onES_data(es: EquipmentState) {
        let bm: BackpackManager = BackpackManager.inst;
        bm.isSelect = es.index;
        bm.selectES = es;

        let equipment: Equipment = bm.backpack.getItem(es.index).item;
        log(`拿起了 ${equipment.name}${equipment.nameSuffix} 它的属性是:${equipment.equipmentProperty.hp != 0 ? '生命:' + equipment.equipmentProperty.hp + ';' : ''}${equipment.equipmentProperty.attack != 0 ? '攻击:' + equipment.equipmentProperty.attack + ';' : ''}${equipment.equipmentProperty.defense != 0 ? '防御:' + equipment.equipmentProperty.defense + ';' : ''}${equipment.equipmentProperty.quickness != 0 ? '敏捷:' + equipment.equipmentProperty.quickness + ';' : ''}${equipment.equipmentProperty.hit != 0 ? '命中:' + equipment.equipmentProperty.hit + ';' : ''}${equipment.equipmentProperty.crit != 0 ? '暴击:' + equipment.equipmentProperty.crit + ';' : ''}${equipment.equipmentProperty.dodge != 0 ? '闪避:' + equipment.equipmentProperty.dodge + ';' : ''}${equipment.equipmentProperty.tenacity != 0 ? '坚韧:' + equipment.equipmentProperty.tenacity + ';' : ''}`)
    }

    private onEUS_data(es: EquipmentState) {
        let bm: BackpackManager = BackpackManager.inst;
        bm.isSelect = -1;
        bm.selectES = null;
    }

    private onEE_backpack(es: EquipmentState) {
        let bm: BackpackManager = BackpackManager.inst;
        bm.backpack.equip(es.index);
        log(bm.backpack.getSize())
    }

    private onEE_equipmentColumn(es: EquipmentState) {
        let bm: BackpackManager = BackpackManager.inst;
        bm.equipmentColumn.addItem(es.index, bm.backpack.getItem(es.index).item);
    }

    private onEE_removeFromBackpack(es: EquipmentState) {
        let bm: BackpackManager = BackpackManager.inst;
        bm.backpack.removeItemByIndex(es.index);
    }

    private onEE_changeProperty(es: EquipmentState) {
        let pm: PropertyManager = PropertyManager.inst;
        let bm: BackpackManager = BackpackManager.inst;

        pm.changeProperty(bm.backpack.getItem(es.index).item, true);
    }

    private onEL_data(es: EquipmentState) {
        let bm: BackpackManager = BackpackManager.inst;

        bm.backpack.getItem(es.index).lock();
    }

    private onEUL_data(es: EquipmentState) {
        let bm: BackpackManager = BackpackManager.inst;

        bm.backpack.getItem(es.index).unLock();
    }
    private onEUE_backpack(es: EquipmentState) {
        let bm: BackpackManager = BackpackManager.inst;
        bm.backpack.unEquip(es.index);
    }
    private onEUE_equipmentColumn(es: EquipmentState) {
        let bm: BackpackManager = BackpackManager.inst;
        bm.equipmentColumn.removeItem(es.index);
    }
    private onEUE_changeProperty(es: EquipmentState) {
        let pm: PropertyManager = PropertyManager.inst;
        let bm: BackpackManager = BackpackManager.inst;

        pm.changeProperty(bm.backpack.getItem(es.index).item, false);
    }
    private onS_data(es: EquipmentState) {
        let bm: BackpackManager = BackpackManager.inst;
        if (es) {
            bm.onChangeGold(bm.backpack.getItem(es.index).item.price);
            bm.backpack.removeItemByIndex(es.index);
        }
        else {
            let canRemove: number[] = bm.backpack.getCanSaleAll();
            canRemove.forEach(item => {
                bm.onChangeGold(bm.backpack.getItem(item).item.price);
                bm.backpack.removeItemByIndex(item);
            })
        }
    }

    private onEB_data(es: EquipmentState) {
        let bm: BackpackManager = BackpackManager.inst;
        bm.backpack.removeItemByIndex(es.index);
    }

    private onCG_Data(gold: number) {
        PropertyManager.inst.changeGold(gold);
    }


    //In UI==================================================
    private onPE_changeBackpackUI(index: number) {

        let bm: BackpackManager = BackpackManager.inst;
        let eb: Equipment_Bag = bm.backpack.getItem(index);
        let equipmentUI: Node = EquipmentPool.inst.get();
        let es: EquipmentState = equipmentUI.getComponent(EquipmentState);
        es.setStrengthenLevel(0);
        es.index = index;
        es.setStyle(eb.item.region, eb.item.quality, eb.isEquip, eb.isLock);
        bm.backpackBox.addChild(equipmentUI);
        bm.backpack.getItem(index).index = equipmentUI.getSiblingIndex();
        bm.newES = es;
    }

    // private onES_uiStyle(es: EquipmentState) {
    //     es.setSelectStyle();
    // }

    // private onES_prohibitScroll(es: EquipmentState) {
    //     BackpackManager.inst.backpackBox.getComponent(ScrollView).vertical = false;
    // }

    private onEUS_uiStyle(es: EquipmentState) {
        es.setUnSelectStyle();
    }

    private onEUS_prohibitScroll(es: EquipmentState) {
        BackpackManager.inst.backpackBox.getComponent(ScrollView).vertical = true;
    }

    private onEE_showEquipmentTip(es: EquipmentState) {
        // es.equipStyle();
    }

    private onEE_equipmentColumnUI(es_out: EquipmentState) {
        let bm: BackpackManager = BackpackManager.inst;
        let eb: Equipment_Bag = bm.backpack.getItem(es_out.index);
        let equipment: Equipment = eb.item;
        let region: Region = equipment.region;
        es_out.node.setPosition(v3(0, 0, es_out.node.position.z))
        bm.equipmentColumnBox.children[region].addChild(es_out.node);
        bm.equipmentNameBox.children[region].children[0].active = false;
        log(`穿上了 ${equipment.name}${equipment.nameSuffix} 它的属性是:${equipment.equipmentProperty.hp != 0 ? '生命:' + equipment.equipmentProperty.hp + ';' : ''}${equipment.equipmentProperty.attack != 0 ? '攻击:' + equipment.equipmentProperty.attack + ';' : ''}${equipment.equipmentProperty.defense != 0 ? '防御:' + equipment.equipmentProperty.defense + ';' : ''}${equipment.equipmentProperty.quickness != 0 ? '敏捷:' + equipment.equipmentProperty.quickness + ';' : ''}${equipment.equipmentProperty.hit != 0 ? '命中:' + equipment.equipmentProperty.hit + ';' : ''}${equipment.equipmentProperty.crit != 0 ? '暴击:' + equipment.equipmentProperty.crit + ';' : ''}${equipment.equipmentProperty.dodge != 0 ? '闪避:' + equipment.equipmentProperty.dodge + ';' : ''}${equipment.equipmentProperty.tenacity != 0 ? '坚韧:' + equipment.equipmentProperty.tenacity + ';' : ''}`)
    }

    private onEE_removeFromBackpackUI(es: EquipmentState) {
        let bm: BackpackManager = BackpackManager.inst;
        let index: number = bm.backpack.getItem(es.index).index;
        let equipmentNode: Node = bm.backpackBox.children[index]
        EquipmentPool.inst.put(equipmentNode);
        bm.backpack.getItem(es.index).index = -1;
    }

    private onBR_backpackReorderUI(es: EquipmentState, tIndex: number) {
        es.node.setSiblingIndex(tIndex);
    }

    private onEL_UI(es: EquipmentState) {
        es.lockStyle();
    }

    private onEUL_UI(es: EquipmentState) {
        es.unLockStyle();
    }

    private onEUE_showEquipmentTip(es: EquipmentState) {
        es.unEquipStyle();
    }

    private onEUE_equipmentColumnUI(es: EquipmentState) {
        let bm: BackpackManager = BackpackManager.inst;
        let eb: Equipment_Bag = bm.backpack.getItem(es.index);
        let equipment: Equipment = eb.item;
        let region: Region = equipment.region;
        bm.backpackBox.addChild(bm.equipmentColumnBox.children[region].children[0]);
        eb.index = bm.backpackBox.children.length - 1;
        bm.equipmentNameBox.children[region].children[0].active = true;
        // EquipmentPool.inst.put();
    }
    private onS_UI(es: EquipmentState) {
        let bm: BackpackManager = BackpackManager.inst;
        if (es) {
            EquipmentPool.inst.put(es.node);
        }
        else {
            let len: number = bm.backpackBox.children.length;
            for (let index = 0; index < len; index++) {
                if (bm.backpackBox.children[index] && !bm.backpack.has(bm.backpackBox.children[index].getComponent(EquipmentState).index)) {

                    //error getComponent(EquipmentState) taret is null or undefind

                    EquipmentPool.inst.put(bm.backpackBox.children[index])
                    index--;
                }
            }
        }
    }

    private onEB_UI(es: EquipmentState) {
        EquipmentPool.inst.put(es.node);
    }


    //Broadcast==================================================
    public pickupEquipmentData(equipment: Equipment, dontSave?: boolean): number {
        if (this.backpack.getSize() >= GameConfig.backpackSize) {
            return;
        }
        let index: number = this.backpack.addItem(equipment);

        if (!dontSave) SaveGame.saveGame();

        return index;
    }

    public pickupEquipmentUI(index: number, dontSave?: boolean) {
        let bm: BackpackManager = BackpackManager.inst;
        let eb: Equipment_Bag = bm.backpack.getItem(index);
        EventManager.inst.cbOnPickupEquipment.broadCast(index);
        if (!dontSave) SaveGame.saveGame();
        return this.backpackBox.children[eb.index].getComponent(EquipmentState);
    }

    public onEquipmentSelect(es: EquipmentState) {
        if (this.isSelect !== -1 && this.selectES !== null) {
            this.onEquipmentUnSelect();
            return;
        }
        EventManager.inst.cbOnEquipmentSelect.broadCast(es);
        let backpackE: Equipment = this.backpack.getItem(es.index).item;
        let equipE: Equipment = this.equipmentColumn.getItemByRegion(backpackE.region);
        EventManager.inst.cbFllowEquipmentSelect.broadCast(backpackE, this.isLock(es.index), this.isEquip(es.index), equipE);
        SaveGame.saveGame();
    }

    public onEquipmentUnSelect() {
        if (this.selectES || this.isSelect != -1) {
            EventManager.inst.cbOnEquipmentUnSelect.broadCast(this.selectES);
        }
        SaveGame.saveGame();
    }

    public onEquipmentEquip(es?: EquipmentState, dontSave?: boolean) {
        EventManager.inst.cbOnEquipmentEquip.broadCast(es ? es : this.selectES);
        // EventManager.inst.cbOnBackpackReorder.broadCast(es ? es : this.selectES, 0);
        this.onEquipmentUnSelect();
        if (!dontSave) SaveGame.saveGame();
    }

    public onEquipmentUnEquip(es?: EquipmentState) {
        EventManager.inst.cbOnEquipmentUnEquip.broadCast(es ? es : this.selectES);
        // EventManager.inst.cbOnBackpackReorder.broadCast(es ? es : this.selectES, this.equipmentColumn.size());
        SaveGame.saveGame();
    }

    public exchangeNew() {
        this.onExchangeEquip(this.newES);
        SaveGame.saveGame();
    }

    public onExchangeEquip(equipmentState?: EquipmentState) {
        let es: EquipmentState = null;
        this.selectES = equipmentState ? equipmentState : this.selectES;
        let selectIndex: number = this.selectES.index;
        for (let index = 0; index < 6; index++) {
            if (!this.equipmentColumnBox.children[index].children[0]) continue;
            es = this.equipmentColumnBox.children[index].children[0].getComponent(EquipmentState);
            let esRegion: Region = this.backpack.getItem(es.index).item.region;
            let selectRegion: Region = this.backpack.getItem(selectIndex).item.region;
            if (esRegion === selectRegion) break;
        }

        this.onEquipmentUnEquip(es);
        this.onEquipmentEquip();
        SaveGame.saveGame();
    }

    public onEquipmentLock(es_out?: EquipmentState, dontSave?: boolean) {
        let bm: BackpackManager = BackpackManager.inst;
        const es: EquipmentState = es_out ? es_out : bm.selectES;
        EventManager.inst.cbOnEquipmentLock.broadCast(es);
        if (dontSave) SaveGame.saveGame();
    }

    public onEquipmentUnLock() {
        let bm: BackpackManager = BackpackManager.inst;
        EventManager.inst.cbOnEquipmentUnLock.broadCast(bm.selectES);
        SaveGame.saveGame();
    }

    public onStrengthen() {
        this.strengthenES = this.selectES;
        EventManager.inst.cbOnEquipmentStrengthen.broadCast(this.selectES, this.backpack.getItem(this.selectES.index).item);
        SaveGame.saveGame();
    }

    public onSale(isAll: boolean) {
        EventManager.inst.cbOnEquipmentSale.broadCast(isAll ? null : this.selectES);
        SaveGame.saveGame();
    }

    public onChangeGold(gold: number) {
        EventManager.inst.cbOnChangeGold.broadCast(gold);
        SaveGame.get().saveGold();
    }

    public onEquipmentBreak() {
        if (this.isEquip(this.strengthenES.index)) this.onEquipmentUnEquip(this.strengthenES);
        EventManager.inst.cbOnEquipmentBreak.broadCast(this.strengthenES);
        SaveGame.saveGame();
    }

    public setStrengthenLevel(level: number) {
        this.strengthenES.setStrengthenLevel(level);
        SaveGame.saveGame();
    }

    //eventRegister==================================================
    private eventRegister() {
        let eventManager: EventManager = EventManager.inst;
        if (eventManager) {
            eventManager.cbOnBackpackReorder.register(this.onBR_backpackReorderUI);

            eventManager.cbOnPickupEquipment.register(this.onPE_changeBackpackUI);

            eventManager.cbOnEquipmentSelect.register(this.onES_data);
            // eventManager.cbOnEquipmentSelect.register(this.onES_uiStyle);
            // eventManager.cbOnEquipmentSelect.register(this.onES_prohibitScroll);

            eventManager.cbOnEquipmentUnSelect.register(this.onEUS_data);
            eventManager.cbOnEquipmentUnSelect.register(this.onEUS_uiStyle);
            eventManager.cbOnEquipmentUnSelect.register(this.onEUS_prohibitScroll);

            eventManager.cbOnEquipmentEquip.register(this.onEE_backpack);
            eventManager.cbOnEquipmentEquip.register(this.onEE_equipmentColumn);
            eventManager.cbOnEquipmentEquip.register(this.onEE_changeProperty);
            // eventManager.cbOnEquipmentEquip.register(this.onEE_showEquipmentTip);
            eventManager.cbOnEquipmentEquip.register(this.onEE_equipmentColumnUI);
            // eventManager.cbOnEquipmentEquip.register(this.onEE_removeFromBackpackUI);

            eventManager.cbOnEquipmentUnEquip.register(this.onEUE_backpack);
            eventManager.cbOnEquipmentUnEquip.register(this.onEUE_equipmentColumn);
            eventManager.cbOnEquipmentUnEquip.register(this.onEUE_changeProperty);
            eventManager.cbOnEquipmentUnEquip.register(this.onEUE_showEquipmentTip);
            eventManager.cbOnEquipmentUnEquip.register(this.onEUE_equipmentColumnUI);

            eventManager.cbOnEquipmentLock.register(this.onEL_data);
            eventManager.cbOnEquipmentLock.register(this.onEL_UI);

            eventManager.cbOnEquipmentUnLock.register(this.onEUL_data);
            eventManager.cbOnEquipmentUnLock.register(this.onEUL_UI);

            eventManager.cbOnEquipmentSale.register(this.onS_data);
            eventManager.cbOnEquipmentSale.register(this.onS_UI);

            eventManager.cbOnChangeGold.register(this.onCG_Data);

            eventManager.cbOnEquipmentBreak.register(this.onEB_data);
            eventManager.cbOnEquipmentBreak.register(this.onEB_UI);
        }
    }

    public restore(equipments: Equipment_Bag[]) {
        equipments.forEach((equipment) => {
            let es = this.pickupEquipmentUI(this.pickupEquipmentData(equipment.item, true), true);
            if (equipment.isEquip) this.onEquipmentEquip(es, true);
            if (equipment.isLock) this.onEquipmentLock(es, true);
        })

    }
}


