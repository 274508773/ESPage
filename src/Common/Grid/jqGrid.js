/**
 * Created by liulin on 2016/12/12.
 *
 *
 *  think:
 * 加载数据有3种方式
 * A. 直接ajax加载数据
 * B. 外部数据加载
 * C. 间接加载数据
 */


ES.Common.JgGrid = ES.Class.extend({

    oOption: {
        // 容器
        cContainer: '',
        // grid id
        cGridContainer: 'dtGridTrackContainer',
        // 分页菜单id
        cPagerContainer: 'dtGridTrackToolBarContainer',
        //cTools: 'refresh|faseQuery|advanceQuery|export[excel,csv,pdf,txt]|print',
        bAjaxLoad: false,
        cUrl: null,

        oDefaultParam: {},

        jqGridOption: {
            ajaxLoad: false,
            mtype: "POST",
            datatype: "json",
            page: 1,
            subGrid: true,
            subGridRowExpanded: null,
            subGridOptions: {
                url: '',
                mtype: "POST",
                datatype: "json",
                reloadOnExpand: false,
                selectOnExpand: true,
                subGrid: false,
                subGridRowExpanded: null,
                subGridOptions: {},
            },
            rowNum: 20,
            rowList: [20, 30, 50],
            multiselect: true,
        }
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        // 保存 grid 中的数据
        this._aoData = [];
        this.aoCol = [];

        this.initOn();

        this.initUI();

        this.setColumns();

        this._loadMode();

        this.initGrid();

        if (this.oOption.bAjaxLoad) {
            this.jqGrid.query();
        }

        // 如果是第三种模式,加载数据，url 不为空，bAjax = false
        this._loadData();
    },

    // 判断加载数据的方式
    _loadMode: function () {
        var oOption = {};
        oOption = ES.extend(oOption, this.oOption.jqGridOption,
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
                    datas: this._aoData

                });

        }

        this.jqGridOption = oOption;
    },

    _loadData: function () {

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
        var oGrid = $(this.oOption.cContainer).find('#' + this.oOption.cGridContainer);

        if (!oGrid || oGrid.length <= 0) {
            $(this.oOption.cContainer).append('<div id="' + this.oOption.cGridContainer + '" class="dt-grid-container"></div>');
            $(this.oOption.cContainer).append('<div id="' + this.oOption.cPagerContainer + '" class="dt-grid-toolbar-container"></div>');
        }
    },

    // 监听外部事件
    initOn: function () {

        // 添加数据
        this._oParent.on("jqGrid.addRows", this.addRows, this);

        // 更新行数据
        this._oParent.on("jqGrid.updateRow", this.updateRow, this);

        //
        this._oParent.on("jqGrid.query", this.query, this);
    },

    // 初始化grid界面
    initGrid: function () {
        var self = this;

        ES.extend(this.jqGridOption, {
            onSelectRow: function (id, record, e) {
                self.initClick(e, record);
            }
        });

        var jqGrid = $.fn.jgGrid.init(this.jqGridOption);
        this.jqGrid = jqGrid;
        this.jqGrid.parameters = this.oOption.oDefaultParam;

        //dtgrid.load();
    },

    // grid 绑定点击事件e, record
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

        var aoCol = [

            {label: 'ID', name: 'OrderID', key: true, editable: false, width: 25, align: 'center'},
            {label: '组织架构名称', name: 'CustomerID', editable: true},
            {label: '组织架构描述', name: 'OrderDate', editable: true, align: 'center'},
            {label: '电话', name: 'Freight', editable: true},
            {label: '传真', name: 'CustomerID', editable: true},
            {label: '日期', name: 'OrderDate', editable: true, align: 'center'},
            {
                label: '操作',
                name: 'actions',
                formatter: function formatHtml(cellValue, options, rowObject) {
                    var Html = '<a class="ec-btn ec-btn-default ec-btn-sm ec-radius" ><i class="ec-icon-pencil"></i>&nbsp;编辑</a>&nbsp;' +
                        '<a class="ec-btn ec-btn-primary ec-btn-sm ec-radius" ><i class="ec-icon-plus"></i>&nbsp;资源分类授权</a>&nbsp;' +
                        '<a class="ec-btn ec-btn-danger ec-btn-sm ec-radius" ><i class="ec-icon-trash-o"></i>&nbsp;删除</a>';
                    return Html;
                },
                align: 'center',
                width: 250
            }
        ];

        $.merge(this.aoCol, aoCol);


    },

    // 触发后台查询
    query: function (oData) {

        var oParam = {};
        ES.extend(oParam, oData.oParam);

        // 重新设置查询条件
        this.jqGrid.parameters = oParam;
        this.jqGrid.query();

    },

});

// 加载本地数据
ES.Common.JgGrid.include({

    // 更新行数据
    updateRow: function ( ) {

    },

    // 删除行数据
    delRow: function ( ) {

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
        if (this.jqGrid) {
            this.jqGrid.query();
        }
    },

});

ES.Common.jqGrid = function (oParent, oOption) {
    return new ES.Common.JgGrid(oParent, oOption);
};

