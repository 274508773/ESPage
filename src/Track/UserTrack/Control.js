/**
 * Created by liulin on 2017/2/23.
 */

ES.UserTrack.Control = ES.TrackView.Control.extend({
    // 第一次请求要初始化滑块
    firstReqTrackBC: function (oData) {
        if (oData.nTotalPage <= 0) {
            ES.aWarn("没有查询到人员的历史轨迹！");
            return;
        }
        var aoTrack = oData.aoTrack;
        if (!aoTrack || aoTrack.length <= 0) {
            // 设置值
            ES.aWarn("当前人员停留，请播放轨迹，查看轨迹数据！");
            //return;
        }

        this.initSlider(oData);

    },
});