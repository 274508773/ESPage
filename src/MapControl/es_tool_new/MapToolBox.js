/*
name:           MapTile.js
des:           地图瓦片操作对象
date:           2016-06-02
author:         liulin

图层切换控件的编写

*/


ES.MapControl.ESMapToolBox = ES.Evented.extend({

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ["ex-layout-maptool", "ex-theme-maptool", "ex-map-top", "ex-map-left"],

        className: '',
        title: '图层切换',
    },

    oUIConfig: {
        div: {
            'class': 'ex-maptool-box ex-control-dropmenu map-tool-box',
            i: {'class': 'ec-icon-briefcase'},
            html: '&nbsp;&nbsp;',
            span: {html: '工具'},
            i11: {'class': 'ec-icon-angle-down'},
            ul: {
                'class': 'ec-avg-sm-1 ec-dropdown-content',
                li: [{
                    a: {
                        href: 'javascript:void(0);',
                        i: {'class': 'ex-icon-maptool ex-maptool-china'},
                        html: '&nbsp;全国'
                    }
                },
                    {
                        a: {
                            href: 'javascript:void(0);',
                            i: {'class': 'ex-icon-maptool ex-maptool-range'},
                            html: '&nbsp;测距'
                        }
                    },
                    {
                        a: {
                            href: 'javascript:void(0);',
                            i: {'class': 'ex-icon-maptool ex-maptool-area'},
                            html: '&nbsp;测面'
                        }
                    },
                    {
                        a: {
                            href: 'javascript:void(0);',
                            i: {'class': 'ex-icon-maptool ex-maptool-scale-big'},
                            html: '&nbsp;拉框放大'
                        }
                    },
                    {
                        a: {
                            href: 'javascript:void(0);',
                            i: {'class': 'ex-icon-maptool ex-maptool-scale-small'},
                            html: '&nbsp;拉框缩小'
                        }
                    },
                    {
                        a: {
                            href: 'javascript:void(0);',
                            i: {'class': 'ex-icon-maptool ex-maptool-location'},
                            html: '&nbsp;坐标查询'
                        }
                    },
                    //{ a: { href: 'javascript:void(0);', i: { 'class': 'ex-icon-maptool ex-maptool-reset' }, html: '&nbsp;清除' } }
                ]
            }
        }
    },

    // 构造函数
    initialize: function (oMapBase, options) {
        ES.setOptions(this, options);

        // 获得地图控件
        this._oMapBase = oMapBase;
        this._oMap = oMapBase._oMap;

        this._oContainer = $("." + this.oOption.acParentDivClass.join("."));

        //L.drawLocal = ES.TrackView.Config.getDrawConfig();

        this.initUI();

        // 设置父级容器的事件
        this.setParentEvent();

        this.initMapTool();

        this.oActHandler = null;
    },

    initMapTool: function () {
        this.oScaleBig = new L.Map.ScaleBig(this._oMap);
        this.oScaleSmall = new L.Map.ScaleSmall(this._oMap);

        //地图测距查询
        this.oDistantHandler = L.MapLib.Measure.distMgr(this._oMap);

        //地图面积查询
        this.oAreaHandler = L.MapLib.Measure.areaMgr(this._oMap, {});

        //地图坐标查询 new L.Measure.LocaltionSearch(map)
        this.oMapToolLocal = new L.MapLib.LocaltionSearch.Search(this._oMap);
    },

    // 设置父级容器的事件
    setParentEvent: function () {

        ////屏蔽事件
        L.DomEvent.addListener(this._oContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this._oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this._oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this._oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

    },

    //加载工具事件，初始化工具栏
    initUI: function () {
        ES.initTag(this._oContainer.eq(0), this.oUIConfig);
        this.initToolEvent();

    },

    //初始化工具栏事件
    initToolEvent: function () {
        var self = this;
        this._oContainer.find("div.map-tool-box>ul>li>a").bind('click', this, function (e) {
            var cName = $(this).get(0).innerText.trim();
            self._oContainer.find("div.map-tool-box>span").html(cName);
            //self._oContainer.find("span").eq(1).html(cName);
        });

        $(".ex-maptool-scale-big").parent().bind("click", function () {
            if (self.oActHandler) {
                self.oActHandler.disable();
            }
            self.oActHandler = self.oScaleBig;
            self.oActHandler.enable();
        })

        $(".ex-maptool-scale-small").parent().bind("click", function () {
            if (self.oActHandler) {
                self.oActHandler.disable();

            }
            self.oActHandler = self.oScaleSmall;
            self.oActHandler.enable();

        })

        $(".ex-maptool-china").parent().bind("click", function () {
            if (self.oActHandler) {
                self.oActHandler.disable();
            }
            self._oMap.setView(new L.LatLng(35, 103.5), 4);
        })


        $(".ex-maptool-reset").parent().bind("click", function () {

            if (self.oActHandler) {
                self.oActHandler.disable();
            }
            //self.oAreaHandler.clearPoly();
        })

        $(".ex-maptool-location").parent().bind("click", function () {
            if (self.oActHandler) {
                self.oActHandler.disable();
            }
            self.oActHandler = self.oMapToolLocal;
            self.oActHandler.enable();

        })
        $(".ex-maptool-range").parent().bind("click", function () {

            if (self.oActHandler) {
                self.oActHandler.disable();
            }
            self.oActHandler = self.oDistantHandler;
            self.oActHandler.enable();

        })
        $(".ex-maptool-area").parent().bind("click", function () {

            if (self.oActHandler) {
                self.oActHandler.disable();
            }
            //self.oAreaHandler.clearPoly();
            self.oActHandler = self.oAreaHandler;
            self.oActHandler.enable();

        })

    },


});


