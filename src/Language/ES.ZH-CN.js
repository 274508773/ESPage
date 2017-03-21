/*

文本订阅规则： ES.Lang 为文本定义包，
.XXXX.XXXX定义对象,实际引用的对象
对象里订阅的对象，为方法，方法里定义的属性为错误编码

例如(for example)：
    ES.Lang.Map={
        flyTo:{
            1:'设备号{PhoneNum}，车牌号{VehicleNo} 无法使用flyTo，原因是地图控件不支持(注：目前1.0以上版本支持)！'
        }
    }
    ES.Lang 为文本包，Map为对象，flyTo为对象订阅的方法，1为错误代码
*/

ES.Lang = {};
ES.Lang.Page = {
    setMap: {
        Err: 'ES.Page->setMap 执行赋值失败，地图控件为空！',
        ErrMap: 'ES.Page->setMap 执行赋值失败,非法的地图控件',
    }
};

ES.Lang.Util = {
    Err: {
        1: '请求数据数据失败',
        2: '请求参数为空',
        3: '回调函数为空'
    }
};

ES.Lang.MapOpr = {

    initialize: {
        Err: '获取地图插件失败！，程序无法运行！',
        ErrMap: '地图控件为空，程序无法运行！',
    }
};
 


ES.Lang.Map = {
    p: {
        1: '地图控件为空，无法执行flyTo操作！',
    },
    flyTo: {
        1: '设备号{PhoneNum}，车牌号{VehicleNo} 无法使用flyTo，原因是地图控件不支持(注：目前1.0以上版本支持)！',
        2: '地图控件为空，无法执行flyTo操作！',

    },
    reflesh: {
        1: '地图控件为空，无法执行地图刷新操作！'
    },
    bcMap: {
        1: '地图控件为空或者对象非地图控件，无法执行广播地图事件！'
    }
};

