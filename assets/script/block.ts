import { _decorator, Atlas, Component, Node, Sprite, SpriteAtlas, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('block')
export class block extends Component {

    @property(SpriteAtlas)
    Color_Atlas: SpriteAtlas = null
    startPod: any = null;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    init(blockIndex: number) {
        this.node.getComponent(Sprite).spriteFrame = this.Color_Atlas.getSpriteFrame(blockIndex.toString())
        this.node.getComponent(UITransform).width = 80 + blockIndex * 40
    }

    canMove: boolean = false;

    onTouchStart(event) {
        this.canMove = window.game.isTopBlock(this.node);
        if (!this.canMove) return;
        this.startPod = this.node.getPosition();
    }

    onTouchMove(event) {
        if (!this.canMove) return;
        const delta = event.getUIDelta();
        const pos = this.node.getPosition();
        this.node.setPosition(pos.x + delta.x, pos.y + delta.y, pos.z);
    }

    onTouchEnd(event) {
        if (!this.canMove) return;
        let canPlace = window.game.placeBlock(this.node);
        if (!canPlace) {
            this.node.setPosition(this.startPod);
        }
    }


    update(deltaTime: number) {
        
    }
}

