/**
 * Created by exsun on 2017-01-09.
 *
 * 第一部分 界面操作
 * 第二部分 编辑操作
 *
 */


ES.HGT.CloudMap.EditTool = ES.Evented.extend({

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ["ex-layout-maptool", "ex-theme-maptool", "ex-map-top", "ex-map-left"],

        className: '',
        title: '图层切换',
        oPenStyle: {
            stroke: true,
            color: '#666666',//'#0FFF05',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 2,
            opacity: 1,
            fill: true,
            fillColor: '#0FFF05',
            fillOpacity: 0.1,
            clickable: true,
            smoothFactor: 1.0,
            noClip: false

        },
    },


    cHTML: '<div class="ex-maptool-box ex-maptool-box-white">' +
    '<ul class="ex-map-tab ec-text-center ex-maptool-tab ex-cloud-map-menu">' +
    '<li><button class="ec-btn ec-btn-secondary ec-circle" data-index="1,2,3,4" data-flag="Grid" title="网格" data-tab-index="1" ><i class="ec-icon-th-large"></i></button><p>网格</p></li>' +
    '<li><button class="ec-btn ec-btn-secondary ec-circle" data-index="1" data-flag="Line"  title="线路" data-tab-index="2"><i class="ec-icon-ils"></i></button><p>线路</p></li>' +
    '<li><button class="ec-btn ec-btn-secondary ec-circle" data-index="2,3,4" data-flag="Fence"  title="围栏" data-tab-index="3"><i class="ec-icon-slack"></i></button><p>围栏</p></li>' +
    '<li><button class="ec-btn ec-btn-secondary ec-circle" data-index="0" data-flag="Poi"  title="兴趣点" data-tab-index="4"><i class="ec-icon-map-marker"></i></button><p>兴趣点</p></li>' +
    '<li><button class="ec-btn ec-btn-secondary ec-circle" data-index="0" data-flag="Pos"  title="兴趣点" data-tab-index="4"><i class="ec-icon-flag"></i></button><p>卡口</p></li>' +
    '</ul>' +
    '</div>' +
    '<div class="ex-maptool-box  ex-maptool-tab-draw">' +
    '    <ul class="ex-map-tab ec-text-center ex-maptool-tab ex-cloud-map-tool">' +
    '       <li><button class="ec-btn ec-btn-secondary ec-radius" data-object="2" title="网格"><i class="ec-icon-dot-circle-o"></i></button><p>画点</p></li>' +
    '       <li><button class="ec-btn ec-btn-secondary ec-radius" data-object="1" title="线路"><i class="ec-icon-xing"></i></button><p>画线</p></li>' +
    '       <li><button class="ec-btn ec-btn-secondary ec-radius" data-object="3" title="围栏"><i class="ec-icon-stop"></i></button><p>画矩形</p></li>' +
    '       <li><button class="ec-btn ec-btn-secondary ec-radius" data-object="4" title="圆形"><i class="ec-icon-circle"></i></button><p>画圆形</p></li>' +
    '       <li><button class="ec-btn ec-btn-secondary ec-radius" data-object="0" title="多边形"><i class="ec-icon-star"></i></button><p>画多边形</p></li>' +
    '       <li><button class="ec-btn ec-btn-secondary ec-radius" data-object="5" title="编辑"><i class="ec-icon-circle"></i></button><p>编辑</p></li>' +
    '       <li><button class="ec-btn ec-btn-secondary ec-radius level" data-object="6" title="删除"><i class="ec-icon-star"></i></button><p>删除</p></li>' +
    '       <li><button class="ec-btn ec-btn-secondary ec-radius level" data-object="7" title="确定"><i class="ec-icon-circle"></i></button><p>确定</p></li>' +
    '       <li><button class="ec-btn ec-btn-secondary ec-radius level" data-object="8" title="取消"><i class="ec-icon-star"></i></button><p>取消</p></li>' +
    '   </ul>' +
    '</div>',


    // 构造函数
    initialize: function (oMapBase, options) {
        ES.setOptions(this, options);
        this.oPenStyle = this.oOption.oPenStyle;
        // 获得地图控件
        this._oMapBase = oMapBase;
        this._oMap = oMapBase._oMap;
        this._oDrawLayer = L.featureGroup();
        this._oDrawLayer.addTo(this._oMap);
        this.$_oContainer = $("." + this.oOption.acParentDivClass.join("."));

        this.initUI();

        // 设置父级容器的事件
        this.setParentEvent();

        this.initMapTool();
        this.initPen();
        this.initOn();


        this.oActHandler = null;
    },


    initMapTool: function () {

    },

    // 设置父级容器的事件
    setParentEvent: function () {

        ////屏蔽事件
        L.DomEvent.addListener(this.$_oContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

    },

    //加载工具事件，初始化工具栏
    initUI: function () {
        this.$_oContainer.eq(0).html(this.cHTML);
        this.initToolEvent();
    },

    //初始化工具栏事件
    initToolEvent: function () {
        var self = this;
        $('.ex-cloud-map-menu button').bind('click', function () {
            self.clearLayer();

            $('.ex-maptool-tab-draw').fadeIn();

            $(this).parents('.ex-maptool-tab').find('button').removeClass('ec-active');
            $(this).addClass('ec-active');

            var cIndex = $(this).attr('data-index');

            var acItem = cIndex.split(',');
            $('.ex-maptool-tab-draw li').hide();
            for (var i = 0; i < acItem.length; i++) {
                $('.ex-maptool-tab-draw li').eq(parseInt(acItem[i])).show();
            }
            $('.ex-maptool-property').fadeIn();
            self.cFlag = $(this).attr('data-flag');
            self._oMapBase._oParent.setFlag(self.cFlag);
            self._oMapBase._oParent.fire('MV:VehSitePanel.initVehSite', {cFlag: self.cFlag});

            self.oSelectMenu = $(this);
        });




        $('.ex-cloud-map-tool button').not('.level').bind('click', function () {
            var nIndex = $(this).attr('data-object');
            var cFlag = self._oMapBase._oParent.getFlag();

            $('.ex-cloud-map-tool button').removeClass('ec-active');
            $(this).addClass('ec-active');

            self.aoDrawPen[parseInt(nIndex)].handler.enable();
            if (nIndex === '5') {
                var acItem = [7, 8];
                self.showButton(acItem);
                self._oMapBase._oParent.fire('CloudMap:' + cFlag + 'TagTree.hide', {});
            }
            else
            {
                self.clearLayer();
            }
        });

        $('.ex-cloud-map-tool button.level').bind('click', function () {
            var nIndex = $(this).attr('data-object');
            var cFlag = self._oMapBase._oParent.getFlag();
            $('.ex-cloud-map-tool button').removeClass('ec-active');
            $(this).addClass('ec-active');
            // 点击确定按钮
            if (nIndex === '7') {
                self.aoDrawPen[5].handler.save();
                self.aoDrawPen[5].handler.disable();
                self._oMapBase._oParent.fire('CloudMap:' + cFlag + 'TagTree.show', {});

                //　回到添加界面
                //$('.ex-cloud-map-menu button[data-flag="Grid"]').click();
            }
            // 点击取消
            if (nIndex === '8') {
                self.aoDrawPen[5].handler.revertLayers();
                self.aoDrawPen[5].handler.disable();

                self._oMapBase._oParent.fire('CloudMap:' + cFlag + 'TagTree.show', {});

                //　回到添加界面
                if(self.oSelectMenu){
                    self.oSelectMenu.click();
                }

            }
            if (nIndex === '6') {

                var aoLayer = self._oDrawLayer.getLayers();
                if (aoLayer && aoLayer.length > 0) {
                    var oLayer = aoLayer[0];

                    var oBusInfo = oLayer.oBusInfo;
                    self._oMapBase._oParent.fire('CloudMap:DelCloudMap.del', {oModel: oBusInfo});
                }
                self.clearLayer();
                if(self.oSelectMenu){
                    self.oSelectMenu.click();
                }
            }
        });

    },
});


