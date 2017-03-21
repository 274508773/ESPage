/**
 * Created by liulin on 2017/1/7.
 */

// 做模拟推送数据，查询历史轨迹数据，然后轨迹定时播放
ES.HGT.MapView.ReqTrack = ES.Class.extend({

    //1.查询轨迹数据，大于0 的轨迹数据，没有找到就画当前点
    //2.查询到轨迹数据后，定时触发轨迹播放
    //3.播放30秒钟后，切换到下一辆车播放轨迹，下一辆车如何查找
    oOption: {
        nIntervalSpeed: 10 * 1000,

        //cUrl: '/api/location/GetHisLoc',
        // 最大轨迹条数
        nMaxTrackCnt: 30,
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.aoLivePos = [];
        // 轨迹游标
        //this._nCur = 0;

        //this.oAlarmClass = this._oParent.getShowAlarm();
        this.oTimer = new ES.MonitorTimer(this, {
            // 默认定时不打开
            bIsStart: false,
            // 定时器执行时间间隔
            nIntervalSpeed: this.oOption.nIntervalSpeed,
            // 执行回调函数
            aoActive: [{oContext: this, fnCallBack: this.tickCallBack}]
        });

        //初始化事件监听
        this.initOn();
        this.oTimer.start();
    },



    // 定时器回调函数，推送轨迹
    tickCallBack: function () {

        if(!this.aoLivePos || this.aoLivePos.length<=0) {
            return;
        }

        var acId =[];

        // 请求数据
        for(var i =0;i< this.aoLivePos.length;i++){

            acId.push(this.aoLivePos[i].PhoneNum);
        }
        ES.getData(acId.join(','),ES.HGT.oConfig.cVehPosUrl,this.TickHandler,this);


    },

    // 回调函数
    TickHandler: function (oData) {
        this._oParent.fire('HubSvr:setGpsInfo', { aoGpsInfo: oData.DataList });
    },

    // 监听事件
    initOn: function () {

        // 添加 车辆
        this._oParent.on('MapView:LiveMange.addLive', this.addLive, this);

        // 添加人员监控
        this._oParent.on('MapView:UserMange.addLive', this.addLive, this);
        // 移除车辆
        this._oParent.on('MapView:LiveMange.removeLive', this.removeLive, this);

    },
    addLive: function (oData) {
        var aoGpsInfo = oData.aoGpsInfo;

        for (var i = 0; i < aoGpsInfo.length; i++) {
            //this.addLivePos({oGpsInfo:aoGpsInfo[i]});
            if (ES.Util.isInArray(this.aoLivePos, aoGpsInfo[i], "PhoneNum")) {
                continue;
            }
            this.aoLivePos.push( aoGpsInfo[i]);
        }
    },

    removeLive: function (oData) {
        var acId = oData.acId
        for (var i = 0; i < acId.length; i++) {
            var nIndex = ES.Util.arrayIndex(this.aoLivePos,{PhoneNum:acId[i]}, "PhoneNum");
            if (nIndex === -1) {
                continue;
            }
            this.aoLivePos.splice(nIndex, 1);
        }
    },

});