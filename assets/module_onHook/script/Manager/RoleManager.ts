import { _decorator, Component, EventHandler, Label, Material, Node, ProgressBar, Sprite, SpriteFrame } from 'cc';
import { RoleBehavior } from '../Role/RoleBehavior';
import { RoleState } from '../Role/RoleState';
import { FrameAnimation, FrameCallback } from '../Role/FrameAnimation';
import { GameManager } from './GameManager';
import { DamageComp } from '../Role/DamageComp';
import { DamageEvent } from '../Role/DamageEvent';
import { PlayerProperty, PropertyManager } from './PropertyManager';
import { getenemy_dataByIndex } from '../data/enemy_data';
import { getanim_dataById } from '../data/anim_data';
import { Anim, AnimType } from '../Structure/Anim';
import { generateAnim } from '../Util/GameUtil';
import { RoleManagerComp } from '../Role/RoleManagerComp';
const { ccclass, property } = _decorator;

export class RoleProperty {
    attack: number = 1;
    quickness: number = 1;
    hit: number = 1;
    crit: number = 1;
    defense: number = 1;
    hp: number = 10;
    dodge: number = 1;
    tenacity: number = 1;
    attackSpeed: number = 0;

    constructor(attack: number, quickness: number, hit: number, crit: number, defense: number, hp: number, dodge: number, tenacity: number, attackSpeed: number) {
        this.attack = attack;
        this.quickness = quickness;
        this.hit = hit;
        this.crit = crit;
        this.defense = defense;
        this.hp = hp;
        this.dodge = dodge;
        this.tenacity = tenacity;
        this.attackSpeed = attackSpeed;
    }
}

@ccclass('RoleManager')
export class RoleManager extends Component {

    public static inst: RoleManager = null;

    @property(RoleManagerComp)
    private player: RoleManagerComp = null;

    @property(RoleManagerComp)
    private enemy: RoleManagerComp = null;

    currentEnemyIndex: number = 0;

    getPlayer(): RoleManagerComp {
        return this.player;
    }

    getEnemy(): RoleManagerComp {
        return this.enemy;
    }

    protected onLoad(): void {
        RoleManager.inst = this;
    }

    public gameStart() {
        this.resetPlayer();
        this.resetEnemy();

        this.player.gameStart();
        this.enemy.gameStart();
    }

    public reFight() {
        this.resetPlayer();
        this.resetEnemy();

        this.player.gameStart();
        this.enemy.gameStart();
    }

    public fightNext() {
        this.currentEnemyIndex++;
        this.resetEnemy();
        this.enemy.gameStart();
    }

    public resetPlayerProperty() {
        let pm: PropertyManager = PropertyManager.inst;
        let p: PlayerProperty = pm.playerProperty;
        let roleProperty: RoleProperty =
            new RoleProperty(p.attack, p.quickness, p.hit, p.crit, p.defense, p.hp, p.dodge, p.tenacity, p.attackSpeed);

        this.player.state.resetProperty(roleProperty);
    }

    private resetPlayer() {
        let data: {} = getenemy_dataByIndex(0);
        let pm: PropertyManager = PropertyManager.inst;
        let p: PlayerProperty = pm.playerProperty;
        let roleProperty: RoleProperty =
            new RoleProperty(p.attack, p.quickness, p.hit, p.crit, p.defense, p.hp, p.dodge, p.tenacity, p.attackSpeed);

        let idle: Anim = generateAnim(getanim_dataById(data['idleAnim'].toString()), AnimType.idle);
        let attack: Anim = generateAnim(getanim_dataById(data['attackAnim'].toString()), AnimType.attack);
        let death: Anim = generateAnim(getanim_dataById(data['deathAnim'].toString()), AnimType.death);
        this.player.state.resetState(roleProperty, idle, attack, death);
    }

    private resetEnemy() {
        let data: {} = getenemy_dataByIndex(this.currentEnemyIndex);
        let roleProperty: RoleProperty =
            new RoleProperty(data['attack'], data['quickness'], data['hit'], data['crit'], data['defense'], data['hp'],
                data['dodge'], data['tenacity'], data['attackSpeed']);

        let idle: Anim = generateAnim(getanim_dataById(data['idleAnim'].toString()), AnimType.idle);
        let attack: Anim = generateAnim(getanim_dataById(data['attackAnim'].toString()), AnimType.attack);
        let death: Anim = generateAnim(getanim_dataById(data['deathAnim'].toString()), AnimType.death);
        this.enemy.state.resetState(roleProperty, idle, attack, death);
    }

    attack(isPlayer: boolean) {
        let target: DamageComp = isPlayer ? this.enemy.damageComp : this.player.damageComp;
        let causer: DamageComp = isPlayer ? this.player.damageComp : this.enemy.damageComp;

        // causer.applyDamage(target, new DamageEvent(), causer);
    }

}


