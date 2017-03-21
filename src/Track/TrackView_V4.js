/*
 name :              TrackView.js 
 des：               历史轨迹回放，第4版本

 date：              2016-5-19
 author：            liulin


 修改说明：
 先前用的kedoUI，现在统一用轻量级的ui控件实现
 摒弃用iframe 嵌套页面的方式，使用

 历史轨迹回放的空间 ES.TrackView

 A. 要做内部事件机制,不与其他页面的事件机制冲突


 轨迹回放机制，轨迹回放分四大块：
 1.地图及地图组件
 ES.TrackView.Map 为地图基础库，赋值管理地图、全屏、图层、地图工具 等组件

 2.地图操作


 3.业务展示
 ES.TrackView.Bar 控制业务展示
 ES.TrackView.TrackChart 业务展示详细内容

 静态文本和动态文本的区别，

 4.轨迹回放控制

*/





// 轨迹数据显示操作
{
    // 对菜单的操作


    // 注释对象
    {
        // 第一个对象，为状态
        // 负责显示图表的状态
        //ES.TrackView.TrackChart.Status = ES.Class.extend({
        //    oOption: {
        //        cUrl: '',
        //        cInitData: 'TrackView:TrackChart.initData',
        //        cInitUI: 'TrackView:TrackChart.initUI',
        //    },
        //    // 行驶时长,行驶里程,平均速度,轨迹点,开始时间,结束时间
        //    _oItem: {
        //        "total_travelPeriod": "RunTimeSec",
        //        "total_mileage": "Mileage",
        //        "total_avgSpeed": "AverageSpeed",
        //        "total_points": "TraceCount",
        //        "tdBeginDate": "StartTime",
        //        "tdEndDate": "EndTime"
        //    },
        //    // 构造函数
        //    initialize: function () {
        //        this.initOn();
        //    },
        //    // 监控
        //    initOn: function () {
        //        this._oParent.on(this.oOption.cInitData, this.initData, this);
        //        this._oParent.on(this.oOption.cInitUI, this.initUI, this);
        //    },
        //    initData: function (oData) {
        //        if (!oData || !oData.oParam) return;
        //        ES.getData(oData.oParam, this.oOption.cUrl, this.initUI, this);
        //    },
        //    //return {
        //    //    "RetCode": 0,
        //    //    "RetMsg": "OK",
        //    //    "StartTime": '',
        //    //    "EndTime": '',
        //    //    "Data": {
        //    //        "RunTimeSec": 0,
        //    //        "Mileage": 0,
        //    //        "AverageSpeed": 0,
        //    //        "TraceCount": 0,
        //    //        "DataRange": [],
        //    //        "DataStop": [],
        //    //    }
        //    //};
        //    // 
        //    //initUI: function (oData) {
        //    //    if (!oData || oData.RetMsg !== "OK") return;
        //    //    oData.total_mileage = (oData.total_mileage / 1000).toFixed(2);
        //    //    for (var cKey in this._oItem) {
        //    //        $("#" + cKey).text(oData[cKey]);
        //    //    }
        //    //    // 广播数据到其他对象中
        //    //},
        //})
    }


     
}





// 点的处理方式
{




 



}

// 对地图面板的操作，请求数据和面板一起操作，相关对象有
{






}

{
    // 轨迹页面的车辆图上显示速度、载重、密闭、顶灯、GPS、网络信息






    // 速度码表


    ////告警轨迹显示



}
 
