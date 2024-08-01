import { _decorator, Component, Label, Node } from 'cc';
import { PlayerProperty } from '../Manager/PropertyManager';
const { ccclass, property } = _decorator;

@ccclass('PropertyComp')
export class PropertyComp extends Component {
    @property(Label)
    attack: Label = null;
    @property(Label)
    quickness: Label = null;
    @property(Label)
    hit: Label = null;
    @property(Label)
    crit: Label = null;
    @property(Label)
    defense: Label = null;
    @property(Label)
    hp: Label = null;
    @property(Label)
    dodge: Label = null;
    @property(Label)
    tenacity: Label = null;

    resetProperty(playerProperty: PlayerProperty) {
        this.attack.string = playerProperty.attack.toString();
        this.quickness.string = playerProperty.quickness.toString();
        this.hit.string = playerProperty.hit.toString();
        this.crit.string = playerProperty.crit.toString();
        this.defense.string = playerProperty.defense.toString();
        this.hp.string = playerProperty.hp.toString();
        this.dodge.string = playerProperty.dodge.toString();
        this.tenacity.string = playerProperty.tenacity.toString();
    }

    hideUI() {
        this.node.active = false;
    }
}


