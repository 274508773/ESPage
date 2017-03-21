/**
 * Created by liulin on 2016/12/22.
 *
 * 功能： 工地实时监控
 *
 *
 *
 *
 */


ES.HGT.MapView.ReceiveAlarm = ES.Evented.extend({

    oUIConfig: {
        div: {
            'class': 'ex-alert-box-bottom',
            div: [
                {
                    'class': 'ex-alert-box-title', h4: {html: '车辆出入记录'},

                    button: [
                        {'class': 'ec-btn ec-btn-xs ec-btn-primary ex-alert-box-setup', html: '设置'},
                        {'class': 'ec-close ec-close-alt ec-close-spin ec-icon-times ex-alert-box-close'}
                    ]
                },


                {'class': 'dt-grid-container'},
                {'class': 'dt-grid-toolbar-container'},
            ]
        }
    },



    //bInitGrid:false,

    oOption: {

        cContainerSel: '.ex-layout-content',
        // 动画处理时长
        nTick: 300,
        // 弹出时显示高度
        nShowH: 270,

        nHideH: 20,

        // 缩小是动画时长
        nHideTick: 150,

        // 缩小时地图的显示高度
        nBottom: -180,

        // 隐藏数据
        cBottom:'-100%',

        // 设置grid 为100条记录
        nTop:100,
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;


        this.$_oPContainer = oOption.cContainerSel;
        if (typeof oOption.cContainerSel !== 'object') {
            this.$_oPContainer = $(this.oOption.cContainerSel);
        }

        this.cFlag = 'Receive';


        this.initOn();

        this._aoData = [];

        this.initUI();
    },

    // 监听外部事件
    initOn: function () {

        // 初始化监控列表，并添加一行数据
        this._oParent.on("MapView:ReceiveAlarm.showTrack", this.showTrack, this);

        // 初始化监控列表
        this._oParent.on("MapView:ReceiveAlarm.initUI", this.initUI, this);
        // 显示监控列表
        this._oParent.on("MapView:ReceiveAlarm.reShowTrack", this.reShowTrack, this);

        // 隐藏监控列表
        this._oParent.on("MapView:ReceiveAlarm.hideTrack", this.hideTrack, this);

        // 接收hub 服务
        this._oParent.on("ReceiveHGTAlarm", this.addRow, this);

        // 更新行数据
        this._oParent.on("MapView:TrackLst.updateRow", this.updateRow, this);
    },

    // 初始化界面
    initUI: function () {
        var self = this;
        // 当前容器
        this.$_oContainer = ES.getTag(this.oUIConfig);
        this.$_oContainer.addClass(this.cFlag);

        this.$_oContainer.find('.dt-grid-container').attr({id:'dtGrid'+this.cFlag});
        this.$_oContainer.find('.dt-grid-toolbar-container').attr({id:'dtGridPager'+this.cFlag});

        // 父亲级容器
        this.$_oPContainer.append(this.$_oContainer);

        var self = this;
        this.$_oContainer.find('button.ex-alert-box-close').bind('click', function () {

            if(!self._aoData && self._aoData.length>100){
                self._oParent.fire('ReceiveAlarm:btn.close');
                self.clearRow();
            }

            // 发送消息
            self.hideTrack();
        });

        this.$_oContainer.find('button.ex-alert-box-setup').bind('click', function () {
            self.oPopSetAlarm.show();
        });

        this.initAlarmSet();

        this.initData();
    },


    // 第一次的登录设置数据
    initData: function () {
        ES.getData({},'/Reports/SiteAlarmTop5',this.initDataHandler,this);
    },

    initDataHandler: function (oData) {

        this._oParent.fire("ReceiveHGTAlarm", {oData:oData.dataList});
    },

    // 再次显示实时监控车辆，不重新加载数据
    reShowTrack: function () {

        var self = this;
        this.$_oContainer.animate({ 'height': self.oOption.nShowH + 'px', 'bottom': '0' }, self.oOption.nTick);

    },

    // 隐藏 grid
    hideTrack: function () {
        var self = this;
        this.$_oContainer.animate({ 'bottom': self.oOption.cBottom }, self.oOption.nHideTick);
        this._oParent.fire('MapView:Map.setMapConterH', { nH: self.oOption.nHideH });
    },

    // 初始化界面
    showTrack: function () {

        var self = this;

        // 设置地图的高度
        //this._oParent.fire('MapView:Map.setMapConterH', { nH: self.oOption.nShowH });

        if( this.dtGrid){
            this.reShowTrack();
            return;
        }
        this.$_oContainer.animate({ 'height': self.oOption.nShowH + 'px', 'bottom': '0' }, self.oOption.nTick);
 
        setTimeout(function () {
            self.$_oContainer.css({'width': '100%', 'height': self.oOption.nShowH + 'px'});

            self.initGrid();
            self.$_oContainer.find('h4').html(self.oOption.cTitle);


        }, self.oOption.nTick);
    },

    // 给 grid 添加数据，推送图片数据和告警名称数据要进行设置
    addRow: function (oTemp) {
        if (!oTemp || !oTemp.oData) {
            return;
        }
        var aoAlarmInfo = oTemp.oData;
        for (var i = 0; i < aoAlarmInfo.length; i++) {
            if (!aoAlarmInfo[i].Images) {
                // 表示是推送过来的数据
                var Images = [];
                Images.push(m_cPicUrl + aoAlarmInfo[i].ImagesUrl);
                aoAlarmInfo[i].Images = Images;
                aoAlarmInfo[i].AlarmTypeName = ES.HGT.oConfig.oAlarmTypeName[aoAlarmInfo[i].AlarmType];

                // 添加数据到 data 中
                this._aoData.unshift(aoAlarmInfo[i]);
            }
            else
            {
                this._aoData.push(aoAlarmInfo[i]);
            }

            if (this._aoData.length > this.oOption.nTop) {
                this._aoData.splice((this.oOption.nTop - 1), 1);
            }
        }

        //for (var cKey in aoAlarmInfo) {
        //
        //    // 加告警消息
        //    this._aoData.unshift(aoAlarmInfo[cKey]);
        //
        //    // 删除最后一条记录
        //    if (this._aoData.length > this.oOption.nTop) {
        //        this._aoData.splice((this.oOption.nTop - 1), 1);
        //    }
        //}
        if (this.dtGrid) {
            // 重新加载内存中的数据
            this.dtGrid.reload(true);
        }
    },

    // 更新行数据
    updateRow: function (oData) {
        if (!oData || !oData.oGpsInfo) return;
        var oGpsInfo = oData.oGpsInfo;

        // 替换数据
        for (var i = this._aoData.length - 1; i >= 0; i--) {
            if (this._aoData[i].PhoneNum == oGpsInfo.PhoneNum) {
                this._aoData.splice(i, 1, oData.oGpsInfo);
            }
        }

        if (this.dtGrid) {
            // 重新加载内存中的数据
            this.dtGrid.reload(true);
        }
    },

    // 删除行数据
    delRow: function (oGpsInfo) {
        if (!oGpsInfo) return;

        // 删除数据，重新绑定grid
        for (var i = this._aoData.length - 1; i >= 0; i--)
        {
            if (this._aoData[i].PhoneNum == oGpsInfo.PhoneNum)
            {
                this._aoData.splice(i, 1);
            }
        }

        if (this.dtGrid) {
            // 重新加载内存中的数据
            this.dtGrid.reload(true);
        }
    },

    clearRow: function () {
        if(!this._aoData || this._aoData.length<=0){
            return;
        }

        this._aoData.splice(0, this._aoData.length);
        if (this.dtGrid) {
            // 重新加载内存中的数据
            this.dtGrid.reload(true);
        }
    },
    
    
    // 初始化grid界面
    initGrid: function () {
        var self = this;

        var dtGridOption = {
            lang: 'zh-cn',
            ajaxLoad: false,
            check: false,
            exportFileName: '告警列表',
            datas: this._aoData,
            columns: this.getColumns(),
            gridContainer: 'dtGrid' + this.cFlag,
            toolbarContainer: 'dtGridPager' + this.cFlag,
            tools: '',
            pageSize: 10,
            pageSizeLimit: [10, 20, 30, 50],
            onRowClick: function (value, record, column, grid, dataNo, columnNo, cell, row, extraCell, e) {
                if ($(e.target).hasClass("edit")) {
                    // 查找a，并给a绑定事件 点击查看按钮
                    self._oParent.fire("MapView:EventReport", {
                        oGpsInfo: record
                    });
                }
            },
            onGridComplete: function (g) {
                $('.ex-lightgallery').lightGallery({exThumbImage: 'data-exthumbimage',closable: false});
            }


        };
        var dtgrid = $.fn.DtGrid.init(dtGridOption);

        $('#dtGrid' + this.cFlag).height(200);
        this.dtGrid = dtgrid;
        dtgrid.load();
    },


    // 获得相关的列数据
    getColumns: function () {


        var aoCol = [
            {
                id: 'AreaName',
                title: '片区',
                type: 'string',
                columnClass: 'text-center'
            },
            {
                id: 'SiteName',
                title: '工地',
                type: 'string',
                columnClass: 'text-center'
            },
            {
                id: 'VehicleNo',
                title: '工地',
                type: 'string',
                columnClass: 'text-center'
            },
            {
                id: 'AlarmTypeName',
                title: '报警类型',
                type: 'string',
                columnClass: 'text-center'
            },
            {
                id: 'AlarmTime',
                title: '告警时间',
                type: 'date',
                columnClass: 'text-center',
                format: 'yyyy-MM-dd hh:mm:ss',
                otype: 'string',
                oformat: 'yyyy-MM-dd hh:mm:ss'
            },
            {
                id: 'operation',
                title: '图片',
                type: 'string',
                columnClass: 'ec-text-center',
                resolution: function (value, record, column, grid, dataNo, columnNo) {
                    var content = '';
                    if(!record || !record.Images || record.Images.length <=0) {
                        return content;
                    }
                    //**第一个img,外面展示，直接放地址显示
                    content += '<div class="ex-lightgallery-box">' +
                        '<img src=' + record.Images[0] + ' class="ec-img-thumbnail ex-img-sm" />';
                    content += '<ul class="ex-lightgallery">';
                    for(var i = 0 ;i< record.Images.length;i++){
                        content += '<li data-exthumbimage="' + record.Images[i]  + '" data-src="' + record.Images[i]  + '"></li>';

                    }

                    content += '</ul></div>';
                    content += '  ';
                    return content;
                }
            },
            {
                id: 'operation1',
                title: '操作',
                type: 'string',
                columnClass: 'text-center grid-blue',
                resolution: function (value, record, column, grid, dataNo, columnNo) {

                    var html = [];
                    html.push('<button class="ec-btn ec-btn-xs ec-btn-default edit"><i class="ec-icon-edit edit"></i> 上报</button>');

                    return html.join(' ');
                }

            }
        ];

        return aoCol;

    },

});

// 对告警订阅的设置
ES.HGT.MapView.ReceiveAlarm.include({

    cHtml:'<div style="width: 95%;margin: 7px 20px;border-bottom:1px solid #c5c5c5;padding: 0;overflow: hidden;">'+
    '<label for="_type_sel_all">'+
    '<input type="checkbox" id="_type_sel_all" name="_type_sel_all">全选</label></div>'+
    '<div class="list-checkbox" style="margin-left: 50px">'+
    '<ul class="ec-avg-sm-3" id="_ulAlarmType"></ul>',

    initAlarmSet:function(){

        this.oPopSetAlarm = new ES.Common.Pop.SubAlarmType(this, {
            content: this.cHtml,
            title: '告警订阅',
            cancelValue: '取消',
        });
        this.oPopSetAlarm.initPopEvent();
    },


})

