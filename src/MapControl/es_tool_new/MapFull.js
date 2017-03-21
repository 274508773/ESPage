/*
name:           MapTile.js
des:            地图全屏操作
date:           2016-06-02
author:         liulin

修改为用js加载

*/
ES.MapControl.ESMapFull = ES.Evented.extend({

    oOption: {
        // 加载全屏按钮容器
        cSelfDiv: 'ex-map-full',
        // 父级容器
        acParentDivClass: [
            'ex-layout-maptool',
            'ex-theme-maptool',
            'ex-map-top',
            'ex-map-right'
        ],

        className: '',
        title: '地图全屏',
    },

    oUIConfig: {
        div: {
            'class': 'ex-maptool-box ex-map-full',
            i: {'class': 'ec-icon-expand'},
            html: '&nbsp;&nbsp;全屏'
        }
    },

    // 构造函数
    initialize: function (oMapBase, options) {
        ES.setOptions(this, options);

        // 获得地图控件
        this._oMapBase = oMapBase;
        this._oMap = oMapBase._oMap;

        //图层
        this._layers = {};
        //记录最近一次的div Z-index
        this._lastZIndex = 0;
        this._oContainer = $('.' + this.oOption.acParentDivClass.join('.')).eq(0);

        //var aoLayer = this._oMapBase.getBaseLayers();

        // 设置父级容器的事件
        this.setParentEvent();

        this.initUI();
    },


    // 设置父级容器的事件
    setParentEvent: function () {

        // 屏蔽事件
        //L.DomEvent.addListener(this._oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        //L.DomEvent.addListener(this._oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        //L.DomEvent.addListener(this._oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

    },

    //加载工具事件，初始化工具栏
    initUI: function () {
        ES.initTag(this._oContainer, this.oUIConfig);
        this.initToolEvent();
    },

    //初始化工具栏事件
    initToolEvent: function () {
        //地图全屏按钮
        $('.' + this.oOption.cSelfDiv).bind('click', function () {
            if (!($.AMUI.fullscreen.isFullscreen)) {
                $('body').addClass('map_full');
                $(this).html('<i class="ec-icon-compress"></i>&nbsp;&nbsp;恢复');
            } else {
                $('body').removeClass('map_full');
                $(this).html('<i class="ec-icon-expand"></i>&nbsp;&nbsp;全屏');
            }
            $.AMUI.fullscreen.toggle();
        });
    },

});


