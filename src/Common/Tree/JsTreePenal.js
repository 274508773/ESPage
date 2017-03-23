
/**
 * jstreePenal.js
 * 查询、节点选择、树的基本操作集成组件
 *
 * 数据请求不要放在树控件里，放在其他地方
 *
 * Created by liulin on 2017/3/23.
 *
 *
 *
 */

ES.Common.JsTreePenal = ES.extend({

    // 查询面板控件
    oOption: {

        // 面板的最上级容器，不是树容器
        cDivContainerSel: '.PContainer',

        cTitle:'树面板标题',

        // 树节点一般由多个表组成，围栏防止节点id有相同，在节点id前面加了前缀码,前缀码为空返回所有的节点元素
        cPrefix:undefined,

        // check 事件
        cCheckEventName:'Common:JsTreePenal.getCheckId',
        // uncheck 事件
        cUncheckEventName:'Common:JsTreePenal.getUncheckId',

        cJsTreePenalShow:'Common:JsTreePenal.show',

        cJsTreePenalHide:'Common:JsTreePenal.hide',
    },

    // 树的 url 对象
    oTreeOption: {
        'core': {
            'animation': 0,
            'check_callback': true,

            'state': {'opened': true},
            'data': {
                'url': '/MapMonitor/SiteTree',
            }
        },
        'checkbox': {
            'tie_selection': false
        },
        'types': {
            'default': {
                'icon': 'icon-tree Ministries'
            },
            'Committee': {
                'icon': 'icon-tree Committee'
            },
            'Site': {
                'icon': 'icon-tree Site'
            },
            'Inpoint': {
                'icon': 'icon-tree Inpoint'
            },
            'SiteNow': {
                'icon': 'icon-tree SiteNow'
            },
            'InpointNow': {
                'icon': 'icon-tree InpointNow'
            },
            'SiteTemp': {
                'icon': 'icon-tree SiteTemp'
            },
            'Car': {
                'icon': 'icon-tree Car'
            },
            'User': {
                'icon': 'icon-tree Department'
            },

            // 行政区
            'District': {
                'icon': 'icon-tree District'
            },
            'GridGroup': {
                'icon': 'icon-tree GridGroup'
            },
            'RoadwayGroup': {
                'icon': 'icon-tree RoadwayGroup'
            },
            'RailGroup': {
                'icon': 'icon-tree RailGroup'
            },
            'POIGroup': {
                'icon': 'icon-tree POIGroup'
            },
            'BayonetGroup': {
                'icon': 'icon-tree BayonetGroup'
            },
            'Grid': {
                'icon': 'icon-tree Grid'
            },
            'Roadway': {
                'icon': 'icon-tree Roadway'
            },
            'Rail': {
                'icon': 'icon-tree Rail'
            },
            'POI': {
                'icon': 'icon-tree POI'
            },
            'Bayonet': {
                'icon': 'icon-tree Bayonet'
            },
        },
        'plugins': ['checkbox', 'types', 'search', 'state', 'unique']
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption, oTOption) {
        // 设置树的属性
        this.oTreeOption = oTOption;

        // 合并属性
        ES.setOptions(this, oOption);

        // 设置父节点
        this._oParent = oParent;

        // 整个页面通信容器
        this._oPage = oParent._oParent;

        this.$_oTreeContainer = null;
        this.$_oSearchInput = null;
        this.$_oSearchBtn = null;

        this.bCheck = true;

        if (typeof this.oOption.cDivContainerSel === 'object') {
            this.$_oPContainer = this.oOption.cDivContainerSel
        }
        else {
            this.$_oPContainer = $(this.oOption.cDivContainerSel);
        }

        this.initUI();

        // 初始化界面
        this.initOn();

        this.initSearchEvent();

        this.initTree();

    },



    // 移除绘制工地
    //removeDrawSite: function (oNode) {
    //    var anId = this.oPopTree.getSelfChildNode(oNode);
    //    this._oPage.fire('MV:Site.clearSites', {anId: anId});
    //},
    //
    //// 画选中的工地
    //drawCheckSite: function () {
    //    //获得所有的工地
    //    var anSiteId = this.oPopTree.getTreeCheckNode();
    //
    //    if (!anSiteId || anSiteId.length <= 0) {
    //        return;
    //    }
    //
    //    // 获得工地的GPS信息
    //    ES.getData({anSiteId: anSiteId}, ES.oConfig.cSiteInfoUrl, this.drawSite, this);
    //},
    //
    //// 画一个工地
    //drawOneSite: function (nSiteId) {
    //
    //    ES.getData({anSiteId: [nSiteId]}, ES.oConfig.cSiteInfoUrl, this.drawSite, this);
    //},



    // 根据id重新初始化树
    clearTree: function () {
        this.oPopTree.uncheckAll();

        this.initCheckHandler();
    },

    // 显示面板
    show: function () {
        this.$_oContainer.show();
        //this.$_oContainer.fadeIn(500);
    },

    // 隐藏面板
    hide: function () {
        this.$_oContainer.hide();
        //this.$_oContainer.fadeOut(500);
    },

    // 画工地,对地图图层集合操作
    drawSite: function (oData) {
        this._oPage.fire('MV:Site.setSiteData', {aoSiteInfo: oData});
    },

    // 初始化界面
    initOn: function () {

        // 内部面板监听
        this._oParent.on(this.oOption.cJsTreePenalShow, this.show, this);
        this._oParent.on(this.oOption.cJsTreePenalHide, this.hide, this);

        // 外部面板监听
        this._oPage.on("MapView:SiteStatic.Select", this.selectNode, this);

    },

    //selectNode: function (oData) {
    //    if (!this.oPopTree || !oData || !oData.anLst) {
    //        return;
    //    }
    //
    //    // 在树上找到id，选择
    //    this.oPopTree.uncheckAll();
    //
    //    if(oData.anLst<=0){
    //        return;
    //    }
    //
    //    var acItem = oData.anLst.map(function (nItem) {
    //        return 's' + nItem;
    //    });
    //    this.bCheck = false;
    //    this.oPopTree.setCheckNode(acItem);
    //    this.bCheck = true;
    //    this.drawCheckSite();
    //},

    // 获得外层容器的宽度
    getWidth: function () {

        return  this.$_oContainer.width();
    },

    initTreeTitle: function () {

        this.$_oContainer.find("a").each(function () {
            $(this).attr("title", $(this).text());
        })

    },

});

