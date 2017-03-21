/**
 * Created by liulin on 2017/3/13.
 */

ES.UserTrack.HistoryTrack  = ES.TrackView.HistoryTrack.extend({

    getDtGridColumns: function () {
        var dtGridColumns = [
            //{ id: 'Speed', title: '速度(Km/h)', columnClass: 'ec-text-center' },
            //{ id: 'Direction', title: '方向', columnClass: 'ec-text-center' },
            //{ id: 'Mileage', title: '累积里程(Km)', columnClass: 'ec-text-center' },
            { id: 'Lng', title: '经度', columnClass: 'ec-text-center' },
            { id: 'Lat', title: '纬度', columnClass: 'ec-text-center' },
            { id: 'PoiInfo', title: '位置', columnClass: 'ec-text-center' },
            { id: 'GpsTime', title: '定位时间', columnClass: 'ec-text-center' }

        ];
        return dtGridColumns;
    },
})