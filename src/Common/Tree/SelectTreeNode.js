/**
 * Created by liulin on 2017/1/18.
 */

ES.Common.SelectTreeNode = ES.Common.SelectTree.extend({
    // 注册单选事件
    initSelectNode: function () {
        //var self = this;
        //this.oTreeContainer.find('i.Department').parent().parent().each(function () {
        //    var oCheck = $('  <a>选择</a>');
        //
        //    $(this).append(oCheck);
        //    oCheck.bind('click', function (e) {
        //        var node = self.oPopTree.$_oTree.get_node(e.target);
        //        self.fire('selectVal', { cVal:node.text,cId: node.id});
        //    });
        //
        //});
    },


    InitTree: function () {
        var self = this;
        if (!this.oPopTree) {
            this.oPopTree = new ES.Common.JsTree(this._oParent, {
                cSelecter: this.oTreeContainer,
                cCheckUrl:this.oOption.cCheckUrl
            }, this.oTOption);

            this.oPopTree.readyCallBack = function () {
                //self.initSelectNode();
            };

            this.oPopTree.refreshCallBack = function () {
                //self.clearTree();
                //this.oSelectTree.on('selectVal',  this.setVal,this)
            };
            this.oPopTree.selectCallBack = function (e, oThisNode) {
                var node =oThisNode.node;// self.oPopTree.$_oTree.get_node(e.target);
                self.fire('selectVal',node);
            };
            //this.oPopTree.selectCallBack = function () {
            //    //触发查询
            //}
        } else {
            //self.oPopTree.$_oTree.settings.core.data.url = ES.template(this.oTOption.cTreeUrl, this.oBusData);
            //self.oPopTree.$_oTree.refresh();
        }
    },

})