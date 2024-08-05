import { _decorator, Asset, assetManager, AssetManager, AudioClip, Component, error, log, Node, SpriteAtlas, SpriteFrame } from 'cc';
import { ModuleDef } from '../../../scripts/ModuleDef';
import { GameManager } from '../Manager/GameManager';
const { ccclass, property } = _decorator;


class Res {
    spriteAtlas: Map<string, SpriteAtlas> = new Map();
    spriteFrames: Map<string, SpriteFrame> = new Map();
    sounds: Map<string, AudioClip> = new Map();
    // 类型映射
    private resourceMap: Map<Function, Map<string, any>> = new Map();

    constructor() {
        this.resourceMap.set(SpriteAtlas, this.spriteAtlas);
        this.resourceMap.set(SpriteFrame, this.spriteFrames);
        this.resourceMap.set(AudioClip, this.sounds);
    }

    // 泛型方法，用于获取资源
    getRes<T>(type: { new(): T }, name: string): T | undefined {
        const resourceMap = this.resourceMap.get(type);
        if (resourceMap) {
            return resourceMap.get(name) as T;
        } else {
            throw new Error(`Unsupported resource type: ${type}`);
        }
    }
}

const resourcePath: string = 'test';
const spriteAtlasPath: string = 'SpriteAtlas';
const spriteFramePath: string = 'SpriteFrame';
const audioClipPath: string = 'AudioClip';
const loadFinish: boolean[] = [false, false, false];

@ccclass('DataGetter')
export class DataGetter extends Component {

    public static inst: DataGetter = null;

    private res: Res = null;

    protected onLoad(): void {
        DataGetter.inst = this;
        this.res = new Res();
        this.loadRes();
    }

    loadRes() {
        let bundle: AssetManager.Bundle = assetManager.getBundle(ModuleDef.ONHOOK);
        bundle.loadDir(`${resourcePath}/${spriteAtlasPath}`, SpriteAtlas, (error, data) => {
            data.forEach(spriteAtlas => {
                this.res.spriteAtlas.set(spriteAtlas.name, spriteAtlas);
            })

            this.complete(0);
        })
        bundle.loadDir(`${resourcePath}/${spriteFramePath}`, SpriteFrame, (error, data) => {
            data.forEach(spriteFrame => {
                this.res.spriteFrames.set(spriteFrame.name, spriteFrame);
            })

            this.complete(1);
        })
        bundle.loadDir(`${resourcePath}/${audioClipPath}`, AudioClip, (error, data) => {
            data.forEach(sound => {
                this.res.sounds.set(sound.name, sound);
            })

            this.complete(2);
        })
    }

    complete(index: number) {
        loadFinish[index] = true;
        if (loadFinish.filter(item => !item).length <= 0) {

            log(this.res.spriteAtlas)
            GameManager.inst.gameStart();
        }
    }

    getRes<T = SpriteAtlas | SpriteFrame | AudioClip>(type: new () => T, name: string): T {
        return this.res.getRes(type, name);
    }
}