// ui面板
ES.Common.JsTreePenal.include({
    cUIConfig:
    '<div class="ex-layout-struckbox ex-theme-struckbox">' +
    '   <div class="ex-layout-struckbox-title ex-theme-struckbox-title"><h4 class="ec-align-left">工地地图</h4></div>' +
    '   <div>' +
    '       <div class="ex-layout-struckbox-wrap">' +
    '           <div class="ex-layout-struckbox-search">' +
    '               <div class="ec-input-group">' +
    '                   <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字">' +
    '                   <span class="ec-input-group-btn">' +
    '                       <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button">' +
    '                           <span class="ec-icon-search"></span>' +
    '                       </button>' +
    '                   </span>' +
    '               </div>' +
    '           </div>' +
    '           <div class="ex-layout-struckbox-content"> </div>' +
    '       </div>' +
    '   </div>' +
    '</div>',

    // 界面初始化
    initUI: function () {

        this.$_oContainer = $(this.cUIConfig);
        this.$_oPContainer.append(this.$_oContainer);

        this.$_oTreeContainer = this.$_oContainer.find('.ex-layout-struckbox-content');
        this.$_oSearchInput = this.$_oContainer.find('.ex-tree-search-ipt');
        this.$_oSearchBtn = this.$_oContainer.find('.ex-tree-search-btn');
        this.$_oContainer.find('h4').html(this.oOption.cTitle);


    },

    // 初始化查询事件
    initSearchEvent: function () {
        var self = this;
        // 注册查询事件
        this.$_oSearchBtn.bind('click', function () {
            if (!self.$_oTree) {
                return;
            }
            var cSearchVal = self.oSearchInput.val();
            // 触发查询
            self.$_oTree.search(cSearchVal, false, true);

        });

        // 注册键盘事件,防止查询刷屏
        var bTo = false;
        this.$_oSearchInput.keyup(function () {
            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {
                var cSearchVal = self.$_oSearchInput.val();
                self.$_oTree.search(cSearchVal, false, true);
            }, 250);
        });
    },
});

