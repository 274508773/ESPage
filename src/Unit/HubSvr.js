/*
name:           HubSvr.js
des:            hub服务，集成了hub服务的所有方法，所有要用的都继承这个基类；
date:           2016-06-15
author:         liulin


订阅思想：
    增加了断开重新连接，重新连接时，车辆重新订阅
    如果是取消订阅，就要注销重新连接

*/
ES.HubSvr = ES.Class.extend({
    oOption: {
        // hub 服务地址
        cHubUrl: '',
        // 超时时长
        nTimeOut: 10000,

        // hub 服务名称
        cSvrName:'GpsHub',

        // 推送服务
        aoClientName:[{cSvrFn:'sendAlarm',on:'ReceiveHGTAlarm'}],

    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.afnCallBack = [];

        this.initSvr();

        // 启动hub服务
        this.start();

        // 注册接受回调数据
        this.onReceiveGPS();

        // 开启监听
        this.initOn();

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
        if(!this.oConnection.disconnected){
            return;
        }
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
        var hubSvr = null;
        try {
            hubSvr = this.oConnection.start()
        }
        catch (e) {

        }
        if (!hubSvr) {
            return;
        }

        hubSvr.done(function () {
            if (self.afnCallBack && self.afnCallBack.length > 0) {
                for (var i = 0; i < self.afnCallBack.length; i++) {
                    var oTemp = self.afnCallBack[i];
                    oTemp.fn.call(oTemp.oContext, oTemp.oData);
                }
            }
            console.log('started transport: ' + oConnection.transport.name + ' ' + oConnection.id);
        }).fail(function (err) {
            console.log('Could not connect.' + err);
        });
    },

    initOn: function () {
        this._oParent.on('HubSvr:subAlarm', this.subAlarm, this);
    },

    //停止hub监听
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

        if(!this.svrBoss){
            return;
        }

        var self = this;

        var aoClientName = this.oOption.aoClientName;
        for(var i =0;i< aoClientName.length;i++){
            var oTemp = aoClientName[i]

            this.svrBoss.client[oTemp.cSvrFn] = function (oData) {
                self._oParent.fire(oTemp.on, {oData: oData});
            };
        }
    },

    // 订阅车辆
    vehicleSub: function (vehicleLst) {

        var oData = {cVehLst: vehicleLst};

        // 断开重新连接，然后在订阅
        this.afnCallBack.push({fn: this._vehicleSub, oContext: this, oData: oData});

        // 没有启动服务，启动服务后会再次订阅
        if (this.oConnection.state !== 1) {
            return;
        }

        this._vehicleSub(oData);

    },

    // 订阅车辆,批量订阅车辆
    _vehicleSub: function (oData) {
        var oTemp = {fnName: '_vehicleSub', cDateTime: new Date().toLocaleString()};

        if (!oData || !oData.cVehLst) {
            console.log(ES.template(ES.Lang.HubSvr.Err[18], oTemp));
            return;
        }

        oTemp.cVehLst = oData.cVehLst;
        if (!this.svrBoss || !this.svrBoss.server.sub) {
            console.log(ES.template(ES.Lang.HubSvr.Err[16], oTemp));
            return;
        }

        console.log(ES.template(ES.Lang.HubSvr.Err[13], oTemp));
        this.svrBoss.server.sub(oData.cVehLst).done(function (results) {
            oTemp.results = results;
            console.log(ES.template(ES.Lang.HubSvr.Err[12], oTemp));

        }).fail(function (e) {
            oTemp.e = e;
            console.log(ES.template(ES.Lang.HubSvr.Err[17], oTemp));
        });
    },

    // 订阅车辆,防止连接断开，需要重新连接
    subGpsByGpsData: function (oGpsInfo) {

        // 断开重新连接，然后在订阅
        this.afnCallBack.push({
            fn: this._subGpsByGpsData,
            oContext: this,
            oData: oGpsInfo,
            PhoneNum: oGpsInfo.PhoneNum
        });

        // 没有启动服务，启动服务后会再次订阅
        if (this.oConnection.state !== 1) {
            return;
        }

        this._subGpsByGpsData(oGpsInfo);
    },


    // 通过GPSData取消订阅---
    unSubGpsByGpsData: function (oGpsInfo) {

        var oTemp = {fnName: 'unSubGpsByGpsData', cDateTime: new Date().toLocaleString()};

        if (!oGpsInfo) {

            console.log(ES.Util.template(ES.Lang.HubSvr.Err[20], oTemp));
            return;
        }
        ES.extend(oTemp, oGpsInfo);

        // 取消内存订阅
        this.removeCallBack(this._subGpsByGpsData, oGpsInfo);

        if (!this.svrBoss ||!this.svrBoss.server.unSub) {
            console.log(ES.Util.template(ES.Lang.HubSvr.Err[22], oTemp));
            return;
        }
        if (this.oConnection.state !== 1) {
            oTemp.state = this.oConnection.state;
            console.log(ES.Util.template(ES.Lang.HubSvr.Err[21], oTemp));
            return;
        }
        console.log(ES.Util.template(ES.Lang.HubSvr.Err[22], oTemp));
        this.svrBoss.server.unSub().done(function (results) {
            oTemp.results = results;
            console.log(ES.Util.template(ES.Lang.HubSvr.Msg[21], oTemp));

        }).fail(function (e) {
            oTemp.e = e;
            console.log(ES.Util.template(ES.Lang.HubSvr.Err[24], oTemp));
        });


    },

    // 订阅车辆,---
    _subGpsByGpsData: function (oGpsInfo) {
        var oTemp = {fnName: '_subGpsByGpsData', cDateTime: new Date().toLocaleString()};
        if (!oGpsInfo) {
            console.log(ES.template(ES.Lang.HubSvr.Err[10], oTemp));
            return;
        }
        if (!this.svrBoss ||!this.svrBoss.server.sub) {
            console.log(ES.template(ES.Lang.HubSvr.Err[16], oTemp));
            return;
        }
        console.log(ES.template(ES.Lang.HubSvr.Err[13], oTemp));

        this.svrBoss.server.sub(oGpsInfo.PhoneNum).done(function (results) {
            oTemp.results = results;
            console.log(ES.template(ES.Lang.HubSvr.Msg[11], oTemp));

        }).fail(function (e) {
            oTemp.e = e;
            console.log(ES.template(ES.Lang.HubSvr.Err[15], oTemp));
        });
    },

    // 取消订阅车辆---
    vehicleUnSub: function (vehicleLst) {
        var oTemp = {fnName: '_subGpsByGpsData', cDateTime: new Date().toLocaleString(), vehicleLst: vehicleLst};
        if (!this.svrBoss ||!this.svrBoss.server.unSub) {
            console.log(ES.template(ES.Lang.HubSvr.Err[41], oTemp));
            return;
        }
        if (this.oConnection.state !== 1) {
            oTemp.state = this.oConnection.state;
            console.log(ES.template(ES.Lang.HubSvr.Err[42], oTemp));
            return;
        }
        console.log(ES.template(ES.Lang.HubSvr.Err[43], oTemp));
        this.svrBoss.server.unSub().done(function (results) {
            oTemp.results = results;
            console.log(ES.template(ES.Lang.HubSvr.Msg[41], oTemp));
        }).fail(function (e) {
            oTemp.e = e;
            console.log(ES.template(ES.Lang.HubSvr.Err[44], oTemp));
        });
    },

    subAlarm: function (oData) {

        // 断开重新连接，然后在订阅
        this.afnCallBack.push({fn: this._subAlarm, oContext: this, oData: oData});

        // 没有启动服务，启动服务后会再次订阅
        if (this.oConnection.state !== 1) {
            return;
        }

        this._subAlarm(oData);

    },

    // 添加告警 -----
    _subAlarm: function (oGpsInfo) {
        var oTemp = {fnName: '_subAlarm', cDateTime: new Date().toLocaleString()};

        if (this.oConnection.state !== 1) {
            oTemp.state = this.oConnection.state;
            console.log(ES.template(ES.Lang.HubSvr.Err[33], oTemp));
            return;
        }

        if (!this.svrBoss.server.subAlarm) {
            console.log(ES.template(ES.Lang.HubSvr.Err[34], oTemp));
            return;
        }

        console.log(ES.template(ES.Lang.HubSvr.Err[30], oTemp));
        this.svrBoss.server.subAlarm(oGpsInfo.nUserId, oGpsInfo.nPlatId, oGpsInfo.nDeptId).done(function (results) {
            oTemp.results = results;
            console.log(ES.template(ES.Lang.HubSvr.Err[31], oTemp));

        }).fail(function (e) {
            oTemp.e = e;
            console.log(ES.template(ES.Lang.HubSvr.Err[35], oTemp));
        });

    },

    unSubAlarm: function () {
        if (!this.svrBoss.server.unSubAlarm) {
            return;
        }
        if (this.oConnection.state !== 1) {
            return;
        }
        this.svrBoss.server.unSubAlarm().done(function (results) {
            console.log('Seccuss at unSubAlarm: ' + results);

        }).fail(function (e) {
            console.log('Failed at unSubAlarm: ' + e);
        });
    },

    // 通过GpsData 订阅单台车辆 防止断开订阅
    subSingleAlarmByGpsData: function (oGpsInfo) {

        // 断开后重新订阅
        this.afnCallBack.push({
            fn: this._subSingleAlarmByGpsData,
            oContext: this,
            oData: oGpsInfo,
            PhoneNum: oGpsInfo.PhoneNum
        });

        // 没有启动服务，启动服务后会再次订阅
        if (this.oConnection.state !== 1) {
            return;
        }

        this._subSingleAlarmByGpsData(oGpsInfo);

    },

    // 取消单台车辆的订阅 ---
    _subSingleAlarmByGpsData: function (oGpsInfo) {
        var oTemp = {fnName: '_subSingleAlarmByGpsData', cDateTime: new Date().toLocaleString()};

        var oMsg = ES.Lang.HubSvr.Err;

        if (!oGpsInfo) {
            console.log(ES.Util.template(oMsg[56], oTemp));
            return;
        }
        if (!this.svrBoss ||!this.svrBoss.server.subSingleDeviceAlarm) {
            console.log(ES.Util.template(oMsg[54], oTemp));
            return;
        }
        console.log(ES.Util.template(oMsg[50], oGpsInfo) + new Date());
        this.svrBoss.server.subSingleDeviceAlarm(oGpsInfo.PhoneNum).done(function (results) {
            oTemp.results = results;
            console.log(ES.Util.template(ES.Lang.HubSvr.Msg[51], oTemp));

        }).fail(function (e) {

            oTemp.e = e;
            console.log(ES.Util.template(oMsg[55], oTemp));
        });

    },

    // 取消订阅
    unSubSingleAlarmByGpsData: function (oGpsInfo) {
        if (!oGpsInfo) {
            return;
        }

        this.removeCallBack(this._subSingleAlarmByGpsData, oGpsInfo);
    },

    //----报警推送
    subSingleDeviceAlarm: function (deviceId) {

        if (!this.svrBoss ||!this.svrBoss.server.subSingleDeviceAlarm) {
            return;
        }
        this.svrBoss.server.subSingleDeviceAlarm(deviceId).done(function (results) {
            console.log('Seccuss at subSingleDeviceAlarm: ' + results);

        }).fail(function (e) {
            console.log('Failed at subSingleDeviceAlarm: ' + e);
        });
    },

});