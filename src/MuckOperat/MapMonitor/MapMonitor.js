/**
 * Created by liulin on 2016/11/24.
 *
 *
 * 页面的入口
 *
 *
 */



$(function () {

    // 页面参数，设置页面的基本参数
    var oPage = new ES.MuckOperat.MapMonitor.Page('mapmonitor', {});

    // 地图加载完成
    var oMapMaster = new ES.MuckOperat.MapMonitor.MapView(oPage, {bIsLoadMap: true});

    oMapMaster.getMap();

    // 实时监控的头文件
    var HeadTab = new ES.MuckOperat.MapMonitor.HeadTab(oPage);
    HeadTab.initEven();

});