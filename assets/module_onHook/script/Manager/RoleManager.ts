import { _decorator, Component, EventHandler, Label, log, Material, Node, ProgressBar, Sprite, SpriteFrame, UITransform } from 'cc';
import { RoleBehavior } from '../Role/RoleBehavior';
import { RoleState } from '../Role/RoleState';
import { FrameAnimation, FrameCallback } from '../Role/FrameAnimation';
import { GameManager } from './GameManager';
import { DamageComp } from '../Role/DamageComp';
import { DamageEvent } from '../Role/DamageEvent';
import { PlayerProperty, PropertyManager } from './PropertyManager';
import { Anim, AnimType } from '../Structure/Anim';
import { generateAnim, getenemy_dataByIndex } from '../Util/GameUtil';
import { RoleManagerComp } from '../Role/RoleManagerComp';
import { getanim_dataById } from '../data/anim_data';
import { PlayerState } from '../Role/PlayerState';
import { enemyPosAndSize } from '../data/GameConfig';
import { SaveGame } from '../Util/SaveGameUtil';
import { playOneShotById, playOneShotBySound } from './SoundPlayer';
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

    @property(Node)
    playerHome: Node = null;

    @property(RoleManagerComp)
    private enemy: RoleManagerComp = null;

    @property(Node)
    enemyHome: Node = null;

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

    moveIn() {
        this.player.moveIn();
        this.enemy.moveIn();
    }

    public reFight() {
        this.resetPlayer();
        this.resetEnemy();

        this.player.gameStart();
        this.enemy.gameStart();
    }

    public fightNext() {
        this.currentEnemyIndex++;
        SaveGame.get().saveMonster();
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

        this.getPlayer().node.getComponent(PlayerState).resetState(roleProperty);
    }

    private resetEnemy() {
        let data: {} = getenemy_dataByIndex(this.currentEnemyIndex);

        this.getEnemy().node.getChildByName('Sprite').setPosition(enemyPosAndSize[this.currentEnemyIndex].pos)
        this.getEnemy().node.getChildByName('Sprite').getComponent(UITransform).setContentSize(enemyPosAndSize[this.currentEnemyIndex].size);

        let roleProperty: RoleProperty =
            new RoleProperty(data['attack'], data['quickness'], data['hit'], data['crit'], data['defense'], data['hp'],
                data['dodge'], data['tenacity'], data['attackSpeed']);

        let idle: Anim = generateAnim(getanim_dataById(data['idleAnim'].toString()), AnimType.idle);
        let attack1: Anim = generateAnim(getanim_dataById(data['attackAnim1'].toString()), AnimType.attack);
        let attack2: Anim = generateAnim(getanim_dataById(data['attackAnim2'].toString()), AnimType.attack);
        let attack3: Anim = generateAnim(getanim_dataById(data['attackAnim3'].toString()), AnimType.attack);
        let death: Anim = generateAnim(getanim_dataById(data['moveAnim'].toString()), AnimType.move);
        this.enemy.state.resetState(roleProperty, idle, attack1, attack2, attack3, death);
    }

    resetPos(isplayer: boolean) {
        if (isplayer) {
            this.getPlayer().node.setPosition(this.playerHome.position);
        }
        else {
            this.getEnemy().node.setPosition(this.enemyHome.position);
        }
    }

    attack(isPlayer: boolean) {
        let target: DamageComp = isPlayer ? this.enemy.damageComp : this.player.damageComp;
        let causer: DamageComp = isPlayer ? this.player.damageComp : this.enemy.damageComp;

        causer.applyDamage(target, new DamageEvent(), causer);
    }

}


