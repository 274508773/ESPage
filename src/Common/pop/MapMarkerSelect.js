/**
 * Created by liulin on 2017/2/27.
 */

ES.Common.Pop.MapMarkerSelect= ES.Common.Pop.Map.extend({

    // 加载工具栏
    loadMapToolArea: function () {
        this.oToolArea = new ES.MapControl.ESMapToolArea(this.oMapMaster, {});
        this.oToolBox = new ES.MapControl.ESMapToolBox(this.oMapMaster, {});
        this.oToolTile = new ES.MapControl.ESMapTile(this.oMapMaster, {});

        new ES.MapControl.ESMapSearch(this.oMapMaster, {});
        this.oToolEdit = new ES.MapControl.MapEditPos(this.oMapMaster, {
            acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-right','ex-maptool-edit'],
        });

    },

})
