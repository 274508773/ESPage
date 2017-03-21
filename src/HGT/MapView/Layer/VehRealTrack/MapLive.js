/**
 * Created by liulin on 2017/1/7.
 */

ES.HGT.MapView.MapLive = L.MapLib.MapMaster.MapOpr.extend({

    /*
     为构造函数
     @oParent 为父级页面对象
     @oOption 为参数，设置当前的参数
     */
    initialize: function (oParent, oOption,oMap) {

        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, oOption, oMap);
        // 添加图层
        this._loadLayerGroup();

        // 注册监听事件
        this._initOn();

        this.PhoneNum = oOption.PhoneNum || "-1";
        this.cId = null;
    },

    setOption: function(oGpsInfo) {
        if(oGpsInfo.hasOwnProperty('VehicleNo')){
            delete  oGpsInfo.VehicleNo;
        }
        return ES.extend(this.options, oGpsInfo);
    },

    // 初始化监听事件
    _initOn: function () {

        this._oMap.on("moveend", this._mapMoveHandler, this);

        // 画实时点
        this._oParent.on("MV:Real.drawLiveTrack", this.drawLiveTrack, this);

        // 判断是否显示弹出层
        this._oParent.on("MV:Real.showVecMarkerPop", this._showVecMarkerPop, this);

        // 放大实时监控点
        this._oParent.on("MV:Real.setLiveZoomIn", this.setLiveZoomIn, this);

        // 清除实时跟踪的点、历史点、轨迹线
        this._oParent.on("MV:Real.clearLiveTrack", this.clearLiveTrack, this);

        this._oParent.on("MapView:MapLive.setZoomIn", this.setZoomIn, this);

    },

    // 实现地图放大
    setZoomIn:function(oData) {
        if (!oData || !oData.oGpsInfo) {
            return;
        }

        var oGpsInfo = oData.oGpsInfo;

        var oLayer = this.findLayer(this._oLivePosGroup, oGpsInfo.PhoneNum);
        if (!oLayer) {
            return;
        }
        var oLatLng = oLayer.getLatLng();
        this.flyTo(oLatLng, {zoom: 16});

        // 打开popup层显示车辆数据
        oLayer.openPopup();
    },

    // 关闭事件
    offEven: function () {
        this._oMap.off("moveend", this._mapMoveHandler, this);

        // 画实时点
        this._oParent.off("MV:Real.drawLiveTrack", this.drawLiveTrack, this);

        //解决聚合和实时同时存在问题
        this._oParent.off("MV:Real.unVisibleMarker");

        // 判断是否显示弹出层
        this._oParent.off("MV:Real.showVecMarkerPop", this._showVecMarkerPop, this);

        // 放大实时监控点
        this._oParent.off("MV:Real.setLiveZoomIn", this.setLiveZoomIn, this);

        // 清楚实时跟踪的点、历史点、轨迹线
        this._oParent.off("MV:Real.clearLiveTrack", this.clearLiveTrack, this);
    },

    //添加实时跟踪状态数据
    _loadLayerGroup: function () {

        //线路
        this._oLineGroup = L.featureGroup();
        this._oMap.addLayer(this._oLineGroup);

        //轨迹点
        this._oTrackGroup = L.featureGroup();
        this._oMap.addLayer(this._oTrackGroup);

        //实时跟踪点
        this._oLivePosGroup = L.featureGroup();
        this._oMap.addLayer(this._oLivePosGroup);
    },

    //判断弹出层是否应该弹出，如果地图为当前获得页，就弹出层，否则不弹出
    //对地图进行了放大缩小操作
    _showVecMarkerPop: function (oData) {
        if (!this._oLivePosGroup) return;
        var bActive = $("#Map").hasClass("active");

        var oGpsInfo = oData.oGpsInfo;
        this._oLivePosGroup.eachLayer(function (oLayer) {
            if (oGpsInfo.cDevId != oLayer.cId) {
                oLayer.closePopup();
                return;
            }

            if (bActive) {
                this._oMap.setView(oLayer.getLatLng(), 17);
                oGpsInfo.bOpenBubble ? oLayer.openPopup() : oLayer.closePopup();
            }
            else {
                oLayer.closePopup();
            }
        }, this)

    },

    //修改弹出层样式错误，
    _updateVecMarkerPop: function (oLivePosLayer, cHtml) {
        if (!oLivePosLayer) return;
        oLivePosLayer.setPopupContent(cHtml);
    },

    //画布,实时跟踪绘制，如线，轨迹点等，oPosInfo，为当前点信息
    _drawLiveHis: function (oPosInfo) {

        var oLatLng = L.latLng(oPosInfo.Lat, oPosInfo.Lng);

        var oPrePosInfo = null;
        var oLineLayer = this.findLayer(this._oLineGroup, oPosInfo.PhoneNum);
        if (!oLineLayer) {
            //创建线图层
            var oPloyLine = L.polyline([oLatLng], ES.HGT.oConfig.oLiveLineConfig);
            oPloyLine.cId = oPosInfo.PhoneNum;
            oPloyLine.oPrePosInfo = oPosInfo;
            oPloyLine.addTo(this._oLineGroup);
        }
        else {
            oPrePosInfo = oLineLayer.oPrePosInfo;
            oLineLayer.oPrePosInfo = oPosInfo;
            oLineLayer.addLatLng(oLatLng);
        }

        //创建轨迹图层
        if (oPrePosInfo) {
            var oTrackLayer = L.circleMarker([oPrePosInfo.Lat, oPrePosInfo.Lng], ES.HGT.oConfig.oLiveCircleMarkerConfig);
            var cHTML = this._getVecMarkerHtml(oPrePosInfo);
            oTrackLayer.bindPopup(cHTML, this.oPopOption);

            var oPopup = oTrackLayer.getPopup();
            oPopup.oGpsInfo = oPosInfo;
            // 设置对象的弹出层
            this.initPopEven(oPopup);

            oTrackLayer.addTo(this._oTrackGroup);
        }
    },

    // 创建实时跟踪点
    _createLive: function (oPosInfo) {
        this._oParent.fire("MV:Real.unVisibleMarker", oPosInfo);
        this._oParent.fire("MapView:MapVehMark.updataMarker", oPosInfo);
        this.selectLi(oPosInfo);

        var oLatLng = L.latLng(oPosInfo.Lat, oPosInfo.Lng);


        var oLayer = L.Marker.movingMarker([oLatLng], [], {icon: this._getPosIconInfo(oPosInfo, {nSize: 30})});

        oLayer.cId = oPosInfo.PhoneNum;
        oLayer.cVehNo = oPosInfo.VehicleNo;
        oLayer.nW = 10;
        oLayer.oData = oPosInfo;
        var oOption = L.extend({radius: 50}, ES.HGT.oConfig.oLiveCircleConfig);

        var oCircle = L.circle(oLatLng, oOption).addTo(this._oLivePosGroup);
        //把矢量点添加到地图上
        oLayer.addTo(this._oLivePosGroup);
        oLayer.oCircle = oCircle;
        return oLayer;
    },

    // 在地图上绘制实时跟踪的点
    _drawLive: function (oPosInfo) {
        if (!this._oLivePosGroup) return;

        var oLayer = this.findLayer(this._oLivePosGroup, oPosInfo.PhoneNum);
        var oLatLng = L.latLng(oPosInfo.Lat, oPosInfo.Lng);
        var cHtml = this._getVecMarkerHtml(oPosInfo);
        if (!oLayer) {
            this.clearLiveTrack();

            this.oLayer = oLayer = this._createLive(oPosInfo);
            //当弹出层弹出时，界面初始化公司信息，注册按钮事件
            oLayer.bindPopup(cHtml, this.oPopOption);
            var oPopup = oLayer.getPopup();
            oPopup.oGpsInfo = oPosInfo;
            this.initPopEven(oPopup);

            if (oPosInfo.bOpenBubble) {
                oLayer.openPopup();
            }
            this._setHeading(oPosInfo, 180);
        }
        else {

            this._oParent.fire("MV:Real.unVisibleMarker", oPosInfo);
            this._oParent.fire("MapView:MapVehMark.updataMarker", oPosInfo);

            this._setHeading(oPosInfo, 180);


            this.selectLi(oPosInfo);
            oLayer.moveTo(oLatLng,5000);
            if (oLayer.oCircle) {
                oLayer.oCircle.setLatLng(oLatLng);
            }
            //更新弹出层的信息,修改的目的是防止注册2次点击事件
            //this._updateVecMarkerPop(oLayer, cHtml);
            var oPopup = oLayer.getPopup();
            // 在次注册事件
            oPopup.oGpsInfo = oPosInfo;
            oPopup._content = cHtml;
            oPosInfo.bOpenBubble ? oLayer.openPopup() : oLayer.closePopup();


        }
        oLayer._bringToFront();

        //this._oMap.fitBounds( this._oLivePosGroup.getBounds());

        //删除实时车辆数据
        //this._oParent.fire("MV:Real.clearVehicle", oPosInfo);

        return oLayer;
    },

    //WQ通过class获取li
    selectLi: function (oPosInfo) {
        var cId = oPosInfo.PhoneNum;
        var oLi = $(".ex-layout-carlist-content").find("li");
        for (var i = 0; i < oLi.length; i++) {
            var oLiData = $(oLi[i]).data("data");
            if (oLiData.PhoneNum == cId) {
                $(oLi[i]).removeData("data");
                $(oLi[i]).data("data", oPosInfo)
            }
        }
    },

    // 地图监控移动设置
    _mapMoveHandler: function () {
        if (!this._oLivePosGroup) return;
        this._oLivePosGroup.eachLayer(function (oLayer) {
            if (!oLayer._bringToFront) return;
            oLayer._bringToFront();

        }, this);
    },

    // 清除实时跟踪的点
    clearLiveTrack: function () {
        this._oLivePosGroup.clearLayers();
        this._oLineGroup.clearLayers();
        this._oTrackGroup.clearLayers();

        //如果字不为空，就返回
        //if (!this.oLayer || !this.oLayer.oData) return;
        //if (this.oLayer.oData.text) return;
        //this._oParent.fire("MV:RegionDraw.addMarker", { oLayer: this.oLayer });
    },

    // 画实时跟踪轨迹数据
    drawLiveTrack: function (oData) {

        this._drawLiveHis(oData.oGpsInfo);
        this._drawLive(oData.oGpsInfo);
        //this._oParent.fire("MV:Real.reComerVehMarker", oData.oGpsInfo);
    },

    // 放大地图,放大
    setLiveZoomIn: function () {

        var aoLayer = this._oLivePosGroup.getLayers();
        if (!aoLayer || aoLayer.length <= 0) {
            return;
        }
        if (!aoLayer[0].getLatLng) {
            return;
        }

        var oLatLng = aoLayer[0].getLatLng();

        var nMaxZoom = this._oMap.getMaxZoom();

        this._oMap.setView(oLatLng, nMaxZoom - 1);

    },

});

