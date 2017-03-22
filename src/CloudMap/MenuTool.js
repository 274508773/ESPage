/**
 * Created by liulin on 2017/3/17.
 */
// 添加菜单容器工具为空
ES.CloudMap.MenuTool = ES.Evented.extend({

    cHtml:
    '<div class="ex-maptool-box ex-maptool-box-white">' +
    '   <ul class="ex-map-tab ec-text-center ex-maptool-tab ex-cloud-map-menu">' +
    '   </ul>' +
    '</div>' +
    '<div class="ex-maptool-box  ex-maptool-tab-draw">' +
    '    <ul class="ex-map-tab ec-text-center ex-maptool-tab ex-cloud-map-tool">' +
    '   </ul>' +
    '</div>',

    oOption: {
        // 父级容器
        //cParentDiv: 'MapView',
        acParentDivClass: ["ex-layout-maptool", "ex-theme-maptool", "ex-map-top", "ex-map-left"],

    },


    // 构造函数
    initialize: function (oMapBase, options) {
        ES.setOptions(this, options);
        this.$_oContainer = $(this.cHtml);

        this.$_oPContainer = $("." + this.oOption.acParentDivClass.join("."));


        this.$_oPContainer.eq(0).append(this.$_oContainer);

        this.aoCtrl = [];

        this.setParentEvent();
    },

    // 设置父级容器的事件
    setParentEvent: function () {

        ////屏蔽事件
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

    },

    //提供添加菜单功能
    appendMenu: function (oCtrl) {
        var $_oLi = oCtrl.getMenu();
        if(!$_oLi) {
            return;
        }
        oCtrl.setPContainer(this);

        this.$_oContainer.find('ul.ex-cloud-map-menu').append($_oLi);

        this.aoCtrl.push(oCtrl);

    },

    clearTool: function () {
        this.$_oContainer.find('ul.ex-cloud-map-tool').empty();
    },

    showTool: function () {
        this.$_oPContainer.find('.ex-maptool-tab-draw').fadeIn();
    },

    // 操作
    appendTool: function (oCtrl) {
        //this.$_oContainer.find('ul.ex-cloud-map-tool').empty();
        this.$_oContainer.find('ul.ex-cloud-map-tool').append(oCtrl.$_oLi);
    },



});