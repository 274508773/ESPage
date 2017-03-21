/**
 * Created by liulin on 2016/12/28.
 */


function Hub(oParent) {
    // hub 服务地址
    this.cHubUrl = '';
        // 超时时长
        this.nTimeOut = 10000;

        // hub 服务名称
        this.cSvrName = 'GpsHub';

        // 推送服务
        this.aoClientName = [{cSvrFn: 'sendAlarm', on: 'ReceiveHGTAlarm'}];



}

Hub.prototype={

    // 车辆列表构造函数
    initialize: function (oOption) {




        this.afnCallBack = [];

        this.initSvr();

        // 启动hub服务
        //this.start();

        // 注册接受回调数据
        this.onReceiveGPS();
        this.aoData =[];

        this.oGrid =new TrackShow();
        this.oGrid.initGrid(this.aoData);
    },

    initSvr: function () {
        var self = this;
        $.connection.hub.url = this.oOption.cHubUrl;
        $.connection.hub.logging = true;
        this.svrBoss = $.connection[this.oOption.cSvrName];
        this.oConnection = $.connection.hub;
        var oConnection = this.oConnection;
        //断开超时时间
        var nTimeOut = this.oOption.nTimeOut;
        this.oConnection.disconnected(function () {
            console.log('disconnected id: ' + oConnection.id + ' state: ' + oConnection.state + '  ' + new Date().getSeconds().toString());
            setTimeout(function () {
                self.start();
            }, nTimeOut);
        });

        this.oConnection.error(function (error) {
            console.log('Error: ' + error);
        });
    },

    //开启hub监听，开启之后 在内存中 读取订阅数据，重新订阅
    start: function () {
        var oConnection = this.oConnection;

        var self = this;
        this.oConnection.start()
            .done(function () {
                //if (self.afnCallBack && self.afnCallBack.length > 0) {
                //    for (var i = 0; i < self.afnCallBack.length; i++) {
                //        var oTemp = self.afnCallBack[i];
                //        oTemp.fn.call(oTemp.oContext, oTemp.oData);
                //    }
                //}
                //self.svrBoss.server.
                console.log('started transport: ' + oConnection.transport.name + ' ' + oConnection.id);
            }).fail(function (err) {
                console.log('Could not connect.' + err);
            });
    },

    stop: function () {
        this.oConnection.stop();
    },

    // 取消开始订阅
    removeCallBack: function (fnCall, oGpsInfo) {
        if (!this.afnCallBack || this.afnCallBack.length <= 0) {
            return;
        }

        for (var i = this.afnCallBack.length - 1; i >= 0; i--) {
            var oTemp = this.afnCallBack[i];
            if (oTemp.fn === fnCall && oTemp.PhoneNum === oGpsInfo.PhoneNum) {
                // 删除
                this.afnCallBack.splice(i, 1);
            }
        }
    },

    onReceiveGPS: function () {
        var self = this;

        var aoClientName = this.oOption.aoClientName;
        for(var i =0;i< aoClientName.length;i++){
            var oTemp = aoClientName[i]
            this.svrBoss.client[oTemp.cSvrFn] = function (oData) {
                //self._oParent.fire(oTemp.on, {aoAlarmInfo: oData});
                self.aoData.push(oData);
                self.oGrid.refreshGrid()
            };
        }
    },
};


/*
 *   name:        TrackShow
 *   des：        轨迹显示对象
 *   author：     liulin
 *   data：       2015-10-29
 *   负责数据的广播
 */
function TrackShow( ) {
    this.aoTrack = new Array();

    this.oGrid = null;

}

TrackShow.prototype = {



    //给grid添加轨迹
    initGrid: function (oTrack) {
        //var aoTrack = oTrack.aoTrack;
        this.aoTrack = oTrack.aoTrack;

        if (this.oGrid)
        {
            this.refreshGrid();
            return;
        }

        var context = this;

        //表单假数据
        var grid = this.oGrid = $("#GridPanelTrack").kendoGrid({
            dataSource: {
                data: [],
                schema: {
                    model: {
                        fields: {
                            VehicleStatus: { type: "string" },
                            Speed: { type: "number" },
                            Direction: { type: "string" },
                            Mileage: { type: "number" },
                            PoiInfo: { type: "string" },
                            GpsDateTime: { type: "string" },
                            GpsTime: { type: "number" },
                            PhoneNum: { type: "string" },
                            Lon: { type: "number" },
                            Lat: { type: "number" },
                        }
                    }
                },
                pageSize: 10,
            },
            excel: {
                allPages: true
            },
            change: function (e) {
                var sel = this.select();
                var oItem = this.dataItem(sel[0]);
                //传递当前id
                context._oParent.broadcastDrawMarker(oItem);
            },

            //height: 198,
            height: 330,
            //scrollable: false,
            selectable: "row",
            sortable: true,
            filterable: false,
            resizable: true,
            pageable: {
                //refresh: false,
                buttonCount: 5,
                pageSizes: true,
                previousNext: false,
            },

            columns: [
                //{
                //    field: "VehicleStatus", title: "定位状态", width: 80
                //},
                { field: "Speed", title: "速度(Km/h)", width: 80 },
                {
                    field: "Direction", title: "方向", width: 80
                },

                {
                    field: "Mileage", title: "累积里程(Km)", width: 80
                },
                {
                    field: "Lon", title: "经度", width: 60
                },

                {
                    field: "Lat", title: "纬度", width: 60
                },
                { field: "PoiInfo", title: "位置", width: 300 },
                { field: "GpsDateTime", title: "定位时间", width: 150 },

            ]

        });

        this.refreshGrid();



    },

    //刷新gird记录数据
    refreshGrid: function () {
        var grid = $("#GridPanelTrack").data("kendoGrid");
        //var aoTemp = this.convertData(this.aoTrack)
        grid.dataSource.data(this.aoTrack);
        //var oContext = this;

    },

}