ES.Lang.HubSvr = {
    _subSingleAlarmByGpsData: {
        1: '无法订阅车辆,原因：oGpsInfo 为空！',
        2: '无法订阅车辆{PhoneNum};车牌号{VehicleNo}原因：hub服务没有订阅接口！',
        3: '开始订阅车辆{PhoneNum};车牌号{VehicleNo}原因：hub服务没有订阅接口！时间:',
        4: '开始订阅车辆{PhoneNum};车牌号{VehicleNo}返回值:{results}时间:',
        5: '开始订阅车辆{PhoneNum};车牌号{VehicleNo}原因：{e}！时间:',
        6: '订阅车辆{PhoneNum}失败，原因:{e},时间:{cDateTime}',
    },

    unSubGpsByGpsData: {

        1: '无法取消订阅车辆{PhoneNum};车牌号{VehicleNo}原因：hub服务没有订阅接口！',
        2: '无法取消订阅车辆{PhoneNum};车牌号{VehicleNo}原因：hubhub服务断开！服务状态为:',
        3: '开始取消订阅车辆{PhoneNum};车牌号{VehicleNo}',
        4: '取消订阅车辆成功{PhoneNum};车牌号{VehicleNo}返回值:{results}时间:',
        5: '取消订阅车辆失败{PhoneNum};车牌号{VehicleNo}原因：{e}！时间:',
        6: '无法取消订阅车辆,原因：oGpsInfo 为空！',
    },

    // 正确 定义规则
    Msg: {
        11: '{fnName},{cDateTime} 订阅车辆：{PhoneNum}车牌号{VehicleNo}成功，返回值为：{results}',
        12: '{fnName},{cDateTime} 订阅车辆{cVehLst}成功，返回值为：{results}',
        21: '{fnName},{cDateTime} 取消订阅车辆{PhoneNum} 成功,车牌号{VehicleNo}，返回值为：{results} ',
        41: '{fnName},{cDateTime} 取消订阅车辆{vehicleLst} 成功，返回值为：{results} ',

        31: '{fnName},{cDateTime} 取消订阅车辆{PhoneNum}/{VehicleNo} 告警成功，返回值为：{results} ',
        51: '{fnName},{cDateTime} 取消订阅车辆{PhoneNum}/{VehicleNo} 告警成功，返回值为：{results} ',
    },

    // 错误 定义规则 接口定义
    Err: {
        10: '{fnName},{cDateTime} 订阅车辆失败，原因：oGpsInfo 为空！',
        12: '{fnName},{cDateTime} 无法订阅车辆{PhoneNum};车牌号{VehicleNo}，原因：hub服务没有订阅接口！',
        13: '{fnName},{cDateTime} 开始订阅车辆{PhoneNum};车牌号{VehicleNo}！',
        15: '{fnName},{cDateTime} 订阅车辆：{PhoneNum}车牌号{VehicleNo}失败，原因:{e}',

        16: '{fnName},{cDateTime} 订阅车辆{cVehLst}失败，原因：hub接口 为空！',
        17: '{fnName},{cDateTime} 订阅车辆：{cVehLst}失败，原因:{e}',
        18: '{fnName},{cDateTime} 订阅车辆失败，原因：参数为空！',


        20: '{fnName},{cDateTime} 取消订阅失败，原因参数为空！',
        22: '{fnName},{cDateTime} 开始取消订阅车辆{PhoneNum};车牌号{VehicleNo}！',
        23: '{fnName},{cDateTime} 取消订阅车辆{vehicleLst}成功，返回值为：{results}',

        40: '{fnName},{cDateTime} 订阅车辆失败，原因：vehicleLst 为空！',
        41: '{fnName},{cDateTime} 取消订阅车辆失败，原因：hub接口 为空！',
        42: '{fnName},{cDateTime} 无法取消订阅车辆{vehicleLst}，原因：hub 服务断开！服务状态为：{state}',
        43: '{fnName},{cDateTime} 开始取消订阅车辆{vehicleLst}！',
        44: '{fnName},{cDateTime} 取消订阅车辆{vehicleLst}失败，原因:{e}',

        30: '{fnName},{cDateTime} 开始订阅所有车辆{PhoneNum}/{VehicleNo}告警，时间：{cDateTime}!',
        31: '{fnName},{cDateTime} 订阅所有车辆告警成功，时间：{cDateTime}!',
        32: '{fnName},{cDateTime} 订阅所有车辆告警成功失败，时间：{cDateTime}',
        33: '{fnName},{cDateTime} 无法取消订阅车辆{PhoneNum}/{VehicleNo}，原因：hub 服务断开！服务状态为：{state}',
        34: '{fnName},{cDateTime} 订阅所有车辆告警失败，原因：hub接口 为空！',
        35: '{fnName},{cDateTime} 取消订阅车辆{PhoneNum}/{VehicleNo}告警失败，原因:{e}',


        50: '{fnName},{cDateTime} 开始订阅单台车辆{PhoneNum}/{VehicleNo}告警，时间：{cDateTime}!',
        51: '{fnName},{cDateTime} 订阅单台车辆告警成功，时间：{cDateTime}!',
        52: '{fnName},{cDateTime} 订阅单台车辆告警成功失败，时间：{cDateTime}',
        53: '{fnName},{cDateTime} 无法取消订阅单台车辆{PhoneNum}/{VehicleNo}，原因：hub 服务断开！服务状态为：{state}',
        54: '{fnName},{cDateTime} 订阅单台车辆告警失败，原因：hub接口 为空！',
        55: '{fnName},{cDateTime} 取消订阅单台车辆{PhoneNum}/{VehicleNo}告警失败，原因:{e}',
        56: '{fnName},{cDateTime} 取消订阅单台车辆告警失败，原因:oGpsInfo 为空',
    }


};

ES.Lang.HubSvr.HubMange = {
    addHub: {
        1: '订阅数据为空，无法进行设备订阅！',
        2: '地图实时跟踪中存在已经跟踪的设备号{PhoneNum};车牌号{VehicleNo}！'
    },
    removeHub: {
        1: '订阅数据为空，无法进行设备订阅！',
        2: '地图实时跟踪中存在已经跟踪的设备号{PhoneNum};车牌号{VehicleNo}！'
    },
    addAlarmHub: {
        1: '订阅数据为空，无法进行设备订阅！',
        2: '地图实时跟踪中存在已经跟踪的设备号{PhoneNum};车牌号{VehicleNo}！'
    }

};

ES.Lang.VehInfo = {};
ES.Lang.VehInfo.RealStatusNj = {
    setHubGpsInfo: {
        1: '执行hub推送时还没有初始化界面。'
    }
};


// 历史轨迹
ES.Lang.TrackView = {};
ES.Lang.TrackView.Contorl = {
    initSlider: {
        1: ''
    }

};


ES.Lang.Boss= {
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

};