import { Component, error, EventHandler, Sprite, SpriteAtlas, _decorator, SpriteFrame, log } from "cc";
import { RoleState } from "./RoleState";
import { calcAttackSpeed } from "../Util/GameUtil";
import { Anim, AnimType } from "../Structure/Anim";
import { RoleManager } from "../Manager/RoleManager";
import { RoleManagerComp } from "./RoleManagerComp";

const { ccclass, property } = _decorator;

export class FrameCallback {
    frame: number = 0;
    event: Function = null;
    target: any = null;

    constructor(frame: number, target: any, event: Function) {
        this.frame = frame;
        this.target = target;
        this.event = event;
    }
}

type Event__ANY_NUMBER__Void = (target: any, currentIndex: number) => void;

class AllFrameCallback {
    target: any;
    event: Event__ANY_NUMBER__Void;

    constructor(target: any, event: Event__ANY_NUMBER__Void) {
        this.target = target;
        this.event = event;
    }
}

@ccclass
export class FrameAnimation extends Component {

    public currentAnim: Anim = null;

    @property(RoleState)
    state: RoleState = null;

    animType: AnimType = null;

    protected frameCount: number = 9;

    protected rate: number = 8;

    protected loop: boolean = true;

    protected runAtStart: boolean = true;

    protected frameCallback: Array<FrameCallback> = [];

    protected allFrameCallback: AllFrameCallback = null;

    protected completeCallback: Array<EventHandler> = [];

    protected endCallback: Array<EventHandler> = [];

    /**是否在播放中 */
    private running: boolean = false;

    private intervalTick: number = 0;

    /**当前展示的图片索引*/
    private currentIndex: number = 0;

    private frameStep = 0;

    /**是否循环播放*/
    public get Loop(): boolean { return this.loop; }

    /**是否在播放中 */
    public get Running(): boolean { return this.running; }

    public set anim(anim: Anim) {
        this.currentAnim = anim;
        this.frameCount = anim.anim.length;
        this.loop = anim.isLoop;
        this.setAnimType(anim.type);
        this.rate = anim.rate;
        this.currentIndex = 0;
    }

    public death() {
        this.animType = AnimType.death;
        this.Stop();
    }

    public isAttack() {
        return this.animType === AnimType.attack;
    }

    public isMove() {
        return this.animType === AnimType.move;
    }

    public isIdle() {
        return this.animType === AnimType.idle;
    }

    private setAnimType(animType: AnimType) {
        this.animType = animType;
    }

    public gameStart() {
        this.registCompleteCallback();

        this.rate = this.state.rate;
    }

    protected update(dt: number): void {
        if (!this.running) {
            return;
        }

        if (this.animType === AnimType.idle) {
            this.intervalTick -= dt;
            if (this.intervalTick <= 0) {
                this.node.parent.getComponent(RoleManagerComp).changeToAttack();
            }
        }

        this.frameStep += dt;
        if (this.frameStep >= 1 / this.rate) {
            this.frameStep -= 1 / this.rate;
            this.ChangeFrame();
        }
    }

    /**
     * 改变帧动画的图片
     */
    private ChangeFrame(): void {

        if (this.allFrameCallback) this.allFrameCallback.event(this.allFrameCallback.target, this.currentIndex);

        let isIndexEnd = this.currentIndex >= this.frameCount;

        this.frameCallback.forEach(fb => {
            if (fb.frame === this.currentIndex) {
                fb.event(fb.target, this.currentIndex);
            }
        });

        if (!this.loop && isIndexEnd) {
            this.running = false;
            this.completeCallback.forEach(callback => { callback.emit([]); });
            this.endCallback.forEach(callback => { callback.emit([]); });
            return;
        }

        if (isIndexEnd) {
            this.completeCallback.forEach(callback => { callback.emit([]); });
            this.currentIndex = 0;
        }
        if (!this.currentAnim.anim) {
            error("atlas not exist!")
            return;
        }
        let sprite = this.node.getComponent(Sprite);
        sprite.spriteFrame = this.currentAnim.anim[this.currentIndex];
        ++this.currentIndex;
    }

    /**
     * 执行帧动画,执行时会从第一张图开始
     */
    public Play(): void {
        this.running = true;

        this.currentIndex = 0;

        //调用一次，马上生效
        this.ChangeFrame();
    }

    /**
     * 恢复执行帧动画，会从当前帧继续执行
     */
    public Resume(loop: boolean = false): void {
        this.loop = loop;
        this.running = true;
        //调用一次，马上生效
        this.ChangeFrame();
    }

    public Pause(): void {
        this.running = false;
    }

    /**
     * 停止
     */
    public Stop(): void {


        if (this.animType === AnimType.move) {
            log(11)
        }

        this.running = false;
        this.runAtStart = false;
    }

    public bindFrameCallback(frameCallback: FrameCallback) {
        this.frameCallback.push(frameCallback);
    }

    public registAllFrameCallback(target: any, event: Event__ANY_NUMBER__Void) {
        this.allFrameCallback = new AllFrameCallback(target, event);
    }

    protected registCompleteCallback() {
        const eventHandler = new Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "FrameAnimation";
        eventHandler.handler = "resetInterval";

        this.completeCallback.push(eventHandler);
    }

    protected resetInterval() {
        let rm: RoleManagerComp = this.node.parent.getComponent(RoleManagerComp);

        switch (this.animType) {
            case AnimType.idle:

                break;

            case AnimType.attack:
                rm.changeToIdle();
                break;

            case AnimType.death:
                break;
        }

    }

    enterInterval(intervalTick: number) {
        this.intervalTick = intervalTick;
    }

    outInterval(attackRate: number) {
        this.rate = attackRate;
    }
}
