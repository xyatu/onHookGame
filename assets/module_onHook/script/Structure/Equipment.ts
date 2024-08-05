import { log, randomRange, randomRangeInt } from "cc";
import { getstrengthen_dataById } from "../data/strengthen_data";
import { generateEquipment } from "../Util/GameUtil";

export enum StrengthenState {
    success,
    field,
    reduce,
    break,
}

export class Equipment {
    id: number = 0;
    name: string = '';
    nameSuffix: string = '';
    quality: Quality = Quality.white;
    region: Region = Region.weapon;
    price: number = 0;
    fighting: number = 0;
    equipmentProperty: EquipmentProperty = new EquipmentProperty(0, 0, 0, 0, 0, 0, 0, 0);
    strengthenProperty: EquipmentProperty = new EquipmentProperty(0, 0, 0, 0, 0, 0, 0, 0);
    strengthenLevel: number = 0;

    constructor() {
        let data: {} = generateEquipment();
        this.id = data['id'];
        this.name = data['name'];
        this.quality = data['quality'];
        this.region = data['region'];
        this.price = Math.ceil(data['price']);

        this.equipmentProperty = new EquipmentProperty(
            data['min_attack'] ? randomRangeInt(data['min_attack'], data['max_attack']) : 0,
            data['min_quickness'] ? randomRangeInt(data['min_quickness'], data['max_quickness']) : 0,
            data['min_hit'] ? randomRangeInt(data['min_hit'], data['max_hit']) : 0,
            data['min_crit'] ? randomRangeInt(data['min_crit'], data['max_crit']) : 0,
            data['min_defense'] ? randomRangeInt(data['min_defense'], data['max_defense']) : 0,
            data['min_hp'] ? randomRangeInt(data['min_hp'], data['max_hp']) : 0,
            data['min_dodge'] ? randomRangeInt(data['min_dodge'], data['max_dodge']) : 0,
            data['min_tenacity'] ? randomRangeInt(data['min_tenacity'], data['max_tenacity']) : 0
        )

        this.calcFighting();
    }

    calcFighting() {
        let ep: EquipmentProperty = this.equipmentProperty;
        let sp: EquipmentProperty = this.strengthenProperty;
        this.fighting =
            Math.ceil(
                (ep.attack + sp.attack) * 1 +
                (ep.quickness + sp.quickness) * 1.2 +
                (ep.hit + sp.hit) * 1.2 +
                (ep.crit + sp.crit) * 1.5 +
                (ep.defense + sp.defense) * 1 +
                (ep.hp + sp.hp) * 0.3 +
                (ep.dodge + sp.dodge) * 1 +
                (ep.tenacity + sp.tenacity) * 1.5);
    }

    strengthen(odds: number): StrengthenState {
        let result: StrengthenState = null;
        let success: boolean = Math.random() <= odds;
        if (success) {
            this.strengthenProperty.strengthen(this.equipmentProperty, ++this.strengthenLevel);
            result = StrengthenState.success;
        }
        else {
            result = this.strengthenField(this.equipmentProperty, this.strengthenLevel)
        }

        if (this.strengthenLevel != 0) {
            this.nameSuffix = ` +${this.strengthenLevel}`;
        }
        else {
            this.nameSuffix = ``;
        }

        this.calcFighting();

        return result;
    }

    strengthenField(equipmentProperty: EquipmentProperty, strengthenLevel: number): StrengthenState {
        if (strengthenLevel < 5) {
            return StrengthenState.field;
        }
        else if (strengthenLevel >= 5 && strengthenLevel < 10) {
            this.strengthenProperty.strengthen(this.equipmentProperty, --this.strengthenLevel);
            return StrengthenState.reduce;
        }
        else if (strengthenLevel >= 10 && strengthenLevel < 15) {
            let reduceOdds: number = 0.5;
            let breakOdds: number = 0.5;

            reduceOdds -= (strengthenLevel - 15) * 0.1;
            breakOdds += (strengthenLevel - 15) * 0.1;

            let random = Math.random();
            if (random <= breakOdds) {
                return StrengthenState.break;
            }
            else {
                this.strengthenProperty.strengthen(this.equipmentProperty, --this.strengthenLevel);
                return StrengthenState.reduce;
            }
        }
        else {
            return StrengthenState.break;
        }
    }

