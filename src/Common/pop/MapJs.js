/**
 * Created by liulin on 2016/12/22.
 */

ES.Common.Pop.Map = ES.Common.Pop.extend({

    oUIConfig: {
        div: {
            //'class':'ex-layout-content1',
            style:'float:left !important;',
            div: {
                'class': 'ex-layout-map-content', id: '{cDivContainerID}',
                div: [
                    {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left'},
                    {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-right ex-maptool-edit'},
                    {'class': 'ex-layout-maptool ex-map-bottom ex-map-left'},
                    {'class': 'ex-layout-maptool ex-theme-maptool ex-map-bottom ex-map-right',}
                ]
            }
        }
    },


    initialize: function (oParent, oOption) {
        this.initContain(oOption);
        ES.Common.Pop.prototype.initialize.call(this, oParent, oOption);
    },

    // 给树的上级容器做id
    initContain: function (oOption) {
        var $_oTemp = ES.getTag(this.oUIConfig);
        var cHtml = ES.template($_oTemp.prop("outerHTML"),oOption);

        // 设置container 容器的id
        oOption.content = cHtml;

    },

    initOn: function () {

    },

    initButton: function () {
        this.oOption.button = [];
    },

    Show: function (oData) {
        this.oBusData = oData.oModel;
        this.oDialog.showModal();
    },

    // 弹出对话框后在加载树
    afterOpen: function () {
        // 初始化树结构

        this.$_oContainer = $('#' + this.oOption.cDivContainerID);
        if (!this.oMapMaster) {
            this.InitMap();
            this.loadMapToolArea();
        }

        if(this.oBusData)
        {
            this.oDialog.title('编辑工地围栏');
            //在地图上画围栏


        }

    },

    // 加载事件
    initEvent:function(){
        ES.Common.Pop.prototype.initEvent.call(this);
        var self = this;
        $('#' + this.oOption.cDivContainerID).find('button.ok').bind('click',function(){

            self.fire('button:ok');
        });

        $('#' + this.oOption.cDivContainerID).find('button.cancle').bind('click',function(){

            self.fire('button:cancle');
        });
    },

    showModal: function (oData) {
        this.oBusData = oData;


        this.oDialog.showModal();
        this.oDialog._$('footer').hide();

    },

    // 加载地图
    InitMap: function () {
        var nMapWidth = 900;
        var nMapHeight = 500;

        this.oMapMaster = new L.MapLib.MapMaster.Map(this, {
            cDidId: this.oOption.cDivContainerID,
            oMapOption: {
                zoomControl: false,
                layers: [],
                center: new L.LatLng(ES.HGT.oConfig.dLat, ES.HGT.oConfig.dLng),
                zoom: 10
            },
            nMapWidth:nMapWidth,
            nMapHeight:nMapHeight,
        });

        this.oMapMaster.loadMapMaster();
    },

    // 加载工具栏
    loadMapToolArea: function () {
        //this.oToolArea = new ES.MapControl.ESMapToolArea(this.oMapMaster, {});
        // 地图工具
        this.oToolBox = new ES.MapControl.ESMapToolBox(this.oMapMaster, {});
        // 地图瓦片
        this.oToolTile = new ES.MapControl.ESMapTile(this.oMapMaster, {});

        // 地图poi查询
        new ES.MapControl.ESMapSearch(this.oMapMaster, {});
        // 编辑工具
        this.oToolEdit = new ES.MapControl.ESPOpMapEdit(this.oMapMaster, {
            acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-right','ex-maptool-edit'],
        });

    },

});