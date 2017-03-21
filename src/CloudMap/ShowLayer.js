/**
 * Created by liulin on 2017/1/18.
 * 显示所有的云图数据
 *
 */


ES.CloudMap.ShowLayer = L.MapLib.MapMaster.MapOpr.extend({

    //执行画点，画线操作
    oOption: {
        onEvenDrawLayers: 'CloudMap:ShowLayer.DrawLayers',

        onEvenClearLayers: 'CloudMap:ShowLayer.clearLayer',

        onEvenRemoveLayers: 'CloudMap:ShowLayer.removeLayers',

        oSiteConfig: ES.HGT.oConfig.oSiteConfig,
        cHtml: '<div class="{cCls}"><div class="{cBCls}"></div><div class="{cTCls}">{Name}</div></div>',
        oPenStyle: {
            stroke: true,
            color: '#666666',//'#0FFF05',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 1,
            opacity: 1,
            fill: true,
            fillColor: null,
            fillOpacity: 0.05,
            clickable: true,
            smoothFactor: 1.0,
            noClip: false

        },
    },

    initialize: function (oParent, oOption) {
        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, {});
        ES.setOptions(this, oOption);
        this.oPenStyle =this.oOption.oPenStyle;
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

        if (!this._oPolygonGroup || !oData ||   oData.aoInfo.length <= 0)  {
            return;
        }

        var aoInfo = oData.aoInfo;

        for (var i = 0; i < aoInfo.length; i++) {
            var oLayer = this.findLayer(this._oPolygonGroup, aoInfo[i].Id);
            if (!oLayer){
                continue;
            }

            this._oPolygonGroup.removeLayer(oLayer);
        };
    },


    clearLayer: function () {
        this._oPolygonGroup.clearLayers();
    },

    // 保存节点状态数据
    setStatusData: function (oData) {
        this.aoStatusData = oData.aoStatusData;
    },

    //设置数据时才进行操作
    setSiteData: function (oData) {
        // 把数据保存到界面上
        this.addSiteData(oData)
        // 画当前工地
        this.drawSites(oData);
    },

    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawLayers: function (oData) {

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
            oTemp.oOption ={};
            ES.extend(oTemp.oOption,this.oPenStyle);
            if(oData.MapType!== 1 && oData.MapType!== 2 ) {
                oTemp.oOption.fill = false;
            }
        } catch (e) {
            oTemp = null;
        }

        if (!oTemp) {
            return oVehLine;
        }

        switch (oData.MapType) {
            case 1:
                oVehLine = L.polygon(oTemp.aoLatLng, oTemp.oOption).addTo(this._oPolygonGroup);
                break;
            case 2:
                var dDis = L.latLng(oTemp.aoLatLng[0]).distanceTo(L.latLng(oTemp.aoLatLng[1]))
                oVehLine = L.circle(oTemp.aoLatLng[0], dDis,oTemp.oOption).addTo(this._oPolygonGroup);
                break;
            case 3:
                oVehLine = L.rectangle(oTemp.aoLatLng, oTemp.oOption).addTo(this._oPolygonGroup);
                break;
            case 4:
                oVehLine = L.polyline(oTemp.aoLatLng, oTemp.oOption).addTo(this._oPolygonGroup);
                break;
            case 5:
                oVehLine = L.marker(oTemp.aoLatLng[0], oTemp.oOption).addTo(this._oPolygonGroup);
                break;
            default :
                oVehLine = L.polygon(oTemp.aoLatLng, oTemp.oOption).addTo(this._oPolygonGroup);
                break;
        }
        return oVehLine;
    },




});