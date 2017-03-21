

/*
 * ES for code lib
 *
 * author:	liulin
 * date:	2016-11-201
 *
 *
 * 列出 组件目录
 */

var ES = {
	version: '0.0.1'
};

function expose() {
	var oldES = window.ES;

	ES.noConflict = function () {
		window.ES = oldES;
		return this;
	};

	window.ES = ES;
}

// define ES for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') {
	module.exports = ES;

// define ES as an AMD module
} else if (typeof define === 'function' && define.amd) {
	define(ES);
}

// define ES as a global  variable, saving the original ES to restore later if needed
if (typeof window !== 'undefined') {
	expose();
}


// 总目录文件
// 语言库
ES.Lang = {}

// 可视化组件库
ES.Common = {};

ES.Common.Lang={

    1: '确定',
    2: '取消',
    3: '新增',
    4: '修改',
    5: '删除',


    10: '新增数据成功！',
    11: '新增数据失败，失败原因{Msg}!',

    20: '修改数据成功！',
    21: '修改数据失败，失败原因{Msg}!',

    30: '删除数据失败，原因:没有获得业务数据',
    31: '确实要删除数据？',
    32: '删除数据成功！',
    33: '删除数据失败，失败原因{Msg}!',


    40: '设置成功！',
    41: '设置失败,失败原因{Msg}!',
}

// 地图控件
ES.MapControl={};

ES.MapControl.Config = {

    oRegionConfig: {
        cSwitchName: '区域',
        cDefaultCityName: '南昌市',
        dLng: 115.89,
        dLat: 28.68,
    },


    oRegionRep: {
        cUrl: '',//'/MapView/GetRealRegion',
        oParam: {
            nDeptId: 1
        }
    },

};

ES.HGT =  {};

// 这个一个临时的配置文件
ES.HGT.oConfig= {

    dLng: 115.868897,
    dLat: 28.702860,

    // 车辆出入记录
    cVehInOutUrl: '/MapView/GetRealRegion',

    // 告警推送订阅告警类型
    cAlarmHubSet: 'http://192.168.1.177:10204/api/UserAlarmSub/Set',
    cHubUrl: 'http://192.168.1.177:10204/signalr',

    // 查询订阅接口数据
    cAlarmHubGet:  'http://192.168.1.177:10204/api/UserAlarmSub/Get',

    // 监控页面获得工地信息
    cSiteInfoUrl: '/Site/GetSiteInfoByIds',


};




