/**
 * Created by liulin on 2017/2/23.
 */

ES.UserTrack = {};

ES.UserTrack.Page = ES.TrackView.Page.extend({
    oReqUrl: {
        // 查询实时状态,停留、行程数据
        oStatusUrl: { cUrl: null, cType: 'api' },
        // 查询历史轨迹
        //2017-1-7
        oTrackUrl: { cUrl:  '/MapView/GetUserTrack', cType: 'api', PageSize: 300, PageIndex: 1 },
        //oTrackUrl: { cUrl: 'http://signalr.boss.comlbs.com/api/location/GetHisLoc', cType: 'api', PageSize: 300, PageIndex: 1 },
        // 查询告警数据
        oAlarmUrl: { cUrl: null, cType: 'api' },
        // 查询当前中心位置信息
        oCenterPOIUrl: { cUrl: m_cSignal + '/api/util/GetPointRegion', cType: 'api' }
    },
});