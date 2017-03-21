/**
 * Created by liulin on 2016/11/29.
 *
 *
 * 对jstree 的操作
 *
 */


ES.Common.JsTree = ES.Evented.extend({

    oOption: {
        // 树使用的容器
        cSelecter: '.ex-layout-struckbox-wrap',
    },

    oTreeOption:{
        'core': {
            'animation': 0,
            'check_callback': true,

            'state': {'opened': true},
            'data': {
                'url': '/MapMonitor/SiteTree',
                //'data': function (node) {
                //    return {'id': node.id};
                //}
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
        'plugins':['checkbox', 'types', 'search', 'state', 'unique']
    },

    initialize: function (oParent, oOption, oTreeOption) {

        ES.extend(this.oTreeOption, oTreeOption);
        ES.setOptions(this,oOption);

        this._oParent = oParent;

        if (typeof  this.oOption.cSelecter === 'object') {

            this.$_oContainer = this.oOption.cSelecter;
        } else {
            this.$_oContainer = $(this.oOption.cSelecter);
        }

        // 初始化界面
        this.initTree();
        this.initEven();
        this.initOn();

    },

    //setCheck: function (bCheck) {
    //    this.$_oTree.settings.checkbox.tie_selection = bCheck;
    //},

    // 注册监听事件
    initOn: function () {
    },

    // 注册事件
    initEven: function () {
    },

    // 构建树
    initTree: function () {


        this.oTree = this.$_oContainer.jstree(this.oTreeOption);

        this.$_oTree = this.$_oContainer.jstree(true);

        this.initCheckEven();
    },

    // 获得自己和 孩子节点id
    getSelfChildNode: function (oNode) {
        var acNode = [];
        if (!oNode) {
            return;
        }

        acNode.push(oNode.id);
        if (!oNode.children || oNode.children.length <= 0) {
            return acNode;
        }

        $.merge(acNode, oNode.children_d);
        return acNode;
    },

    // 勾选节点回调函数
    checkCallBack: function () {

    },

    // 勾选节点回调函数
    uncheckCallBack: function () {

    },

    // 树加载完成回调函数
    readyCallBack: function () {

    },

    // 刷新树加载回调函数
    refreshCallBack: function () {

    },
    // 打开节点 回调函数
    afterOpen: function () {

    },

    // 选择节点回调函数  e, oThisNode
    selectCallBack: function () {
        
    },
    changedCallBack: function () {

    },

    dblclickCallBack: function () {

    },
    checkAllCallBack:function(){

    },
    uncheckAllCallBack: function () {

    },
    initCheckEven: function () {
        var self = this;
        if (!this.oTree) {
            return;
        }

        this.oTree.on('check_node.jstree', function (e, oThisNode) {
            self.checkCallBack(e, oThisNode);
        });

        // 取消 check 是的查询
        this.oTree.on('uncheck_node.jstree', function (e, oThisNode) {
            // 获得所有选中的数组
            self.uncheckCallBack(e, oThisNode);
        });
        // 选择所有节点触发
        this.oTree.on('check_all.jstree', function (e, oThisNode) {
            self.checkAllCallBack(e, oThisNode);
        });
        this.oTree.on('uncheck_all.jstree', function (e, oThisNode) {
            self.uncheckAllCallBack(e, oThisNode);
        });

        this.oTree.on('ready.jstree', function (e, oThisNode) {
            self.readyCallBack(e, oThisNode);
        });

        this.oTree.on('after_open.jstree', function (e, oThisNode) {
            self.afterOpen(e, oThisNode);
        });

        this.oTree.on('refresh.jstree', function (e, oThisNode) {
            self.refreshCallBack(e, oThisNode);
        });

        this.oTree.on('select_node.jstree', function (e, oThisNode) {
            self.selectCallBack(e, oThisNode);
        });

        this.oTree.on("changed.jstree", function (e, oThisNode) {
            self.changedCallBack(e, oThisNode);
        });

        this.oTree.on("dblclick.jstree", function (e, oThisNode) {
            self.dblclickCallBack(e, oThisNode);
        });
        //this.oTree.on('loaded.jstree', function (e, data) {
        //    var inst = data.instance;
        //    var obj = inst.get_node(e.target.firstChild.firstChild.lastChild);
        //    inst.select_node(obj);
        //});
    },

    // 获得所有check 的节点数据
    getTreeCheckNode: function () {
        // 获得所有选中的数组
        var aoNodeId = this.$_oTree.get_checked();
        if (!aoNodeId || aoNodeId.length <= 0) {
            return [];
        }
        var anSiteId = [];
        // 获得所有选中的节点id,工地id
        for (var i = 0; i < aoNodeId.length; i++) {
            if (!aoNodeId[i]) {
                continue;
            }


            anSiteId.push(parseInt(aoNodeId[i]));
        }
        if (!anSiteId || anSiteId.length <= 0) {
            return [];
        }
        return anSiteId;
    },

    // 获得选中的叶子节点
    getLeafCheckNode: function () {

        var aoNodeId = this.$_oTree.get_bottom_checked();
        if (!aoNodeId || aoNodeId.length <= 0) {
            return [];
        }
        var anSiteId = [];
        // 获得所有选中的节点id,工地id
        for (var i = 0; i < aoNodeId.length; i++) {
            if (!aoNodeId[i]) {
                continue;
            }


            anSiteId.push(parseInt(aoNodeId[i]));
        }
        if (!anSiteId || anSiteId.length <= 0) {
            return [];
        }
        return anSiteId;
    },

    // 设置叶子节点为check，参数为叶子节点id
    setCheckNode: function (anData) {
        if (!anData || anData.length <= 0) {
            return;
        }
        for (var i = 0; i < anData.length; i++) {
            this.$_oTree.check_node(this.$_oTree.get_node(anData[i]));
        }
    },

    uncheckAll: function () {
        if (!this.$_oTree) {
            return;
        }
        if (!this.$_oTree.uncheck_all) {
            return;
        }
        this.$_oTree.uncheck_all();
    },

    checkAll: function () {
        if (!this.$_oTree) {
            return;
        }
        if (!this.$_oTree.check_all) {
            return;
        }
        this.$_oTree.check_all();
    },

    // 读后台的数据，让 checkbox 选中
    initCheck: function (anPerm) {
        if (!anPerm || anPerm.length <= 0) {
            return;
        }
        if ($.inArray('checkbox', this.oOption.acPlugin) >= 0){
            this.oPopTree.setCheckNode(anPerm);
        }
    },

});


