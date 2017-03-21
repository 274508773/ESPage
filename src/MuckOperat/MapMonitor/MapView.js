/**
 * Created by liulin on 2016/11/24.
 *
 * 实时监控地图部分操作
 *
 *
 */



ES.MuckOperat.MapMonitor.MapView = L.MapLib.MapMaster.Map.extend({


    initialize: function (oParent, oOption) {
        ES.extend(oOption, {cDidId: 'Map', cDivContainerId: 'MapContain'});
        L.MapLib.MapMaster.Map.prototype.initialize.call(this, oParent, oOption);

        if (oOption.bIsLoadMap) {

            this.loadMapMaster();
        }
        // 加载菜单
        this.initTopLeft();
    },

    // 加载地图
    loadMapMaster: function () {
        // 设置地图的高度和宽度
        var winHeight = this._oParent.height();
        var winWidth = this._oParent.width();

        this.nMapWidth = winWidth - 268;
        this.nMapHeight = winHeight - 80;

        L.MapLib.MapMaster.Map.prototype.loadMapMaster.call(this);
    }

});

