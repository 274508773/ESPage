/**
 * Created by liulin on 2017/2/23.
 */

ES.UserTrack.TrackPos = ES.TrackView.RealTrack.TrackPos.extend({

    // 系统构造函数
    initialize: function (oParent, oOption) {
        ES.TrackView.RealTrack.TrackPos.prototype.initialize.call(this, oParent, oOption);
        this._oParent = oParent;

        // 定时器
        this.oTimes = new ES.MonitorTimer(this, { nIntervalSpeed: 1000, bIsStart: false });

        //单次轨迹停车计算
        this.aoParkInfo = new Array();

        //重置当前游标
        this._nCursor = 0;
        this.initOn();
        // 移动速度
        this.nSpeed = 500;

        this.initGroup();
    },

    // 监听多个事件
    initOn: function () {

        // 监听点击查询事件
        // 监听第一次请求数据回调
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.initPos, this);
        this._oParent.on(this._oParent.getEvenName("play"), this.play, this);

        //通知定时器开始执行播放轨迹
        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.noticeTimerPlay, this);

        //setPlaySpeed//playFinish
        this._oParent.on(this._oParent.getEvenName("setPlaySpeed"), this.setPlaySpeed, this);

        // 判断是否播放轨迹
        //this._oParent.on(this._oParent.getEvenName("setPopupOpen"), this.setPopupOpen, this);

        // 暂停轨迹回放
        this._oParent.on(this._oParent.getEvenName("pause"), this.stop, this);

        // 触发停止播放轨迹
        this._oParent.on(this._oParent.getEvenName("playFinish"), this.stop, this);
    },

    setPopupOpen: function () {
        //var oCkbStatus = this._oParent.getCkbStatus();
        //if (!oCkbStatus) return;
        //var aoLayer = this._oLineGroup.getLayers();
        //if (!aoLayer || aoLayer.length <= 0) return;

        //for (var i = 0 ; i < aoLayer.length; i++) {
        //    if (oCkbStatus.bIsTrackLine) {
        //        L.DomUtil.removeClass(aoLayer[i]._path, 'ec-hide');
        //    }
        //    else {
        //        L.DomUtil.addClass(aoLayer[i]._path, 'ec-hide');
        //    }
        //}
    },

    getPopupOpen: function () {
        var oCkbStatus = this._oParent.getCkbStatus();
        if (!oCkbStatus) return false;
        return oCkbStatus.bIsPopup;
    },

    // 点击开始回放轨迹
    play: function () {
        this.oTimes.on({ oContext: this, fnCallBack: this.playing });
        // 开始回放轨迹
        this.oTimes.start();
    },

    stop: function () {
        if (!this.oTimes) return;
        this.oTimes.stop();
    },



    // 定时执行这个函数
    playing: function () {
        if (this._nCursor >= this.aoGpsInfo.length) {
            // 开始下一次的请求
            this.oTimes.stop();

            this._oParent.fire(this._oParent.getEvenName("nextReq"));
        }
        else {
            this.drawVecPos(this._nCursor);
            this._nCursor = this._nCursor + 1;
        }
    },

    // 轨迹在外部过滤，不再内部过滤
    initPos: function (oData) {
        // 停止播放
        this._nCursor = 0;
        this.stop();

        // 当前页的轨迹数据
        this.aoGpsInfo = oData.aoPageTrack;
        if (this.aoGpsInfo.length <= 0) return;
        // 画第一个点
        this.drawVecPos(this._nCursor);
    },

    //判断是否结束播放,或者继续播放轨迹
    noticeTimerPlay: function (oData) {
        this.aoGpsInfo = oData.aoPageTrack;
        this._nCursor = 0;



        if (!this.aoGpsInfo || this.aoGpsInfo.length <= 0) {
            //结束本次播放
            this.oTimes.stop();

            //修改
            ES.aWarn("轨迹播放完成！");

            // 广播通知播放完成
            this._oParent.fire(this._oParent.getEvenName("playFinish"));

        }
        else {

            if ($(".track-play").css("display") !== "none") {
                this.oTimes.stop();

            }
            else {
                // 要获得当前状态，才决定是否要轨迹回放,如果定时器已经关闭，不要播放轨迹
                this.oTimes.start();
            }

        }
    },

    drawVecPos: function (nIndex) {
        var oGpsInfo = this.aoGpsInfo[nIndex];
        if (!oGpsInfo) {
            var i = 0;
        }
        var oLatLng = L.latLng(oGpsInfo.Lat, oGpsInfo.Lng);
        if (!this.posInSrceen(oLatLng)) {
            this.flyTo(oLatLng,{zoom:16});
        }

        this._oParent.fire("ES.MapOpr.TrackView.TrackPos:drawVecPos", { oGpsInfo: oGpsInfo });

        // 画矢量点
        this._drawVecPos(nIndex);
    },

    //画矢量点数据，带有方向的矢量数据，不使用滑板进行绘制，使用div来画数字
    _drawVecPos: function (nIndex) {
        if (!this._oLayerGroup) return;
        var oGpsInfo = this.aoGpsInfo[nIndex];
        var oLatLng = L.latLng(oGpsInfo.Lat, oGpsInfo.Lng);

        var oLivePosLayer = this.findLayer(this._oLayerGroup, oGpsInfo.PhoneNum);
        if (!oLivePosLayer) {
            //创建当前点
            //var oLayer = L.marker.(oLatLng, {
            //    icon: this._setHeading(oGpsInfo, 180)
            //});

            var oLayer = L.Marker.movingMarker([oLatLng], [1], { icon: this._setHeading(oGpsInfo, { nSize: 20 }) });
            oLayer.cId = oGpsInfo.PhoneNum;
            oLayer.cVehNo = oGpsInfo.VehicleNo;

            oLayer.oData = oGpsInfo;

            //把矢量点添加到地图上
            oLayer.addTo(this._oLayerGroup);

            var cHtml = this.getVecMarkerHtmlNotBtn(oGpsInfo);

            if (this.getPopupOpen()) {
                oLayer.bindPopup(cHtml, { autoPan: false }).openPopup();
            }
            else {
                oLayer.bindPopup(cHtml, { autoPan: false });
            }

            //注册点击事件，
            return oLayer;
        }
        else {
            oLivePosLayer.moveTo(oLatLng, this.nSpeed);

            // 计算角度
            var oPreLatLng = oLivePosLayer.getLatLng();

            var nDir = -1;// Math.ceil(Math.atan((oLatLng.lat - oPreLatLng.lat) / (oLatLng.lng - oPreLatLng.lng)));
            if(oLatLng.lng > oPreLatLng.lng)
            {
                nDir = 1;
            }

            ES.extend(oGpsInfo, {Direction: nDir});
            oLivePosLayer.setIcon(this._setHeading(oGpsInfo, 0));

            var cHtml = this.getVecMarkerHtmlNotBtn(oGpsInfo);
            oLivePosLayer.setPopupContent(cHtml);

            if (this.getPopupOpen()) {
                oLivePosLayer.openPopup();
            }
            else {
                oLivePosLayer.closePopup();
            }
        }
        oLivePosLayer._bringToFront();
        return oLivePosLayer;
    },

    _setHeading: function (oPosInfo, nInitDir) {


        if (!oPosInfo) {
            return;
        }
        if (!nInitDir) {
            nInitDir = 0;
        }
        var nDir = oPosInfo.Direction + nInitDir;
        if (nDir > 360) {
            nDir = nDir % 360;
        }
        var cCls = 'person_left_run';
        if((nDir<90 && nDir>0) || (nDir >-360 && nDir < -270))
        {
            cCls = 'person_right_run';
        }

        var oIcon = L.icon({
            iconUrl: '/Asset/img/ex_nanchang/'+cCls+'.gif',
            iconSize: [15, 30],
            iconAnchor: [10, 40],
            popupAnchor: [-3, -40],
            shadowAnchor: [22, 30]
        });

        return oIcon;
    },

    //获取画点对象
    getPosIconInfo: function (oItem, oOption) {
        //新建设备号
        var myIcon = L.icon({
            iconUrl: '/Asset/img/ex_nanchang/person_left_run.gif',
            iconSize: [15, 30],
            iconAnchor: [10, 40],
            popupAnchor: [-3, -30],
            shadowAnchor: [22, 30]
        });
        return myIcon;

    },

    // 轨迹点tooltip
    getVecMarkerHtmlNotBtn: function (oGpsInfo) {
        //要判断
        var oTemp = {};
        ES.extend(oTemp, oGpsInfo, {VehicleNo: m_VehicleNo});

        var popupContent = ES.Util.template(
            '<div style="width:320px;">' +

            '<h4><b>人员：{VehicleNo}</b></h4>' +
            '<ul style="padding: 0;">' +
            '<li style="clear: both;  " ><strong>位置：</strong>{PoiInfo} </li>' +
            '<li><strong>时间：</strong>{GpsDate} </li>' +
            '</ul>' +
            '</div>', oTemp)
        return popupContent;
    },
});
