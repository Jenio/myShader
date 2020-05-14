
cc.Class({
    extends: cc.Component,

    properties: {
        sprite: cc.Node,
        _progress: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },
    init(n) {
        this.sprite.getComponent(cc.Sprite).setState(0);
        this.sprite.getComponent('ShaderComponent')._applyShader();
        this._progress = n;
        this.setProgress(n);
    },
    setProgress(n) {
        let level = Math.floor(n * 6);
        let r, g, b;
        let rd, gd, bd;
        rd = gd = bd = 0;
        let d = n % (1 / 6) * 6;
        switch (level) {
            case 0:
                r = 255;
                g = 0;
                b = 0;
                gd = d;
                break;

            case 1:
                r = 255;
                g = 255;
                b = 0;
                rd = -d;
                break;
            case 2:
                r = 0;
                g = 255;
                b = 0;
                bd = d;
                break;
            case 3:
                r = 0;
                g = 255;
                b = 255;
                gd = -d;

                break;
            case 4:
                r = 0;
                g = 0;
                b = 255;
                rd = d;

                break;
            case 5:
                r = 255;
                g = 0;
                b = 255;
                bd = -d;
                break;
            case 6:
                r = 255;
                g = 0;
                b = 0;

                break;
        }


        this.sprite.color = new cc.Color(r + rd * 255, g + gd * 255, b + bd * 255, 255)
        // this.sprite.getComponent('ShaderComponent').setColor(255, 0, 0, 255);
    },
    start() {

    },

    // update (dt) {},
});
