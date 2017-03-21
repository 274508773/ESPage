/**
 * Created by liulin on 2017/2/22.
 */

ES.TrackHelper = {


    //获取告警类型
    getAlarmTypeName: function (type) {

        var oData = this.getAlarmType();
        if (!oData) return;
        return oData[type];
    },

    //告警字典
    getAlarmType: function () {
        var alarmType = {
            1: '紧急报警', 2: '超速报警', 3: '疲劳驾驶', 4: '预警', 5: 'GNSS模块发生故障',
            6: '定位天线被剪断', 7: 'GNSS天线短路', 8: '终端主电源欠压', 9: '电源掉电', 10: '终端LCD或显示器故障',
            11: 'TTS模块故障', 12: '摄像头故障', 13: '当天累计驾驶超时', 14: '超时停车', 15: '进出区域',
            16: '进出路线', 17: '路段行驶时间不足_过长', 18: '路线偏离报警', 19: '车辆VSS故障', 20: '车辆油量异常',
            21: '车辆被盗', 22: '车辆非法点火', 23: '车辆非法位移', 24: '碰撞侧翻报警', 25: 'SD卡异常',
            26: '进区域报警', 27: '出区域报警', 28: '超线报警',
            51: '平台超速报警',
            200: '重量传感器可疑故障', 201: '顶棚可疑故障', 202: '不按线路行驶', 203: '未密闭', 204: '超载',
            206: '无运输许可证', 207: '正常出土', 208: '可疑出土', 209: '可疑消纳', 215: '正常消纳', 210: '非工作时间运输',
            211: '工地可疑出土', 212: '工地正常出土', 213: '消纳场可疑消纳', 214: '消纳场正常消纳'
        };

        return alarmType;
    },

    // 获取对象类型
    getObjType: function (oLayer) {
        if (oLayer instanceof L.Rectangle) {
            return 501001;
        }
        if (oLayer instanceof L.Polygon) {
            return 501003;
        }
        if (oLayer instanceof L.Polyline) {
            return 501004;
        }
        if (oLayer instanceof L.Circle) {
            return 501002;
        }
        return 1;
    },

    getPosW: function (cKey) {

        var oParam = {vPos: 10, aPos: 20};
        if (oParam.hasOwnProperty(cKey)) {
            return oParam[cKey];
        }
        return null;
    },

    //方向处理
    getDire: function (dataItem) {
        var nDir = 0;
        if (typeof dataItem == 'object') {
            nDir = dataItem.Direction;
        }
        else {
            nDir = dataItem;
        }
        if ((nDir >= 0 && nDir <= 15) || (nDir > 345 && nDir <= 360))
            return '正北';
        if (nDir > 15 && nDir <= 75)
            return '东北';
        if (nDir > 75 && nDir <= 105)
            return '正东';
        if (nDir > 105 && nDir <= 165)
            return '东南';
        if (nDir > 165 && nDir <= 195)
            return '正南';
        if (nDir > 195 && nDir <= 255)
            return '西南';
        if (nDir > 255 && nDir <= 285)
            return '正西';
        if (nDir > 285 && nDir <= 345)
            return '西北';

    },

    getDateMsg: function (nTick) {

        var nCurTick = new Date().getTime();
        var nInt = nCurTick - nTick;
        if (nInt > 24 * 60 * 60 * 1000) {
            var nDay = (nCurTick - nTick) / (24 * 60 * 60 * 1000);

            return "[" + parseInt(nDay) + "天前]";
        }
        else if (nInt > 1 * 60 * 60 * 1000 && nInt <= 24 * 60 * 60 * 1000) {

            var nH = nInt / (1 * 60 * 60 * 1000);
            return "[" + parseInt(nH) + "小时前]";
        }
        else {
            var nH = parseInt(nInt / (60 * 1000));
            if (nH <= 0) {
                return "";
            }
            return "[" + parseInt(nH) + "分钟前]";

        }
    },

    // 设置车辆的在线状态
    getVehStatusClass: function (oPosInfo) {
        var oClass = {};
        var cClass = "l-bd-off l-mobile-off";
        //判断当前位置信息
        if (oPosInfo.VehicleStatus == "行驶"
            || oPosInfo.VehicleStatus == "停车"
            || oPosInfo.VehicleStatus == "熄火") {
            oClass.cStatus = 'l-bd-on l-mobile-on';

            oClass.cLstClass = ''
        }
        else if (oPosInfo.VehicleStatus == "通讯中断") {//通讯中断;定位失败

            oClass.cStatus = 'l-bd-off l-mobile-off';
            oClass.cLstClass = 'gray'
        }
        else if (oPosInfo.VehicleStatus == "定位失败") {

            oClass.cStatus = 'l-bd-off l-mobile-on';
            oClass.cLstClass = 'gray'
        }
        return oClass;
    },

    // 获得顶灯的状态
    convertVehStatus: function (oGpsInfo) {
        var aoAttach = oGpsInfo.Attach;
        oGpsInfo.nGreenOn = 0;
        oGpsInfo.nRedOn = 0;
        oGpsInfo.nYelloOn = 0;
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

    // 获得时间相关信息
    getTrackDateMsg: function (nTick) {

        //var nInt = nCurTick - nTick;
        var nInt = nTick;
        if (nInt > 24 * 60 * 60 * 1000) {
            var nDay = (nInt / (24 * 60 * 60 * 1000)).toFixed(2);

            var oTime = {nTime: nDay, cMsg: '天'};
            return oTime;
        }
        else if (nInt > 1 * 60 * 60 * 1000 && nInt <= 24 * 60 * 60 * 1000) {

            var nH = (nInt / (1 * 60 * 60 * 1000)).toFixed(2);
            var oTime = {nTime: nH, cMsg: '小时'}
            return oTime;
        }
        else if (nInt > 1 * 60 * 1000 && nInt <= 60 * 60 * 1000) {
            var nH = (nInt / (60 * 1000)).toFixed(0);
            if (nH < 0) {
                nH = 0;
            }
            var oTime = {nTime: nH, cMsg: '分钟'}
            return oTime;
        }
        else {
            var nH = (nInt / 1000).toFixed(0);
            if (nH <= 0) {
                return {nTime: 0, cMsg: ''}
            }
            var oTime = {nTime: nH, cMsg: '秒'}
            return oTime;

        }
    },

}