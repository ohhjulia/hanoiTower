import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('game')
export class game extends Component {

    @property(Node)
    Block_Layer: Node = null;

    @property(Prefab)
    Block_Prefab: Prefab = null;

    @property({ type: [Node], visible: true })
    Base_Node_Array: Node[] = [];

    protected onLoad(): void {
        this.initBlock(1);
    }
    
    initBlock(num) {
        let blockNode = instantiate(this.Block_Prefab);
        this.Block_Layer.addChild(blockNode);
        // blockNode.setParent(this.Block_Layer);
        // blockNode.setPosition(0, 0, 0);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

