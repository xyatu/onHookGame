import { _decorator, Button, Component, director, Game, game, instantiate, Label, log, Node, NodeEventType, Prefab, ProgressBar, SpriteAtlas } from 'cc';
import { Equipment, Quality, Region, regionToEngString, TestregionToString } from '../Structure/Equipment';
import { BackpackManager } from './BackpackManager';
import { EventManager } from './EventManager';
import { EquipmentState } from '../Component/EquipmentState';
import { EquipState, OptionsComp } from '../Component/OptionsComp';
import { PropertyManager } from './PropertyManager';
import { RoleManager } from './RoleManager';
import { tgxUIAlert } from '../../../core_tgx/tgx';
import { GameConfig } from '../data/GameConfig';
import { WECHAT } from 'cc/env';
import { SelectAlert } from '../Component/SelectAlert';
import { StrengthenComp } from '../Component/StrengthenComp';
import { getstrengthen_dataById } from '../data/strengthen_data';
import { MoveTipComp } from '../Component/MoveTipComp';
import { SaveGame } from '../Util/SaveGameUtil';
import { DataGetter } from '../Util/DataGetter';
const { ccclass, property } = _decorator;


@ccclass('GameManager')
export class GameManager extends Component {
    public static inst: GameManager = null;
    @property(Node)
    private createAlert: Node = null;
    @property(Node)
    private selectAlert: Node = null;
    @property(SelectAlert)
    selectAlertComp: SelectAlert = null;
    @property(StrengthenComp)
    private strengthenAlert: StrengthenComp = null;
    @property(Node)
    private strengthenTip: Node = null;
    @property(Prefab)
    private tipPrefab: Prefab = null;

    @property(Node)
    private canvas: Node = null;
    @property(Node)
    private mask: Node = null;
    @property(Node)
    private playerDeathMask = null;

    @property(Node)
    rank: Node = null;

    resetTick: number = 0;

    selectedEquipment: Node = null;

    protected onLoad(): void {
        GameManager.inst = this;
    }

    registerEvent() {

        game.on(Game.EVENT_SHOW, this.onShow, this);

        // 浏览器窗口关闭或刷新事件
        window.addEventListener('beforeunload', this.saveDate);
        // 移动端页面隐藏事件
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveDate();
            }
        });
    }

    onShow() {
        SaveGame.loadTime();
    }

    saveDate() {
        SaveGame.get().saveDate();
    }

    onDestroy() {
        // 移除事件监听器
        window.removeEventListener('beforeunload', this.saveDate);
        document.removeEventListener('visibilitychange', this.saveDate);
    }

    protected start(): void {
        let eventManager: EventManager = EventManager.inst;

        this.mask.active = true;

        if (eventManager) {
            eventManager.cbFllowEquipmentSelect.register(this.onES_showUI);
            eventManager.cbOnEquipmentStrengthen.register(this.onEST_showUI);

            eventManager.cbOnEquipmentUnSelect.register(this.onEUS_hideOptions);
        }
        this.canvas.on(NodeEventType.TOUCH_END, this.onEquipmentUnSelect);
    }

    protected update(dt: number): void {
        this.resetTick += dt;
        if (this.resetTick >= GameConfig.resetDataTime) {
            this.resetTick = 0;
            // if (WECHAT) {
            //     wx.postMessage({
            //         type: 'resetData',
            //         data: {
            //             x: 0,
            //             y: 0,
            //             width: 750,
            //             height: 1334,
            //         }
            //     });
            // }
        }
    }

    public gameStart() {
        // 绑定游戏退出事件
        this.registerEvent();

        log(DataGetter.inst.getRes(SpriteAtlas,'equipment'))

        SaveGame.get().loadGame();
        BackpackManager.inst.gameStart();
        PropertyManager.inst.gameStart();
        RoleManager.inst.gameStart();
        this.mask.active = false;
        RoleManager.inst.moveIn();
    }

    public spawnEquipment(): Equipment {
        let euqipment = new Equipment();
        // BackpackManager.inst.pickupEquipment(euqipment);
        return euqipment;
    }

    private onEquipmentUnSelect() {
        BackpackManager.inst.onEquipmentUnSelect();
    }

    public onBackpackScroll() {
        // BackpackManager.inst.onEquipmentUnSelect();
    }

    public death(isPlayer: boolean) {
        if (isPlayer) {
            this.playerDeath();
        }
        else {
            this.enemyDeath();
        }
    }

    private playerDeath() {
        // this.playerDeathMask.active = true;
    }

    private enemyDeath() {
        this.showEnemyDeathUI();
    }

    private showEnemyDeathUI() {
        // tgxUIAlert.show(`你击败了敌人，你获得了${1000}金币`, false).onClick(isOK => {
        //     if (isOK) {
        //         BackpackManager.inst.onChangeGold(1000);
        //         RoleManager.inst.fightNext();
        //     }
        // })
        RoleManager.inst.fightNext();
    }

    public reFight() {
        RoleManager.inst.reFight();
    }

    public showTip(content: string) {
        let tip: Node = instantiate(this.tipPrefab);
        tip.getComponent(MoveTipComp).setContent(content).node.active = true;
        this.strengthenTip.addChild(tip);
    }

    //In UI==================================================
    private onES_showUI(e: Equipment, isLock: boolean, isEquip: boolean, oldE: Equipment) {
        let gm: GameManager = GameManager.inst;
        let selectAlert: Node = gm.selectAlert;
        selectAlert.active = true;

        gm.selectAlertComp.setStyle(e, isLock, isEquip, oldE)

    }

    private onEST_showUI(es: EquipmentState, e: Equipment) {
        let gm: GameManager = GameManager.inst;
        gm.strengthenAlert.node.active = true;
        gm.strengthenAlert.setStyle(es, e);
    }

    private onEUS_hideOptions() {
        let equipmentOptions: Node = GameManager.inst.selectAlert;
        equipmentOptions.active = false;
    }

    private saleAll() {
        BackpackManager.inst.onSale(true);
    }

    private showPlayerProperty() {
        PropertyManager.inst.showPlayerProperty();
    }

    private showCreateAlert() {
        this.createAlert.active = true;
    }

    private showRank() {
        this.rank.active = true;
    }

    private hideRank() {
        this.rank.active = false;
    }
}


