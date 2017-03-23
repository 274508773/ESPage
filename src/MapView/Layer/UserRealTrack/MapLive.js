/**
 * Created by liulin on 2017/1/7.
 */

ES.MapView.MapUserLive = ES.MapView.MapLive.extend({

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

        this._oParent.on("MapView:MapUserLive.setZoomIn", this.setZoomIn, this);

    },

    // 实现地图放大
    setZoomIn:function(oData) {
        if (!oData || !oData.oGpsInfo) {
            return;
        }


        var oLayer = this.findLayer(this._oLivePosGroup, oData.oGpsInfo.OId);
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
        //this._oParent.off("MV:Real.showVecMarkerPop", this._showVecMarkerPop, this);

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
            var oPloyLine = L.polyline([oLatLng], ES.oConfig.oLiveLineConfig);
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
            var oTrackLayer = L.circleMarker([oPrePosInfo.Lat, oPrePosInfo.Lng], ES.oConfig.oLiveCircleMarkerConfig);
            var cHTML = this._getVecMarkerHtml(oPrePosInfo);
            oTrackLayer.bindPopup(cHTML, this.oPopOption);

            var oPopup = oTrackLayer.getPopup();
            oPopup.oGpsInfo = oPosInfo;
            // 设置对象的弹出层
            this.initPopEven(oPopup);
            //oTrackLayer.
            oTrackLayer.addTo(this._oTrackGroup);
        }
    },

    // 创建实时跟踪点
    _createLive: function (oPosInfo) {
        this._oParent.fire("MV:Real.unVisibleMarker", oPosInfo);
        this._oParent.fire("MapView:MapVehMark.updataMarker", oPosInfo);
        this.selectLi(oPosInfo);
        //this.cId = oPosInfo.PhoneNum
        var oLatLng = L.latLng(oPosInfo.Lat, oPosInfo.Lng);
        //创建当前点
        //添加点到点图层
        var oLayer = L.Marker.movingMarker([oLatLng], [], {icon: this._getPosIconInfo(oPosInfo, {nSize: 30})});
        //oLayer = L.marker(oLatLng, {
        //    icon: this._getPosIconInfo(oPosInfo, { nSize: 30 })
        //});

        oLayer.cId = oPosInfo.PhoneNum;
        oLayer.cVehNo = oPosInfo.VehicleNo;
            oLayer.nW =   10;
        oLayer.oData = oPosInfo;
        var oOption = L.extend({ radius:100 },  ES.oConfig.oLiveCircleConfig)
        //var oCircle = L.circleMarker(oLatLng, oOption).addTo(this._oLivePosGroup);
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

            if (oPosInfo.bOpenBubble) oLayer.openPopup();
        }
        else {
            this._oParent.fire("MV:Real.unVisibleMarker", oPosInfo);
            this._oParent.fire("MapView:MapVehMark.updataMarker", oPosInfo);
            this.selectLi(oPosInfo);
            oLayer.setLatLng(oLatLng);
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
        this._setHeading(oPosInfo, 180);

        //删除实时车辆数据
        this._oParent.fire("MV:Real.clearVehicle", oPosInfo);

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
        if (!this.oLayer || !this.oLayer.oData) return;
        if (this.oLayer.oData.text) return;
        this._oParent.fire("MV:RegionDraw.addMarker", { oLayer: this.oLayer });
    },

    // 画实时跟踪轨迹数据，人员不用画轨迹
    drawLiveTrack: function (oData) {
        ES.extend(this.oOption,oData.oGpsInfo);
        //this._drawLiveHis(oData.oGpsInfo);
        this._drawLive(this.oOption);
        this._oParent.fire("MV:Real.reComerVehMarker", this.oOption);
    },

    // 放大地图,放大
    setLiveZoomIn: function () {

        var aoLayer = this._oLivePosGroup.getLayers();
        if (!aoLayer || aoLayer.length <= 0) return;
        if (!aoLayer[0].getLatLng) return;

        var oLatLng = aoLayer[0].getLatLng();

        var nMaxZoom = this._oMap.getMaxZoom();

        this._oMap.setView(oLatLng, nMaxZoom - 1);

    },

});