    toString(): string {
        let result: string = JSON.stringify({
            id: this.id,
            name: this.name,
            namesuffix: this.nameSuffix,
            quality: this.quality,
            region: this.region,
            price: this.price,
            fighting: this.fighting,
            equipmentProperty: this.equipmentProperty.toString(),
            strengthenProperty: this.strengthenProperty.toString(),
            strengthenLevel: this.strengthenLevel,
        });
        return result;
    }
}

export class EquipmentProperty {
    attack: number = 0;
    quickness: number = 0;
    hit: number = 0;
    crit: number = 0;
    defense: number = 0;
    hp: number = 0;
    dodge: number = 0;
    tenacity: number = 0;

    constructor(attack: number, quickness: number, hit: number, crit: number, defense: number, hp: number, dodge: number, tenacity: number) {
        this.attack = attack;
        this.quickness = quickness;
        this.hit = hit;
        this.crit = crit;
        this.defense = defense;
        this.hp = hp;
        this.dodge = dodge;
        this.tenacity = tenacity;
    }

    strengthen(base: EquipmentProperty, level: number) {
        let strengthenVal: {} = getstrengthen_dataById(level.toString());
        this.attack = Math.ceil(base.attack * strengthenVal['val']);
        this.quickness = Math.ceil(base.quickness * strengthenVal['val']);
        this.hit = Math.ceil(base.hit * strengthenVal['val']);
        this.crit = Math.ceil(base.crit * strengthenVal['val']);
        this.defense = Math.ceil(base.defense * strengthenVal['val']);
        this.hp = Math.ceil(base.hp * strengthenVal['val']);
        this.dodge = Math.ceil(base.dodge * strengthenVal['val']);
        this.tenacity = Math.ceil(base.tenacity * strengthenVal['val']);
    }

    toString(): string {
        const result: string = JSON.stringify({
            attack: this.attack,
            quickness: this.quickness,
            hit: this.hit,
            crit: this.crit,
            defense: this.defense,
            hp: this.hp,
            dodge: this.dodge,
            tenacity: this.tenacity,
        });

        return result;
    }
}


export enum Quality {
    white,
    green,
    blue,
    purple,
    gold,
}

export enum Region {
    weapon,
    shield,
    helmet,
    armor,
    rings,
    earrings,
}

export function TestregionToString(region: Region) {
    let str: string = '';

    switch (region) {
        case Region.weapon: str = '武'; break;
        case Region.shield: str = '盾'; break;
        case Region.helmet: str = '盔'; break;
        case Region.armor: str = '铠'; break;
        case Region.earrings: str = '耳'; break;
        case Region.rings: str = '戒'; break;
    }

    return str;
}

export function regionToString(region: Region) {
    let str: string = '';

    switch (region) {
        case Region.weapon: str = '武器'; break;
        case Region.shield: str = '盾牌'; break;
        case Region.helmet: str = '头盔'; break;
        case Region.armor: str = '盔甲'; break;
        case Region.earrings: str = '饰品'; break;
        case Region.rings: str = '戒指'; break;
    }

    return str;
}

export function regionToEngString(region: Region) {
    let str: string = '';

    switch (region) {
        case Region.weapon: str = 'weapon'; break;
        case Region.shield: str = 'shield'; break;
        case Region.helmet: str = 'helmet'; break;
        case Region.armor: str = 'armor'; break;
        case Region.earrings: str = 'earrings'; break;
        case Region.rings: str = 'rings'; break;
    }

    return str;
}