/**
 * name:Page.js
 * des: 负责整个页面的通信，数据共享
 * 车辆历史已经是一个公共模块
 *
 * Created by liulin on 2017/2/22.
 */


ES.TrackView.Page = ES.Page.extend({

    oReqUrl: {

        // 查询实时状态,停留、行程数据
        oStatusUrl: {cUrl: null, cType: 'api'},

        // 查询历史轨迹
        oTrackUrl: {cUrl: m_cSignal + '/api/Gps/GetHisTrack', cType: 'api', PageSize: 300, PageIndex: 1},

        // 查询告警数据
        oAlarmUrl: {cUrl: null, cType: 'api'},

        // 查询当前中心位置信息
        oCenterPOIUrl: {cUrl: m_cSignal + '/api/util/GetPointRegion', cType: 'api'}
    },

    getUrl: function (cKey) {
        var oUrl = this.oReqUrl[cKey];
        if (!oUrl) return "";
        return oUrl.cUrl;
    },

    //页面id
    initialize: function (id, options) {

        ES.Page.prototype.initialize.call(this, id, options);

        this.initEvent();

        // 设置面板高度
        $(".ex-layout-track-chart").stop().animate({
            "max-height": $(window).height() - 275 + "px",
        }, 500)
    },

    initEvent: function () {

    },

    getEvenName: function (cKey) {
        return this.oEvenName[cKey];
    },

    // 页面所有的事件
    oEvenName: {

        // 第一次请求数据回调
        firstReqTrackBC: 'TrackView:TrackData:firstReqTrackBC',

        // 开始轨迹回放
        play: "TrackView:Control.Play",

        // 通知定时器开始播放轨迹，
        noticeTimerPlay: 'TrackView:TrackPos.noticeTimerPlay',

        // 停止轨迹播放，定时器播放完成后,通知别人播放完成
        playFinish: 'TrackView:TrackPos.playFinish',

        // 停止播放轨迹
        pause: 'TrackView:Contorl.pause',

        // 请求下次的轨迹点
        nextReq: "TrackView:TrackData.timerReqTrack",

        // 滑块滑动完成后，开始请求推荐事件
        sliderReq: "TrackView:TrackData.sliderReq",

        // 设置播放速度
        setPlaySpeed: "TrackView:TrackPos.setPlaySpeed",

        // 设置线条的样式
        setTrackClass: "TrackView:Control.setTrackClass",

        setPosClass: "TrackView:Control.setPosClass",

        setPopupOpen: 'TrackView:Control.setPopupOpen',

        // 设置箭头图层叠加
        setToFront: "TrackView:TrackArrow.setToFront",

        // 画停留点触发事件
        drawParkMarker: "TrackView:Penal.drawParkMarker",

        localParkMarker: "TrackView:Penal.localParkMarker",

        setParkData: "TrackView:Penal.setParkData",

        // 告警数据处理
        // 画停留点触发事件
        drawAlarmMarker: "TrackView:Penal.drawAlarmMarker",

        // 定位停留点
        localAlarmMarker: "TrackView:Penal.localAlarmMarker",

        // 设置停留点数据
        setAlarmData: "TrackView:Penal.setAlarmData",

        clearMap: "Track:Cotrol.clearMap",
    },


});




ES.TrackView.Page.include({


    trackSearch: function () {

        if (!this.GetQueryString("nBTick")) {
            return;
        }

        $(".track-search").click();

    },

    GetQueryString:function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null){
            return unescape(r[2]);
        }
        return null;
    },

})