ES.MapView.MapUserLive.include({
    oPopOption: { maxWidth: 400 },
    // 获得实时跟踪点, 地图统计点数据
    _getPosIconInfo: function (oItem, oOption) {
        //var oClass = this.alarmToCls(oItem);

        //<div class="ex-monitor-mapicon-site"><div class="person-left-run"></div><div class="site-title">执法人员</div></div>
        //return new L.DivIcon({
        //    html: "<div cid='" + oItem.PhoneNum + "' class='person-left-run'></div> <div class='" + oClass.cAlarm + "'></div>",
        //    className: "ex-monitor-mapicon-site " ,//+ oItem.cClsLight,
        //    iconSize: L.point(oOption.nSize, oOption.nSize),
        //    popupAnchor: L.point(-0, -20),
        //
        //});
        var oIcon = L.icon({
            iconUrl: '/Asset/img/ex_nanchang/person_stay.png',
            iconSize: [20, 40],
            iconAnchor: [10, 40],
            popupAnchor: [-3, -40],
            //shadowUrl: 'my-icon-shadow.png',
            //shadowSize: [68, 30],
            shadowAnchor: [22, 30]
        });
        return oIcon;
    },
    // 设置车辆的角度
    _setHeading: function (oPosInfo, nInitDir) {
        if (!oPosInfo) {
            return;
        }
        if (!nInitDir) {
            nInitDir = 0;
        }
        var nDir = oPosInfo.Direction + nInitDir;
        if(nDir>360) {
            nDir = nDir % 360;
        }
        var cCls = 'person_left_run';
        if(nDir<=180) {
            var cCls = 'person_right_run';
        }

        var oIcon = L.icon({
            iconUrl: '/Asset/img/ex_nanchang/'+cCls+'.gif',
            iconSize: [38, 95],
            iconAnchor: [22, 30],
            popupAnchor: [-3, -30],
            //shadowUrl: 'my-icon-shadow.png',
            //shadowSize: [68, 30],
            shadowAnchor: [22, 30]
        });

        return oIcon;
        //$("div[cId='" + oPosInfo.PhoneNum + "']").removeClass('person-left-run').removeClass('person-rigth-run');
        //
        //$("div[cId='" + oPosInfo.PhoneNum + "']").addClass(cCls);
    },

    //根据告警类型，生成告警样式
    alarmToCls: function (oGpsInfo) {
        // 获得车辆的样式 和 车辆告警样式
        var oClass = { cAlarm: "" };
        oGpsInfo.cClsLight = "green";
        // 车灯要修改
        if (!oGpsInfo) return oClass;

        if ((oGpsInfo.Status.FrontDoor && oGpsInfo.Speed > 0)) {
            oClass.cAlarm = "car-state cover";
        }
        if (oGpsInfo.nRedOn == 1) {
            oClass.cAlarm = "car-state";
        }
        if (oGpsInfo.Speed > 60) {
            oClass.cAlarm = "car-state speed";
        }
        return oClass;
    },

    // 注册弹出层事件
    _getVecMarkerHtml: function (oGpsInfo) {

        var cDir = this.getDire(oGpsInfo.Direction);
        var cMsg = this.getDateMsg(oGpsInfo.GpsTime * 1000);
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
            cVehicleStatus: oGpsInfo.VehicleStatus || "通讯中断"
        });
        //var cVehStatus = "";

        // 设置外层div 控制弹出层的宽度
        var cHtmlD =
            '<div style="width:400px">'+
            '<div class="ex-map-tip-head">'+
           ' <h3> {VehicleNo} <span class="ex-map-tip-timer ec-fr">{cGpsDate} {cMsg}  </span></h3>'+
        ' <div class="ex-map-tip-humen-status">'+
        '    <p> 当前状态： <span> {cVehicleStatus}</span></p>'+
        '<ul class="ec-avg-sm-2 ex-map-tip-mobile ec-fr"><li><i class="ex-icon-16 ex-icon-mobile on"></i></li><li><i class="ex-icon-16 ex-icon-bd on"></i></li></ul>'+
        '</div>'+
        '</div>'+
        ' <div class="ex-map-tip-humen-info">'+
        '    <div class="ex-tip-humen-img">'+
        '  <img src="/Asset/img/icon_image.png" />'+
        '   </div>'+
        '   <div class="ex-tip-humen-detial">'+
        '   <ul>'+
        '    <li><label>所属公司：</label><span> 武汉新森泰土方工程有限公司 </span></li>'+
        '<li><label>所属网格：</label><span> 凤凰街道 </span></li>'+
        ' <li><label>当前位置：</label><span> {PoiInfo} </span></li>'+
        '</ul>'+
        '</div>'+
        '</div>'+
        '<ul class="ec-avg-sm-9 ex-map-tip-ctl">'+
        //'    <li> <i class="ec-icon-truck"></i> <label>详细</label> </li>'+
        ' <li> <i class="ec-icon-exchange"></i> <label>轨迹</label> </li>'+
        //'<li> <i class="ec-icon-send"></i> <label>点名</label>  </li>'+
        //'<li> <i class="ec-icon-commenting"></i>  <label>消息</label> </li>'+
        //'<li>  <i class="ec-icon-cogs"></i>  <label>设置</label> </li>'+
        //'<li>  <i class="ec-icon-file-text"></i>  <label>任务</label> </li>'+
        ' </ul>'+
        ' </div>';



        var cHtml = ES.Util.template(cHtmlD, oTemp);
        return cHtml;
    },

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
                // 显示详细数据

            })

            oBtnTrack.bind("click", function () {
                window.open("/MapView/UserTrackView?PhoneNum=" + oGpsInfo.Account + "&VehicleNo=" + oGpsInfo.Name);
            })

            oMeassageClick.bind("click", function () {
                //devcmd.sendMsg(oGpsInfo.VehicleNo, oGpsInfo.PhoneNum);
                ES.aWarn('系统正在开发过程！');
            })

            //设置状态
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

    //获取告警类型
    getAlarmTypeName: function (type) {

        var oData = this.getAlarmType();
        if (!oData) return;
        return oData[type];
    },

    //告警字典
    getAlarmType: function () {
        var alarmType = {
            1: '紧急报警', 2: '超速报警', 3: '疲劳驾驶', 4: '预警', 5: 'GNSS模块发生故障',
            6: '定位天线被剪断', 7: 'GNSS天线短路', 8: '终端主电源欠压', 9: '电源掉电', 10: '终端LCD或显示器故障',
            11: 'TTS模块故障', 12: '摄像头故障', 13: '当天累计驾驶超时', 14: '超时停车', 15: '进出区域',
            16: '进出路线', 17: '路段行驶时间不足_过长', 18: '路线偏离报警', 19: '车辆VSS故障', 20: '车辆油量异常',
            21: '车辆被盗', 22: '车辆非法点火', 23: '车辆非法位移', 24: '碰撞侧翻报警', 25: 'SD卡异常',
            26: '进区域报警', 27: '出区域报警', 28: '超线报警',
            51: '平台超速报警',
            200: '重量传感器可疑故障', 201: '顶棚可疑故障', 202: '不按线路行驶', 203: '未密闭', 204: '超载',
            206: '无运输许可证', 207: '正常出土', 208: '可疑出土', 209: '可疑消纳', 215: '正常消纳', 210: '非法运营',
            211: '工地可疑出土', 212: '工地正常出土', 213: '消纳场可疑消纳', 214: '消纳场正常消纳'
        };

        return alarmType;
    },

    // 获取对象类型
    getObjType: function (oLayer) {
        if (oLayer instanceof L.Rectangle) {
            return 501001;
        }
        if (oLayer instanceof L.Polygon) {
            return 501003;
        }
        if (oLayer instanceof L.Polyline) {
            return 501004;
        }
        if (oLayer instanceof L.Circle) {
            return 501002;
        }
        return 1;
    },

    getPosW: function (cKey) {

        var oParam = { vPos: 10, aPos: 20 };
        if (oParam.hasOwnProperty(cKey)) {
            return oParam[cKey];
        }
        return null;
    },

    //方向处理
    getDire: function (dataItem) {
        var nDir = 0;
        if (typeof dataItem == 'object') {
            nDir = dataItem.Direction;
        }
        else {
            nDir = dataItem;
        }
        if ((nDir >= 0 && nDir <= 15) || (nDir > 345 && nDir <= 360))
            return '正北';
        if (nDir > 15 && nDir <= 75)
            return '东北';
        if (nDir > 75 && nDir <= 105)
            return '正东';
        if (nDir > 105 && nDir <= 165)
            return '东南';
        if (nDir > 165 && nDir <= 195)
            return '正南';
        if (nDir > 195 && nDir <= 255)
            return '西南';
        if (nDir > 255 && nDir <= 285)
            return '正西';
        if (nDir > 285 && nDir <= 345)
            return '西北';

    },

    getDateMsg: function (nTick) {

        var nCurTick = new Date().getTime();
        var nInt = nCurTick - nTick;
        if (nInt > 24 * 60 * 60 * 1000) {
            var nDay = (nCurTick - nTick) / (24 * 60 * 60 * 1000);

            return "[" + parseInt(nDay) + "天前]";
        }
        else if (nInt > 1 * 60 * 60 * 1000 && nInt <= 24 * 60 * 60 * 1000) {

            var nH = nInt / (1 * 60 * 60 * 1000);
            return "[" + parseInt(nH) + "小时前]";
        }
        else {
            var nH = parseInt(nInt / (60 * 1000));
            if (nH <= 0) {
                return "";
            }
            return "[" + parseInt(nH) + "分钟前]";

        }
    },

    // 设置车辆的在线状态
    getVehStatusClass: function (oPosInfo) {
        var oClass = {};
        //var cClass = "l-bd-off l-mobile-off";
        //判断当前位置信息
        if (oPosInfo.VehicleStatus == "行驶"
            || oPosInfo.VehicleStatus == "停车"
            || oPosInfo.VehicleStatus == "熄火") {
            oClass.cStatus = 'l-bd-on l-mobile-on';

            oClass.cLstClass = ''
        }
        else if (oPosInfo.VehicleStatus == "通讯中断") {//通讯中断;定位失败

            oClass.cStatus = 'l-bd-off l-mobile-off';
            oClass.cLstClass = 'gray'
        }
        else if (oPosInfo.VehicleStatus == "定位失败") {

            oClass.cStatus = 'l-bd-off l-mobile-on';
            oClass.cLstClass = 'gray'
        }
        return oClass;
    },

    // 获得顶灯的状态
    convertVehStatus: function (oGpsInfo) {
        var aoAttach = oGpsInfo.Attach;
        oGpsInfo.nGreenOn = 0; oGpsInfo.nRedOn = 0; oGpsInfo.nYelloOn = 0;
        oGpsInfo.cLight = "白灯";
        oGpsInfo.cClsLight = "gray";
        for (var i = 0; i < aoAttach.length; i++) {
            if (aoAttach[i].AttachId == 232) {

                if (aoAttach[i].AttachObject.LeightGreenOn) {
                    oGpsInfo.nGreenOn = 1
                    oGpsInfo.cLight = "绿灯"
                    oGpsInfo.cClsLight = "green"
                }

                if (aoAttach[i].AttachObject.LeightRedOn) {
                    oGpsInfo.nRedOn = 1;
                    oGpsInfo.cLight = "红灯";
                    oGpsInfo.cClsLight = "red"
                }

                if (aoAttach[i].AttachObject.LeightYelloOn) {
                    oGpsInfo.nYelloOn = 1;
                    oGpsInfo.cLight = "黄灯";
                    oGpsInfo.cClsLight = "yellow"
                }
                oGpsInfo.dWeight = aoAttach[i].AttachObject.WeightValue;
            }
        }
    },

    // 获得时间相关信息
    getTrackDateMsg: function (nTick) {

        //var nInt = nCurTick - nTick;
        var nInt = nTick;
        if (nInt > 24 * 60 * 60 * 1000) {
            var nDay = (nInt / (24 * 60 * 60 * 1000)).toFixed(2);

            var oTime = { nTime: nDay, cMsg: '天' };
            return oTime;
        }
        else if (nInt > 1 * 60 * 60 * 1000 && nInt <= 24 * 60 * 60 * 1000) {

            var nH = (nInt / (1 * 60 * 60 * 1000)).toFixed(2);
            var oTime = { nTime: nH, cMsg: '小时' }
            return oTime;
        }
        else if (nInt > 1 * 60 * 1000 && nInt <= 60 * 60 * 1000) {
            var nH = (nInt / (60 * 1000)).toFixed(0);
            if (nH < 0) { nH = 0; }
            var oTime = { nTime: nH, cMsg: '分钟' }
            return oTime;
        }
        else {
            var nH = (nInt / 1000).toFixed(0);
            if (nH <= 0) { return  { nTime: 0, cMsg: '' } }
            var oTime = { nTime: nH, cMsg: '秒' }
            return oTime;

        }
    },

});