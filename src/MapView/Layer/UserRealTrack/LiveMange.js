/**
 * Created by liulin on 2017/1/7.
 */

ES.HGT.MapView.UserMange = ES.HGT.MapView.LiveMange.extend({

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.initOn();

    },

    // 缓存车辆数据
    aoLivePos:null,

    initOn: function () {
        // 单个添加监控
        this._oParent.on("MapView:UserMange.addLivePos", this.addLivePos, this);

        // 批量添加监控
        this._oParent.on("MapView:UserMange.addLive", this.addLive, this);

        // 移除单个监控
        this._oParent.on("MapView:UserMange.removePos", this.removePos, this);

        // 批量移除监控
        this._oParent.on("MapView:UserMange.removeLive", this.removeLive, this);

        this._oParent.on("MapView:UserMange.removeAll", this.removeAll, this);
    },

    //删除所有的订阅车辆记录
    removeAll: function () {
        if (!this.aoLivePos || this.aoLivePos.length <= 0) {
            return;
        }
        var aoGpsInfo = []
        for (var i = 0; i < this.aoLivePos.length; i++) {
            this.aoLivePos[i].offEven();
            this.aoLivePos[i].clearLiveTrack();
            aoGpsInfo.push(this.aoLivePos[i].options);
        }

        // 删除所有元素
        this.aoLivePos.splice(0,this.aoLivePos.length);
    },

    addLive: function (oData) {
        var aoGpsInfo = oData.aoGpsInfo
        for (var i = 0; i < aoGpsInfo.length; i++) {
            this.addLivePos({oGpsInfo:aoGpsInfo[i]});
        }
    },

    // 添加实时跟踪 marker ,
    addLivePos: function (oData) {
        if (!oData || !oData.oGpsInfo) return;

        if (!this.aoLivePos) {
            this.aoLivePos = new Array();
        }

        var oGpsInfo = oData.oGpsInfo;
        if (ES.Util.isInArray(this.aoLivePos, oData.oGpsInfo, "PhoneNum")) {
            console.log("地图实时跟踪中存在已经跟踪的设备号" + oGpsInfo.PhoneNum + ";车牌号" + oGpsInfo.VehicleNo + "！");
            return;
        }

        // 要判断是否超出了监控设备个数，如果是，要移除最后一个元素
        if (this.aoLivePos.length >= ES.HGT.oConfig.nMonitorCnt) {
            var oMapLiveTemp = this.aoLivePos.pop();
            this.removeMonitor(oMapLiveTemp);

        }

        var oMapLive = new ES.HGT.MapView.MapUserLive(this._oParent, oData.oGpsInfo);
        this.aoLivePos.push(oMapLive);
        oData.oGpsInfo.bOpenBubble = true;
        oMapLive.drawLiveTrack(oData);

    },

})
