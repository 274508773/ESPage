
ES.MonitorTimer = ES.Class.extend({

    oOption: {
        // 定时器执行时间间隔
        nIntervalSpeed: 1000 * 60 * 10,

        // 是否默认开始执行
        bIsStart: true,

        // 注册执行的方法
        aoActive: [],
    },

    //定时器 id
    _nIntervalId: null,

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        if (this.oOption.bIsStart) {
            this.start();
        }
    },

    // 增加回调
    on: function (oActive) {
        if (!this.oOption.aoActive) {
            this.oOption.aoActive = [];
        }
        var bIn = false;
        $.each(this.oOption.aoActive, function (nIndex, oItem) {
            if (oItem.fnCallBack === oActive.fnCallBack && oItem.oContext === oActive.oContext) {
                oItem.fnCallBack = oActive.fnCallBack;
                bIn = true;
            }
        });
        if (bIn) {
            return;
        }
        this.oOption.aoActive.push(oActive);
    },

    // 注销回调
    off: function (fnCallBack, oContext) {
        if (!this.oOption.aoActive || this.oOption.aoActive.length <= 0) {
            return;
        }
        var aoActive = this.oOption.aoActive;

        for (var i = aoActive.length - 1; i >= 0; i--) {
            if (aoActive[i].oContext === oContext && aoActive[i].fnCallBack === fnCallBack) {
                // 删除该元素
                aoActive.slice(i, 1);
            }
        }
    },

    //开始轨迹回放
    start: function () {
        if (this._nIntervalId) {
            return;
        }
        //定时器
        this._nIntervalId = window.setInterval(
            this._tick,
            this.oOption.nIntervalSpeed,
            this);
    },

    stop: function () {
        if (!this._nIntervalId) {
            return;
        }
        clearInterval(this._nIntervalId);
        this._nIntervalId = null;
    },

    //暂停timer 后在按照时间启动


    // 获得定时器的状态,false表示定时器已经关闭，true表示定时器开，正在回放轨迹
    getStatus: function () {
        if (!this._nIntervalId) {
            return false;
        }
        return true;
    },

    //设置播放轨迹速度
    setSpeed: function (nIntervalSpeed) {
        this.oOption.nIntervalSpeed = nIntervalSpeed;

        if (this.oOption.nIntervalSpeed) {
            this.stop();
            this.start();
        }
    },

    //定时触发
    _tick: function (self) {
        self._callbacks();
    },

    //设置播放进度条,移动轨迹点到下一个位置
    _callbacks: function () {
        if (!this.oOption.aoActive || this.oOption.aoActive.length <= 0) {
            return;
        }
        var aoActive = this.oOption.aoActive;
        $.each(aoActive, function (nIndex, oItem) {
            if (!oItem.fnCallBack) {
                return;
            }
            if (!oItem.oContext && oItem.fnCallBack) {
                oItem.fnCallBack.call(this, {});
            }
            if (oItem.oContext && oItem.fnCallBack) {
                oItem.fnCallBack.call(oItem.oContext, {});
            }
            return true;
        });
    },

});