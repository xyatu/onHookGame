import { _decorator, Animation, animation, Button, Component, instantiate, Label, log, Node, tween, Tween, UITransform, v3, Widget } from 'cc';
import { EquipState } from './OptionsComp';
import { EquipmentState } from './EquipmentState';
import { Equipment, regionToEngString, StrengthenState } from '../Structure/Equipment';
import { getstrengthen_dataById } from '../data/strengthen_data';
import { GameConfig } from '../data/GameConfig';
import { BackpackManager } from '../Manager/BackpackManager';
import { PropertyManager } from '../Manager/PropertyManager';
import { stregnthenStateToString } from '../Util/GameUtil';
import { GameManager } from '../Manager/GameManager';
import { tgxUIAlert } from '../../../core_tgx/tgx';
import { IOS } from 'cc/env';
import { SaveGame } from '../Util/SaveGameUtil';
import { playOneShotById } from '../Manager/SoundPlayer';
const { ccclass, property } = _decorator;


enum SState {
    base,
    success,
    field,
}

@ccclass('StrengthenComp')
export class StrengthenComp extends Component {

    private static inst: StrengthenComp = null;

    @property(Node)
    private base: Node = null;
    @property(Node)
    private success: Node = null;
    @property(Node)
    private field: Node = null;
    @property(Node)
    private fileldMask: Node = null;
    @property(Node)
    private iconBox: Node = null;
    @property(Label)
    private successRate: Label = null;
    @property(Label)
    private successRateAdded: Label = null;
    @property(Label)
    private strengthenLabel: Label = null;
    @property(Button)
    private strengthenBtn: Button = null;
    @property(Button)
    private backBtn: Button = null;
    @property(Label)
    private price: Label = null;
    @property(Node)
    private animNode: Node = null;
    @property(Animation)
    private strengthenAnim: Animation = null;


    private strengthenTween: Tween<Node> = null;

    private state: SState = SState.base;
    private successNum: number = 0;
    private priceNum: number = 0;
    private successAdded: number = 0;
    private equipment: Equipment = null;
    private es: EquipmentState = null;
    private strengthenState: StrengthenState = null;

    protected onLoad(): void {
        StrengthenComp.inst = this;
    }

    public setStyle(es: EquipmentState, e: Equipment) {
        this.equipment = e;

        this.resetStyle();
        this.setIcon(es.node);
    }

    private setIcon(node: Node) {
        let Icon: Node = instantiate(node);
        Icon.setPosition(0, 0, Icon.position.z)
        this.iconBox.addChild(Icon);
        Icon.getComponent(UITransform).setContentSize(152, 152);
        this.es = Icon.getComponent(EquipmentState);
    }

    private setSuccessRate(successRate: number) {
        this.successRate.string = `${successRate * 100}%`;
        this.successNum = successRate;
    }

    private setPrice(price: number) {
        this.price.string = price.toString();
        this.priceNum = price;
    }

    private back() {
        this.node.active = false;
        this.priceNum = 0;
        this.successNum = 0;
        this.equipment = null;
    }

    protected onEnable(): void {
        this.base.active = true;
        this.success.active = false;
        this.field.active = false;
        this.fileldMask.active = false;
        this.strengthenBtn.node.active = true;
        this.animNode.active = false;
    }

    protected onDisable(): void {
        this.base.active = true;
        this.success.active = false;
        this.field.active = false;
        this.fileldMask.active = false;
        this.strengthenBtn.node.active = true;
        this.animNode.active = false;
    }

    private doStrength() {
        if (this.priceNum > PropertyManager.inst.playerProperty.gold) {
            tgxUIAlert.show('金币不足');
            return;
        }

        if (this.equipment.strengthenLevel >= 20) {
            tgxUIAlert.show(`你确定要打碎吗`, true).onClick(isOK => {
                if (isOK) {
                    this.strengthenState = this.equipment.strengthen(this.successNum + this.useAdded());

                    log(stregnthenStateToString(this.strengthenState));

                    this.strengthenBtn.interactable = false;
                    this.backBtn.interactable = false;

                    this.getStrengthenTween().start();
                }
            })

            return;
        }

        BackpackManager.inst.onChangeGold(-this.priceNum);
        this.strengthenState = this.equipment.strengthen(this.successNum + this.useAdded());

        log(stregnthenStateToString(this.strengthenState));

        this.strengthenBtn.interactable = false;
        this.backBtn.interactable = false;

        this.getStrengthenTween().start();
    }

    private resetStyle() {
        let data: {} = getstrengthen_dataById(this.equipment.strengthenLevel + 1);
        if (data) {
            let price: number = data[regionToEngString(this.equipment.region)] * GameConfig.qualityPriceCrit[this.equipment.quality];
            let successRate: number = data['successRate'];
            this.setSuccessRate(successRate);
            this.setPrice(price);
            this.strengthenLabel.string = '强化';
        }
        else {
            this.setMaxLevelStyle();
        }
    }

    private resetIcon() {
        this.es.setStrengthenLevel(this.equipment.strengthenLevel);
    }

    private setMaxLevelStyle() {
        this.setSuccessRate(0);
        this.setPrice(0);
        this.strengthenLabel.string = '打碎';
    }

    private strengthenFinish() {
        let self: StrengthenComp = StrengthenComp.inst;
        self.animNode.active = true;
        self.strengthenAnim.play();
        switch (self.strengthenState) {
            case StrengthenState.success:
                self.setSuccessStyle();
                self.iconBox.setScale(1, 1, 1);
                break;
            case StrengthenState.field:
                self.setFieldStyle();
                self.iconBox.setScale(1, 1, 1);
                break;
            case StrengthenState.reduce:
                self.setFieldStyle();
                self.iconBox.setScale(1, 1, 1);
                GameManager.inst.showTip('装备降级');
                break;
            case StrengthenState.break:
                self.setBreakStyle();
                self.iconBox.setScale(1, 1, 1);
                GameManager.inst.showTip('装备损坏');
                BackpackManager.inst.onEquipmentBreak();
                self.setAdded(null);
                break;
        }

        self.resetStyle();
        self.resetIcon();
        BackpackManager.inst.setStrengthenLevel(self.equipment.strengthenLevel);
        PropertyManager.inst.resetPlayerProperty();


        self.strengthenBtn.interactable = true;
        self.backBtn.interactable = true;

        SaveGame.saveGame();
    }

    private useAdded(): number {
        let result: number = this.successAdded;
        this.successAdded = 0;
        this.successRateAdded.node.active = false;
        return result;
    }

    private setAdded(added: number) {
        this.successAdded = (this.equipment.strengthenLevel - 15) / 100;
        if (this.successAdded > 0) {
            this.successRateAdded.string = `+${this.successAdded * 100}%`;
            this.successRateAdded.node.active = true;
        }
    }

    private setSuccessStyle() {
        this.base.active = false;
        this.success.active = true;
        this.field.active = false;
        this.fileldMask.active = false;
    }

    private setFieldStyle() {
        this.base.active = false;
        this.success.active = false;
        this.field.active = true;
        this.fileldMask.active = false;
    }

    private setBreakStyle() {
        this.base.active = false;
        this.success.active = false;
        this.field.active = true;
        this.fileldMask.active = true;
    }

    private getStrengthenTween(): Tween<Node> {

        playOneShotById(10006);
        if (!this.strengthenTween) {
            this.strengthenTween = tween(this.iconBox);
            this.strengthenTween.to(0.5, { scale: v3(0, 0, 1) }).call(this.strengthenFinish);
        }
        return this.strengthenTween;
    }
}


