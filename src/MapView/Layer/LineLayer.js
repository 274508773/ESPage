/**
 * Created by liufangzhou on 2017/3/23.
 */
ES.MapView.LineLayer = L.MapLib.MapMaster.MapOpr.extend({
    //执行画点，画线操作
    oOption: {
        onEvenDrawLayers: 'MapView:ShowLayer.DrawLayers',

        onEvenClearLayers: 'MapView:ShowLayer.clearLayer',

        onEvenRemoveLayers: 'MapView:ShowLayer.removeLayers',

        /*oSiteConfig: ES.oConfig.oSiteConfig,*/
        cHtml: '<div class="{cCls}"><div class="{cBCls}"></div><div class="{cTCls}">{Name}</div></div>'
    },

    initialize: function (oParent, oOption) {
        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, {});
        ES.setOptions(this, oOption);
        // 执行自己的方法
        this._initGroup();
        this._loadOn();
    },

    // 初始化Group
    _initGroup: function () {

        this._oPolygonGroup = L.layerGroup();
        this._oMap.addLayer(this._oPolygonGroup);

    },
    //初始化时加载数据
    _loadOn: function () {

        // 画所有的工地数据
        this._oParent.on(this.oOption.onEvenDrawLayers, this.drawLayers, this);
        this._oParent.on(this.oOption.onEvenClearLayers, this.clearLayer, this);
        this._oParent.on(this.oOption.onEvenRemoveLayers, this.removeLayers, this);

    },
    removeLayers: function (oData) {

        if (!this._oPolygonGroup || !oData || oData.acId.length <= 0) {
            return;
        }

        var aoInfo = oData.acId;

        for (var i = 0; i < aoInfo.length; i++) {
            var nId = parseInt(aoInfo[i]);
            if (nId > 0) {
                continue;
            }

            var oLayer = this.findLayer(this._oPolygonGroup, -nId);
            if (!oLayer) {
                continue;
            }

            this._oPolygonGroup.removeLayer(oLayer);
        }

    },

    clearLayer: function () {
        this._oPolygonGroup.clearLayers();
    },
    drawLayers: function(oData){
        this.clearLayer();

        if (!oData || !oData.aoNode) {
            return;
        }


        var aoNode = oData.aoNode;



        for (var i = 0; i < aoNode.length; i++) {
            var oLayer = this.findLayer(this._oPolygonGroup, aoNode[i].Id);
            if(oLayer){
                return;
            }
            this.drawLayer(aoNode[i]);
        }
    },
    drawLayer: function (oData) {
        if (!oData) {
            return ;
        }

        // 编辑围栏数据,画围栏时要表明自己的名称
        var oVehLine = this.createLayer(oData);
        if (!oVehLine) {
            return;
        }
        oVehLine.cId = oData.Id;
        oVehLine.oBusInfo = oData;
    },
    // 设置图层设置
    createLayer:function(oData) {
        var oVehLine = null;
        if (!oData || !oData.Json) return oVehLine;

        var oTemp = null;

        try {
            oTemp = JSON.parse(oData.Json);
        } catch (e) {
            oTemp = null;
        }
        if (!oTemp) {
            return oVehLine;
        }
        oVehLine = L.polygon(oTemp.aoLatLng, oTemp.oOption).addTo(this._oPolygonGroup);

        return oVehLine;
    },


});
