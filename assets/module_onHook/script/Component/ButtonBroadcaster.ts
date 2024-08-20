import { _decorator, Component, Node, Button } from 'cc';
import { playOneShotById } from '../Manager/SoundPlayer';
const { ccclass, property } = _decorator;

@ccclass('ButtonBroadcaster')
export class ButtonBroadcaster extends Component {
    start() {
        // 遍历并监听所有按钮的点击事件
        this.node.getComponentsInChildren(Button).forEach(button => {
            button.node.on(Button.EventType.CLICK, this.onButtonClick, this);
        });
    }

    onButtonClick(event: Event) {
        playOneShotById(10003);
        // 处理点击事件
    }
}
