
cc.Class({
    extends: cc.Component,

    properties: {
        sprite: cc.Node,
        txt: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    setProgress(n) {
        this.flip(660 * n);
    },
    init(n) {
        this.sprite.getComponent('ShaderComponent').myStart();

        this.duration = .6;

        let width = this.node.width;
        let height = this.node.height;
        let min = Math.min(width, height);
        let max = width + height - min;
        this.r = min * 0.21;
        this.shortDistance = min * Math.sqrt(2);
        this.middleDistance = max * Math.sqrt(2);
        this.longDistance = (min + max) * Math.sqrt(2);

        this.setRadius(this.r);
        this.setDistance(0);
        this.setFoward(cc.v2(0.707106781186547524, 0.707106781186547524));
        this.setMDistance(0);
        this.setSize();

        this.setSubTexture(this.txt.getTexture());

        this.setProgress(n);
        cc.log('set progress:', n)

    },

    flip(n) {
        let d = n;
        let m;
        let length = (this.middleDistance + this.r * Math.PI);
        if (d > length / 2) {
            d = length / 2;
            m = n - d;
            // this.fliping = false;
        }
        this.setDistance(n);
        this.setMDistance(m);
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
    // update (dt) {},
});
