const FlipType = cc.Enum({
    HORIZONAL: 0,
    VERTICAL: 1
})
cc.Class({
    extends: cc.Component,

    properties: {
        flipType: {
            type: FlipType,
            default: FlipType.VERTICAL
        },
        frame: cc.SpriteFrame,


        fliping: false,
        covering: false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node.on('touchstart', this.touchstart, this)
        this.node.on('touchend', this.touchend, this)
        this.node.on('touchmove', this.touchmove, this)
        this.node.on('touchcancel', this.touchend, this)
        this.init();
    },
    init() {
        this.width = this.node.width * 0.8;
        this.height = this.node.height * 0.8;

        if (this.flipType === FlipType.VERTICAL) {
            this.r = this.height * 0.08;
            this.limitMoveLength = this.height / 2 + this.r * Math.PI / 2
            this.setFoward(cc.v2(0, -1));


        } else {
            this.r = this.width * 0.08;
            this.limitMoveLength = this.width / 2 + this.r * Math.PI / 2
            this.setFoward(cc.v2(1, 0));


        }

        this.setRadius(this.r);
        this.setDistance(0);
        this.setMDistance(0);
        this.setSize();
        this.setSubTexture(this.frame.getTexture())

    },
    touchstart(e) {
        this.clickStartPos = e.touch._point;
    },
    touchmove(e) {
        let vector = e.touch._point.sub(e.touch._startPoint);
        let length;
        if (this.flipType == FlipType.HORIZONAL) {
            length = vector.x;
        } else {
            length = vector.y;
        }
        this.flip(length);
    },
    touchend(e) {
        let vector = e.touch._point.sub(e.touch._startPoint);
        let length;
        if (this.flipType == FlipType.HORIZONAL) {
            length = vector.x;
        } else {
            length = vector.y;
        }

        if (length > this.limitMoveLength-this.r*2) {
            this.fliping = true;
            this.covering = false;
        } else {
            this.covering = true;
            this.fliping = false;
        }

    },

    flip(n) {
        if (!n) {
            console.trace(n)
        }
        this.flipDis = n;
        let d = n;
        let m;
        let length = this.limitMoveLength;
        if (d > length) {
            d = length;
            m = n - d;
            // this.fliping = false;
        }
        this.setDistance(n);
        this.setMDistance(m);
    },

    setFrame(n){
        this.setSubTexture(n.getTexture())
    },
    setSize() {
        this.node.getComponent('ShaderComponent').setSize();
    },
    setRadius(n) {
        this.node.getComponent('ShaderComponent').setRadius(n);
    },
    setFoward(n) {
        this.node.getComponent('ShaderComponent').setFlipFoward(n);
    },
    setDistance(n) {
        this.node.getComponent('ShaderComponent').setFlipDistance(n);
    },
    setMDistance(n) {
        this.node.getComponent('ShaderComponent').setMDistance(n);

    },
    setSubTexture(n) {
        this.node.getComponent('ShaderComponent').setSubTexture(n);
    },
    update(dt) {
        if (this.fliping) {
            this.covering = false;
            this.flipDis += dt * this.r*50;
            this.flip(this.flipDis);
            if (this.flipDis >= 3 * this.limitMoveLength) {
                this.fliping = false;
            }
        }

        if (this.covering) {
            this.fliping = false;
            this.flipDis -= dt * this.r*50;
            if (this.flipDis <= 0) {
                this.flipDis = 0;
                this.covering = false;
            }
            this.flip(this.flipDis);

        }
    },
});
