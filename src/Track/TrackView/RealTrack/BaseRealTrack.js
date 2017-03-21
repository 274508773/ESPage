/**
 * Created by liulin on 2017/2/22.
 */

ES.TrackView.RealTrack = {};

ES.TrackView.RealTrack.BaseRealTrack = L.MapLib.MapMaster.MapOpr.extend({
    initialize: function (oParent, oOption) {

        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, oOption);

        this._oParent = oParent;

        // 清除点数据
        this._oParent.on(this._oParent.getEvenName("clearMap"), this.clearMap, this);
    },

    // 灯的转换
    getLight: function (oGpsInfo) {
        var oClass = { cClsLight: 'gray', cClsDoor: 'red', cClsWeight: 'yellow' };

        if (oGpsInfo.nGreenOn === 1) {
            oGpsInfo.cLight = "绿灯";
            oClass.cClsLight = "green";
            return;
        }
        if (oGpsInfo.nRedOn === 1) {
            oGpsInfo.cLight = "红灯";
            oClass.cClsLight = "red";
            return;
        }

        if (oGpsInfo.nYelloOn === 1) {
            oGpsInfo.cLight = "黄灯";
            oClass.cClsLight = "yellow";
            return;
        }

        oGpsInfo.cLight = "白灯";
        oClass.cClsLight = "gray";
        return oClass;
    },

    // 轨迹点tooltip
    getVecMarkerHtmlNotBtn: function (oGpsInfo) {

        var oClass = this.getLight(oGpsInfo);

        //要判断
        var oTemp = {};
        ES.extend(oTemp, oGpsInfo,
            {
                cDir: ES.TrackHelper.getDire(oGpsInfo.Direction),
                cGpsDateTime: oGpsInfo.GpsDate.replace("T", " "),
                dMileage: (parseFloat(oGpsInfo.Mileage) / 1000).toFixed(2),
                cPoiInfo: oGpsInfo.PoiInfo || '',
                VehicleNo:m_VehicleNo
            }, oClass);

        var popupContent = ES.Util.template(
            '<div style="width:320px;">'+
            '<h4><b>车辆:{VehicleNo}</b></h4>' +
            '<ul style="padding: 0;">' +
            '<li><strong>速度：</strong>{Speed} Km/h </li>' +
            '<li><strong>方向：</strong>{cDir} </li>' +
            '<li style="clear: both;  " ><strong>位置：</strong>{cPoiInfo} </li>' +
            '<li><strong>时间：</strong>{cGpsDateTime} </li>' +
            '</ul>'+
            '</div>', oTemp)
        return popupContent;
    },

    // 实时点为车辆时 才能 设置 该点信息获得实时跟踪点, 地图统计点数据
    _getPosIconInfo: function (oItem, oOption) {

        return new L.DivIcon({
            html: "<div cid='" + oItem.PhoneNum + "' class='car-body' style='transform: rotate(" +
            (oItem.Direction + 180) + "deg);-webkit-transform: rotate(" + (oItem.Direction + 180) + "deg);'></div> <div class='car-state'></div>",
            className: "ex-monitor-mapicon-car green",
            iconSize: L.point(oOption.nSize, oOption.nSize),
            iconAnchor:L.point(16, 16),
            popupAnchor: L.point(-0, -20),

        });
    },

    // 设置车辆的角度
    _setHeading: function (oGpsInfo, nInitDir) {
        if (!oGpsInfo) return;
        if (!nInitDir) nInitDir = 0;
        var nDir = oGpsInfo.Direction + nInitDir;
        $("div[cId='" + oGpsInfo.PhoneNum + "']").attr('style', 'transform: rotate('
            + nDir + 'deg);-webkit-transform: rotate('
            + nDir + 'deg);');
    },

    // 初始化图层
    initGroup: function () {
        this._oLayerGroup = new L.featureGroup();
        this._oLayerGroup.addTo(this._oMap);
    },

    clearMap: function () {
        if (!this._oLayerGroup) {
            return;
        }
        this._oLayerGroup.clearLayers();
    },
});