/**
 * 播放轨迹控制 -- 在页面的下左方
 *
 * Created by liulin on 2017/2/22.
 */

ES.TrackView.Control = ES.Class.extend({

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.initControl();
        this.initEvent();

        this.initOn();
    },

    initEvent: function () {
        $('#txtBeginDate').val(ES.Util.dateFormat(new Date().getTime() - 60 * 60 * 1000, 'yyyy-MM-dd hh:mm:ss'));
        $('#txtEndDate').val(ES.Util.dateFormat(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss'));

        $('.ec-form-datetime').datetimepicker({
            language: 'zh-CN',
            format: 'yyyy-mm-dd hh:ii:ss',
            autoclose: true,
            todayBtn: true,
            pickerPosition: 'top-left',
        });

        $('.ec-handle-time').bind('click', function () {
            if ($(this).val() == '0') {
                $('.ex-datetime-box').show();
            } else {
                $('.ex-datetime-box').hide();
            }
        });


        // 初始化查询按钮
        this.initSearchEven();

        // 设置暂停和播放
        this.initPlayEven();

        // 设置播放速度
        this.initPlaySpeedEven();

        // 重新播放轨迹
        this.initReplay();

        this.initCkbEven();
    },

    // 注册查询事件
    initSearchEven: function () {

        var self = this;
        $('.track-search').bind('click', function () {

            self._oParent.fire("TV:firstReqTrack");
            self._oParent.fire(self._oParent.getEvenName("clearMap"));
            self.backStatus();
        })

    },

    initControl: function () {

        var _poi = [1, 2, 3, 4, 5, 6, 7];
        var _poiNum = _poi.length;
        $('.track-control-label').addClass('ec-avg-sm-' + _poiNum);
        for (var i = 0; i <= _poiNum - 1; i++) {
            $('.track-control-label').append('<li>' + _poi[i] + '</li>');
        }
        $('.track-control-label > li:first-child').append('<span class="ec-align-left">起</span>')
        $('.track-control-label > li:last-child').html('终')


        var self = this;
        $('.track-control-slider').attr({ 'data-range_max': _poiNum, 'data-cur_min': _poiNum }).nstSlider({
            "left_grip_selector": ".track-control-leftGrip",
            "value_bar_selector": ".track-control-bar",

            // 注册事件
            "user_mouseup_callback": function (leftValue, rightValue, isLeftGrip) {
                self._oParent.fire(self._oParent.getEvenName("sliderReq"), { nPage: leftValue });
            }
        });
    },

    // 初始化滑块
    initSlider: function (oData) {
        if (!oData || !oData.hasOwnProperty("nTotalPage")) {
            console.log(ESLang.TrackView.Contorl[1]);
            return;
        }

        $('.track-control-label').removeClass("ec-avg-sm-7");
        $('.track-control-label').empty();
        $('.track-control-label').addClass('ec-avg-sm-' + oData.nTotalPage);

        for (var i = 0; i < oData.nTotalPage; i++) {
            var k = i + 1;
            if (i === 0) {
                if (oData.nTotalPage == 1) {
                    $('.track-control-label').append('<li><span class="ec-align-left">起</span>终</li>');
                }
                else {
                    $('.track-control-label').append('<li><span class="ec-align-left">起</span>' + k + '</li>');
                }
                continue;
            }
            if (i === (oData.nTotalPage - 1)) {
                $('.track-control-label').append('<li>终</li>');
                continue;
            }

            $('.track-control-label').append('<li>' + k + '</li>');
        }

        //$('.track-control-slider').attr({'data-range_min':0, 'data-range_max': oData.nTotalPage, 'data-cur_min': 0 });
        $('.track-control-slider').nstSlider("set_range", 0, oData.nTotalPage);


        this.setCursor(0);

        $('.ex-datetime-box').hide();
        $('.track-control-box').show().addClass('in');
    },

    // 设置控制
    initOn: function () {
        // 第一次查询，设置查询控件,初始化滑块控件
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.firstReqTrackBC, this);
        this._oParent.on(this._oParent.getEvenName("playFinish"), this.playFinish, this);
        // timer 查询轨迹结束时设置滑块的值
        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.setSliderCursor, this);

        // 注册委托事件
        this._oParent.getSearchTime = this.getSearchTime;
        this._oParent.getSearchSpeed = this.getSearchSpeed;
        this._oParent.getCkbStatus = this.getCkbStatus
    },

    setSliderCursor: function (oData) {
        var nIndex = oData.nPage - 1;
        this.setCursor(nIndex);
    },

    setCursor:function(nIndex){
        $('.track-control-slider').nstSlider("set_position", nIndex);
    },

    // 第一次请求要初始化滑块
    firstReqTrackBC: function (oData) {
        if (oData.nTotalPage <= 0) {
            ES.aWarn("没有查询到车辆的历史轨迹！");
            return;
        }
        var aoTrack = oData.aoTrack;
        if (!aoTrack || aoTrack.length <= 0) {
            // 设置值
            ES.aWarn("当前车辆停留，请播放轨迹，查看轨迹数据！");
            //return;
        }

        this.initSlider(oData);

    },

    // 获得每个控件的值
    //  查询时间
    getSearchTime: function () {
        var nVal = parseInt($(".ec-handle-time").val());
        var nBeginT = 0
        var nEndT = 0;

        if (nVal === 0) {
            nBeginT = $("#txtBeginDate").val();
            nEndT = $("#txtEndDate").val();
        }
        else {
            nEndT = new Date().getTime();
            nBeginT = nEndT - nVal * 60 * 60 * 1000;
        }

        var cEndDate = ES.Util.dateFormat(nEndT, "yyyy-MM-dd hh:mm:ss");
        var cBeginData = ES.Util.dateFormat(nBeginT, "yyyy-MM-dd hh:mm:ss");
        var oParam = {
            nBeginT: nBeginT,
            nEndT: nEndT,
            EndTime: cEndDate,
            StartTime: cBeginData
        }
        return oParam;
    },

    getSearchSpeed: function () {
        var nVal = parseInt($(".ec-handle-speed").val());
        return nVal;
    },

    // 获得ckb 的基本状态
    getCkbStatus: function () {

        var oCkbStatus = {
            bIsPopup: false,
            bIsTrackLine: false,
            bIsTrackPos: false,
        };
        oCkbStatus.bIsPopup = $("ul.ex-layout-trackcontrol-query").find("input.ckbPopup").is(":checked");
        oCkbStatus.bIsTrackLine = $("ul.ex-layout-trackcontrol-query").find("input.ckbTrackLine").is(":checked");
        oCkbStatus.bIsTrackPos = $("ul.ex-layout-trackcontrol-query").find("input.ckbTrackPos").is(":checked");
        return oCkbStatus;
    },

    //轨迹播放
    initPlayEven: function () {
        var self = this;
        $('.track-play').bind('click', function () {
            $(this).hide();
            $('.track-pause').show();
            // 广播开始播放轨迹

            self._oParent.fire(self._oParent.getEvenName("play"));
        });

        // 暂停播放
        $('.track-pause').bind('click', function () {
            $(this).hide();
            $('.track-play').show();
            self._oParent.fire(self._oParent.getEvenName("pause"));
        });
    },

    // 设置当前状态为停止播放
    playFinish: function (oData) {
        var nIndex = oData.nPage - 1;
        this.setCursor(nIndex);

        $('.track-pause').hide();
        $('.track-play').show();

    },

    backStatus: function () {
        $('.track-pause').hide();
        $('.track-play').show();
    },

    notBackStatus: function () {
        $('.track-pause').show();
        $('.track-play').hide();
    },

    // 设置播放速度
    initPlaySpeedEven: function () {
        var self = this;
        $(".ec-handle-playSpeed").bind("change", function () {
            self._oParent.fire(self._oParent.getEvenName("setPlaySpeed"), { nSpeed: parseInt($(this).val()) });
        })
    },

    // 设置重新播放
    initReplay: function () {

        var self = this;
        // 重新播放轨迹
        $(".track-replay").bind("click", function () {
            self.notBackStatus();
            self._oParent.fire(self._oParent.getEvenName("sliderReq"), { nPage: 0 });
        })
    },

    initCkbEven: function () {
        //setTrackClass
        var self = this;
        $("ul.ex-layout-trackcontrol-query").find("input.ckbTrackLine").bind("click", function () {
            self._oParent.fire(self._oParent.getEvenName("setTrackClass"));
        })
        $("ul.ex-layout-trackcontrol-query").find("input.ckbTrackPos").bind("click", function () {
            self._oParent.fire(self._oParent.getEvenName("setPosClass"));
        })
        $("ul.ex-layout-trackcontrol-query").find("input.ckbPopup").bind("click", function () {
            self._oParent.fire(self._oParent.getEvenName("setPopupOpen"));
        })
    },
})