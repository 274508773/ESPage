/**
 * Created by liulin on 2017/3/13.
 */

ES.UserTrack.TrackMarker = ES.TrackView.RealTrack.TrackMarker.extend({

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
            //'<li><strong>速度：</strong>{Speed} Km/h </li>' +
            //'<li><strong>方向：</strong>{cDir} </li>' +
            '<li style="clear: both;  " ><strong>位置：</strong>{cPoiInfo} </li>' +
            '<li><strong>时间：</strong>{cGpsDateTime} </li>' +
            '</ul>'+
            '</div>', oTemp)
        return popupContent;
    },

});