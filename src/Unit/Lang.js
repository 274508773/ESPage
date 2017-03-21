/**
 * Created by liulin on 2017/2/21.
 */


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