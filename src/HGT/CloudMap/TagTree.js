/**
 * Created by exsun on 2017-01-09.
 */


ES.HGT.CloudMap.TagTree = ES.Evented.extend({

    oOption: {
        // 树的ur
        cUrl: '',
        // 外层容器
        cDivContainer: '.tree-layout-map',

        cCheckUrl: '',
        // 树节点容器
        cTreeContainerSel: '.ex-layout-struckbox-content',
        // 查询框容器
        cSearchInputSel: '.ex-tree-search-ipt',
        // 查询btn容器
        cSearchBtnSel: '.ex-tree-search-btn',
        // 监听事件，对外接口
        cEventName: 'cPermission',
        cFlag: 'ddd',
    },


    oTreeOption: {
        // 树的url
        //cTreeUrl: '',
        // 树所用的插件
        //acPlugin: ['checkbox', 'types', 'search', 'state', 'unique'],
        // 树的check数据来源
    },

    initialize: function (oParent, oOption, oTOption) {
        //this.initContain(oOption);
        this._oParent =oParent._oParent;

        this.oTOption = {};
        ES.setOptions(this,oOption);
        ES.extend(this.oTOption, this.oTreeOption, oTOption);

        if (typeof this.oOption.cDivContainer === 'object') {
            this.$_oPContainer = this.oOption.cDivContainer;
        }
        else {
            this.$_oPContainer = $(this.oOption.cDivContainer);
        }

        this.initOn();

        this.$_oContainer = null;
        this.oPopTree = null;
        this.oTreeContainer = null;
        this.oSearchInput = null;
        this.oSearvhBtn = null;
        // 缓存上次树选择的节点数据
        this._oSelData = null;
    },

    // 给树的上级容器做id
    initContain: function (oOption) {
        // 设置container 容器的id
        oOption.content = ES.template(oOption.content, oOption);
    },

    initOn: function () {

        this._oParent.on('CloudMap:'+this.oOption.cFlag+'TagTree.show', this.show, this);
        this._oParent.on('CloudMap:'+this.oOption.cFlag+'TagTree.hide', this.hide, this);
        this._oParent.on(this.oOption.cFlag + 'TreeView.reflesh',this.reflesh,this);
    },

    reflesh: function () {
        if (!this.oPopTree) {
            return;
        }
        //this.oPopTree.$_oTree.settings.core.data.url = ES.template(this.oTOption.cTreeUrl, this.oBusData);
        this.oPopTree.$_oTree.refresh();
    },

    initButton: function () {

        var self = this;

        var aoButton = [
            {
                value: ES.Lang.Boss[1],
                callback: function () {
                    self.ok();
                    return false;
                },
                autofocus: true
            }
        ];

        this.oOption.button = aoButton;
    },

    initUI: function () {
        var oTemp = $(this.cHtml).addClass(this.oOption.cFlag);
        this.$_oPContainer.append(oTemp);
        this.$_oContainer = oTemp;
        this.oTreeContainer = this.$_oContainer.find(this.oOption.cTreeContainerSel);
        this.oSearchInput = this.$_oContainer.find(this.oOption.cSearchInputSel);
        this.oSearvhBtn = this.$_oContainer.find(this.oOption.cSearchBtnSel);
        this.initSearchEvent();
        this.InitTree();
    },


    show: function (oData) {
        if (this.$_oContainer) {
            this.$_oContainer.show();
        }
        else {

            this.initUI();
            this.$_oContainer.show();
        }


    },

    hide: function (oData) {
        if(!this.$_oContainer) {
            return;
        }
        this.$_oContainer.hide();
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
ES.HGT.CloudMap.TagTree.include({

    cHtml: '<div class="ex-maptool-box ex-maptool-box-white ex-maptool-property ec-padding-0">' +
    '<div class="ex-layout-sider ex-theme-tree ec-fl">' +
    '    <h3 class="ex-theme-sider-title">' +
    '    <i class="ec-icon-sitemap"></i>&nbsp;组织结构' +
    '</h3>' +
    '<div class="ex-layout-struckbox-search">' +
    '    <div class="ec-input-group">' +
    '    <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字">' +
    '    <span class="ec-input-group-btn">' +
    '    <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button"><span class="ec-icon-search"></span></button>' +
    '</span>' +
    '</div>' +
    '</div>' +
    '<div class="ex-layout-struckbox-content" style="height:450px;"></div>' +
    '</div>' +
    '</div>',

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
                self.oPopTree.oTree.jstree(true).search(cSearchVal,false,true);
            }, 250);
        });
    },

    // 初始化树
    InitTree: function () {
        var self = this;
        if (!this.oPopTree) {
            this.oPopTree = new ES.Common.JsTree(this._oParent,
                {cSelecter: this.oTreeContainer},
                this.oTOption);
            this.oPopTree.readyCallBack = function () {
                self.drawNode();
            };
            this.oPopTree.refreshCallBack = function () {
                self.drawNode();
            };
            this.oPopTree.selectCallBack = function (e, oNode) {
                self._oParent.fire('CloudMap:EditTool.edit', {oNode: oNode.node});

                //if (self._oSelData) {
                //    // 添加点数据
                //    self._oParent.fire('CloudMap:ShowLayer.DrawLayers', {aoNode: [self._oSelData]});
                //}
                //if (oNode.node.data) {
                //    self._oSelData = oNode.node.data;
                //    self._oParent.fire('CloudMap:ShowLayer.removeLayers',   {aoInfo: [oNode.node.data]});
                //    //触发查询
                //}
            }
        } else {
            //self.oPopTree.$_oTree.settings.core.data.url = ES.template(this.oTOption.cTreeUrl, this.oBusData);
            //self.oPopTree.$_oTree.refresh();
        }
    },

    // 获得所有的 节点
    drawNode: function () {
        // this.$_oTree.instance.get_node('#')
        //this.$_oTree.instance.get_node('#')
        var oNode = this.oPopTree.$_oTree.get_node('#');
        var aoNode = this.getChildNode(oNode);

        this._oParent.fire('CloudMap:ShowLayer.DrawLayers',{aoNode:aoNode})
    },

    getChildNode: function (oNode) {

        if (!oNode) {
            return;
        }

        var aoNode = [];

        if (!oNode.children_d || oNode.children_d.length <= 0) {
            return
        }
        for (var i = 0; i < oNode.children_d.length; i++) {
            var oTemp = this.oPopTree.$_oTree.get_node(oNode.children_d[i]);

            if (!oTemp.data) {
                continue;
            }
            aoNode.push(oTemp.data);
        }
        return aoNode;
    },
});
