import { log } from "cc";
import { Backpack, BackpackManager, Equipment_Bag } from "../Manager/BackpackManager";
import { PropertyManager } from "../Manager/PropertyManager";
import { RoleManager } from "../Manager/RoleManager";
import { Equipment, EquipmentProperty } from "../Structure/Equipment";
import { tgxUIAlert } from "../../../core_tgx/tgx";

/**
 * 金币 装备 背包 怪物 挂机时间
 */
class SaveData {
    haveSlot: string = '';
    gold: string = '';
    equipment: string = '';
    monster: string = '';
    date: string = '';
    equipmentNum: string = '';
}

export class SaveGame {
    private static inst: SaveGame = null;

    private saveData: SaveData = null;

    public equipments: Equipment_Bag[] = [];
    private loadNum: number = 0;

    private constructor() { }

    public static get() {
        if (!SaveGame.inst) {
            SaveGame.inst = new SaveGame();
            this.inst.saveData = new SaveData();
        }
        return SaveGame.inst;
    }

    public saveGold() {
        const gold: number = PropertyManager.inst.playerProperty.gold;
        this.saveData.gold = gold.toString();
        // log(gold);
    }

    public saveEquipment() {
        const equipments: Readonly<Equipment_Bag[]> = BackpackManager.inst.getBackpack().getAll();

        this.saveData.equipment = JSON.stringify(equipments);

        this.saveData.equipmentNum = equipments.length.toString();

        equipments.forEach(element => {
            console.log(element.toString());
        });
    }

    public saveMonster() {
        const monster: number = RoleManager.inst.currentEnemyIndex;
        this.saveData.monster = monster.toString();
        // log(monster);
    }

    public saveDate() {
        const date: Date = new Date();
        this.saveData.date = JSON.stringify(date);
        localStorage.setItem('OnHook_date', this.saveData.date);
        log(localStorage.getItem('OnHook_date'));
    }

    public static saveGame() {
        this.get().saveGold();
        this.get().saveEquipment();
        this.get().saveMonster();
        this.get().saveGame();
    }

    public saveGame() {
        this.saveData.haveSlot = '1';
        localStorage.setItem('OnHook_haveSlot', this.saveData.haveSlot);
        localStorage.setItem('OnHook_gold', this.saveData.gold);
        localStorage.setItem('OnHook_equipmentNum', this.saveData.equipmentNum);
        localStorage.setItem('OnHook_equipment', this.saveData.equipment);
        localStorage.setItem('OnHook_monster', this.saveData.monster);
        localStorage.setItem('OnHook_date', this.saveData.date);
    }

    public loadGame() {
        const OnHook_haveSlot = localStorage.getItem('OnHook_haveSlot');
        if (!OnHook_haveSlot || OnHook_haveSlot === '') return;

        const OnHook_gold = localStorage.getItem('OnHook_gold');
        const OnHook_equipment = localStorage.getItem('OnHook_equipment');
        const OnHook_monster = localStorage.getItem('OnHook_monster');
        const OnHook_date = localStorage.getItem('OnHook_date');

        PropertyManager.inst.playerProperty.gold = parseInt(OnHook_gold);

        RoleManager.inst.currentEnemyIndex = parseInt(OnHook_monster);

        // 2024-08-05T07:27:29.076Z

        const logoutTime = new Date(JSON.parse(OnHook_date));

        const offLineTime: number = (new Date()).getTime() - logoutTime.getTime();

        log(`离线时间: ${offLineTime / 1000 / 60} 分钟`);

        JSON.parse(OnHook_equipment).forEach(element => {
            let equipment: Equipment = new Equipment();
            equipment.id = element.item.id;
            equipment.name = element.item.name;
            equipment.nameSuffix = element.item.nameSuffix;
            equipment.quality = element.item.quality;
            equipment.region = element.item.region;
            equipment.price = element.item.price;
            equipment.fighting = element.item.fighting;
            const ep = element.item.equipmentProperty;
            let equipmentProperty = new EquipmentProperty(ep.attack, ep.quickness, ep.hit, ep.createAlert, ep.defense, ep.hp, ep.dodge, ep.tenacity);
            equipment.equipmentProperty = equipmentProperty;
            const sp = element.item.strengthenProperty;
            let strengthenProperty = new EquipmentProperty(sp.attack, sp.quickness, sp.hit, sp.createAlert, sp.defense, sp.hp, sp.dodge, sp.tenacity);
            equipment.strengthenProperty = strengthenProperty;
            equipment.strengthenLevel = element.item.id;
            let equipment_bag: Equipment_Bag = new Equipment_Bag(element.item);
            if (element.isEquip) equipment_bag.equip();
            if (element.isLock) equipment_bag.lock();

            this.equipments.push(element);

            this.loadNum++;
        });

        log(this.equipments);

    }

    public static loadTime() {
        const OnHook_date = localStorage.getItem('OnHook_date');

        const logoutTime = new Date(JSON.parse(OnHook_date));

        const offLineTime: number = (new Date()).getTime() - logoutTime.getTime();


        const minute: number = Math.floor(offLineTime / 1000 / 60);

        if (minute >= 1) {

            const gold: number = minute * 20;

            tgxUIAlert.show(`离线时间: ${minute} 分钟,获得了 ${gold} 金币收益`);

            BackpackManager.inst.onChangeGold(gold);
        }

        log(`离线时间: ${minute} 分钟`);

    }
}
