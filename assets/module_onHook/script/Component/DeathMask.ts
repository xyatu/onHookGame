import { _decorator, Component, Label, Node } from 'cc';
import { GameManager } from '../Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('DeathMask')
export class DeathMask extends Component {

    @property(Label)
    timeUI: Label = null;

    time: number = 3;

    protected onEnable(): void {
        this.time = 3;
        this.timeUI.string = `重新挑战 (${this.time})`;
        this.schedule(this.resetTime, 1);
    }

    private resetTime() {
        this.time--;
        this.timeUI.string = `重新挑战 (${this.time})`;
        if (this.time <= 0) {
            this.unschedule(this.resetTime);

            this.reFight();
        }
    }

    private reFight() {
        GameManager.inst.reFight();
        this.node.active = false;
    }

    protected onDisable(): void {
        this.unschedule(this.resetTime);
    }
}


