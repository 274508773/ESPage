/**
 * Created by liulin on 2016/12/20.
 */

ES.MapView = {};
ES.MapView.version = '0.1.1';

ES.MapView.oConfig= {

    // 工地树的url
    site: {
        cTreeUrl: '/Site/TreeAll',
        acPlugin: ['checkbox', 'types', 'search', 'state', 'unique'],
    },
    // 视频树的url
    vedio: {
        cTreeUrl: '/Site/Tree',
        acPlugin: ['types', 'search', 'state', 'unique'],
    },

    dLng: 115.868897,
    dLat: 28.702860,

    // 车辆出入记录
    cVehInOutUrl: '/MapView/GetRealRegion',

    // 查询车辆告警明细
    cAlarmUrl: '',

    // 当前用户所在部门
    nDeptId: 1,

    // 告警推送订阅告警类型
    cAlarmHubSet: 'http://192.168.1.177:10204/api/UserAlarmSub/Set',
    cHubUrl: 'http://192.168.1.177:10204/signalr',

    // 查询订阅接口数据
    cAlarmHubGet:  'http://192.168.1.177:10204/api/UserAlarmSub/Get',

    // 监控页面获得工地信息
    cSiteInfoUrl: '/Site/GetSiteInfoByIds',

    oSiteConfig: {
        stroke: true,
        color: '#0FFF05',
        dashArray: null,
        lineCap: null,
        lineJoin: null,
        weight: 3,
        opacity: 1,
        fill: true,
        fillColor: null,
        fillOpacity: 0.2,
        clickable: true,
        smoothFactor: 1.0,
        noClip: false

    },

    // 视频树的url
    vehTree: {
        plugins: ['checkbox', 'types', 'search', 'unique'],
        core: {
            'animation': 0,
            'check_callback': true,

            'state': {'opened': true},
            dblclick_toggle: true,
        },
    },

    // 默认设置告警类型
    oAlarmTypeName: {
        1001: '无资质出土',
        1002: '未上报出土',
        1003: '资质过期出土',
        1004: '不按规定时间出土',
        1005: '未审批车辆出土',

    },
};

// 存储页面公共的模块
ES.MapView.Page = ES.Page.extend({


});




