/*
name        :               page.js 
des         :               页面基础对象，整个页面的外层容器
author      ：              liulin
date        ：              2016-2-17

思想：
为真个页面的外部容器，所有的对象以control 的形式添加到page对象中
如果是外部控制就使用page
如果是内部使用，就在control中完成

页面的设计远远比想象中要复杂，所以现在摒弃容器管理思想，
A.所有page只负责对象间的通信工作
B.页面公共元素的缓存
C.页面中的公共方法

*/



ES.Page = ES.Evented.extend({


    //页面id
    initialize: function (cId, oOption) {

        ES.setOptions(this, oOption);

        this.cId = cId;

        this.initLayout();
        this._onInit();

        this.initEvent();

    },


    initEvent: function () {
        
    },
    // 构建网页布局
    initLayout: function () {

    },

    //获得页面只要控件
    getMap: function () {
        return this._oMap;
    },

    //设置页面主要控件
    setMap: function (oData) {
        if (!oData) {
            console(ES.Lang.Page.setMap.Err);

            return;
        }
        if (!oData || oData.hasOwnProperty('oMap')) {
            if (oData.oMap instanceof L.Map) {
                this._oMap = oData.oMap;
                return;
            }
        }
        // 直接传地图控件
        if (oData instanceof L.Map) {
            this._oMap = oData;
        }
        else {
            console(ES.Lang.Page.setMap.ErrMap);
        }
    },

    // 添加控件
    addControl: function (control) {
        control.addTo(this);
        return this;
    },

    // todo 反射
    addHandler: function (name, HandlerClass) {
        if (!HandlerClass) {
            return this;
        }

        var handler = this[name] = new HandlerClass(this);

        this._handlers.push(handler);

        if (this.options[name]) {
            handler.enable();
        }

        return this;
    },

    //清楚对象
    remove: function () {
        if (this._loaded) {
            this.fire('unload');
        }

        this._initEvents('off');

        try {
            // throws error in IE6-8
            delete this._container._nId;
        } catch (e) {
            this._container._nId = undefined;
        }

        this._clearPanes();
        if (this._clearControlPos) {
            this._clearControlPos();
        }

        this._clearHandlers();

        return this;
    },

    // public methods for getting map state
    getContainer: function () {
        return this._container;
    },


    // 注册时间
    _onInit: function () {

        this.on('Map:loadFinish', this.setMap, this);

    },

});

ES.page = function (cId, oOption) {
    return new ES.Page(cId, oOption);
};
