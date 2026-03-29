import { _decorator, AudioClip, AudioSource, Component, instantiate, Node, Prefab, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('game')
export class game extends Component {

    @property(Node)
    Block_Layer: Node = null;

    @property(Prefab)
    Block_Prefab: Prefab = null;

    @property({ type: [Node], visible: true })
    Base_Node_Array: Node[] = [];

    @property(AudioClip)
    Win_Audio: AudioClip = null;

    @property(AudioClip)
    Lose_Audio: AudioClip = null;

    @property(AudioClip)
    Place_Audio: AudioClip = null;

    @property(AudioClip)
    BackGround_Audio: AudioClip = null;

    blockNodeArr: Node[][] = [];
    blockNum: number = 3;

    protected onLoad(): void {
        window.game = this;
        this.blockNodeArr = [[], [], []]
        this.initBlock(this.blockNum);
    }
    
    initBlock(num) {
        if (num > 6) {
            num = 6
        }

        for (let i = 0; i < this.blockNodeArr.length; i++) {
            let arr = this.blockNodeArr[i];
            for (let j = 0; j < arr.length; j++) {
                arr[j].destroy();
            }
            this.blockNodeArr[i] = [];
        }

        for (let i = 0; i < num; i++) {
            let blockNode = instantiate(this.Block_Prefab);
            this.Block_Layer.addChild(blockNode);
            blockNode.setPosition(this.Base_Node_Array[0].x, -122 + 44 * i)
            blockNode.baseIndex = 0;
            blockNode.blockIndex = num - i - 1;
            blockNode.getComponent('block').init(num - i - 1);
            this.blockNodeArr[0].push(blockNode);
        }
    }

    baseIndexCheck(pos) {
        for (let i = 0; i < this.Base_Node_Array.length; i++) {
            let baseNode = this.Base_Node_Array[i];
            let width = baseNode.getComponent(UITransform).width
            if (pos.x > baseNode.x - width / 2 && pos.x < baseNode.x + width / 2) {
                return i;
            }
        }
        return -1;
    }

    isTopBlock(blockNode) {
        let arr = this.blockNodeArr[blockNode.baseIndex];
        return arr.length > 0 && arr[arr.length - 1] === blockNode;
    }

    playAudio(audioClip: AudioClip) {
        const audio = this.node.getComponent(AudioSource);
        audio.playOneShot(audioClip, 1.0);
    }

    placeBlock(blockNode) {
        if (!this.isTopBlock(blockNode)) {
            return false;
        }

        let index = this.baseIndexCheck(blockNode.getPosition());
        if (index == -1) {
            return false;
        }

        if (blockNode.baseIndex == index) {
            return false;
        }

        let arr = this.blockNodeArr[index];
        if (arr.length > 0 && arr[arr.length - 1].blockIndex <= blockNode.blockIndex) {
            return false;
        }

        let baseNode = this.Base_Node_Array[index];
        blockNode.setPosition(baseNode.x, baseNode.y);

        this.blockNodeArr[blockNode.baseIndex].pop();
        this.blockNodeArr[index].push(blockNode);
        blockNode.baseIndex = index;

        let len = this.blockNodeArr[blockNode.baseIndex].length;
        blockNode.y = -122 + 44 * (len - 1);

        if (this.blockNodeArr[2].length == this.blockNum) {
            this.playAudio(this.Win_Audio);
            this.blockNum++;
            this.initBlock(this.blockNum);
            return true;
        }

        this.playAudio(this.Place_Audio);

        return true
    }
}

