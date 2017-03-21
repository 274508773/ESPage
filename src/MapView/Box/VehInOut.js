/**
 * Created by liulin on 2016/12/22.
 *
 *
 * 车辆出入记录
 */

ES.HGT.MapView.VehInOut = ES.HGT.MapView.ReceiveAlarm.extend({

    oUIConfig: {
        div: {
            'class': 'ex-alert-box-bottom',
            div: [
                {
                    'class': 'ex-alert-box-title', h4: {html: '车辆出入记录'},

                    button: [
                        {'class': 'ec-close ec-close-alt ec-close-spin ec-icon-times ex-alert-box-close'}
                    ]
                },


                {'class': 'dt-grid-container'},
                {'class': 'dt-grid-toolbar-container'},
            ]
        }
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;


        this.$_oPContainer = oOption.cContainerSel;
        if (typeof oOption.cContainerSel !== 'object') {
            this.$_oPContainer = $(this.oOption.cContainerSel);
        }

        this.cFlag = 'VehInOut';


        this.initOn();

        this._aoData = [];

        this.initUI();
    },

    initOn: function () {

        // 初始化监控列表，并添加一行数据
        this._oParent.on("MapView:VehInOut.showTrack", this.showTrack, this);

        // 初始化监控列表
        this._oParent.on("MapView:VehInOut.initUI", this.initUI, this);
        // 显示监控列表
        this._oParent.on("MapView:VehInOut.reShowTrack", this.reShowTrack, this);

        // 隐藏监控列表
        this._oParent.on("MapView:VehInOut.hideTrack", this.hideTrack, this);

        // 接收hub 服务
        this._oParent.on("ReceiveInOut", this.addRow, this);

        // 更新行数据
        this._oParent.on("MapView:VehInOut.updateRow", this.updateRow, this);
    },

    // 初始化界面
    initUI: function () {
        var self = this;
        // 当前容器
        this.$_oContainer = ES.getTag(this.oUIConfig);
        this.$_oContainer.addClass(this.cFlag);

        this.$_oContainer.find('.dt-grid-container').attr({id: 'dtGrid' + this.cFlag});
        this.$_oContainer.find('.dt-grid-toolbar-container').attr({id: 'dtGridPager' + this.cFlag});

        // 父亲级容器
        this.$_oPContainer.append(this.$_oContainer);

        var self = this;
        this.$_oContainer.find('button').bind('click', function () {
            self.hideTrack();

            if(!self._aoData && self._aoData.length>100){

                self.clearRow();
                self._oParent.fire('VehInOut:btn.close');

            }


        });

        this.initData();
    },

    // 第一次的登录设置数据
    initData: function () {
        ES.getData({},'/Reports/VehicleRecordTop5',this.initDataHandler,this);

    },

    initDataHandler: function (oData) {

        this._oParent.fire("ReceiveInOut", {oData:oData.dataList});

    },

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
        //
        //}

        if (this.dtGrid) {
            // 重新加载内存中的数据
            this.dtGrid.reload(true);
        }
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
                title: '车牌号',
                type: 'string',
                columnClass: 'text-center'
            },
            {
                id: 'CreateTime',
                title: '出入时间',
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
                    if (!record || !record.Images || record.Images.length <= 0) {
                        return content;
                    }

                    //**第一个img,外面展示，直接放地址显示
                    content += '<div class="ex-lightgallery-box">' +
                        '<img src=' + record.Images[0] + ' class="ec-img-thumbnail ex-img-sm" />';
                    content += '<ul class="ex-lightgallery">';
                    for (var i = 0; i < record.Images.length; i++) {
                        content += '<li data-exthumbimage="' + record.Images[i] + '" data-src="' + record.Images[i] + '"></li>';

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