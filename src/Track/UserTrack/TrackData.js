/**
 * Created by liulin on 2017/2/23.
 */

ES.UserTrack.TrackData = ES.TrackView.TrackData.extend({

    //首次加载轨迹数据，点击查询时
    firstReqTrack: function () {

        var bVal = this.getReqParam();
        if (!bVal) {
            return;
        }

        //第一次请求时，要清除查询数据，
        delete this.m_oTrack;
        // 然后在加载数据
        this.m_oTrack = {};
        this.m_oTrackInfo = {nTotalCnt: 0, nTotalPage: 0, nPageSize: 100, nPage: 0};
        //请求数据时，清空数据
        this.aoTrack.splice(0, this.aoTrack.length);
        this.nPage = 1;

        ES.loadAn('body', ' ');
        // 执行请求

        ES.getData({reqModel: this.oReqParam}, this.cUrl, this.fristCallBack, this);

    },

    fristCallBack: function (oTrackInfo) {
        if (!oTrackInfo || !oTrackInfo.Result || !oTrackInfo.Success) {
            // 移除遮罩层
            ES.removeAn("body", ' ');
            ES.aWarn("没有查询到人员历史轨迹！");
            return;
        }

        this.ReqTrackCallBack(oTrackInfo);

        // 用于分页
        this.m_oTrackInfo = {
            nTotalCnt: oTrackInfo.Result.TotalCount,
            nTotalPage: Math.ceil( oTrackInfo.Result.PageSize == 0 ? 0 : oTrackInfo.Result.TotalCount / oTrackInfo.Result.PageSize),
            nPageSize: oTrackInfo.Result.PageSize,
            nPage: oTrackInfo.Result.PageIndex
        };

        //以事件机制加载数据,广播查询结果，广播轨迹数据
        this._oParent.fire(this._oParent.getEvenName("firstReqTrackBC"), {
            // 总的轨迹数据
            aoTrack: this.aoTrack,
            // 当前分页的轨迹数据
            aoPageTrack: oTrackInfo.Result.Data,
            // 轨迹当前页
            nPage: this.m_oTrackInfo.nPage,
            // 总页数
            nTotalPage: this.m_oTrackInfo.nTotalPage,
        });
    },

    //广播查询轨迹接口，也是回调函数,点击查询按钮第一请求
    ReqTrackCallBack: function (oTrackInfo) {
        // 移除遮罩层
        ES.removeAn("body", ' ');

        // 设置页号
        this.oReqParam.PageIndex = this.oReqParam.PageIndex + 1;

        // 设置当页轨迹
        this.m_oTrack[oTrackInfo.Result.PageIndex] = oTrackInfo.Result.Data;

        // 合并轨迹
        $.merge(this.aoTrack, oTrackInfo.Result.Data);

        this.aoTrack.sort(function (a, b) { return a.GpsTime > b.GpsTime ? 1 : -1 });


    },


    //timer时间到了，再次请求数据
    timerReqTrack: function () {

        //在请求前判断是否结束请求
        var nBeginReqPage = this.oReqParam.PageIndex;

        if (nBeginReqPage > this.m_oTrackInfo.nTotalPage) {
            //结束轨迹回放,修改按钮状态
            this._oParent.fire(this._oParent.getEvenName('playFinish'), { nPage: nBeginReqPage });
            ES.aWarn('历史轨迹播放完毕！');
            return;
        }

        if (this.m_oTrack.hasOwnProperty(nBeginReqPage)) {

            this._oParent.fire(this._oParent.getEvenName('noticeTimerPlay'), {
                aoTrack: this.aoTrack,
                aoPageTrack: this.m_oTrack[nBeginReqPage],
                nPage: nBeginReqPage,
                nTotalPage: this.m_oTrackInfo.nTotalPage,
            });

            // 下一次请求的分页数
            this.oReqParam.PageIndex = nBeginReqPage + 1;

            return;
        };

        ES.loadAn('body');

        // 执行请求
        ES.getData({reqModel:this.oReqParam}, this.cUrl, this.timerReqCallBack, this);

    },


    timerReqCallBack: function (oTrackInfo) {
        if (!oTrackInfo || !oTrackInfo.Result || !oTrackInfo.Success) {
            // 移除遮罩层
            ES.removeAn("body", ' ');
            ES.aWarn("没有查询到人员历史轨迹！");
            return;
        }

        this.ReqTrackCallBack(oTrackInfo);

        //以事件机制加载数据,广播查询结果，广播轨迹数据
        this._oParent.fire(this._oParent.getEvenName("noticeTimerPlay"), {
            // 总的轨迹数据
            aoTrack: this.aoTrack,
            // 当前分页的轨迹数据
            aoPageTrack: oTrackInfo.Result.Data,
            // 轨迹当前页
            nPage: oTrackInfo.Result.PageIndex,
            // 总页数
            nTotalPage: this.m_oTrackInfo.nTotalPage,
        });
    },

    sliderReq: function (oData) {
        var nPage = oData.nPage + 1;
        //判断是否有该属性
        if (this.m_oTrack.hasOwnProperty(nPage)) {

            this._oParent.fire(this._oParent.getEvenName('noticeTimerPlay'), {
                aoTrack: this.aoTrack,
                aoPageTrack: this.m_oTrack[nPage],
                nPage: nPage,
                nTotalPage: this.m_oTrackInfo.nTotalPage,
            });


            //判断是发有这个属性,返回轨迹
            this.oReqParam.PageIndex = nPage + 1;
            return;
        }

        this.oReqParam.PageIndex = nPage;
        ES.loadAn('body');
        ES.getData({reqModel: this.oReqParam}, this.cUrl, this.sliderReqCallBack, this);

    },

    sliderReqCallBack: function (oTrackInfo) {
        if (!oTrackInfo || !oTrackInfo.Result || !oTrackInfo.Success) {
            // 移除遮罩层
            ES.removeAn("body", ' ');
            ES.aWarn("没有查询到人员历史轨迹！");
            return;
        }

        this.ReqTrackCallBack(oTrackInfo);
        //以事件机制加载数据,广播查询结果，广播轨迹数据
        this._oParent.fire(this._oParent.getEvenName("noticeTimerPlay"), {
            // 总的轨迹数据
            aoTrack: this.aoTrack,
            // 当前分页的轨迹数据
            aoPageTrack: oTrackInfo.Result.Data,
            // 轨迹当前页
            nPage: oTrackInfo.Result.PageIndex,
            // 总页数
            nTotalPage: this.m_oTrackInfo.nTotalPage,
        });
    },

});