/**
 * Created by exsun on 2017-01-09.
 *
 * 选择特定的节点 并负责
 *
 *
 */



ES.Common.SelectTree = ES.Evented.extend({

    oOption: {
        // 树的ur
        cUrl: '',
        // 弹出层容器
        cBandSel: '',

        cCheckUrl: '',
        // 树节点容器
        cTreeContainerSel: '.ex-tree-dom',
        // 查询框容器
        cSearchInputSel: '.ex-tree-search-ipt',
        // 查询btn容器
        cSearchBtnSel: '.ex-tree-search-btn',
        // 监听事件，对外接口
        cEventName: 'cPermission',

        // 寻找节点的样式，叶子节点的样式
        cSelCls:'GridGroup',
    },

    cHtml:
    '<div class="ex-tree-select">' +
    '   <div class="ec-input-group">' +
    '       <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字">' +
    '       <span class="ec-input-group-btn">' +
    '       <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button">' +
    '           <span class="ec-icon-search"></span>' +
    '       </button>' +
    '       </span>' +
    '   </div>' +
    '   <div class="ex-layout-struckbox-content ex-tree-dom"></div>' +
    '</div>',

    cHtmlCover:'<div class="ex-cover-tree-select" style="position: fixed; z-index: 1900; width:1000000px; height: 1000000px; top: -100000px; left: -100000px; display: block;"></div>',

    oTreeOption: {
        // 树的url
        //cTreeUrl: '',
        // 树所用的插件
        //acPlugin: ['checkbox', 'types', 'search', 'state', 'unique'],
        // 树的check数据来源
    },

    initialize: function (oParent, oOption, oTOption) {

        this.oTOption = {};
        ES.extend(this.oTOption, this.oTreeOption, oTOption);
        ES.setOptions(this,oOption);

        if(typeof this.oOption.cBandSel === 'object'){
            this.$_oBandContainer = this.oOption.cBandSel;
        }
        else {
            this.$_oBandContainer = $(this.oOption.cBandSel);
        }
        this.initObj();
        this.initEvent();

        this.oPopTree = null;
        this.oTreeContainer = null;
        this.oSearchInput = null;
        this.oSearvhBtn = null;

        this.bIn =false;
    },


    initOn: function () {
        var cEventName = this.oOption.cEventName;
        this._oParent.on(this._oParent.getEventName(cEventName), this.Show, this);
    },

    initObj: function () {
        // 选择树容器
        this.oTreeObj = $('<div cId="ex-common-select-tree">' + this.cHtml + '</div>');
        // 树的遮罩层
        this.$_oCover =  $(this.cHtmlCover);

    },

    initInEvent: function () {
        //var self = this;

        this.$_oCover.on('click',function(){
            $(this).siblings('div').hide();
            $(this).hide();
        });

    },

    initEvent: function () {
        var self = this;

        this.$_oBandContainer.bind('click focus', function (e) {
            var oObj = $(this).parent().find('div[cId="ex-common-select-tree"]');
            if (oObj && oObj.length > 0) {
                self.oTreeObj.show();

                $('.ex-cover-tree-select').show();
            }
            else {

                $(this).after(self.oTreeObj);
                $(this).after(self.$_oCover);
                //$(this).parent().append(self.oTreeObj);
                self.oTreeContainer = self.oTreeObj.find(self.oOption.cTreeContainerSel);
                self.oSearchInput = self.oTreeObj.find(self.oOption.cSearchInputSel);
                self.oSearvhBtn = self.oTreeObj.find(self.oOption.cSearchBtnSel);
                self.initSearchEvent();
                self.InitTree();
            }
            self.initInEvent();
        });
    },

});

// 注册查询事件
ES.Common.SelectTree.include({

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
            this.oPopTree = new ES.Common.JsTree(this._oParent, {
                cSelecter: this.oTreeContainer,
                cCheckUrl:this.oOption.cCheckUrl
            }, this.oTOption);

            this.oPopTree.readyCallBack = function () {
                self.initSelectNode();
            };

            this.oPopTree.afterOpen = function () {
                self.initSelectNode();
            };

            this.oPopTree.refreshCallBack = function () {
                //self.clearTree();
                //this.oSelectTree.on('selectVal',  this.setVal,this)
            };
            this.oPopTree.selectCallBack = function (e, oThisNode) {
                //var node =oThisNode.node;// self.oPopTree.$_oTree.get_node(e.target);
                //self.fire('selectVal', { cVal:node.text,cId: node.id});
            };
            //this.oPopTree.selectCallBack = function () {
            //    //触发查询
            //}
        } else {
            //self.oPopTree.$_oTree.settings.core.data.url = ES.template(this.oTOption.cTreeUrl, this.oBusData);
            //self.oPopTree.$_oTree.refresh();

        }
    },

    // 注册单选事件
    initSelectNode: function () {
        var self = this;
        this.oTreeContainer.find('i.'+this.oOption.cSelCls).parent().parent().each(function () {
            var oInput = $(this).find('input[cId="selectNode"]');
            if(oInput && oInput.length>0){
                return;
            }

            var oRadio = $('<input type="radio" name = "'+self.oOption.cSelCls+'" style="vertical-align: sub;" cId="selectNode"  ></input>');
            $(this).find('a').prepend(oRadio);
            $(this).find('a').bind('click', function (e) {
                var node = self.oPopTree.$_oTree.get_node(e.target);
                self.fire('selectVal', { cVal:node.text,cId: node.id});
            })


        });
    },
});