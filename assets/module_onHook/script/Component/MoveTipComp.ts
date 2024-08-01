import { _decorator, color, Color, Component, Label, Node, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MoveTipComp')
export class MoveTipComp extends Component {
    @property(Label)
    content: Label = null;

    setContent(content: string): MoveTipComp {
        this.content.string = content;
        return this;
    }

    protected onEnable(): void {
        tween(this.content.color)
            .to(2, { a: 0 })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}


