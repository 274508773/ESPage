/**
 * Created by liulin on 2016/12/8.
 */

// 树和grid 和 view
ES.Common.Pop.TreeGrid = ES.Common.Pop.Tree.extend({

    oGridOption: {
        // 容器
        cContainer: '',
        // grid id
        cGridContainer: 'dtGridTrackContainer',
        // 分页菜单id
        cPagerContainer: 'dtGridTrackToolBarContainer',
        bAjaxLoad: false,
        cUrl: null,
        oDefaultParam: {},
        dtGridOption: {
            lang: 'zh-cn',
            ajaxLoad: false,
            check: false,
            exportFileName: 'grid',
            tools: 'refresh|faseQuery|advanceQuery|export[excel,csv,pdf,txt]|print',
            pageSize: 30,
            pageSizeLimit: [10, 20, 30, 50],
        }
    },

    oListViewOption: {},

    initialize: function (oParent, oOption, oTOption, oGOption, oLVOption) {
        this.oGOption = {};
        ES.extend(this.oGOption, this.oGridOption, oGOption);

        this.oLVOption = {};
        ES.extend(this.oLVOption, this.oListViewOption, oLVOption);

        this.oPopGrid = null;
        this.oGSearchInput = null;
        this.oGSearvhBtn = null;

        ES.Boss.Pop.Tree.prototype.initialize.call(this, oParent, oOption, oTOption);
    },

    afterOpen: function () {
        ES.Boss.Pop.Tree.prototype.afterOpen.call(this);
        this.oGSearchInput = $('#' + this.oOption.cDivContainer).find(this.oGOption.cSearchInputSel);
        this.oGSearvhBtn = $('#' + this.oOption.cDivContainer).find(this.oGOption.cSearchBtnSel);
        if (!this.oPopGrid) {
            // 加载grid结构
            this.oPopGrid = new ES.Boss.DtGrid.Tenant(this._oParent, this.oGOption);
        }
        else {
            // 情况所有的选择
            this.oPopGrid.uncheck();
        }
        this.initListView();
        this.initGSearchEvent();
    },

    initGSearchEvent: function () {
        var self = this;
        // 注册查询事件
        this.oGSearvhBtn.bind('click', function () {
            if (!self.oPopGrid) {
                return;
            }
            var cSearchVal = self.oGSearchInput.val();
            // 触发查询

            self.oPopGrid.query({oParam: {TenantName: cSearchVal}});
        });
    },

    initListView: function () {
        if (!this.oPopListView) {
            // 加载grid结构
            this.oPopListView = new ES.Common.ListViewEx(this._oParent, this.oLVOption);
        }

        this.oPopListView.setBusData(this.oBusData);
        this.oPopListView.initUI();
    },

    // 初始化树，重载基类方法
    InitTree: function () {
        var self = this;
        if (!this.oPopTree) {
            this.oPopTree = new ES.Boss.JsTree(this._oParent, {
                cSelecter: this.oTreeContainer,
                // 树url
                cUrl: ES.template(this.oTOption.cTreeUrl, this.oBusData),
                // 属性控件使用的插件
                acPlugin: this.oTOption.acPlugin,
            });
            this.oPopTree.readyCallBack = function (obj, e) {
                // 默认选择第一个节点
                var oNode = e.instance.get_node(obj.target.firstChild.firstChild.lastChild);
                e.instance.select_node(oNode);
            };
            this.oPopTree.selectCallBack = function (obj, e) {
                //触发查询
                self._oParent.fire(self.oTOption.cSelectEventName, {oSelect: e, obj: obj});
            };
        } else {
            self.oPopTree.$_oTree.settings.core.data.url = ES.template(this.oTOption.cTreeUrl, this.oBusData);
            self.oPopTree.$_oTree.refresh();
        }
    },

    // 重新树的提交代码
    ok: function () {

        ES.loadAn($(this.oDialog.node));

        if (!this.oBusData) {
            ES.aWarn(ES.Common.Pop.Lang[30]);
            return;
        }
        // 回调保存接口
        var anPerm = this.oPopListView.getCheckNode();
        var nRoleId = this.oBusData.RoleId;

        ES.getData({lstId: anPerm, nRoleId: nRoleId}, this.oOption.cUrl, this.okHandler, this);

    },
});



// 加载list
ES.Common.ListViewEx = ES.Class.extend({

    oOption: {
        // list 容器
        cSelecter: '.ex-layout-content>.ex-layout-panel>.ec-u-lg-2>.ec-collapse>.ec-padding-0>ul',
        // 树url
        cUrl: '/ResourceType/GetResourceGroup',

        cId: 'TenantId'
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.$_oContainer = this.getContainer();

        this.initOn();

    },

    getCheckNode: function () {
        var self = this;
        var $_oContainer = this.getContainer();
        var anTemp = [];
        $_oContainer.find('li').each(function () {

            var oData = $(this).data('oData');
            if (!oData) {
                return true;
            }
            anTemp.push(oData[self.oOption.cId]);
            return true;
        });

        return anTemp;
    },

    getCheck: function (oData) {
        var anTemp = this.getCheckNode();
        $.merge(oData.anData, anTemp);
    },

    // 判断是否存在
    isExist: function (oModel) {
        var anTemp = this.getCheckNode();
        return $.inArray(oModel[this.oOption.cId], anTemp) >= 0;
    },


    setBusData: function (oBusData) {
        this.oBusData = oBusData;
    },

    initOn: function () {
        this._oParent.on(this._oParent.getEventName('cAddTenantUser'), this.Add, this);
        this._oParent.on(this._oParent.getEventName('cDelTenantUser'), this.Del, this);

        this._oParent.on(this._oParent.getEventName('cListViewData'), this.getCheck, this);//{ anData: anData }
    },

    cHtml: '<li>' +
    '<a  href="javascript:void(0)">{Name} </a> ' +
    '</li>',

    Add: function (oData) {
        var oModel = oData.oModel;
        if (this.isExist(oModel)) {
            return;
        }
        var $_oContainer = this.getContainer();
        var cTemp = ES.template(this.cHtml, oModel);

        var oLI = $(cTemp);
        oLI.data('oData', oModel);
        $_oContainer.append(oLI);
    },
    Del: function (oData) {
        var self = this;
        var oModel = oData.oModel;
        var $_oContainer = this.getContainer();
        $_oContainer.find('li').each(function () {

            var oData = $(this).data('oData');
            if (!oData) {
                return true;
            }
            if (oData[self.oOption.cId] === oModel[self.oOption.cId]) {
                $(this).remove();
                return false;
            }

            return true;
        });
    },

    getContainer: function () {
        var $_oContainer = $(this.oOption.cSelecter);
        if (typeof this.oOption.cSelecter === 'object') {
            $_oContainer = this.oOption.cSelecter;
        }
        return $_oContainer;
    },

    // 加载界面
    initUI: function () {
        //清空所有的li 对象
        this.$_oContainer.empty();
        ES.getData({}, ES.template(this.oOption.cUrl, this.oBusData), this.initUIHandler, this);
    },

    // 加载界面
    initUIHandler: function (oData) {
        if (!oData) {
            return;
        }
        var anId = [];
        for (var i = 0; i < oData.length; i++) {
            var cTem = ES.template(this.cHtml, oData[i]);
            var oLI = $(cTem);

            oLI.data('oData', oData[i]);
            this.$_oContainer.append(oLI);
            anId.push(oData[i][this.oOption.cId]);
        }
        // 完成后广播
        this._oParent.fire('ListView.loadFinish', {anId: anId});
    },
});

