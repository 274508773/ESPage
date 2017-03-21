/**
 * Created by liulin on 2016/12/26.
 */

ES.MapControl.ESMapMaster =ES.Evented.extend({

    oUIConfig: {
        div: {
            id: 'MapView',
            'class': 'ex-layout-map-content',
            div: [
                {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left'},
                //{'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left ex-maptool-edit'},
                {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-right'},
                {'class': 'ex-layout-maptool ex-map-bottom ex-map-left'},
                {'class': 'ex-layout-maptool ex-theme-maptool ex-map-bottom ex-map-right'}
            ]
        }
    },

    oOption: {
        cContainerSel: '.ex-layout-content',
    },


    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.$_oPContainer = oOption.cContainerSel;
        if (typeof oOption.cContainerSel !== 'object') {
            this.$_oPContainer = $(this.oOption.cContainerSel);
        }

        // 初始化界面
        this.initUI();
    },


    initUI: function () {
        this.$_oContainer = ES.getTag(this.oUIConfig);
        this.$_oPContainer.append(this.$_oContainer);
        //ES.initTag($(this.oOption.cContainerSel), this.oUIConfig);

    },

    loadMap: function (nMapWidth,nMapHeight) {
        this.oMapMaster = new L.MapLib.MapMaster.Map(this._oParent, {
            cDidId: 'MapView',
            oMapOption: {
                zoomControl: false,
                layers: [],
                center: new L.LatLng(ES.MapControl.Config.dLat, ES.MapControl.Config.dLng),
                zoom: 10
            }
        });
        this.oMapMaster.nMapWidth = nMapWidth;
        this.oMapMaster.nMapHeight = nMapHeight;
        this.oMapMaster.loadMapMaster();

        return this.oMapMaster;
    },

    resize: function (nW,nH) {
        this.$_oContainer.width(nW);
        this.$_oContainer.height(nH);
        this.oMapMaster.reflesh(nW,nH);

    },

    // 加载工具栏
    loadMapToolArea: function () {
        this.oToolArea = new ES.MapControl.ESMapToolArea(this.oMapMaster,{});
        this.oToolBox = new ES.MapControl.ESMapToolBox (this.oMapMaster,{});
        this.oToolTile = new ES.MapControl.ESMapTile (this.oMapMaster,{});
        this.oToolFull = new ES.MapControl.ESMapFull (this.oMapMaster,{});
    },

});