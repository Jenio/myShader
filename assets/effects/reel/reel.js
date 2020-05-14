
cc.Class({
    extends: cc.Component,

    properties: {
        sprite1: cc.Node,
        sprite2: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        cc.log(this.sprite1)
    },

    setProgress(n) {
        let one = 345*0.5;
        let radiu = 1.4502*one*1.1;
        let alpha = -0.9 + 1.8 * n;
        let alpha1 = alpha + 0.68956*0.3;
        let alpha2 = alpha - 0.68956*0.3;
        let y1 = Math.sin(alpha1)*radiu ;
        let y2 = Math.sin(alpha2)*radiu ;
        this.sprite1.y = y1;
        this.sprite2.y = y2;

        this.sprite1.getComponent('ShaderComponent').setAlpha(-alpha1);
        this.sprite2.getComponent('ShaderComponent').setAlpha(-alpha2);
    },
    setPosition(y) {

    },
    init(n) { 
        this.sprite1.getComponent('ShaderComponent').myStart();
        this.sprite2.getComponent('ShaderComponent').myStart();
        this.setProgress(n)
    },
    // update (dt) {},
});
