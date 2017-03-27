/**
 * Created by liulin on 2016/12/23.
 *
 * 工地树
 */

ES.MapView.SiteTreeTemp = ES.Common.JsTree.extend({

    getTreeCheckNodes: function () {
        // 获得所有选中的数组
        var aoNodeId = this.$_oTree.get_checked();
        if (!aoNodeId || aoNodeId.length <= 0) return [];
        var anSiteId = [];
        // 获得所有选中的节点id,工地id
        for (var i = 0; i < aoNodeId.length; i++) {
            if (!aoNodeId[i]) continue;
            var oTemp = this.$_oTree.get_node(aoNodeId[i])
            //var nIndex = aoNodeId[i].indexOf("s");
            //if (nIndex < 0) {
            //    continue;
            //}

            anSiteId.push(oTemp);
        }
        if (!anSiteId || anSiteId.length <= 0) return [];
        return anSiteId;
    },

    getTreeCheckNode: function () {
        // 获得所有选中的数组
        var aoNodeId = this.$_oTree.get_checked();
        if (!aoNodeId || aoNodeId.length <= 0) return [];
        var anSiteId = [];
        // 获得所有选中的节点id,工地id
        for (var i = 0; i < aoNodeId.length; i++) {
            if (!aoNodeId[i]) continue;
            var nIndex = aoNodeId[i].indexOf("s");
            if(nIndex<0) {
                continue;
            }

            anSiteId.push(parseInt(aoNodeId[i].replace('s','')));
        }
        if (!anSiteId || anSiteId.length <= 0) return [];
        return anSiteId;
    },
    getTreeCheckNodeId: function () {
        // 获得所有选中的数组
        var aoNodeId = this.$_oTree.get_checked();
        if (!aoNodeId || aoNodeId.length <= 0) return [];
        var anSiteId = [];
        // 获得所有选中的节点id,工地id
        for (var i = 0; i < aoNodeId.length; i++) {
            if (!aoNodeId[i]) continue;
            anSiteId.push(aoNodeId[i]);
        }
        if (!anSiteId || anSiteId.length <= 0) return [];
        return anSiteId;
    },
    getSelfChildNode: function (oNode) {
        var anNode = [];
        if (!oNode) {
            return;
        }
        var nIndex = oNode.id.indexOf("s");
        if(nIndex>=0){
            anNode.push(parseInt(oNode.id.replace('s','')));
            return anNode;
        }

        if (!oNode.children || oNode.children.length <= 0) {
            return anNode;
        }

        for(var i =0;i< oNode.children_d.length;i++) {

            var nIndex = oNode.children_d[i].indexOf("s");
            if (nIndex < 0) {
                continue;
            }
            anNode.push(parseInt(oNode.children_d[i].replace('s', '')));
        }

        return anNode;
    },

});



ES.MapView.VehTreeTemp = ES.Common.JsTree.extend({

    getTreeCheckNode: function () {
        // 获得所有选中的数组
        var aoNodeId = this.$_oTree.get_checked();
        if (!aoNodeId || aoNodeId.length <= 0) return [];
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

    getSelfChildNode: function (oNode) {
        var anNode = [];
        if (!oNode) {
            return;
        }
        var nIndex = oNode.id.indexOf("s");
        if(nIndex>=0){
            anNode.push(oNode.id.replace('s',''));
            return anNode;
        }

        if (!oNode.children || oNode.children.length <= 0) {
            return anNode;
        }

        for(var i =0;i< oNode.children_d.length;i++) {

            var nIndex = oNode.children_d[i].indexOf("s");
            if (nIndex < 0) {
                continue;
            }
            anNode.push(oNode.children_d[i].replace('s', ''));
        }

        return anNode;
    },

});


ES.MapView.UserTreeTemp = ES.Common.JsTree.extend({

    getTreeCheckNode: function () {
        // 获得所有选中的数组
        var aoNodeId = this.$_oTree.get_checked();
        if (!aoNodeId || aoNodeId.length <= 0) return [];
        var anSiteId = [];
        // 获得所有选中的节点id,工地id
        for (var i = 0; i < aoNodeId.length; i++) {
            if (!aoNodeId[i]) continue;
            var oTemp = this.$_oTree.get_node(aoNodeId[i])
            //var nIndex = aoNodeId[i].indexOf("s");
            //if (nIndex < 0) {
            //    continue;
            //}

            anSiteId.push(parseInt(aoNodeId[i]));
        }
        if (!anSiteId || anSiteId.length <= 0) return [];
        return anSiteId;
    },

    getSelfChildNode: function (oNode) {
        var anNode = [];
        if (!oNode) {
            return;
        }
        var nIndex = oNode.id.indexOf("s");
        if (nIndex >= 0) {
            anNode.push(oNode.id.replace('s', ''));
            return anNode;
        }

        if (!oNode.children || oNode.children.length <= 0) {
            return anNode;
        }

        for (var i = 0; i < oNode.children_d.length; i++) {

            var nIndex = oNode.children_d[i].indexOf("s");
            if (nIndex < 0) {
                continue;
            }
            anNode.push(oNode.children_d[i].replace('s', ''));
        }

        return anNode;
    },

});