 
/*
name:           ESMapEdit
des:            地图图层编辑，创建图形和画图形

引用的库为 leaflet.draw-master.js 

对围栏进行编辑

*/



ES.MapControl.ESMapEdit = ES.Evented.extend({

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-left','ex-maptool-edit'],
        cBtnContain: '.ex-map-tool-edit',
        className: '',
        title: '图层编辑',
        oPenStyle: {
            stroke: true,
            color: '#0FFF05',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 3,
            opacity: 1,
            fill: true,
            fillColor: null,
            fillOpacity: 0.2,
            clickable: true,
            smoothFactor: 1.0,
            noClip: false

        },
    },

    oUIConfig: {
        div: {
            'class': 'ex-maptool-box',
            ul: {
                'class': 'ec-avg-sm-1 ex-map-tool-edit',
                li: [
                    {a: {href: 'javascript:void(0);', i: {'class': 'ec-icon-plus'}, html: '&nbsp;画工地'}},
                    {a: {href: 'javascript:void(0);', i: {'class': 'ec-icon-pencil'}, html: '&nbsp;编&nbsp;&nbsp;辑'}},
                    {a: {href: 'javascript:void(0);', i: {'class': 'ec-icon-power-off'}, html: '&nbsp;删&nbsp;&nbsp;除'}},
                    {a: {href: 'javascript:void(0);', i: {'class': 'ec-icon-save'}, html: '&nbsp;确&nbsp;&nbsp;定'}},
                    {
                        a: {
                            href: 'javascript:void(0);',
                            'class': 'ex-map-tool-cancel',
                            i: {'class': 'ec-icon-ban'},
                            html: '&nbsp;取&nbsp;&nbsp;消'
                        }
                    }
                ]
            }
        }
    },

    // 构造函数
    initialize: function (oMapBase, options) {
        ES.setOptions(this, options);
        this.oPenStyle = this.oOption.oPenStyle;
        // 获得地图控件
        this._oMapBase = oMapBase;
        this._oMap = oMapBase._oMap;

        // 添加编辑图层
        this._oDrawLayer = L.featureGroup();
        this._oDrawLayer.addTo(this._oMap);

        this._oContainer = $('.' + this.oOption.acParentDivClass.join('.'));

        this.cFlag = 'add';

        // 设置父级容器的事件，是为了屏蔽地图的操作
        this.setParentEvent();


        // 初始化画笔
        this.initPen();

        // 初始化界面
        this.initUI();

        // 加载地图回调函数
        this.initCallBack();

        this.initOn();

    },

    // 注册监听事件
    initOn: function () {
        // 触发显示编辑按钮，并默认画
        this._oMapBase._oParent.on('ESMapEdit:showEditDraw', this.showEditAdd, this);
        this._oMapBase._oParent.on('ESMapEdit:clearLayers', this.clearLayers, this);

        // 删除围栏时要这的事情
        this._oMapBase._oParent.on('ESMapEdit:deleteFence', this.deleteFence, this);
        this._oMapBase._oParent.on('ESMapEdit:editDraw', this.editDraw, this);


    },

    // 编辑围栏数据,画围栏时要表明自己的名称
    editDraw: function (oData) {
        //画线加载时，加载图标
        this.cFlag = 'edit';
        var aX = oData.MapX.split(',');
        var aY = oData.MapY.split(',');
        if (!aX || !aY || aX.length <= 0) {
            return;
        }
        var aoLatLng = [];
        for (var i = 0; i < aX.length; i++) {
            var oLatLng = L.latLng(parseFloat(aY[i]), parseFloat(aX[i]));
            aoLatLng.push(oLatLng);
        }

        var oVehLine = L.polygon(aoLatLng, this.oPenStyle).addTo(this._oDrawLayer);

        oVehLine.cId = oData.Id;
        oVehLine.oFenceInfo = oData;


        oVehLine.bindTooltip(oData.Name).openTooltip();
        //oVehLine.oTip = oTip;
        this.fitBound();

        // 点击编辑时 控制按钮显示，显示编辑，其他隐藏
        this.$_btnPlus.hide();
        this.$_btnEdit.show();
        this.$_btnDel.show();
        this.$_btnCal.hide();
        this.$_btnSave.hide();
        this.dealEditUI();
    },

    fitBound: function () {
        if (!this._oDrawLayer) return;
        var oBound = this._oDrawLayer.getBounds();
        this._oMap.fitBounds(oBound);
    },

    // 画tip
    drawTip: function (oTemp) {
        var oOption = {
            bIsNotEdit: true,
            cName: '测试tip显示名称',
            oLatLng: {lat: 30.333, lng: 113.333},
            bNoHide: true
        };
        ES.extend(oOption, oTemp);
        var oIcon = new L.DivIcon({
            html: '<div> </div>',
            className: '',
        });

        var oMarker = L.marker(oOption.oLatLng, {icon: oIcon, bIsNotEdit: oOption.bIsNotEdit});
        oMarker.cId = oOption.cId;

        //给oMarker绑定tip
        oMarker.bindLabel(oOption.cName, {noHide: oOption.bNoHide, direction: 'auto'});
        return oMarker;
    },

    deleteFence: function () {
        this._oDrawLayer.clearLayers();
        this.$_btnCal.hide();
        this.$_btnEdit.hide();
        this.dealEditUI();
    },

    clearLayers: function () {
        this._oDrawLayer.clearLayers();

        // 隐藏取消按钮
        this.$_btnCal.hide();
        this.dealEditUI();
    },

    showEditAdd: function () {
        this.cFlag = 'add';

        this.show();
        this.clearLayers();
        $(this.oOption.cBtnContain).find('.ec-icon-plus').parent().click();

    },

    // 显示编辑框
    show: function () {
        this._oContainer.find('.ex-maptool-box').show();
    },

    // 隐藏编辑框
    hide: function () {
        this._oContainer.find('.ex-maptool-box').hide();
    },

    // 界面处理
    dealEditUI: function () {
        var aoA = this._oContainer.find('.ex-maptool-box').find('a');
        var bShow = false;
        for (var i = 0; i < aoA.length; i++) {
            if ($(aoA[i]).css('display') === 'block') {
                bShow = true;
            }
        }

        if (!bShow) {
            this.hide();
        }
        else {
            this.show();
        }
    },

    // 初始化画笔控件
    initPen: function () {

        // 画笔
        this.oDrawPen = {
            enabled: {shapeOptions: this.oPenStyle},
            handler: new L.Draw.Polygon(this._oMap, {shapeOptions: this.oPenStyle}),
            title: L.drawLocal.draw.toolbar.buttons.polygon
        };

        // 画笔
        this.oEditPen = {
            enabled: this.oPenStyle,
            handler: new L.EditToolbar.Edit(this._oMap, {
                featureGroup: this._oDrawLayer,
                selectedPathOptions: {
                    dashArray: '10, 10',
                    fill: true,
                    fillColor: '#fe57a1',
                    fillOpacity: 0.1,
                    maintainColor: false
                },
                poly: {allowIntersection: false}
            }),
            title: L.drawLocal.edit.toolbar.buttons.edit
        };
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

        ES.initTag(this._oContainer, this.oUIConfig);

        this.initEven();
        var cBtnContain = this.oOption.cBtnContain;

        this.$_btnPlus = $(cBtnContain).find('.ec-icon-plus').parent();
        this.$_btnEdit = $(cBtnContain).find('.ec-icon-pencil').parent();
        this.$_btnCal = $(cBtnContain).find('.ec-icon-ban').parent();
        this.$_btnSave = $(cBtnContain).find('.ec-icon-save').parent();
        this.$_btnDel = $(cBtnContain).find('.ec-icon-power-off').parent();

        this.$_btnPlus.hide();
        this.$_btnEdit.hide();
        this.$_btnCal.hide();
        this.$_btnSave.hide();
        this.$_btnDel.hide();
        this.dealEditUI();


    },

    //初始化工具栏事件
    initEven: function () {
        var self = this;

        // 对象
        $(this.oOption.cBtnContain).find('.ec-icon-plus').parent().bind('click', function () {
            self.oDrawPen.handler.enable();

            self.$_btnPlus.hide();
            self.$_btnSave.hide();
            self.$_btnEdit.hide();
            self.$_btnCal.show();
            self.dealEditUI();
        });

        // 确定修改
        $(this.oOption.cBtnContain).find('.ec-icon-save').parent().bind('click', function () {
            // 触发结束编辑
            self.oEditPen.handler.save();
            self.oEditPen.handler.disable();
            // 清除图层
            //self._oDrawLayer.clearLayers();

            // 点击确定 隐藏自身、取消、编辑
            self.$_btnPlus.hide();
            self.$_btnEdit.hide();
            self.$_btnCal.hide();
            $(this).hide();
            self.dealEditUI();

        });

        // 编辑
        $(this.oOption.cBtnContain).find('.ec-icon-pencil').parent().bind('click', function () {

            // 点击编辑隐藏自身，和添加功能，显示确定和取消
            $(self.oOption.cBtnContain).find('.ec-icon-plus').parent().hide();

            self.$_btnSave.show();
            $(self.oOption.cBtnContain).find('.ec-icon-ban').parent().show();
            $(this).hide();
            self.dealEditUI();
            self.oEditPen.handler.enable();
        });

        // 取消
        $(this.oOption.cBtnContain).find('.ec-icon-ban').parent().bind('click', function () {

            $(this).hide();

            if (self.cFlag === 'add') {
                // 全部隐藏
                self.$_btnPlus.hide();
                self.$_btnSave.hide();
                self.$_btnEdit.hide();
                self.$_btnCal.hide();
            }

            if (self.cFlag === 'edit') {
                self.$_btnPlus.hide();
                self.$_btnSave.hide();
                self.$_btnEdit.show();
                self.$_btnCal.hide();
            }

            self.oDrawPen.handler.disable();
            // 撤销修改
            self.oEditPen.handler.revertLayers();
            self.oEditPen.handler.disable();

            self.dealEditUI();
        });

        // 删除
        $(this.oOption.cBtnContain).find('.ec-icon-power-off').parent().bind('click', function () {

            $(this).hide();

            if (self.cFlag === 'add') {
                // 全部隐藏
                self.$_btnPlus.hide();
                self.$_btnSave.hide();
                self.$_btnEdit.hide();
                self.$_btnCal.hide();
            }

            if (self.cFlag === 'edit') {
                self.$_btnPlus.hide();
                self.$_btnSave.hide();
                self.$_btnEdit.show();
                self.$_btnCal.hide();
            }

            if (self.cFlag === 'del') {

            }

            self.oDrawPen.handler.disable();
            // 撤销修改
            self.oEditPen.handler.revertLayers();
            self.oEditPen.handler.disable();

            self.dealEditUI();
        });
    },

    initCallBack: function () {
        var self = this;

        this._oMap.on('draw:created', function (e) {

            var oLayer = e.layer;

            self._oDrawLayer.addLayer(oLayer);
            var oInfo = self._getGisObj(oLayer);
            self._oMapBase._oParent.fire('FenceView:UI.addFence', oInfo);

        });

        this._oMap.on('draw:edited', function (e) {

            var aoLayer = e.layers;
            aoLayer.eachLayer(function (oLayer) {
                var oInfo = self._getGisObj(oLayer);
                self._oDrawLayer.addLayer(oLayer);
                oInfo.cId = oLayer.cId;
                oInfo.oFenceInfo = oLayer.oFenceInfo;
                self._oMapBase._oParent.fire('FenceView:UI.updateFence', oInfo);

            });
        });
    },

    // 获得所有画的model
    getDrawModeHandlers: function () {

        return [
            {
                enabled: this.options.polyline,
                handler: new L.Draw.Polyline(this._oMap, this.options.polyline),
                title: L.drawLocal.draw.toolbar.buttons.polyline
            },
            {
                enabled: {shapeOptions: this.oPenStyle},
                handler: new L.Draw.Polygon(this._oMap, {shapeOptions: this.oPenStyle}),
                title: L.drawLocal.draw.toolbar.buttons.polygon
            },
            {
                enabled: this.options.rectangle,
                handler: new L.Draw.Rectangle(this._oMap, this.options.rectangle),
                title: L.drawLocal.draw.toolbar.buttons.rectangle
            },
            {
                enabled: this.options.circle,
                handler: new L.Draw.Circle(this._oMap, this.options.circle),
                title: L.drawLocal.draw.toolbar.buttons.circle
            },
            {
                enabled: this.options.marker,
                handler: new L.Draw.Marker(this._oMap, this.options.marker),
                title: L.drawLocal.draw.toolbar.buttons.marker
            }
        ];
    },

    // 获得所有的编辑model
    getEditModeHandlers: function () {

        return [
            {
                enabled: this.oPenStyle,
                handler: new L.EditToolbar.Edit(this._oMap, {
                    featureGroup: this._oDrawLayer,
                    selectedPathOptions: this.options.edit.selectedPathOptions,
                    poly: this.options.poly
                }),
                title: L.drawLocal.edit.toolbar.buttons.edit
            },
            {
                enabled: {},
                handler: new L.EditToolbar.Delete(this._oMap, {
                    featureGroup: this._oDrawLayer
                }),
                title: L.drawLocal.edit.toolbar.buttons.remove
            }
        ];
    },

    // 获得编辑对象
    _getGisObj: function (oLayer) {
        var oInfo = {};
        //var nZoom = this._oMap.getZoom();
        var oOption = oLayer.options;

        //if (oLayer.options.hasOwnProperty('original')) {
        //    oOption = L.extend({}, oLayer.options.original)
        //}

        if (oLayer instanceof L.Circle) {
            //还要取一个经纬度
            //var oBound = oLayer.getBounds();
            var oLatLng = oLayer.getLatLng();
            var oLatLngTemp = L.latLng([oLatLng.lat + oLayer._getLatRadius(), oLatLng.lng]);
            oInfo = {
                aoLatLng: [oLatLng, oLatLngTemp],
                dRadius: oLayer.getRadius(),
                oOption: oOption,
                nType: this.getObjType(oLayer)
            };
        }
        else {

            oInfo = {aoLatLng: oLayer.getLatLngs(), oOption: oOption, nType: this.getObjType(oLayer)};
        }

        return oInfo;
    },

    getObjType: function (oLayer) {
        if (oLayer instanceof L.Rectangle) {
            return 3;
        }
        if (oLayer instanceof L.Polygon) {
            return 1;
        }
        if (oLayer instanceof L.Polyline) {
            return 4;
        }
        if (oLayer instanceof L.Circle) {
            return 2;
        }
        return 1;
    }

});


