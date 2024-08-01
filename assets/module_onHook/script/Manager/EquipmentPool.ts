import { _decorator, Component, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EquipmentPool')
export class EquipmentPool extends Component {

    @property(Prefab)
    equipmentPrefab: Prefab = null

    private pool: NodePool = null;
    private maxSize: number = 1000;

    public static inst: EquipmentPool = null;

    protected onLoad(): void {
        EquipmentPool.inst = this;
        this.pool = new NodePool();
    }

    get(): Node {
        let node = this.pool.get();
        if (!node) {
            node = instantiate(this.equipmentPrefab);
        }

        return node;
    }

    put(node: Node): number {
        if (this.pool.size() >= this.maxSize) {
            node.destroy();
        }
        else {
            this.pool.put(node);
        }

        return this.pool.size();
    }

    clear(): number {
        this.pool.clear();
        return this.pool.size();
    }
}


