/**
 * Created by liulin on 2016/12/22.
 *
 * hub服务，继承hub
 */


ES.HGT.HGTHubSvr = ES.HubSvr.extend({

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
            //console.log(ES.template(ES.Lang.HubSvr.Err[33], oTemp));
            return;
        }

        if (!this.svrBoss.server.subAlarm) {
            //console.log(ES.template(ES.Lang.HubSvr.Err[34], oTemp));
            return;
        }

        //console.log(ES.template(ES.Lang.HubSvr.Err[30], oTemp));
        this.svrBoss.server.subAlarm(oGpsInfo.cUserId).done(function (results) {
            oTemp.results = results;
            //console.log(ES.template(ES.Lang.HubSvr.Err[31], oTemp));
            console.log('订阅成功!');

        }).fail(function (e) {
            oTemp.e = e;
            //console.log(ES.template(ES.Lang.HubSvr.Err[35], oTemp));
            console.log('订阅失败!');
        });

    },
});


ES.HGT.HGTVehInOutHubSvr = ES.HubSvr.extend({

    subVehicleRecord: function (oData) {

        // 断开重新连接，然后在订阅
        this.afnCallBack.push({fn: this._subVehicleRecord, oContext: this, oData: oData});

        // 没有启动服务，启动服务后会再次订阅
        if (this.oConnection.state !== 1) {
            return;
        }

        this._subVehicleRecord(oData);

    },

    // 添加告警 -----
    _subVehicleRecord: function (oGpsInfo) {
        var oTemp = {fnName: '_subVehicleRecord', cDateTime: new Date().toLocaleString()};

        if (this.oConnection.state !== 1) {
            oTemp.state = this.oConnection.state;
            //console.log(ES.template(ES.Lang.HubSvr.Err[33], oTemp));
            return;
        }

        if (!this.svrBoss ||!this.svrBoss.server.subVehicleRecord) {
            //console.log(ES.template(ES.Lang.HubSvr.Err[34], oTemp));
            return;
        }

        //console.log(ES.template(ES.Lang.HubSvr.Err[30], oTemp));
        this.svrBoss.server.subVehicleRecord(oGpsInfo.cUserId).done(function (results) {
            oTemp.results = results;
            //console.log(ES.template(ES.Lang.HubSvr.Err[31], oTemp));
            console.log('订阅成功1!');

        }).fail(function (e) {
            oTemp.e = e;
            //console.log(ES.template(ES.Lang.HubSvr.Err[35], oTemp));
            console.log('订阅失败2!');
        });

    },


});


// 车辆推送服务
ES.HGT.HGTHubGpsSvr = ES.HubSvr.extend({


    subGps: function (oData) {

        // 断开重新连接，然后在订阅
        this.afnCallBack.push({fn: this._subGps, oContext: this, oData: oData});

        // 没有启动服务，启动服务后会再次订阅
        if (this.oConnection.state !== 1) {
            return;
        }

        this._subGps(oData.oGpsInfo, oData.cUserId);

    },

    // 监听数据
    initOn: function () {
        this._oParent.on('HubSvr:subGps', this.subGps, this);

        this._oParent.on('HubSvr:batchSubGps', this.batchSubGps, this);

        // 取消订阅
        this._oParent.on('HubSvr:UnSubGps', this.UnSubGps, this);


        this._oParent.on('HubSvr:batchUnsubGps', this.batchUnsubGps, this);
    },

    // 批量订阅告警信息
    batchSubGps:function(oData) {

        if (!oData || !oData.aoGpsInfo) {
            return;
        }
        var acVeh = [];
        for (var i = 0; i < oData.aoGpsInfo.length; i++) {
            acVeh.push(oData.aoGpsInfo[i].PhoneNum);
        }

        this._batchSubGps(oData.cUserId,acVeh);
    },

    _batchSubGps: function (cUserId,acVeh) {
        var oTemp = {fnName: '_batchSubGps', cDateTime: new Date().toLocaleString()};

        if (this.oConnection.state !== 1) {
            oTemp.state = this.oConnection.state;
            return;
        }

        if (!this.svrBoss || !this.svrBoss.server.batchSubGps) {
            return;
        }

        this.svrBoss.server.batchSubGps(cUserId, acVeh).done(function (results) {
            oTemp.results = results;
            console.log('订阅执法车辆GPS成功!');

        }).fail(function (e) {
            oTemp.e = e;
            console.log('订阅执法车辆GPS失败!');
        });
    },

    batchUnsubGps: function (oData) {
        if (!oData || !oData.aoGpsInfo) {
            return;
        }
        var acVeh = [];
        for (var i = 0; i < oData.aoGpsInfo.length; i++) {
            acVeh.push(oData.aoGpsInfo[i].PhoneNum);
        }

        this._batchUnsubGps(acVeh);
    },

    _batchUnsubGps: function (acVeh) {
        var oTemp = {fnName: '_batchSubGps', cDateTime: new Date().toLocaleString()};

        if (this.oConnection.state !== 1) {
            oTemp.state = this.oConnection.state;
            return;
        }

        if (!this.svrBoss || !this.svrBoss.server.batchUnsubGps) {
            return;
        }

        this.svrBoss.server.batchUnsubGps(acVeh).done(function (results) {
            oTemp.results = results;
            console.log('取消订阅执法车辆GPS成功!');

        }).fail(function (e) {
            oTemp.e = e;
            console.log('取消订阅执法车辆GPS失败!');
        });
    },

    // 添加告警 -----
    _subGps: function (oGpsInfo,cUserId) {
        var oTemp = {fnName: '_subGps', cDateTime: new Date().toLocaleString()};

        if (this.oConnection.state !== 1) {
            oTemp.state = this.oConnection.state;
            return;
        }

        if (!this.svrBoss ||!this.svrBoss.server.subGps) {
            return;
        }

        this.svrBoss.server.subGps(cUserId,oGpsInfo.PhoneNum).done(function (results) {
            oTemp.results = results;
            console.log('订阅执法车辆GPS成功!');

        }).fail(function (e) {
            oTemp.e = e;
            console.log('订阅执法车辆GPS失败!');
        });

    },

    // 取消订阅
    UnSubGps: function () {

        if (!this.svrBoss ||!this.svrBoss.server.unSubMapGps) {
            return;
        }
        this.svrBoss.server.unSubMapGps(cUserId,oGpsInfo.PhoneNum).done(function (results) {
            oTemp.results = results;
            console.log('取消订阅执法车辆GPS成功!');

        }).fail(function (e) {
            oTemp.e = e;
            console.log('取消订阅执法车辆GPS失败!');
        });

    },
});