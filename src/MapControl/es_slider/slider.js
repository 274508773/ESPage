/**
 * Created by liulin on 2016/12/27.
 */

ES.MapControl.Slider = ES.Evented.extend({

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-bottom', 'ex-map-right'],
        className: '',
        title: '滑块',
    },

    oUIConfig: '<div class="mapNavControl"> <div class="moveBox"></div> ' +
    '<div class="{moveBox-up}" title="向上平移"></div> <div class="{moveBox-down}" title="向下平移"></div> ' +
    '<div class="{moveBox-left}" title="向左平移"></div> <div class="{moveBox-right}" title="向右平移"></div> ' +
    '<div class="{zoomIn}" title="放大"></div> <div class="{zoomOut}" title="缩小"> </div> ' +
    '<div class="slider"></div> <div class="{sliderMoving}"></div> <div class="{slider-block}"></div> <div class="slider-icon-1">' +
    '</div> <div class="slider-icon-2"></div>  <div class="slider-icon-3"></div>  <div class="slider-icon-4"></div> </div>',

    // 构造函数
    initialize: function (oMapBase, options) {
        ES.setOptions(this, options);

        // 获得地图控件
        this._oMapBase = oMapBase;
        this._oMap = oMapBase._oMap;

        this._oContainer = $('.' + this.oOption.acParentDivClass.join('.'));

        // 设置父级容器的事件，是为了屏蔽地图的操作
        this.setParentEvent();


        // 初始化界面
        this.initUI();

        // 加载地图回调函数
        this.initCallBack();

        this.initOn();

    },

    // 注册监听事件
    initOn: function () {
        // 触发显示编辑按钮，并默认画
        this._oMapBase._oParent.on('ESMapEdit:showEditDraw', this.showEditAdd, this);
        this._oMapBase._oParent.on('ESMapEdit:clearLayers', this.clearLayers, this);

        // 删除围栏时要这的事情
        this._oMapBase._oParent.on('ESMapEdit:deleteFence', this.deleteFence, this);
        this._oMapBase._oParent.on('ESMapEdit:editDraw', this.editDraw, this);


    },







    // 设置父级容器的事件
    setParentEvent: function () {

        ////屏蔽事件
        //L.DomEvent.addListener(this._oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        //L.DomEvent.addListener(this._oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        //L.DomEvent.addListener(this._oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

    },

    //加载工具事件，初始化工具栏
    initUI: function () {

        var oBtn = {
            'moveBox-up': 'moveBox-up',
            'moveBox-down': 'moveBox-down',
            'moveBox-left': 'moveBox-left',
            'moveBox-right': 'moveBox-right',
            zoomIn: 'zoomIn',
            zoomOut: 'zoomOut',
            sliderMoving:'sliderMoving',
            'slider-block':'slider-block',
        };

        var $_oSlidler = $(this.oUIConfig);
        $(this.oOption.acParentDivClass.join('.')).append($_oSlidler);

    },



});