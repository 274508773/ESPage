/**
 * Created by liulin on 2017/1/2.
 *
 * 画地图编辑数据
 */
//new ES.HGT.MapView.SiteLayer(oParent, oOption)

ES.HGT.MapView.RegionBoundLayer = ES.HGT.MapView.SiteLayer.extend({

    //执行画点，画线操作
    oOption: {
        onEvenSetData: 'MV:RegionBoundLayer.setSiteData',
        onEvenClearSites: 'MV:RegionBoundLayer.clearSites',
        oSiteConfig: ES.HGT.oConfig.oSiteConfig,
        cBound: '28.753815,115.900097|28.757953,115.89529|28.757577,115.853748|28.761339,115.831947|28.763747,115.819244|28.730184,115.791435|' +
        '28.700074,115.75573|28.667696,115.727921|28.63545880216531,115.71109771728517|28.60140301544218,115.72071075439455|28.56974836181537,115.7347869873047|28.527829,115.774612|' +
        '28.526019,115.805511|28.567035,115.815125|28.608034,115.821304|28.636965,115.839157|28.657454,115.861816|28.699622,115.883102'
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

        //把所有的圆点区域绘制在分组图层中
        this._oSiteGroup = L.layerGroup();
        this._oMap.addLayer(this._oSiteGroup);

        this._oPolygonSiteGroup = L.layerGroup();
        this._oMap.addLayer(this._oPolygonSiteGroup);

        this.aoSiteInfo = null;
    },

    //初始化时加载数据
    _loadOn: function () {

        //给界面赋值，并画工地
        this._oParent.on(this.oOption.onEvenSetData, this.setSiteData, this);

        //监听地图放大缩小时间
        this._oMap.on("zoomend", this.drawSites, this);

        // 清除工地
        this._oParent.on(this.oOption.onEvenClearSites, this.clearSites, this);

    },

    clearAll: function () {

        this._oPolygonSiteGroup.clearLayers();
    },



    //设置数据时才进行操作
    setSiteData: function () {
        var oData = null;
        if (this.oOption.cBound) {
            oData = this.oOption.cBound.split('|');
        }

        var aoSiteInfo = oData.map(function (oItem) {
            var acTemp = oItem.split(',');
            return [parseFloat(acTemp[0]), parseFloat(acTemp[1])]
        });
        oData = {Points: aoSiteInfo, Id: 1201};
        // 把数据保存到界面上
        this.addSiteData(oData)
        // 画当前工地
        this._drawPolygonSite(oData);
    },

    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawBound: function () {

        var aoSiteInfo = this.aoSiteInfo;
        if (!aoSiteInfo) {
            return;
        }

        //获得当前图层层级，如果是1-5层
        var nZoom = this._oMap.getZoom();
        var k = -1;
        for (var i = 0; i < aoSiteInfo.length; i++) {
            if (!aoSiteInfo[i].Points || aoSiteInfo[i].Points.length<= 0)
            {
                continue;
            }
            if (nZoom <= 4) {
                this._oPolygonSiteGroup.clearLayers();
            }
            else {

                this._drawPolygonSite(aoSiteInfo[i], k);
            }
        }
    },

    //给点注册点击事件
    initEventForMarker: function (oMarker) {
        if (!oMarker) {
            return;
        }

        oMarker.on('click', function () {
            var oPop = new ES.HGT.MapView.PopSiteInfo(this, oMarker.oPosInfo);
            oPop.showModal();
        }, this);

    },

    // 画多边形
    _drawPolygonSite: function (oPosInfo, nIndex) {
        if (!this._oPolygonSiteGroup || !oPosInfo) {
            return;
        }
        var oTemp = this.findLayer(this._oPolygonSiteGroup, oPosInfo.Id);
        if (oTemp) {
            return;
        }

        var oPolygon = L.polygon(oPosInfo.Points, this.oOption.oSiteConfig).addTo(this._oPolygonSiteGroup);

        oPolygon.cId = oPosInfo.Id;
        oPolygon.oPosInfo = oPosInfo;
        return oPolygon;
    },



    // 清空界面所有的工地数据
    clearSites: function (oData) {
        //this.oInfo = null;
        this.clearPolygonSite(oData);

        this.deleteSite(oData);
    },

    // 删除对象
    deleteSite: function (oData) {
        if (!this.aoSiteInfo || !oData || !oData.anId || oData.anId.length <= 0) return;
        var aoSiteInfo = this.aoSiteInfo
        var anId = oData.anId;
        for (var i = aoSiteInfo.length - 1; i >= 0; i--) {

            var aoTemp = $.grep(anId, function (k, nIndex) {
                if (aoSiteInfo[i].Id === parseInt(k)) {
                    return true;
                }
            })
            if (!aoTemp || aoTemp.length <= 0) continue;

            aoSiteInfo.splice(i, 1);
        }
    },

    addSiteData: function (oData) {
        //测试结果
        if (!this.aoSiteInfo) {
            this.aoSiteInfo = oData.aoSiteInfo;
            return;
        }

        $.merge(this.aoSiteInfo, oData.aoSiteInfo);

    },

    clearPolygonSite: function (oData) {
        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oPolygonSiteGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oPolygonSiteGroup.removeLayer(oLayer.oMarker);
            }
            this._oPolygonSiteGroup.removeLayer(oLayer);
        };


    },

    clearMarkerSite: function (oData) {
        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oSiteGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oSiteGroup.removeLayer(oLayer.oMarker);
            }
            this._oSiteGroup.removeLayer(oLayer);
        };


    },

    // 删除所有的数据
    clearAllPolygonSite: function (oData) {
        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oPolygonSiteGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oPolygonSiteGroup.removeLayer(oLayer.oMarker);
            }
            this._oPolygonSiteGroup.removeLayer(oLayer);
        }
    },

});