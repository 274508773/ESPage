/**
 * Created by liulin on 2016/11/29.
 *
 * think:
 * 加载数据有3种方式
 * A. 直接ajax加载数据
 * B. 外部数据加载
 * C. 间接加载数据
 *
 */


ES.Common.DtGrid = ES.Class.extend({

    oOption: {
        // 容器
        cContainer: '',
        // grid id
        cGridContainer: 'dtGridTrackContainer',
        // 分页菜单id
        cPagerContainer: 'dtGridTrackToolBarContainer',

        bAjaxLoad: false,

        // 是否立即加载数据
        bInitLoad: true,

        cUrl: null,

        oDefaultParam: {},

        dtGridOption: {
            lang: 'zh-cn',
            ajaxLoad: false,
            check: false,
            exportFileName: 'grid',
            tools: 'refresh|print',//'refresh|faseQuery|advanceQuery|export[excel,csv,pdf,txt]|print',
            pageSize: 10,
            pageSizeLimit: [10, 20, 30, 50],
        }
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption,aoCol) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        // 保存 grid 中的数据
        this._aoData = [];
        // 设置集合
        if(oOption.aoData){
            this._aoData = oOption.aoData;
        }

        if (typeof this.oOption.cContainer === 'object') {

            // 父亲级容器
            this.$_oContainer = this.oOption.cContainer;
        }
        else {
            this.$_oContainer = $(this.oOption.cContainer);
        }

        this.aoCol = aoCol||[];

        this.initOn();

        this.initUI();

        this.setColumns();

        this._loadMode();

        this.initGrid();

        if (this.oOption.bInitLoad) {
            this.dtGrid.load();
        }

        // 如果是第三种模式,加载数据，url 不为空，bAjax = false
        this._loadData();
    },

    // 判断加载数据的方式
    _loadMode: function () {
        var oOption = {};
        oOption = ES.extend(oOption, this.oOption.dtGridOption,
            {
                ajaxLoad: true,
                loadURL: this.oOption.cUrl,
                columns: this.aoCol,
                gridContainer: this.oOption.cGridContainer,
                toolbarContainer: this.oOption.cPagerContainer,
            });
        if (!this.oOption.bAjaxLoad) {
            ES.extend(oOption,
                {
                    ajaxLoad: false,
                    datas: this._aoData,
                });

        }

        this.dtGridOption = oOption;
    },

    _loadData: function () {
        //bAjaxLoad: false,
        //    cUrl: '',
        if (!this.oOption.bAjaxLoad && this.oOption.cUrl) {

            ES.getData({}, this.oOption.cUrl, this.loadDataHandler, this);
        }
    },

    // 加载数据
    loadDataHandler: function (oData) {

        if ($.isArray(oData)) {
            this.addRows(oData);
        }
        else {
            this.addRows(oData.aoData);
        }

    },

    initUI: function () {
        var oGrid =  this.$_oContainer.find('#' + this.oOption.cGridContainer);

        if (!oGrid || oGrid.length <= 0) {
            this.$_oContainer.append('<div id="' + this.oOption.cGridContainer + '" class="dt-grid-container"></div>');
            this.$_oContainer.append('<div id="' + this.oOption.cPagerContainer + '" class="dt-grid-toolbar-container"></div>');
        }
    },

    // 监听外部事件
    initOn: function () {

        // 添加数据
        this._oParent.on('DtGrid.addRows', this.addRows, this);

        // 更新行数据
        this._oParent.on('DtGrid.updateRow', this.updateRow, this);

        //
        this._oParent.on('DtGrid.query', this.query, this);
    },

    // 给 grid 添加数据
    addRows: function (aoData, bIsClear) {
        if (!aoData) {
            return;
        }
        if (bIsClear) {
            this._aoData.splice(0, this._aoData.length);
        }
        $.merge(this._aoData, aoData);
        if (this.dtGrid) {
            this.dtGrid.reload(true);
        }
    },

    clearGrid: function () {
        if (!this._aoData || this._aoData.length <= 0) {
            return;
        }
        this._aoData.splice(0, this._aoData.length);
        if (this.dtGrid) {
            this.dtGrid.reload(true);
        }
    },

    // 更新行数据
    updateRow: function ( ) {

    },

    // 删除行数据
    delRow: function ( ) {

    },

    // 初始化grid界面
    initGrid: function () {
        var self = this;

        ES.extend(this.dtGridOption, {
            onRowClick: function (value, record, column, grid, dataNo, columnNo, cell, row, extraCell, e) {
                self.initClick(e, record);

            },
            onCheck: function (isChecked, record, grid, dataNo, row, extraCell, e) {

                self.checkHandler(isChecked, record, e);
            },
            onGridComplete: function (grid, e) {
                self.gridComplete(grid, e);
            }
        });

        var dtgrid = $.fn.DtGrid.init(this.dtGridOption);
        this.dtGrid = dtgrid;
        this.dtGrid.parameters = this.oOption.oDefaultParam;

    },

    //isChecked, record, e
    checkHandler: function () {

    },

    //grid, e
    gridComplete: function () {
        ES.removeAn($(this.oOption.cContainer));
    },

    // grid 绑定点击事件
    //e, record
    initClick: function () {

    },

    height: function (nH) {
        nH = nH || 200;
        $('#' + this.oOption.cGridContainer).height(nH);
    },

    width: function (nW) {
        nW = nW || 200;
        $('#' + this.oOption.cGridContainer).width(nW);
    },

    // 获得相关的列数据,可以重新
    setColumns: function () {


        //var self = this;

        var aoCol = [
            //{
            //    id: 'VehicleStatus',
            //    title: '当前状态',
            //    type: 'string',
            //    columnClass: 'text-center'
            //},
            //{
            //    id: 'VehicleNo',
            //    title: '车牌号',
            //    type: 'string',
            //    columnClass: 'text-center'
            //},
            //
            //{
            //    id: 'Direction',
            //    title: '方向',
            //    type: 'number',
            //    columnClass: 'text-center',
            //    hideType: 'xs',
            //    resolution: function (value, record, column, grid, dataNo, columnNo) {
            //
            //        var content = self._oParent.getDire(value);
            //        return content;
            //    }
            //},
            //
            //{
            //    id: 'Speed',
            //    title: '速度',
            //    type: 'number',
            //    columnClass: 'text-center',
            //    hideType: 'xs',
            //    resolution: function (value, record, column, grid, dataNo, columnNo) {
            //
            //        var content = value + " Km/h";
            //        return content;
            //    }
            //},
            //
            //{
            //    id: 'PhoneNum',
            //    title: '期望角度',
            //    type: 'number',
            //    columnClass: 'text-center',
            //    hideType: 'xs',
            //    resolution: function (value, record, column, grid, dataNo, columnNo) {
            //
            //        var content = (record.NJAngleExp || 0) + ' °';
            //        return content;
            //    }
            //},
            //{
            //    id: 'PhoneNum',
            //    title: '实际角度',
            //    type: 'number',
            //    columnClass: 'text-center',
            //    hideType: 'xs',
            //    resolution: function (value, record, column, grid, dataNo, columnNo) {
            //        var content = (record.NJAngleReal || 0) + ' °';
            //        return content;
            //    }
            //},
            //
            //{
            //    id: 'PhoneNum',
            //    title: '横向偏差',
            //    type: 'number',
            //    columnClass: 'text-center',
            //    hideType: 'xs',
            //    resolution: function (value, record, column, grid, dataNo, columnNo) {
            //
            //        var content = (record.NJDistanceErr || 0) + ' 厘米';
            //        return content;
            //    }
            //},
            //{
            //    id: 'PhoneNum',
            //    title: '航向角偏差',
            //    type: 'number',
            //    columnClass: 'text-center',
            //    hideType: 'xs',
            //    resolution: function (value, record, column, grid, dataNo, columnNo) {
            //        var content = (record.NJHeadingErr || 0) + ' °';
            //        return content;
            //    }
            //},
            //{
            //    id: 'Speed',
            //    title: '作业面积',
            //    type: 'number',
            //    columnClass: 'text-center',
            //    hideType: 'xs',
            //    resolution: function (value, record, column, grid, dataNo, columnNo) {
            //
            //        var content = (record.NJJobArea || 0) + ' 亩';
            //        return content;
            //    }
            //},
            //{
            //    id: 'GpsDateTime',
            //    title: '定位时间',
            //    type: 'date',
            //    columnClass: 'text-center',
            //    format: 'yyyy-MM-dd hh:mm:ss',
            //    otype: 'string',
            //    oformat: 'yyyy-MM-dd hh:mm:ss'
            //},
            //{
            //    id: 'PoiInfo',
            //    title: '位置信息',
            //    type: 'number',
            //    columnClass: 'text-center',
            //    hideType: 'xs'
            //},
            //{
            //    id: 'operation',
            //    title: '操作',
            //    type: 'string',
            //    columnClass: 'text-center grid-blue',
            //    resolution: function (value, record, column, grid, dataNo, columnNo) {
            //        var content = '';
            //        content += '<a  href="javascript:void(0);" title="详细" ><i class="ec-icon-eye"></i></a>';
            //        content += '&nbsp;&nbsp;';
            //        //content += '<a  href="javascript:void(0);" title="定位"><i class="ec-icon-link"></i></a>';
            //        //content += '&nbsp;&nbsp;';
            //        //content += '<a  href="javascript:void(0);" ><i class="ec-icon-user"></i></a>';
            //        //content += '&nbsp;&nbsp;';
            //        //content += '<a  href="javascript:void(0);" ><i class="ec-icon-pencil"></i></a>';
            //        //content += '&nbsp;&nbsp;';
            //        content += '<a  href="javascript:void(0);" title="取消跟踪"><i class="ec-icon-trash"></i></a>';
            //        return content;
            //    }
            //}
        ];

        $.merge(this.aoCol, aoCol);


    },

    // 触发后台查询，要做缓存查询
    query: function (oData) {
        // 添加查询层
        ES.loadAn($(this.oOption.cContainer));
        //var oParam = {};
        //ES.extend(oParam, oData.oParam, this.oOption.oDefaultParam);
        ES.extend(this.oOption.oDefaultParam, oData.oParam);
        // 重新设置查询条件
        this.dtGrid.parameters = this.oOption.oDefaultParam;
        this.dtGrid.refresh(true);

    },

    // 清空所有的选着
    uncheck: function () {
        $('input[id*=dt_grid_' + this.dtGrid.option.id + '_check_]').removeAttr('checked');
    }

});


ES.Common.dtGrid = function (oParent, oOption) {
    return new ES.Common.DtGrid(oParent, oOption);
};