// 树的初始化
ES.Common.JsTreePenal.include({

    // 构建树
    initTree: function () {

        this.oTree = this.$_oTreeContainer.jstree(this.oTreeOption);

        this.$_oTree = this.$_oTreeContainer.jstree(true);

        this.initTreeEvent();

        this.initCheckEven();
    },

    // 初始化树的事件
    initTreeEvent: function () {
        this.oTree.on('ready.jstree', function (e, oThisNode) {
            if (!self.readyCallBack) {
                return;
            }
            self.readyCallBack(e, oThisNode);
        });

        this.oTree.on('after_open.jstree', function (e, oThisNode) {
            if (!self.afterOpen) {
                return;
            }
            self.afterOpen(e, oThisNode);
        });

        this.oTree.on('refresh.jstree', function (e, oThisNode) {
            if (!self.refreshCallBack) {
                return;
            }
            self.refreshCallBack(e, oThisNode);
        });

        this.oTree.on('select_node.jstree', function (e, oThisNode) {
            if (!self.selectCallBack) {
                return;
            }
            self.selectCallBack(e, oThisNode);
        });

        this.oTree.on("changed.jstree", function (e, oThisNode) {
            if (!self.changedCallBack) {
                return;
            }
            self.changedCallBack(e, oThisNode);
        });

        this.oTree.on("dblclick.jstree", function (e, oThisNode) {
            if (!self.dblclickCallBack) {
                return;
            }
            self.dblclickCallBack(e, oThisNode);
        });
    },

    // checkbox 相关的事件
    initCheckEven: function () {
        var self = this;
        if (!this.oTree) {
            return;
        }

        this.oTree.on('check_node.jstree', function (e, oThisNode) {
            if (!self.checkCallBack) {
                return;
            }
            self.checkCallBack(e, oThisNode);
        });

        // 取消 check 是的查询
        this.oTree.on('uncheck_node.jstree', function (e, oThisNode) {
            if (!self.uncheckCallBack) {
                return;
            }
            // 获得所有选中的数组
            self.uncheckCallBack(e, oThisNode);
        });

        // 选择所有节点触发
        this.oTree.on('check_all.jstree', function (e, oThisNode) {
            if (!self.checkAllCallBack) {
                return;
            }
            self.checkAllCallBack(e, oThisNode);
        });

        this.oTree.on('uncheck_all.jstree', function (e, oThisNode) {
            if (!self.uncheckAllCallBack) {
                return;
            }
            self.uncheckAllCallBack(e, oThisNode);
        });

    },

    /*
     * 树的节点操作
     * @cPrefix 树前缀，只返回树前缀数据
     * @bInClude true 表示包含前缀返回，false 不包含前缀返回
     * */
    getCheckId: function () {
        var cPrefix = this.oOption.cPrefix;
        var aoNodeId = this.$_oTree.get_checked();
        if (!aoNodeId || aoNodeId.length <= 0) {
            return [];
        }
        var acRtn = null;

        if (cPrefix) {
            acRtn = aoNodeId.map(function (cItem) {
                if (cItem.indexOf(cPrefix) === 0) {
                    return cItem;
                }
            });
        }
        else {
            acRtn = aoNodeId;
        }
        return acRtn;
    },


    // 获得自己和 孩子节点id
    getSelfChildId: function (oNode) {
        var acNodeId = [];
        if (!oNode) {
            return;
        }

        acNodeId.push(oNode.id);
        if (!oNode.children || oNode.children.length <= 0) {
            return acNode;
        }

        $.merge(acNodeId, oNode.children_d);
        var cPrefix = this.oOption.cPrefix;
        var acRtn = null;
        if (cPrefix) {
            acRtn = acNodeId.map(function (cItem) {
                if (cItem.indexOf(cPrefix) === 0) {
                    return cItem;
                }
            });
        }
        else {
            acRtn = acNodeId
        }

        return acRtn;
    },


    /*
     * 勾选回调函数
     * @cPrefix 树前缀，只返回树前缀数据
     * @bInClude true 表示包含前缀返回，false 不包含前缀返回
     * */
    checkCallBack: function (e, oNode) {
        this._oPage.fire(this.oOption.cCheckEventName,{acId:this.getCheckId()});
    },

    // 取消所有选择
    uncheckCallBack: function (e, oNode) {
        this._oPage.fire(this.oOption.cUncheckEventName,{acId:this.getSelfChildId()});
    },
});