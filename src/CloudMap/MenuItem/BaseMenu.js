/**
 * Created by liulin on 2017/3/22.
 *
 */

// 基础菜单
ES.CloudMap.BaseMenu = ES.Evented.extend({

    cHtml:'<li><button class="ec-btn ec-btn-secondary ec-circle" data-flag="Grid"  data-tab-index="1"><i class="ec-icon-th-large"></i></button><p>邮路</p></li>',

    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);

        this._oMap = oParent.getMap();
        this._oDrawLayer = L.featureGroup();
        this._oDrawLayer.addTo(this._oMap);

        this.aoDrawTool = [];
        this.aoEditTool=[];
        this.aoSaveACalTool= [];
        this.aoPopWnd = [];


        // 存在统一的编辑、删除
        this.oEditTool = null;
        this.oDelTool = null;

        this.$_oLi = null;

        this.initOn();
        this.initUI();

    },

    getDrawLayer:function() {
        return this._oDrawLayer;
    },

    getLayer: function () {
       return this._oDrawLayer.getLayers();
    },


    initOn: function () {
        this._oParent.on('CloudMap:BaseMenu.addActive',this.addActive,this);
        this._oParent.on('CloudMap:BaseMenu.removeActive',this.removeActive,this);
        this._oParent.on('CloudMap:BaseMenu.hidePenal',this.hidePenal,this);
        this._oParent.on('CloudMap:BaseMenu.endMenu',this.endMenu,this);
    },

    initUI:function(){

        this.$_oLi = $(this.cHtml);

        var self = this;

        this.$_oLi.find('button').bind('click', function () {
            if (self.oPenal) {

                self._oParent.fire('CloudMap:BaseMenu.hidePenal');
                self.oPenal.show();

                self._oParent.fire('CloudMap:BaseMenu.removeActive');
                self.addActive();
                // 显示工具面板
                self.oPContainer.showTool();
                // 添加画图按钮
                self.addDrawToUI();
                self._oParent.fire('CloudMap:BaseMenu.endMenu');

            }

        });

    },

    hidePenal: function () {

    },

    clearLayers: function () {
        this._oDrawLayer.clearLayers();
    },

    addLayer: function (oLayer) {
        oLayer.addTo( this._oDrawLayer);
    },

    getMenu: function () {
        return this.$_oLi;
    },

    addActive: function () {
        this.$_oLi.find('button').addClass('ec-active');
    },

    removeActive: function () {
        this.$_oLi.find('button').removeClass('ec-active');
    },

    getActive: function () {
        if (this.$_oLi.find('button').hasClass('ec-active')) {
            return true;
        }
        return false;
    },


    // 设置父级对象
    setPContainer: function (oPContainer) {
        this.oPContainer = oPContainer;
    },

    endMenu: function () {

    },

});