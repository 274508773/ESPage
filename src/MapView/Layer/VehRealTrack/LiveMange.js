/**
 * Created by liulin on 2017/1/7.
 */

ES.MapView.LiveMange = ES.Class.extend({

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.initOn();

    },

    // 缓存车辆数据
    aoLivePos:null,

    initOn: function () {

        this._oParent.on("MapView:LiveMange.addLivePos", this.addLivePos, this);
        this._oParent.on("MapView:LiveMange.addLive", this.addLive, this);
        this._oParent.on("MapView:LiveMange.removeLive", this.removeLive, this);
        this._oParent.on("MapView:LiveMange.removePos", this.removePos, this);
        this._oParent.on("MapView:LiveMange.removeAll", this.removeAll, this);
        // hub 推送GPS数据 监听接口
        this._oParent.on("HubSvr:setGpsInfo", this.setGpsInfo, this);

    },

    addLive: function (oTemp) {
        var aoGpsInfo = oTemp.oData
        for (var i = 0; i < aoGpsInfo.length; i++) {
            this.addLivePos({oGpsInfo:aoGpsInfo[i]});
        }
    },

    removeLive: function (oData) {
        var acId = oData.acId
        for (var i = 0; i < acId.length; i++) {
            this.removePos({oGpsInfo: {PhoneNum: acId[i]}});
        }
    },

    // 是一个数组，分发数据到包
    setGpsInfo: function (oTemp) {
        var aoGpsInfo =oTemp.oData;
        // 监听轨迹数据
        if (!aoGpsInfo || aoGpsInfo.length <= 0) return;
        var self = this;
        $.each(aoGpsInfo, function (nIndex, oGpsInfo) {
            var nIndex = ES.Util.arrayIndex(self.aoLivePos, oGpsInfo, "PhoneNum")
            if (nIndex < 0) {
                console.log("不存在跟踪设备：" + oGpsInfo.PhoneNum + ";车牌号" + oGpsInfo.VehicleNo);
                return;
            }

            oGpsInfo.bOpenBubble = true;

            // 画实时跟踪点
            oGpsInfo = self.aoLivePos[nIndex].setOption(oGpsInfo);
            self.aoLivePos[nIndex].drawLiveTrack({ oGpsInfo: oGpsInfo });

        })
    },

    // 添加实时跟踪 marker ,
    addLivePos: function (oData) {
        if (!oData || !oData.oGpsInfo){
            return;
        }

        if (!this.aoLivePos) {
            this.aoLivePos = new Array();
        }

        var oGpsInfo = oData.oGpsInfo;
        if (ES.Util.isInArray(this.aoLivePos, oData.oGpsInfo, "PhoneNum")) {
            console.log("地图实时跟踪中存在已经跟踪的设备号" + oGpsInfo.PhoneNum + ";车牌号" + (oGpsInfo.VehicleNo||'' )+ "！");
            return;
        }

        // 要判断是否超出了监控设备个数，如果是，要移除最后一个元素
        if (this.aoLivePos.length >=  ES.oConfig.nMonitorCnt) {
            var oMapLiveTemp = this.aoLivePos.pop();
            this.removeMonitor(oMapLiveTemp);

        }

        var oMapLive = new ES.MapView.MapLive(this._oParent, oData.oGpsInfo);
        this.aoLivePos.push(oMapLive);
        oData.oGpsInfo.bOpenBubble = true;
        oMapLive.drawLiveTrack(oData);

    },

    // 移除监控
    removeMonitor: function (oMapLive) {
        if (!oMapLive) return;
        oMapLive.offEven();
        oMapLive.clearLiveTrack();
    },

    // 设备号 为唯一的判断
    removePos: function (oData) {
        if (!oData || !oData.oGpsInfo || !oData.oGpsInfo.hasOwnProperty("PhoneNum")){
            return;
        }

        //var oGpsInfo = oData.oGpsInfo;
        var nIndex = ES.Util.arrayIndex(this.aoLivePos, oData.oGpsInfo, "PhoneNum");
        if (nIndex === -1) {
            //console.log("地图实时跟踪中不存在设备号" + oGpsInfo.PhoneNum + ";车牌号" + oGpsInfo.VehicleNo + "！");
            return;
        }
        var oMapLive = this.aoLivePos[nIndex];
        if (!oMapLive) return;
        this.removeMonitor(oMapLive);
        this.aoLivePos.splice(nIndex, 1);

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

        // 取消订阅
        this._oParent.fire('HubSvr:batchUnsubGps', {aoGpsInfo: aoGpsInfo});

        // 删除所有元素
        this.aoLivePos.splice(0,this.aoLivePos.length);
    },

    convertVehStatus: function (oGpsInfo) {
        var aoAttach = oGpsInfo.Attach;
        oGpsInfo.nGreenOn = 0; oGpsInfo.nRedOn = 0; oGpsInfo.nYelloOn = 0;
        oGpsInfo.cLight = "白灯";
        oGpsInfo.cClsLight = "gray";
        for (var i = 0; i < aoAttach.length; i++) {
            if (aoAttach[i].AttachId == 232) {

                if (aoAttach[i].AttachObject.LeightGreenOn) {
                    oGpsInfo.nGreenOn = 1
                    oGpsInfo.cLight = "绿灯"
                    oGpsInfo.cClsLight = "green"
                }

                if (aoAttach[i].AttachObject.LeightRedOn) {
                    oGpsInfo.nRedOn = 1;
                    oGpsInfo.cLight = "红灯";
                    oGpsInfo.cClsLight = "red"
                }

                if (aoAttach[i].AttachObject.LeightYelloOn) {
                    oGpsInfo.nYelloOn = 1;
                    oGpsInfo.cLight = "黄灯";
                    oGpsInfo.cClsLight = "yellow"
                }
                oGpsInfo.dWeight = aoAttach[i].AttachObject.WeightValue;
            }
        }
    },

});