// 车辆实时跟踪的基本操作
ES.HGT.MapView.MapLive.include({
    // 设置弹出层的位置
    oPopOption: { maxWidth: 400 ,autoPan: false},

    // 获得实时跟踪点, 地图统计点数据
    _getPosIconInfo: function (oItem, oOption) {
        var oClass = this.alarmToCls(oItem);

        return new L.DivIcon({
            html: "<div cid='" + oItem.PhoneNum + "' class='car-body' style='transform: rotate(" +
            (oItem.Direction + 180) + "deg);-webkit-transform: rotate(" + (oItem.Direction + 180) + "deg);'></div> <div class='"
            + oClass.cAlarm + "'></div>",
            className: "ex-monitor-mapicon-car " + oItem.cClsLight,
            iconSize: L.point(oOption.nSize, oOption.nSize),
            popupAnchor: L.point(-0, -20),

        });
    },
    // 设置车辆的角度
    _setHeading: function (oPosInfo, nInitDir) {
        if (!oPosInfo) return;
        if (!nInitDir) nInitDir = 0;
        var nDir = oPosInfo.Direction + nInitDir;
        $("div[cId='" + oPosInfo.PhoneNum + "']").attr('style', 'transform: rotate('
            + nDir + 'deg);-webkit-transform: rotate('
            + nDir + 'deg);');
    },

    //根据告警类型，生成告警样式
    alarmToCls: function (oGpsInfo) {
        // 获得车辆的样式 和 车辆告警样式
        var oClass = { cAlarm: "" };
        oGpsInfo.cClsLight = "green";
        // 车灯要修改
        if (!oGpsInfo) return oClass;


        if (oGpsInfo.Speed > 60) {
            oClass.cAlarm = "car-state speed";
        }
        return oClass;
    },

    // 注册弹出层事件
    _getVecMarkerHtml: function (oGpsInfo) {

        var cDir = ES.TrackHelper.getDire(oGpsInfo.Direction);
        var cMsg = ES.TrackHelper.getDateMsg(oGpsInfo.GpsTime * 1000);
        var oTemp = {};
        if (oGpsInfo.Property && oGpsInfo.Property.LastWorkPlace)
        {
            oTemp.cLastWorkPlace = oGpsInfo.Property.LastWorkPlace.replace("湖北省;武汉市;", "");
        }
        ES.extend(oTemp, oGpsInfo, oGpsInfo.Property, {
            cMsg: cMsg,
            cDir: cDir,
            Mileage: oGpsInfo.Mileage / 1000,
            cGpsDate: ES.Util.dateFormat(oGpsInfo.GpsTime * 1000, "yyyy-MM-dd hh:mm:ss"),
            cVehicleStatus: oGpsInfo.VehicleStatus || "通讯中断",
            cPoiInfo: oGpsInfo.PoiInfo || ""
        });


        // 设置外层div 控制弹出层的宽度
        var cHtmlD = '<div style="width:400px"><div class="ex-map-tip-head"><h3> {VehicleNo} <span class="ex-map-tip-timer">{cGpsDate} {cMsg} </span></h3> ';
        cHtmlD += ' <ul class="ec-avg-sm-2 ex-map-tip-mobile"><li><i class="ex-icon-16 ex-icon-mobile on"></i></li><li><i class="ex-icon-16 ex-icon-bd on"></i></li></ul></div>';
        cHtmlD += ' <ul class="ec-avg-sm-2 ex-map-tip-status"><li class=""><label>状态：</label><span> {cVehicleStatus} </span></li>';

        //cHtmlD += ' <li><label>总里程：</label><span>{Mileage}(Km)</span>  </li>';

        cHtmlD += '<li><label>速度：</label><span>{Speed}(Km/h)</span> </li>';
        cHtmlD += ' <li><label>方向：</label><span>{cDir}</span> </li>';
        cHtmlD += ' </ul>';


        cHtmlD += ' <p class="ex-map-tip-location ">当前位置：<span> {cPoiInfo}  </span></p>';
        cHtmlD += ' </div>';

        cHtmlD += ' <ul class="ec-avg-sm-9 ex-map-tip-ctl">';
        cHtmlD += '<li> <i class="ec-icon-exchange"></i> <label>轨迹</label> </li>';

        cHtmlD += ' </ul>';
        cHtmlD += '</div></div>';

        var cHtml = ES.Util.template(cHtmlD, oTemp);
        return cHtml;
    },






});

