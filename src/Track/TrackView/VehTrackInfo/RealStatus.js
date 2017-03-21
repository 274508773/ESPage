/**
 * 密闭、顶灯、GPS、网络信息
 * Created by liulin on 2017/2/23.
 */

ES.VehTrackInfo.RealStatus = ES.VehTrackInfo.extend({

    //管理基本事件操作,内部事件管理机制，只在内部使用，禁止事件在外部广播
    includes: ES.Mixin.Events,

    oOption: {
        // 实时状态$ 查找标志
        cTagGpsInfo: '.ec-g > .ec-u-md-4 > .stats-card > ul.ec-avg-md-2',

        // 车信号$ 查找标志
        cTagVehStatusInfo: '.ec-g > .ec-u-md-4 > .stats-card > ul.ex-acc',

        //车辆gps信息 和 网络信息
        cTagMobileInfo: '.ex-layout-mobile',

        // 速度图表控件
        cSpeedChartId: 'echartsSpeed',

        cSpeed: ""
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        //this.$_oContent = $(".ex-layout-cardetail-content.veh-real-status");
        this.$_oContent = $(".ex-layout-maptool.ex-theme-maptool.ex-map-bottom.ex-map-right");
        this.$_oContent.css("visibility", "hidden");

        //初始化事件监听
        this.initOn();

    },


    // 监听事件
    initOn: function () {
        //this._oParent.on("ES.MapOpr.TrackView.TrackPos:drawVecPos", this.callBack, this);

    },

    callBack: function (oData) {
        this.$_oContent.css("visibility", "visible");
        this.setVehLight(oData.oGpsInfo);
        this.setMobileInfo(oData.oGpsInfo);
        this.setVehStatusInfo(oData.oGpsInfo);
    },
    // 车顶灯状态
    setVehLight: function (oGpsInfo) {
        if (!oGpsInfo) return;

        $(".car-light").removeClass("l-green").removeClass("l-red").removeClass("l-yellow").removeClass("l-gray");
        $('a[cId="cz"]').removeClass("green").removeClass("warning").removeClass("yellow");
        var cClass = "";
        if ((oGpsInfo.nGreenOn + oGpsInfo.nRedOn + oGpsInfo.nYelloOn) != 1) {
            cClass = "l-gray";
            //$('a[cid="cz"]').addClass('noline');
        }
        else if (oGpsInfo.nGreenOn == 1) {
            cClass = "l-green";
            $('a[cId="cz"]').addClass('green');
        }
        else if (oGpsInfo.nRedOn == 1) {
            cClass = "l-red";
            $('a[cId="cz"]').addClass('warning');
        }
        else {
            cClass = "l-yellow";
            $('a[cId="cz"]').addClass('yellow');
        }
        $(".car-light").addClass(cClass);
    },

    // 设置顶棚状态
    setVehStatusInfo: function (oGpsInfo) {
        if (!oGpsInfo.Status) return;
        $(this.oOption.cTagVehStatusInfo).parent().show();
        var oStatus = oGpsInfo.Status;
        for (var cKey in oStatus) {
            var oA = $('a[cId="' + cKey + '"]');
            if (!oA) continue;
            oStatus[cKey] ? oA.addClass('warning') : oA.removeClass('warning');
        }

        //设置顶灯状态 开为 -360px ，关 为0px
        //oGpsInfo.Status.FrontDoor ? $('.car-cover').animate({ "left": "-360px" }, 500) : $('.car-cover').animate({ "left": "0px" }, 500);
        //oGpsInfo.Status.FrontDoor ? $('.car-cover').css("left", "-360px") : $('.car-cover').css("left", "0px");

        //设置是否超速
        if (oGpsInfo.Speed > 60) {
            $('a[cId="cs"]').addClass("warning");
        }
        else {
            $('a[cId="cs"]').removeClass("warning");
        }

        // 设置未密封
        //$('a[cId="OilLinetemp"]').removeClass("warning").removeClass("check");
        //设置未密封 速度大于0 ，但是门磁为1
        if (oGpsInfo.Speed > 0 && oGpsInfo.Status.FrontDoor) {
            $('a[cId="OilLinetemp"]').addClass("warning");
        }
        //else if (oGpsInfo.Status.FrontDoor == false) {
        //    $('a[cId="OilLinetemp"]').addClass("check");
        //}
    },

    // 设置车辆gps信息 和 网络信息
    setMobileInfo: function (oGpsInfo) {
        //去掉on状态
        var $_oIMobile = $(".ex-icon-mobile");
        var $_oIBD = $(".ex-icon-bd");

        $_oIMobile.removeClass("on").removeClass("off");
        $_oIBD.removeClass("on").removeClass("off");

        //判断当前位置信息
        if (oGpsInfo.VehicleStatus == "行驶"
            || oGpsInfo.VehicleStatus == "停车"
            || oGpsInfo.VehicleStatus == "熄火") {
            $_oIMobile.addClass("on");
            $_oIBD.addClass("on");
        }
        else if (oGpsInfo.VehicleStatus == "通讯中断") {
            $_oIMobile.addClass("l-mobile-off");
            $_oIBD.addClass("l-bd-off");
        }
        else if (oGpsInfo.VehicleStatus == "定位失败") {
            $_oIMobile.addClass("on");
            $_oIBD.addClass("off");
        }
        else {
            $_oIMobile.addClass("off");
            $_oIBD.addClass("off");
        }
    },

})