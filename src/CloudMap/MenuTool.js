/**
 * Created by liulin on 2017/3/17.
 */
// 添加菜单容器工具为空
ES.CloudMap.MenuTool = ES.Evented.extend({

    cHtml:
    '<div class="ex-maptool-box ex-maptool-box-white">' +
    '   <ul class="ex-map-tab ec-text-center ex-maptool-tab ex-cloud-map-menu">' +
        //'       <li><button class="ec-btn ec-btn-secondary ec-circle" data-flag="Grid"  data-tab-index="1"><i class="ec-icon-th-large"></i></button><p>网格</p></li>' +
        //'       <li><button class="ec-btn ec-btn-secondary ec-circle" data-flag="Line"  data-tab-index="2"><i class="ec-icon-ils"></i></button><p>线路</p></li>' +
        //'       <li><button class="ec-btn ec-btn-secondary ec-circle" data-flag="Fence" data-tab-index="3"><i class="ec-icon-slack"></i></button><p>围栏</p></li>' +
        //'       <li><button class="ec-btn ec-btn-secondary ec-circle" data-flag="Poi"   data-tab-index="4"><i class="ec-icon-map-marker"></i></button><p>兴趣点</p></li>' +
        //'       <li><button class="ec-btn ec-btn-secondary ec-circle" data-flag="Pos" 　data-tab-index="4"><i class="ec-icon-flag"></i></button><p>卡口</p></li>' +

    '   </ul>' +
    '</div>' +
    '<div class="ex-maptool-box  ex-maptool-tab-draw">' +
    '    <ul class="ex-map-tab ec-text-center ex-maptool-tab ex-cloud-map-tool">' +
        //'       <li><button class="ec-btn ec-btn-secondary ec-radius" data-object="0" ><i class="ec-icon-dot-circle-o"></i></button><p>画点</p></li>' +
        //'       <li><button class="ec-btn ec-btn-secondary ec-radius" data-object="1" ><i class="ec-icon-xing"></i></button><p>画线</p></li>' +
        //'       <li><button class="ec-btn ec-btn-secondary ec-radius" data-object="2" ><i class="ec-icon-stop"></i></button><p>画矩形</p></li>' +
        //'       <li><button class="ec-btn ec-btn-secondary ec-radius" data-object="3" ><i class="ec-icon-star"></i></button><p>画多边形</p></li>' +
        //'       <li><button class="ec-btn ec-btn-secondary ec-radius" data-object="4" ><i class="ec-icon-circle"></i></button><p>画圆形</p></li>' +
        //'       <li><button class="ec-btn ec-btn-secondary ec-radius" data-object="5"><i class="ec-icon-circle"></i></button><p>编辑</p></li>' +
        //
        //'       <li><button class="ec-btn ec-btn-secondary ec-radius level" data-object="6"><i class="ec-icon-star"></i></button><p>删除</p></li>' +
        //'       <li><button class="ec-btn ec-btn-secondary ec-radius level" data-object="7" ><i class="ec-icon-circle"></i></button><p>确定</p></li>' +
        //'       <li><button class="ec-btn ec-btn-secondary ec-radius level" data-object="8" ><i class="ec-icon-star"></i></button><p>取消</p></li>' +
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
    appendTool: function ($_oLi) {
        //this.$_oContainer.find('ul.ex-cloud-map-tool').empty();
        this.$_oContainer.find('ul.ex-cloud-map-tool').append($_oLi);

    },


    setActive: function (oCtrl) {
        if (this.aoCtrl.length <= 0) {
            oCtrl.addClass('ec-active');
            oCtrl.oPenalShow();

        }

        for (var i = 0; i < this.aoCtrl.length; i++) {
            if (oCtrl !== this.aoCtrl[i]) {
                this.aoCtrl[i].removeClass('ec-active');
                this.aoCtrl[i].oPenalHide();
            }
            else {
                this.aoCtrl[i].addClass('ec-active');
                this.aoCtrl[i].oPenalShow();
            }
        }
    },


});