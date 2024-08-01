import { _decorator, Component, EventTouch, Label, log, Node, NodeEventType, RichText, Sprite, SpriteFrame } from 'cc';
import { Quality, Region, TestregionToString as testRegionToString } from '../Structure/Equipment';
import { BackpackManager } from '../Manager/BackpackManager';
import { setColor, setOutline } from '../Util/GameUtil';
const { ccclass, property } = _decorator;

@ccclass('EquipmentState')
export class EquipmentState extends Component {

    @property(Label)
    private region: Label = null;
    @property(Node)
    private isLock: Node = null;
    @property(Node)
    private isEquip: Node = null;
    @property(Sprite)
    bg: Sprite = null;

    @property(Node)
    private selectFrame: Node = null;

    @property(SpriteFrame)
    qualitySprite: SpriteFrame[] = [];

    @property(RichText)
    strengthenLevel: RichText = null;


    private i: number = 0;

    set index(index: number) {
        this.i = index;
    }

    get index(): number {
        return this.i;
    }

    protected start(): void {
    }

    public setStrengthenLevel(level: number) {
        if (level > 0) {
            this.strengthenLevel.node.active = true;
            this.strengthenLevel.string = setColor(setOutline(`+${level}`, '000000', 2), 'ffffff');
        }
        else {
            this.strengthenLevel.node.active = false;
        }
    }

    private resetQuality(quality: Quality) {
        this.bg.spriteFrame = this.qualitySprite[quality];
    }

    setStyle(region: Region, quality: Quality, isEquip: boolean, isLock: boolean) {
        this.region.string = testRegionToString(region);
        this.resetQuality(quality);
        this.isLock.active = isLock;
        this.isEquip.active = isEquip;
    }

    selectEquipment() {
        BackpackManager.inst.onEquipmentSelect(this);
    }

    setSelectStyle() {
        this.selectFrame.active = true;
    }

    setUnSelectStyle() {
        this.selectFrame.active = false;
    }

    equipStyle() {
        this.isEquip.active = true;
    }
    unEquipStyle() {
        this.isEquip.active = false;
    }

    lockStyle() {
        this.isLock.active = true;
    }
    unLockStyle() {
        this.isLock.active = false;
    }
}


