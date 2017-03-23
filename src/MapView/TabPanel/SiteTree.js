/**
 * Created by liulin on 2016/12/19.
 *
 * 工地树--包括工地查询面板、工地树等信息
 *
 *
 * 查询面板 可能为树，可能为 查询控件
 *
 * 对资源进行操作
 *
 * 树 查询 组装 控件
 */


ES.MapView.TabPanel.SiteTree = ES.Evented.extend({
    // 查询面板控件
    oOption: {
        // 树的ur
        cUrl: '',
        // 面板的最上级容器，不是树容器
        cDivContainerSel: '#classContainer',
        // 树节点容器
        cTreeContainerSel: '.ex-layout-struckbox-content',
        // 查询框容器
        cSearchInputSel: '.ex-tree-search-ipt',
        // 查询btn容器
        cSearchBtnSel: '.ex-tree-search-btn',
    },


    oUIConfig: {
        div: {
            'class': 'ex-layout-struckbox ex-theme-struckbox',
            div: [
                {
                    'class': 'ex-layout-struckbox-title ex-theme-struckbox-title',
                    h4: {
                        'class': 'ec-align-left',
                        html: '工地列表'
                    }
                },
                {
                    div: {
                        'class': 'ex-layout-struckbox-wrap',
                        div: [
                            {
                                'class': 'ex-layout-struckbox-search',
                                div: {
                                    'class': 'ec-input-group',
                                    input: {
                                        type: 'text',
                                        'class': 'ec-form-field ex-tree-search-ipt',
                                        placeholder: '请输入关键字'
                                    },
                                    span: {
                                        'class': 'ec-input-group-btn',
                                        button: {
                                            'class': 'ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn',
                                            type: 'button',
                                            span: {'class': 'ec-icon-search'}
                                        }
                                    }
                                }
                            },
                            {'class': 'ex-layout-struckbox-content'}
                        ]
                    }
                },
            ]

        }
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption, oTOption) {

        this.oTreeOption = oTOption;

        ES.setOptions(this, oOption);
        this._oParent = oParent;


        // 整个页面通信容器
        this._oPage = oParent._oParent;

        this.oTree = null;
        this.oTreeContainer = null;
        this.oSearchInput = null;
        this.oSearvhBtn = null;

        this.bCheck = true;
        // 初始化界面
        this.initOn();

        if (typeof this.oOption.cDivContainerSel === 'object') {

            this.$_oContainer = this.oOption.cDivContainerSel
        }
        else {
            this.$_oContainer = $(this.oOption.cDivContainerSel);
        }

        this.initUI();

    },

    initUI: function () {

        this.$_oStruck = ES.getTag(this.oUIConfig);
        this.$_oContainer.append(this.$_oStruck);
        this.show();
        this.oTreeContainer = this.$_oStruck.find(this.oOption.cTreeContainerSel);
        this.oSearchInput = this.$_oStruck.find(this.oOption.cSearchInputSel);
        this.oSearvhBtn = this.$_oStruck.find(this.oOption.cSearchBtnSel);

        this.$_oStruck.find('h4').html(this.oOption.cTitle);

        this.initSearchEvent();

        this.InitTree();

    },

    // 初始化查询事件
    initSearchEvent: function () {
        var self = this;
        // 注册查询事件
        this.oSearvhBtn.bind('click', function () {
            if (!self.oPopTree) {
                return;
            }
            var cSearchVal = self.oSearchInput.val();
            // 触发查询
            self.oPopTree.oTree.jstree(true).search(cSearchVal, false, true);

        });

        // 注册键盘事件,防止查询刷屏
        var bTo = false;
        this.oSearchInput.keyup(function () {
            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {
                var cSearchVal = self.oSearchInput.val();
                self.oPopTree.oTree.jstree(true).search(cSearchVal, false, true);
            }, 250);
        });
    },

    // 初始化树
    InitTree: function () {
        var self = this;

        if (!this.oPopTree) {

            this.oPopTree = new ES.MapView.SiteTreeTemp(this._oParent, {cSelecter: this.oTreeContainer}, this.oTreeOption);
            this.oPopTree.readyCallBack = function () {
                self.clearTree();
                this.checkAll();
                self.initTreeTitle();
            };

            this.oPopTree.checkAllCallBack = function () {

                    self.drawCheckSite();

            };

            this.oPopTree.uncheckAllCallBack = function () {
                self._oPage.fire('SiteLayer:clearAll');
            };

            this.oPopTree.uncheckCallBack = function (e, oThisNode) {
                self.removeDrawSite(oThisNode.node);
            };
        }
    },

    // 移除绘制工地
    removeDrawSite: function (oNode) {
        var anId = this.oPopTree.getSelfChildNode(oNode);
        this._oPage.fire('MV:Site.clearSites', {anId: anId});
    },

    // 画选中的工地
    drawCheckSite: function () {
        //获得所有的工地
        var anSiteId = this.oPopTree.getTreeCheckNode();

        if (!anSiteId || anSiteId.length <= 0) {
            return;
        }

        // 获得工地的GPS信息
        ES.getData({anSiteId: anSiteId}, ES.oConfig.cSiteInfoUrl, this.drawSite, this);
    },

    // 画一个工地
    drawOneSite: function (nSiteId) {

        ES.getData({anSiteId: [nSiteId]}, ES.oConfig.cSiteInfoUrl, this.drawSite, this);
    },

    initCheckHandler: function () {

        var self = this;
        this.oPopTree.checkCallBack = function (e, oThisNode) {
            if(self.bCheck) {
                //self.drawCheckSite();
                // 定位到当前位置上
                if(oThisNode.node.children && oThisNode.node.children.length>0){
                    self.drawCheckSite();
                }
                else
                {
                    var cId = oThisNode.node.id;
                    self.drawOneSite(parseInt(cId.replace('s', '')));

                }
            }
        };
    },

    // 根据id重新初始化树
    clearTree: function () {
        this.oPopTree.uncheckAll();

        this.initCheckHandler();
    },

    // 显示面板
    show: function () {
        this.$_oStruck.show();
        //this.$_oStruck.fadeIn(500);
    },

    // 隐藏面板
    hide: function () {
        this.$_oStruck.hide();
        //this.$_oStruck.fadeOut(500);
    },

    // 画工地,对地图图层集合操作
    drawSite: function (oData) {
        this._oPage.fire('MV:Site.setSiteData', {aoSiteInfo: oData});
    },

    // 初始化界面
    initOn: function () {

        // 内部面板监听
        this._oParent.on("MapView:Struct.show", this.show, this);
        this._oParent.on("MapView:Struct.hide", this.hide, this);

        // 外部面板监听
        this._oPage.on("MapView:SiteStatic.Select", this.selectNode, this);

    },

    selectNode: function (oData) {
        if (!this.oPopTree || !oData || !oData.anLst) {
            return;
        }

        // 在树上找到id，选择
        this.oPopTree.uncheckAll();

        if(oData.anLst<=0){
            return;
        }

        var acItem = oData.anLst.map(function (nItem) {
            return 's' + nItem;
        });
        this.bCheck = false;
        this.oPopTree.setCheckNode(acItem);
        this.bCheck = true;
        this.drawCheckSite();
    },

    // 获得外层容器的宽度
    getWidth: function () {

        return  this.$_oStruck.width();
    },

    initTreeTitle: function () {

        this.$_oStruck.find("a").each(function () {
            $(this).attr("title", $(this).text());
        })

    },

});