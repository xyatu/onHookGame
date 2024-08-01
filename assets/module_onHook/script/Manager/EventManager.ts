import { _decorator, Component } from 'cc';
import { EquipmentState } from '../Equipment/EquipmentState';
import { Equipment } from '../Structure/Equipment';
const { ccclass } = _decorator;

type Event__EquipmentState__void = (args: EquipmentState) => void;
type Event__EquipmentState_Equipment__void = (es: EquipmentState, e: Equipment) => void;
type Event__Equipment_Doubboolean_Equipment__void = (equipment: Equipment, isLock: boolean, isEquip: boolean, oldEquipment: Equipment) => void;
type Evnet__number__void = (args: number) => void;
type Evnet__EquipmentState_number__void = (arg1: EquipmentState, arg2: number) => void;

/**
 * 事件类，用来管理事件的注册，注销，广播
 * @template T 回调函数的类型
 * @param cb 回调列表
 */
class Event<T extends (...args: any[]) => any> {
    private cb: Set<T> = new Set<T>();

    /**
     * 注册回调（绑定）
     * @param callback 将要注册的回调
     */
    register(callback: T) {
        this.cb.add(callback);
    }

    /**
     * 注销回调（解绑）
     * @param callback 将要注销的回调
     */
    unregister(callback: T) {
        this.cb.delete(callback);
    }

    /**
     * 广播
     * @param args 广播参数
     */
    broadCast(...args: any[]) {
        this.cb.forEach(cb => {
            try {
                cb(...args);
            } catch (error) {
                console.error(`Error in callback: Function: ${cb}, error: ${error}`);
            }
        });
    }
}

@ccclass('EventManager')
export class EventManager extends Component {

    public static inst: EventManager = null;

    /**装备拾取 */
    public cbOnPickupEquipment: Event<Evnet__number__void> = new Event<Evnet__number__void>();
    /**装备选中 */
    public cbOnEquipmentSelect: Event<Event__EquipmentState__void> = new Event<Event__EquipmentState__void>();
    public cbFllowEquipmentSelect: Event<Event__Equipment_Doubboolean_Equipment__void> = new Event<Event__Equipment_Doubboolean_Equipment__void>();
    /**装备取消选中 */
    public cbOnEquipmentUnSelect: Event<Event__EquipmentState__void> = new Event<Event__EquipmentState__void>();
    /**装备穿戴 */
    public cbOnEquipmentEquip: Event<Event__EquipmentState__void> = new Event<Event__EquipmentState__void>();
    /**装备卸下 */
    public cbOnEquipmentUnEquip: Event<Event__EquipmentState__void> = new Event<Event__EquipmentState__void>();
    /**装备穿戴排序 */
    public cbOnBackpackReorder: Event<Evnet__EquipmentState_number__void> = new Event<Evnet__EquipmentState_number__void>();
    /**装备锁定 */
    public cbOnEquipmentLock: Event<Event__EquipmentState__void> = new Event<Event__EquipmentState__void>();
    /**装备解锁 */
    public cbOnEquipmentUnLock: Event<Event__EquipmentState__void> = new Event<Event__EquipmentState__void>();
    /**装备出售 */
    public cbOnEquipmentSale: Event<Event__EquipmentState__void> = new Event<Event__EquipmentState__void>();
    /**装备强化 */
    public cbOnEquipmentStrengthen: Event<Event__EquipmentState_Equipment__void> = new Event<Event__EquipmentState_Equipment__void>();
    /**装备损坏 */
    public cbOnEquipmentBreak: Event<Event__EquipmentState__void> = new Event<Event__EquipmentState__void>();
    /**金币变更 */
    public cbOnChangeGold: Event<Evnet__number__void> = new Event<Evnet__number__void>();


    protected onLoad(): void {
        if (EventManager.inst) {
            console.warn("EventManager already exists!");
            this.node.destroy();
            return;
        }
        EventManager.inst = this;
    }

    public static getInstance(): EventManager {
        if (!EventManager.inst) {
            console.error("EventManager instance is not initialized!");
        }
        return EventManager.inst;
    }
}
