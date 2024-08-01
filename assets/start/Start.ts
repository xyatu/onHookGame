import { _decorator, assetManager, Component, director, game, Label, Prefab, Node, SpriteAtlas, SpriteFrame, AudioClip, view } from 'cc';
import { tgxModuleContext, tgxUIMgr } from '../core_tgx/tgx';
import { GameUILayers, GameUILayerNames } from '../scripts/GameUILayers';

import { ModuleDef } from '../scripts/ModuleDef';
import { SceneDef } from '../scripts/SceneDef';
import { WECHAT } from 'cc/env';
const { ccclass, property } = _decorator;

const _preloadBundles = [ModuleDef.BASIC, ModuleDef.ONHOOK];

const _preloadRes = [
    { bundle: ModuleDef.BASIC, url: 'ui_alert/UI_Alert', type: 'prefab' },
    { bundle: ModuleDef.BASIC, url: 'ui_waiting/UI_Waiting', type: 'prefab' },
    { bundle: ModuleDef.ONHOOK, url: 'Test/SpriteAtlas', type: 'spriteAtlas' },
    { bundle: ModuleDef.ONHOOK, url: 'Test/SpriteFrame', type: 'spriteFrame' },
    { bundle: ModuleDef.ONHOOK, url: 'Test/AudioClip', type: 'audioClip' },
];

const _loadingText = ['Loading.', 'Loading..', 'Loading...'];
const _totalNum = _preloadBundles.length + _preloadRes.length + 1;

@ccclass('Start')
export class Start extends Component {
    @property(Label)
    txtLoading: Label;

    @property(Prefab)
    uiCanvasPrefab: Prefab;

    @property(Node)
    loadingBar: Node;

    pauseLoading: boolean = false;

    private _percent: string = '';
    private _numCurrentLoaded = 0;

    start() {

        // if (WECHAT) {
        //     // 通过 wx.getSetting 查询用户是否已授权头像昵称信息
        //     wx.getSetting({
        //         success(res) {
        //             if (res.authSetting['scope.userInfo']) {
        //                 // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        //                 wx.getUserInfo({
        //                     success: function (res) {
        //                         console.log(res.userInfo)
        //                     }
        //                 })
        //             } else {
        //                 // 否则，先通过 wx.createUserInfoButton 接口发起授权
        //                 this.pauseLoading = true;
        //                 var info = wx.getWindowInfo()
        //                 let button = wx.createUserInfoButton({
        //                     type: 'text',
        //                     text: '获取用户信息',
        //                     style: {
        //                         left: info.windowWidth / 2 - 100,
        //                         top: info.windowHeight / 5 * 4 - 20,
        //                         width: 200,
        //                         height: 40,
        //                         lineHeight: 40,
        //                         backgroundColor: '#ff0000',
        //                         color: '#ffffff',
        //                         textAlign: 'center',
        //                         fontSize: 16,
        //                         borderRadius: 4
        //                     }
        //                 })
        //                 button.onTap((res) => {
        //                     // 用户同意授权后回调，通过回调可获取用户头像昵称信息
        //                     console.log(res)
        //                     this.pauseLoading = false;
        //                 })
        //             }
        //         }
        //     })
        // }

        tgxModuleContext.setDefaultModule(ModuleDef.BASIC);

        game.frameRate = 61;
        tgxUIMgr.inst.setup(this.uiCanvasPrefab, GameUILayers.NUM, GameUILayerNames);

        this.preloadBundle(0);
    }

    onResLoaded() {
        this._numCurrentLoaded++;
        this._percent = ~~(this._numCurrentLoaded / _totalNum * 100) + '%';
    }

    preloadBundle(idx: number) {
        assetManager.loadBundle(_preloadBundles[idx], null, (err, bundle) => {
            console.log('module:<' + _preloadBundles[idx] + '>loaded.');
            idx++;
            this.onResLoaded();
            if (idx < _preloadBundles.length) {
                this.preloadBundle(idx);
            }
            else {
                this.preloadRes(0);
            }
        });
    }

    preloadRes(idx: number) {
        let res = _preloadRes[idx];
        let bundle = assetManager.getBundle(res.bundle);

        let onComplete = () => {
            idx++;
            this.onResLoaded();
            if (idx < _preloadRes.length) {
                this.preloadRes(idx);
            }
            else {
                this.onPreloadingComplete();
            }
        }
        if (bundle) {
            if (res.type == 'prefab') {
                bundle.preload(res.url, Prefab, onComplete);
            }
            else if (res.type == 'spriteAtlas') {
                bundle.preloadDir(res.url, SpriteAtlas, onComplete);
            }
            else if (res.type == 'spriteFrame') {
                bundle.preloadDir(res.url, SpriteFrame, onComplete);
            }
            else if (res.type == 'audioClip') {
                bundle.preloadDir(res.url, AudioClip, onComplete);
            }
        }
    }

    onPreloadingComplete() {
        let bundle = assetManager.getBundle(ModuleDef.ONHOOK);
        bundle.preloadScene(SceneDef.ONHOOK_GAME, () => {
            this.onResLoaded();
            director.loadScene(SceneDef.ONHOOK_GAME);
        });
    }

    update(deltaTime: number) {

        if (this.pauseLoading) return;

        if (this._percent) {
            this.txtLoading.string = 'Loading...' + this._percent;
        }
        else {
            let idx = Math.floor(game.totalTime / 1000) % 3;
            this.txtLoading.string = _loadingText[idx];
        }
        this.loadingBar.setScale(this._numCurrentLoaded / _totalNum, 1, 1);
    }
}


