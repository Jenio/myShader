cc.Class({
    extends: cc.Component,

    properties: {

        _data: [],
        maxView: 5,
        step: 36,//--- 步长： 角度

        _offset: 0,
        _angular: 0,//--- 转轮状态

        brake: 0,
        _angularVelocity: 0,
        _angularAcc: 0,
        virtualRadius: 800,//--- 物理属性

        _hold: 0,
        _clickDuration: 0,//--- 控制属性
    },

    // LIFE-CYCLE CALLBACKS:
    initData(data) {
        this._data = data;
        this.init();
        this.node.on('touchend', this.touchEndHandler, this);
        this.node.on('touchcancel', this.touchEndHandler, this);
        this.node.on('touchstart', this.touchStartHandler, this);
        this.node.on('touchmove', this.touchMoveHandler, this);
    },
    init() {
        this.node.width = this.virtualRadius * 2 + 180;
        this.mainItem = this.getChildByName('item');
        let parent = this.mainItem.parent;
        this._prev1 = cc.instantiate(this.mainItem);
        this._prev2 = cc.instantiate(this.mainItem);
        this._next1 = cc.instantiate(this.mainItem);
        this._next2 = cc.instantiate(this.mainItem);
        this._temp = cc.instantiate(this.mainItem);
        this._prev1.parent = parent;
        this._prev2.parent = parent;
        this._next1.parent = parent;
        this._next2.parent = parent;
        this._temp.parent = parent;

        this._offset = 0;
        this.spin(0.0001);

    },
    touchStartHandler(e) {
        //--- 限制多点触碰
        if (this._hold > 0) return;
        this._hold++;
        //---  stop spin
        this._clickDuration = 0;
        this._angularVelocity = 0;

    },
    touchMoveHandler(e) {
        let x = e.touch._point.x - e.touch._prevPoint.x;
        let delta = x / this.virtualRadius * 180 / Math.PI;
        this._angularVelocity = delta;
        this.spin(delta);
    },
    touchEndHandler(e) {
        //--- 限制多点触碰
        if (this._hold == 0) return;
        this._hold--;

        //--  short click
        let mag = e.touch._point.sub(e.touch._startPoint).mag();
        if (this._clickDuration < 0.35 && mag < 20) {
            //---  时间短，位移短，视为单击
            this.shotClick(e)
        }
    },
    shotClick(e) {
        let p = e.touch._point;
        let nodeTouch = this.node.convertToNodeSpaceAR(p);
        let x = nodeTouch.x;
        x = x / this.node.width * this.virtualRadius * 2;
        let clickAngular = Math.asin(x / this.virtualRadius) * 180 / Math.PI;
        let abs = Math.abs(clickAngular)
        if (abs <= this.step / 2) {
            //---
            let index = this.getIndex();
            cc.log('enter game', this._data[index].name);
            this.node.emit(this._data[index].name);
        } else {
            let run = Math.ceil((abs - this.step / 2) / this.step);
            this._angularVelocity = -abs / clickAngular * (run * 8 + 1);
            cc.log('run', run)
        }
        // this.spin(15)
        // this._angularVelocity=6;
    },
    previous() {
        this._angular -= this.step;
        this._offset--;
    },
    next() {
        this._angular += this.step;
        this._offset++;
    },
    spin(x) {
        this._angular += x;
        if (this._angular > this.step / 2) {
            this.previous()
        }
        if (this._angular < -this.step / 2) {
            this.next();
        }
        let tempAngular = this._angular;

        // let k = 0.08;
        let k = 0.04;
        this._angularAcc = k * tempAngular
        this._angularVelocity -= this._angularAcc;
        this.render(this.mainItem, this._angular, 0);
        this.render(this._prev1, this._angular - this.step, -1);
        this.render(this._prev2, this._angular - 2 * this.step, -2);
        this.render(this._next1, this._angular + this.step, 1);
        this.render(this._next2, this._angular + 2 * this.step, 2);
        if (x > 0) {
            this.render(this._temp, this._angular - 3 * this.step, -3);
        } else {
            this.render(this._temp, this._angular + 3 * this.step, 3);
        }
    },
    render(node, angular, pos) {
        node.active = true;
        if (angular < -90 || angular > 90) node.active = false;


        let x = Math.sin(angular / 180 * Math.PI) * this.virtualRadius;
        // let deep = Math.cos(angular / 180 * Math.PI)

        let deep = 1 - Math.abs(Math.sin(angular / 180 * Math.PI));


        let y = 0.5 + 0.5 * deep;
        node.scale = y;
        node.zIndex = Math.cos(angular / 180 * Math.PI) * 100;
        node.x = x;

        let frontMask = node.getChildByName('mask');
        let maskScale = 1 / y;
        let opacity = 255 * (1 - deep);
        if (opacity > 255) opacity = 255;
        if (opacity < 0) opacity = 0;
        frontMask.opacity = opacity;
        frontMask.position = node.position.scale(cc.v2(- maskScale, - maskScale));
        frontMask.scale = maskScale;

        let index = this.getIndex(pos);
        let frameName = this._data[index].icon;
        // let frame = this._data[frameName];
        node.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = frame;

        if (this._data[index].enable) {
            node.getChildByName('sprite').getComponent('ShaderComponent').shader = 0;
        } else {
            node.getChildByName('sprite').getComponent('ShaderComponent').shader = 1;
        }


        node.getComponent(cc.Mask).spriteFrame = frame;
        node.width = node.getChildByName('sprite').width;
        node.height = node.getChildByName('sprite').height;
    },
    getIndex(pos) {
        let index = this._offset;
        if (pos) index += pos;
        index = index % this._data.length;
        if (index < 0) index += this._data.length;
        return index;
    },
    start() {

    },

    update(dt) {
        this._clickDuration += dt;
        if (!this._hold && (this._angularAcc || this._angularVelocity)) {
            this.spin(this._angularVelocity);
            // this._angularVelocity *= (1 - this.brake / 4);
            this._angularVelocity *= (1 - this.brake / 3);
            if (Math.abs(this._angularVelocity) < 0.001) {
                this._angularVelocity = 0;
            }
            if (Math.abs(this._angularAcc) < 0.001) {
                this._angularAcc = 0;
            }
        }
    },
});
