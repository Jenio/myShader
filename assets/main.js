
let effects = cc.Enum({
    0: 'normalFlip', normalFlip: 0,
    1: 'scaleFlip', scaleFlip: 1,
    2: 'color', color: 2,
    3: 'rgb', rgb: 3,
    4: 'reel', reel: 4,
    5: 'reel2', reel2: 5,

})
cc.Class({
    extends: cc.Component,

    properties: {
        slider: cc.Slider,
        view: cc.Node,
        content: cc.Node,
        _progress: 0,
        _index: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.maxLength = 6;
        this.loadEffect('reel2');
    },

    start() {

    },
    loadEffect(str) {
        let that = this;
        cc.loader.loadRes(str, cc.Prefab, (err, res) => {
            that._index = effects[str];
            let node = cc.instantiate(res);
            that.content.removeAllChildren();
            node.parent = that.content;
            node._components[0].init(that._progress);
            cc.log('next:progress,', that, that._progress)
        })
    },
    prev() {
        let index = this._index - 1;
        if (index < 0) {
            index += this.maxLength;
        }
        this.loadEffect(effects[index]);
    },
    next() {
        let index = this._index + 1;
        if (index >= this.maxLength) {
            index -= this.maxLength;
        }
        this.loadEffect(effects[index]);
    },
    onSlide(e) {
        this._progress = e.progress;
        this.content.children[0]._components[0].setProgress(this._progress);
    },
    // update (dt) {},
});
