/**
 * Created by liulin on 2016/12/26.
 *
 * 告警控制
 * 订阅推送 的2 个按钮，在地图下方显示
 */



ES.MapControl.AlarmCtrl = ES.Evented.extend({

    oOption: {
        // 父级容器
        acParentDivClass: [
            'ex-layout-maptool',
            'ex-theme-maptool',
            'ex-map-bottom',
            'ex-map-right'
        ],

        className: '',
        title: '红谷滩告警推送',
    },

    oUIConfig: {
        button: [
            {
                'class': 'ec-btn ec-btn-block ec-btn-warning',
                span: [
                    {html: '车辆出入记录&nbsp;'},
                    {'class': 'ec-badge ec-round ec-badge-danger', html: '0'}
                ],
                cFlag: 'VehInOut',
                cObject: 'ES.HGT.MapView.BoxBottom'
            },
            {
                'class': 'ec-btn ec-btn-block ec-btn-danger',
                span: [
                    {html: '工地报警监控&nbsp;'},
                    {'class': 'ec-badge ec-round ec-badge-danger', html: '0'}
                ],
                cFlag: 'AlarmMonitor',
                cObject: 'ES.HGT.MapView.AlarmBoxBottom'
            }
        ]
    },

    // 构造函数
    initialize: function (oParent, options) {
        ES.setOptions(this, options);

        // 获得地图控件
        this._oParent = oParent;

        this.$_oContainer = $('.' + this.oOption.acParentDivClass.join('.')).eq(0);

        // 设置父级容器的事件
        this.setParentEvent();

        this.initUI();

        this.initButtonEvent();

        this.initOn();
    },


    // 设置父级容器的事件
    setParentEvent: function () {

        // 屏蔽事件
        //L.DomEvent.addListener(this._oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        //L.DomEvent.addListener(this._oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        //L.DomEvent.addListener(this._oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

    },

    //加载工具事件，初始化工具栏
    initUI: function () {
        ES.initTag(this.$_oContainer, this.oUIConfig);
    },

    initOn: function () {
        // 订阅告警数据
        this._oParent.on('ReceiveHGTAlarm', this.receiveAlarm, this);

        this._oParent.on('ReceiveInOut', this.vehInOut, this);

        this._oParent.on('ReceiveAlarm:btn.close', this.resetReceiveAlarmCnt, this);
        this._oParent.on('VehInOut:btn.close', this.resetVehInOutCnt, this);
    },

    receiveAlarm: function (oData) {
        if (!oData || oData.oData.length <= 0) {
            return;
        }


        var nCnt = parseInt(this.$_oContainer.find('.ec-btn-danger>span:eq(1)').text()) + oData.oData.length;
        this.$_oContainer.find('.ec-btn-danger>span:eq(1)').text(nCnt);

    },

    resetReceiveAlarmCnt: function () {
        this.$_oContainer.find('.ec-btn-danger>span:eq(1)').text(0);
    },

    resetVehInOutCnt: function () {
        this.$_oContainer.find('.ec-btn-warning>span:eq(1)').text(0);
    },

    vehInOut: function (oData) {
        if (!oData || oData.oData.length <= 0) {
            return;
        }


        var nCnt = parseInt(this.$_oContainer.find('.ec-btn-warning>span:eq(1)').text()) + oData.oData.length;
        this.$_oContainer.find('.ec-btn-warning>span:eq(1)').text(nCnt);
    },

    // 给按钮注册事件
    initButtonEvent: function () {
        var self = this;
        this.$_oContainer.find('.ec-btn-danger').bind('click', function () {
            self._oParent.fire('MapView:ReceiveAlarm.showTrack');
        });

        this.$_oContainer.find('.ec-btn-warning').bind('click', function () {
            self._oParent.fire('MapView:VehInOut.showTrack');
        });
    },

});