// 弹出层的事件操作
ES.HGT.MapView.MapLive.include({

    // 注册弹出层事件,弹出层绑定对象,每次不是最新oGpsInfo数据，不能用匿名的函数，需要注销
    initPopEven: function (oPopup) {

        var self = this;

        if (!oPopup) return;
        oPopup.self = this;
        oPopup.on("contentupdate", function (){
            // 车辆详情按钮
            var oBtnDetail = $(".leaflet-popup").find("i.ec-icon-truck").parent();

            // 车辆轨迹按钮
            var oBtnTrack = $(".leaflet-popup").find("i.ec-icon-exchange").parent();


            var oMeassageClick = $(".leaflet-popup").find("i.ec-icon-commenting").parent();

            var oGpsInfo = this.oGpsInfo;

            // 绑定事件
            oBtnDetail.bind("click", function () {
                ES.aWarn('系统正在开发过程！');

            })

            oBtnTrack.bind("click", function () {


                // 单独的页面打开
                window.open("/MapView/TrackView?PhoneNum=" + oGpsInfo.PhoneNum + "&VehicleNo=" + oGpsInfo.VehicleNo);

            })

            // 发送消息
            oMeassageClick.bind("click", function () {

                ES.aWarn('系统正在开发过程！');
                //devcmd.sendMsg(oGpsInfo.VehicleNo, oGpsInfo.PhoneNum);

            })

            //设置状态,设置工地状态
            self.setMobileInfo(oGpsInfo);

        }, oPopup);
    },

    // 设置车辆gps信息 和 网络信息
    setMobileInfo: function (oGpsInfo) {
        //去掉on状态
        var $_oIMobile = $(".ex-icon-mobile");
        var $_oIBD = $(".ex-icon-bd");

        $_oIMobile.removeClass("on").removeClass("off");
        $_oIBD.removeClass("on").removeClass("off");

        //判断当前位置信息
        if (oGpsInfo.VehicleStatus == "行驶"
            || oGpsInfo.VehicleStatus == "停车"
            || oGpsInfo.VehicleStatus == "熄火") {
            $_oIMobile.addClass("on");
            $_oIBD.addClass("on");
        }
        else if (oGpsInfo.VehicleStatus == "通讯中断") {
            $_oIMobile.addClass("l-mobile-off");
            $_oIBD.addClass("l-bd-off");
        }
        else if (oGpsInfo.VehicleStatus == "定位失败") {
            $_oIMobile.addClass("on");
            $_oIBD.addClass("off");
        }
        else {
            $_oIMobile.addClass("off");
            $_oIBD.addClass("off");
        }
    },
})