/*
name:           MapTile.js
des:           地图瓦片操作对象
date:           2016-06-02
author:         liulin

图层切换控件的编写

*/


ES.MapControl.ESMapTile = ES.Evented.extend({

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-left'],

        className: '',
        title: '图层切换',

        cMapTileUrl: '/Asset/scripts/ESLib/MapControl/DivMapTile.html',
    },

    oUIConfig: {
        div: {
            'class': 'ex-maptool-box ex-control-dropmenu map-tile',
            i: {'class': 'ec-icon-clone'},
            html: '&nbsp;&nbsp;',
            span: {html: '高德地图'},
            i11: {'class': 'ec-icon-angle-down'},
            ul: {
                'class': 'ec-avg-sm-1 ec-dropdown-content',
                li: [{a: {href: 'javascript:void(0);', html: '高德地图'}},
                    {a: {href: 'javascript:void(0);', html: '高德卫星图'}},
                    {a: {href: 'javascript:void(0);', html: '谷歌地图'}},
                    {a: {href: 'javascript:void(0);', html: '谷歌卫星图'}},
                    {a: {href: 'javascript:void(0);', html: '谷歌地形图'}},
                    {a: {href: 'javascript:void(0);', html: '灰度图'}}
                ]
            }
        }
    },

    // 构造函数
    initialize: function (oMapBase, options) {
        ES.setOptions(this, options);

        //this._oParent = oParent;

        // 获得地图控件
        this._oMapBase = oMapBase;
        this._oMap = oMapBase._oMap;

        //图层
        this._layers = {};
        //记录最近一次的div Z-index
        this._lastZIndex = 0;

        this._oContainer = $('.' + this.oOption.acParentDivClass.join('.'));
        var aoLayer = this._oMapBase.getBaseLayers();
        // 添加图层
        for (var i in aoLayer) {
            this._addLayer(aoLayer[i], i);
        }
        // 设置父级容器的事件
        this.setParentEvent();

        this.initUI();
    },

    _addLayer: function (layer, name, overlay) {
        // 获得图层id
        var id = L.stamp(layer);

        this._layers[id] = {
            layer: layer,
            name: name,
            overlay: overlay
        };

        if (this.oOption.autoZIndex && layer.setZIndex) {
            this._lastZIndex++;
            layer.setZIndex(this._lastZIndex);
        }
    },

    // 设置父级容器的事件
    setParentEvent: function () {

        ////屏蔽事件
        //L.DomEvent.addListener(this._oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        //L.DomEvent.addListener(this._oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        //L.DomEvent.addListener(this._oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

    },

    //加载工具事件，初始化工具栏
    initUI: function () {
        ES.initTag(this._oContainer.eq(0), this.oUIConfig);
        this.initToolEvent();

        //var self = this;
        //// 异步加载 html 页面
        //$.ajax({
        //    url: self.oOption.cMapTileUrl,
        //    success: function (cHtml) {
        //        self._oContainer.eq(0).append(cHtml);
        //        // 加载事件
        //        self.initToolEvent();
        //    }
        //});
    },

    //初始化工具栏事件
    initToolEvent: function () {
        var self = this;
        this._oContainer.find('div.map-tile>ul>li>a').bind('click', this, function () {
            var cName = $(this).get(0).innerText.trim();
            self.selectLayer(cName);
            self._oContainer.find('div.map-tile>span').html(cName);

        });
        this._oContainer.find('div.map-tile>ul>li>a').mouseover(function () {
            self._oMap.doubleClickZoom.disable();//禁止默认双击
        });
        this._oContainer.find('div.map-tile>ul>li>a').mouseout(function () {
            self._oMap.doubleClickZoom.enable();//禁止默认双击
        });

    },

    // 选择图层
    selectLayer: function (cName) {
        if (cName === '灰度图') {
            if (this._oMap.getZoom() > 16) {
                this._oMap.setZoom(16);
            }
        }

        //var oLayer = null;
        for (var key in this._layers) {
            var oItem = this._layers[key];
            if (oItem.name === cName && !this._oMap.hasLayer(oItem.layer)) {
                //添加图层
                this._oMap.addLayer(oItem.layer);
            }
            else if (this._oMap.hasLayer(oItem.layer) && oItem.name !== cName) {

                this._oMap.removeLayer(oItem.layer);
            }
        }
    },

});