ES.HGT.CloudMap.EditTool.include({


    // 初始化画笔控件
    initPen: function () {
        this.aoDrawPen = [
            {
                enabled: {shapeOptions: this.oPenStyle},
                handler: new L.Draw.Polygon(this._oMap, {shapeOptions: this.oPenStyle}),
                title: ''
            }, {
                enabled: {shapeOptions: this.oPenStyle},
                handler: new L.Draw.Polyline(this._oMap, {shapeOptions: ES.HGT.oConfig.CloudMap.oLiveLineConfig}),
                title: ''
            }, {
                enabled: {shapeOptions: this.oPenStyle},
                handler: new L.Draw.Marker(this._oMap, {shapeOptions: ES.HGT.oConfig.CloudMap.oSiteConfig}),
                title: ''
            }, {
                enabled: {shapeOptions: this.oPenStyle},
                handler: new L.Draw.Rectangle(this._oMap, {shapeOptions: ES.HGT.oConfig.CloudMap.oSiteConfig}),
                title: ''
            }, {
                enabled: {shapeOptions: this.oPenStyle},
                handler: new L.Draw.Circle(this._oMap, {shapeOptions: ES.HGT.oConfig.CloudMap.oSiteConfig}),
                title: ''
            }, {
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
                title: ''
            }];
    },

    // 添加事件监听
    initOn: function () {
        var self = this;

        this._oMap.on('moveend', function (e) {
            //var newPos = this.mouseEventToLayerPoint(e.originalEvent);
            //var latlng = this.layerPointToLatLng(newPos);
            //var oPos = this.latLngToLayerPoint(latlng);
            //
            self._oMapBase._oParent.fire('CloudMap:' + self.cFlag + 'PopWnd.setPos', {});
        });

        this._oMap.on('draw:created', function (e) {

            var oLayer = e.layer;

            self._oDrawLayer.addLayer(oLayer);
            var oInfo = self._getGisObj(oLayer);

            // 创建是的位置，因为当前位置不再容器中，所以要自己计算当前位置
            var oPos = this.latLngToLayerPoint(self.getPos(oLayer));

            self._oMapBase._oParent.fire('CloudMap:' + self.cFlag + 'PopWnd.show',
                {cFlag: self.cFlag, oInfo: oInfo, oPos: oPos, oLatLng: self.getPos(oLayer)});
        });

        this._oMap.on('draw:edited', function (e) {

            var aoLayer = e.layers;
            aoLayer.eachLayer(function (oLayer) {
                var oInfo = self._getGisObj(oLayer);
                self._oDrawLayer.addLayer(oLayer);
                //oInfo.cId = oLayer.cId;
                oInfo.oInfo = oLayer.oInfo;
                oInfo.oBusInfo = oLayer.oBusInfo;

                // 弹出层显示的位置信息

                var oPos = self._oMap.latLngToLayerPoint(self.getPos(oLayer));
                // 告诉外面弹出层的位置
                self._oMapBase._oParent.fire('CloudMap:' + self.cFlag + 'PopWnd.editShow', {
                    oInfo: oInfo,
                    oPos: oPos,
                    oLatLng: self.getPos(oLayer)
                });
            });
        });

        this._oMapBase._oParent.on('CloudMap:EditTool.clearLayer',this.clearLayer,this);

        this._oMapBase._oParent.on('CloudMap:EditTool.edit',this.edit,this);
    },

    createLayer:function(oData) {
        var oVehLine = null;
        if (!oData || !oData.Json) return oVehLine;

        var oTemp = null;

        try {
            if (!oData.HgtStr) {
                oTemp = JSON.parse(oData.Json);
            }
            else {
                oTemp = JSON.parse(oData.HgtStr);
                // 做坐标转换
                oTemp.aoLatLng = [];
                if (!oTemp.geo) {
                    return;
                }
                for (var i = 0; i < oTemp.geo.length - 1; i++) {

                    oTemp.aoLatLng.push(ES.CoordTrans.bd_decrypt(oTemp.geo[i].lat, oTemp.geo[i].lng));
                }
            }
            oTemp.oOption = this.oPenStyle;
        } catch (e) {
            oTemp = null;
        }
        if (!oTemp) {
            return oVehLine;
        }

        switch (oData.MapType) {
            case 1:
                oVehLine = L.polygon(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);
                break;
            case 2:
                // 计算2个点的距离，在来画圆
                var dDis = L.latLng(oTemp.aoLatLng[0]).distanceTo(L.latLng(oTemp.aoLatLng[1]))
                oVehLine = L.circle(oTemp.aoLatLng[0], dDis, oTemp.oOption).addTo(this._oDrawLayer);
                break;
            case 3:
                oVehLine = L.rectangle(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);
                break;
            case 4:
                oVehLine = L.polyline(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);
                break;
            case 5:
                oVehLine = L.marker(oTemp.aoLatLng[0], oTemp.oOption).addTo(this._oDrawLayer);
                break;
            default :
                oVehLine = L.polygon(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);
                break;
        }
        return oVehLine;
    },

    // 编辑数据oData:oNode.node.data,
    edit: function (oVal) {

        this.clearLayer();

        if (!oVal  || !oVal.oNode) {
            return ;
        }

        // 编辑围栏数据,画围栏时要表明自己的名称
        var oVehLine = this.createLayer(oVal.oNode.data);
        if (!oVehLine) {
            return;
        }
        oVehLine.cId = oVal.oNode.data.Id;
        oVehLine.oBusInfo = oVal.oNode.data;
        this.fitBound();
        var acItem = [5, 6];
        this.showButton(acItem);
    },

    showButton: function (acItem) {
        $('.ex-maptool-tab-draw li').hide();
        for (var i = 0; i < acItem.length; i++) {
            $('.ex-maptool-tab-draw li').eq(parseInt(acItem[i])).show();
        }
    },

    fitBound: function () {
        if (!this._oDrawLayer) {
            return;
        }
        var oBound = this._oDrawLayer.getBounds();
        this._oMap.fitBounds(oBound);
    },

    clearLayer: function () {
        this._oDrawLayer.clearLayers();
    },

    // 获得编辑对象
    _getGisObj: function (oLayer) {
        var oInfo = {};

        var oOption = oLayer.options;

        if (oLayer instanceof L.Circle) {
            var oLatLng = oLayer.getLatLng();
            var oLatLngTemp = {lat: oLatLng.lat + oLayer.getDueLat(), lng: oLatLng.lng};
            oInfo = {
                aoLatLng: [{lat: oLatLng.lat, lng: oLatLng.lng}, oLatLngTemp],
                //dRadius: oLayer.getRadius(),
                oOption: oOption,
                nType: this.getObjType(oLayer)
            };
        }
        else if (oLayer instanceof L.Marker) {
            var oLatLng = oLayer.getLatLng();

            oInfo = {
                aoLatLng: [{lat: oLatLng.lat, lng: oLatLng.lng}],
                oOption: {},
                nType: this.getObjType(oLayer)
            };
        }
        else if(oLayer instanceof L.Polygon){
            var aoLatLng = oLayer.getLatLngs()[0].map(function (oItem) {
                return {lat:oItem.lat,lng:oItem.lng};
            });

            oInfo = {aoLatLng: aoLatLng, oOption: oOption, nType: this.getObjType(oLayer)};
        }
        else {
            var aoLatLng = oLayer.getLatLngs().map(function (oItem) {
                return {lat:oItem.lat,lng:oItem.lng};
            });

            oInfo = {aoLatLng: aoLatLng, oOption: oOption, nType: this.getObjType(oLayer)};
        }
        return oInfo;
    },

    getObjType: function (oLayer) {
        if (oLayer instanceof L.Polygon) {
            return 1;
        }
        if (oLayer instanceof L.Circle) {
            return 2;
        }
        if (oLayer instanceof L.Rectangle) {
            return 3;
        }
        if (oLayer instanceof L.Polyline) {
            return 4;
        }
        if (oLayer instanceof L.Marker) {
            return 5;
        }
        return 1;
    },

    getPos:function(oLayer) {
        if (oLayer instanceof L.Polygon || oLayer instanceof L.Rectangle ) {
            var aoLatLng = oLayer.getLatLngs()[0];
            var oTemp = {
                lat: aoLatLng[aoLatLng.length - 1].lat, lng: aoLatLng[aoLatLng.length - 1].lng
            }
            return oTemp
        }

        if(oLayer instanceof L.Polyline){
            var aoLatLng = oLayer.getLatLngs();
            var oTemp = {
                lat: aoLatLng[aoLatLng.length - 1].lat, lng: aoLatLng[aoLatLng.length - 1].lng
            }
            return oTemp;
        }

        if (oLayer instanceof L.Circle || oLayer instanceof L.Marker) {
            var oLatLng = oLayer.getLatLng();
            var oTemp = {lat: oLatLng.lat, lng: oLatLng.lng}
            return oTemp
        }

        return null;
    }
});