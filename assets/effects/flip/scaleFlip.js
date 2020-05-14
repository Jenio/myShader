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
        sprite: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    init(n) {

        this.sprite.getComponent('ShaderComponent').myStart();


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
        this.setProgress(n);
        cc.log('set progress:', n)

    },

    setProgress(n) {

        this.flip(this.limitMoveLength * 2.3 * n);
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

    setFrame(n) {
        this.setSubTexture(n.getTexture())
    },
    setSize() {
        this.sprite.getComponent('ShaderComponent').setSize();
    },
    setRadius(n) {
        this.sprite.getComponent('ShaderComponent').setRadius(n);
    },
    setFoward(n) {
        this.sprite.getComponent('ShaderComponent').setFlipFoward(n);
    },
    setDistance(n) {
        this.sprite.getComponent('ShaderComponent').setFlipDistance(n);
    },
    setMDistance(n) {
        this.sprite.getComponent('ShaderComponent').setMDistance(n);

    },
    setSubTexture(n) {
        this.sprite.getComponent('ShaderComponent').setSubTexture(n);
    },

});
