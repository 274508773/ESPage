/**
 * Created by liulin on 2016/12/5.
 */


ES.Common.Pop.Tree = ES.Common.Pop.extend({

    oOption: {
        // 树的ur
        cUrl: '',
        // 弹出层容器id
        cDivContainer: '',
        // 树节点容器
        cTreeContainerSel: '.ex-layout-struckbox-content-1',
        // 查询框容器
        cSearchInputSel: '.ex-tree-search-ipt-1',
        // 查询btn容器
        cSearchBtnSel: '.ex-tree-search-btn-1',
        // 监听事件，对外接口
        cEventName: 'cPermission',
    },

    oTreeOption: {
        // 树的url
        cTreeUrl: '',
        // 树所用的插件
        acPlugin: ['checkbox', 'types', 'search', 'state', 'unique'],
        // 树的check数据来源
        cCheckUrl: '',
    },

    initialize: function (oParent, oOption, oTOption) {
        this.initContain(oOption);
        this.oTOption = {};
        ES.extend(this.oTOption, this.oTreeOption, oTOption);
        ES.Common.Pop.prototype.initialize.call(this, oParent, oOption);

        this.oPopTree = null;
        this.oTreeContainer = null;
        this.oSearchInput = null;
        this.oSearvhBtn = null;
    },

    // 给树的上级容器做id
    initContain: function (oOption) {
        // 设置container 容器的id
        oOption.content = ES.template(oOption.content, oOption);
    },

    initOn: function () {
        var cEventName = this.oOption.cEventName;
        this._oParent.on(this._oParent.getEventName(cEventName), this.Show, this);
    },

    initButton: function () {

        var self = this;

        var aoButton = [
            {
                value: ES.Common.Pop.Lang[1],
                callback: function () {
                    self.ok();
                    return false;
                },
                autofocus: true
            }
        ];

        this.oOption.button = aoButton;
    },

    // 点击确定时触发
    ok: function () {

        ES.loadAn($(this.oDialog.node));

        if (!this.oBusData) {
            ES.aWarn(ES.Common.Pop.Lang[30]);
            return;
        }
        // 回调保存接口
        //var anPerm = this.oPopTree.getLeafCheckNode();
        var anPerm = this.oPopTree.getTreeCheckNode();
        var nRoleId = this.oBusData.RoleId;

        ES.getData({lstId: anPerm, nRoleId: nRoleId}, this.oOption.cUrl, this.okHandler, this);

    },

    okHandler: function (oData) {
        ES.removeAn($(this.oDialog.node));
        if (oData && oData.IsSuccess) {
            ES.aSucess(ES.Common.Pop.Lang[40]);

        }
        else {
            ES.aErr(ES.template(ES.Common.Pop.Lang[41], oData));

        }

        this.oDialog.close();
    },

    Show: function (oData) {
        this.oBusData = oData.oModel;
        this.oDialog.showModal();
    },

    // 弹出对话框后在加载树
    afterOpen: function () {
        // 初始化树结构
        this.oTreeContainer = $('#' + this.oOption.cDivContainer).find(this.oOption.cTreeContainerSel);
        this.oSearchInput = $('#' + this.oOption.cDivContainer).find(this.oOption.cSearchInputSel);
        this.oSearvhBtn = $('#' + this.oOption.cDivContainer).find(this.oOption.cSearchBtnSel);

        this.initSearchEvent();
        this.InitTree();
    },

    // 根据id重新初始化树
    clearTree: function () {
        this.oPopTree.uncheckAll();
        // 加载选择节点
        if (this.oTOption.cCheckUrl) {
            ES.getData({nRoleId: this.oBusData.RoleId}, this.oTOption.cCheckUrl, this.initCheck, this);
        }
    },

    initCheck: function (anPerm) {
        if (!anPerm || anPerm.length <= 0) {
            return;
        }
        this.oPopTree.uncheckAll();
        this.oPopTree.setCheckNode(anPerm);

    },

});

// 注册查询事件
ES.Common.Pop.Tree.include({

    initSearchEvent: function () {
        var self = this;
        // 注册查询事件
        this.oSearvhBtn.bind('click', function () {
            if (!self.oPopTree) {
                return;
            }
            var cSearchVal = self.oSearchInput.val();
            // 触发查询
            self.oPopTree.oTree.jstree(true).search(cSearchVal);

        });

        // 注册键盘事件,防止查询刷屏
        var bTo = false;
        this.oSearchInput.keyup(function () {
            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {
                var cSearchVal = self.oSearchInput.val();
                self.oPopTree.oTree.jstree(true).search(cSearchVal);
            }, 250);
        });
    },

    // 初始化树
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
            this.oPopTree.readyCallBack = function () {
                self.clearTree();
            };
            this.oPopTree.refreshCallBack = function () {
                self.clearTree();
            };
            //this.oPopTree.selectCallBack = function () {
            //    //触发查询
            //}
        } else {
            self.oPopTree.$_oTree.settings.core.data.url = ES.template(this.oTOption.cTreeUrl, this.oBusData);
            self.oPopTree.$_oTree.refresh();
        }
    },

});
