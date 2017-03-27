/**
 * Created by liulin on 2016/12/23.
 *
 * 工地图层操作
 *
 *
 */



ES.MapView.SiteLayer = L.MapLib.MapMaster.MapOpr.extend({

    //执行画点，画线操作
    oOption: {
        onEvenDrawSite: 'MV:Site.DrawSite',
        onEvenSetData: 'MV:Site.setSiteData',
        onEvenSetStatusData: 'MV:Site.setStatusData',
        onEvenClearSites: 'MV:Site.clearSites',
        oSiteConfig: ES.MapView.oConfig.oSiteConfig,
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

        //把所有的圆点区域绘制在分组图层中
        this._oSiteGroup = L.layerGroup();
        this._oMap.addLayer(this._oSiteGroup);

        this._oPolygonSiteGroup = L.layerGroup();
        this._oMap.addLayer(this._oPolygonSiteGroup);

        this.aoSiteInfo = null;
    },

    //初始化时加载数据
    _loadOn: function () {

        //this._oParent.fire('MV:Site.setSiteData', { aoSiteInfo: oData });
        //画出站点
        this._oParent.on(this.oOption.onEvenDrawSite, this.DrawSites, this);
        //给界面赋值，并画工地
        this._oParent.on(this.oOption.onEvenSetData, this.setSiteData, this);

        // 设置工地状态
        this._oParent.on(this.oOption.onEvenSetStatusData, this.setStatusData, this);

        //监听地图放大缩小时间
        this._oMap.on("zoomend", this.drawSites, this);

        // 清除站点
        this._oParent.on(this.oOption.onEvenClearSites, this.clearSites, this);

        this._oParent.on('SiteLayer:clearAll', this.clearAll, this);
    },
    DrawSites:function(oData){
        this.clearAll();
        if (!oData ) {
            return;
        }

        for (var i = 0; i < oData.oData.length; i++) {
            var oLayer = this.findLayer(this._oSiteGroup, oData.oData[i].id);
            if(oLayer){
                return;
            }
            this.DrawSite(oData.oData[i]);
        }
    },
    DrawSite:function(oData){
        if (!oData) {
            return ;
        }

        // 编辑邮路,画围栏时要表明自己的名称
        var oVehLine = this.createLayer(oData);
        if (!oVehLine) {
            return;
        }
        oVehLine.cId = oData.id;
        oVehLine.cName  = oData.text;
    },
    createLayer:function(oData) {
        var oVehLine = null;
        if (!oData) return oVehLine;
        oVehLine = L.marker(oData.data, {}).addTo(this._oSiteGroup);

        return oVehLine;
    },
    clearAll: function () {
        if (this.aoSiteInfo && this.aoSiteInfo.length > 0) {

            this.aoSiteInfo.splice(0, this.aoSiteInfo.length);
        }

        // 清空数据
        this._oSiteGroup.clearLayers();
        this._oPolygonSiteGroup.clearLayers();
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
    drawSites: function (oData) {

        var aoSiteInfo = this.aoSiteInfo;
        if (!aoSiteInfo) {
            return;
        }

        //获得当前图层层级，如果是1-5层
        var nZoom = this._oMap.getZoom();

        for (var i = 0; i < aoSiteInfo.length; i++) {
            if (!aoSiteInfo[i].Points || aoSiteInfo[i].Points.length <= 0) {
                continue;
            }
            if (nZoom <= 4) {
                this._oSiteGroup.clearLayers();
                this._oPolygonSiteGroup.clearLayers();
            }
            else if (nZoom > 4 && nZoom <= 16) {
                this._oPolygonSiteGroup.clearLayers();
                this._drawSiteMarker(aoSiteInfo[i]);
            }
            else {
                this._oSiteGroup.clearLayers();
                this._drawPolygonSite(aoSiteInfo[i]);
            }
        }



        if (oData.aoSiteInfo && oData.aoSiteInfo.length === 1) {
            var oLayer = this.findLayer(this._oPolygonSiteGroup,oData.aoSiteInfo[0].Id);
            if(oLayer){

                this._oMap.fitBounds(oLayer.getLatLngs());
            }

            oLayer = this.findLayer(this._oSiteGroup,oData.aoSiteInfo[0].Id);
            if(oLayer){
                var oLatLng = oLayer.getLatLng();
                this.flyTo({oGpsInfo: {Lat: oLatLng.lat, Lon: oLatLng.lng}}, {zoom: 16});

            }
        }
    },

    // 画单个点
    _drawSiteMarker: function (oPosInfo) {

        if (!this._oSiteGroup || !oPosInfo) return;

        var oLayer = this.findLayer(this._oSiteGroup, oPosInfo.Id);
        if (oLayer) {
            return oLayer;
        }


        var oBound = new L.LatLngBounds(oPosInfo.Points);
        var oLatLng = oBound.getCenter()
        if (oPosInfo.FenceType == 2) {
            oLatLng = oPosInfo.Points[0];
        }


        var oIcon = this._getIcon(this._getIconHtml(oPosInfo));

        var oMarker = L.marker(oLatLng, { icon: oIcon });

        oMarker.cId = oPosInfo.Id;
        oMarker.oPosInfo = oPosInfo;

        oMarker.addTo(this._oSiteGroup);

        this.initEventForMarker(oMarker);

        return oMarker;
    },


    //给点注册点击事件
    initEventForMarker: function (oMarker) {
        if (!oMarker) {
            return;
        }

        oMarker.on('click', function () {
            var oPop = new ES.MapView.PopSiteInfo(this, oMarker.oPosInfo);
            oPop.showModal();
        }, this);

    },

    // 画多边形
    _drawPolygonSite: function (oPosInfo) {
        if (!this._oPolygonSiteGroup || !oPosInfo) {
            return;
        }
        var oTemp = this.findLayer(this._oPolygonSiteGroup, oPosInfo.Id);
        if (oTemp) {
            return;
        }

        var oPolygon = null;


        // 中心点
        var oLatLng = null;
        if (oPosInfo.FenceType === 2) {
            var nZoom = this.oMap.getZoom();
            var oBPos = this.oMap.options.crs.latLngToPoint(L.latLng(oPosInfo.Points[0]), nZoom);
            var oEPos = this.oMap.options.crs.latLngToPoint(L.latLng(oPosInfo.Points[1]), nZoom);
            oPolygon = L.circle(oPosInfo.Points[0], oBPos.distanceTo(oEPos), oInfo.oOption).addTo(this._oPolygonSiteGroup);

            oLatLng = oPosInfo.Points[0];
        }
        else {
            oPolygon = L.polygon(oPosInfo.Points, this.oOption.oSiteConfig).addTo(this._oPolygonSiteGroup);
            var oBound = new L.LatLngBounds(oPosInfo.Points);
            oLatLng = oBound.getCenter();

            oPolygon.cId = oPosInfo.Id;
        }

        oPolygon.bindTooltip(oPosInfo.Name).openTooltip();
        oPolygon.oPosInfo = oPosInfo;
        this.initEventForMarker(oPolygon);
        return oPolygon;
    },

    // 工地数据
    _getIconHtml: function (oPosInfo) {
        oPosInfo.cCls = 'ex-monitor-mapicon-site green '
        oPosInfo.cBCls = 'site-body'
        oPosInfo.cTCls = 'site-title';
        // 核准工地
        if(oPosInfo.SiteType ===1){

            oPosInfo.cCls = 'ex-monitor-mapicon-site green';
            if(oPosInfo.ApprovalType ===1)
            {
                oPosInfo.cCls = 'ex-monitor-mapicon-site green-unearthed';
            }

            oPosInfo.cBCls = 'site-body'

            oPosInfo.cTCls = 'site-title green';
        }
        else if(oPosInfo.SiteType ===2){
            // 临时工地
            oPosInfo.cCls = 'ex-monitor-mapicon-site  yellow ';
            oPosInfo.cBCls = 'site-body'
            oPosInfo.cTCls = 'site-title green';
        }
        else if(oPosInfo.SiteType ===3){
            // 违规工地
            oPosInfo.cCls = 'ex-monitor-mapicon-site  red';
            oPosInfo.cBCls = 'site-body'
            oPosInfo.cTCls = 'site-title green';
        }
        //  核准工地 没有开工
        else if(oPosInfo.SiteType ===4){
            // 核准未开工工地
            oPosInfo.cCls = 'ex-monitor-mapicon-site  gray';
            oPosInfo.cBCls = 'site-body'
            oPosInfo.cTCls = 'site-title green';
        }

        var cHtml = ES.Util.template(this.oOption.cHtml, oPosInfo);

        return cHtml;
    },

    // 画点
    _getIcon: function (cHtml) {

        var oIcon = L.divIcon({
            iconSize: [20, 20], iconAnchor: [10, 20],
            popupAnchor: [-1, -20],
            className: "",
            html: cHtml,
        });
        return oIcon;
    },

    // 获得弹出层的内容
    _getPopHtml: function (oPosInfo) {

        return '';
    },

    // 清空界面所有的工地数据
    clearSites: function (oData) {
        //this.oInfo = null;
        this.clearPolygonSite(oData);
        this.clearMarkerSite(oData);
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