/**
 * Created by liulin on 2017/3/17.
 *
 */

ES.CloudMap.DeleteTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" ><i class="ec-icon-dot-circle-o"></i></button><p>删除</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this,oParent, options);
    },


    // 绑定事件
    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.bandClick.call(this);

        var self = this;
        this.$_oLi.find('button').bind('click', function () {
            // 获得数据
            var aoLayer = self._oParent.getLayer();
            if (!aoLayer || aoLayer.length <= 0) {
                ES.aWarn('没有可以删除的数据');
                return;
            }
            self._oParent.fire('CloudMap:DelCloudMap.del', {oModel: aoLayer[0].oBusData});
        });
    },

});