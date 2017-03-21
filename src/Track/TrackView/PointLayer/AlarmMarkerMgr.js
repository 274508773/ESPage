/**
 *
 * 告警点
 *
 * Created by liulin on 2017/2/22.
 */


ES.TrackView.PointLayer.AlarmMarkerMgr = ES.TrackView.PointLayer.BaseMarker.extend({

    // 监听多个事件
    initOn: function () {

        // 设置停留点的数据
        this._oParent.on(this._oParent.getEvenName("setAlarmData"), this.setAlarmData, this);
        //通知定时器开始执行播放轨迹
        this._oParent.on("Track:Bar.dealAlarmMarkers", this.dealAlarmMarkers, this);

        this._oParent.on("Track:Bar.clearAlarmMarkers", this.clearMarkers, this);

        this._oParent.on(this._oParent.getEvenName("localAlarmMarker"), this.localAlarmMarker, this);

        // 清除点数据
        this._oParent.on(this._oParent.getEvenName("clearMap"), this.clearMap, this);
    },

    // 定位点
    localAlarmMarker: function (oData) {
        if (!oData) return;
        var oItem = oData.oItem;//this.aoData[oData.nIndex];
        if (!oItem) return;
        this.drawMarker(oItem);

        // 定位
        var oLatLng = L.latLng(oItem.FirstPosition[1], oItem.FirstPosition[0]);
        this.flyTo(oLatLng);
    },

    setAlarmData: function (oData) {
        this.aoData = oData.DataList;
    },

    // 画告警点的入口
    dealAlarmMarkers: function (oData) {
        if (!oData) return;

        if (oData.bIsDraw) {
            this.drawMarkers()
        } else {
            this.clearMarkers();
        }
    },

    drawMarkers: function () {
        if (!this.aoData || this.aoData.length <= 0) return;
        for (var i = 0; i < this.aoData.length ; i++) {
            this.drawMarker(this.aoData[i]);
        }
    },

    clearMarkers: function () {
        if (!this._oMarkerGroup) return;

        this._oMarkerGroup.clearLayers();
    },

    drawMarker: function (oData) {

        var oLayer = this.findLayer(this._oMarkerGroup, oData.nIndex);
        if (!oLayer) {
            oLayer = L.marker([oData.FirstPosition[1], oData.FirstPosition[0]], { icon: this.getIcon(oData) });
            oLayer.cId = oData.nIndex;
            oLayer.addTo(this._oMarkerGroup);
            oLayer.bindPopup(this.getHtml(oData));
        } else {
            // 更新位置信息
            oLayer.setLatLng([oData.FirstPosition[1], oData.FirstPosition[0]]);
            oLayer.openPopup();
        }
    },

    //设置告警图标样式
    getIcon: function (oData) {
        var oIconStyle = {
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [-1, -32],
            className: '',
            html: '<div class="track-marker track-alarm-marker"></div>',
        }
        //告警类型数字
        var nAlarmType = oData.AlarmType;
        //告警类型的class
        var cAlarmClass = this.getAlarmTypeName(nAlarmType);

        //设置oIconStyle的值
        if (cAlarmClass) {
            var cHtml = "<div class='track-marker track-alarm-marker'><div class= 'car-state " + cAlarmClass + "' ></div></div>";
            oIconStyle = ES.extend(oIconStyle, { html: cHtml })
        }
        var oIcon = L.divIcon(oIconStyle);
        return oIcon;
    },

    //获得告警类型的class
    getAlarmTypeName: function (type) {
        var oData = this.getAlarmType();
        if (!oData) return;
        return oData[type];
    },

    //告警字典
    getAlarmType: function () {
        var alarmType = {
            //未密闭 可疑出土 非工作时间运输 可疑消纳  平台超速报警
            203: 'cover', 208: 'o-earth', 210: 'work', 209: 'i-earth', 51: 'speed',
        };
        return alarmType;
    },

    // 获得popup 的html
    getHtml: function (oItem) {
        var oTime = ES.TrackHelper.getTrackDateMsg(oItem.ContinueTime * 60 * 1000)
        var cHtml = '<h4><b>告警信息</b></h4>'
            + '<b>次数：' + oItem.Count + ' </b><br />'
            + '<b>时长：' + oTime.nTime + ' ' + oTime.cMsg + ' </b><br />'
            + '<b>类型：' + ES.TrackHelper.getAlarmTypeName(oItem.AlarmType) + ' </b><br />'
            + '<b>位置：' + oItem.POI + ' </b><br />'
            + '<b>时间：' + ES.Util.dateFormat(oItem.AlarmStartTimeStamp * 1000, "yyyy-MM-dd hh:mm:ss") + ' </b><br />';

        return cHtml;
    },

})