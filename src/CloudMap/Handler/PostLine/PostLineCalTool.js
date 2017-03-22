/**
 * Created by liulin on 2017/3/22.
 */




ES.CloudMap.PostLineCalTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" ><i class="ec-icon-dot-circle-o"></i></button><p>取消</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this,oParent, options);

    },

    initUI: function () {
        this.$_oLi = $(this.cHtml);
    },

    // 绑定事件
    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.initOn.call(this);
        var self =this;
        this.$_oLi.find('button').bind('click', function () {
            self._oParent.fire('CloudMap:EditTool.calEdit');
            // 显示新增按钮
            self._oParent.addDrawToUI();
            self._oParent.clearLayers();
            self._oParent.oPenalPos.close();
        });
    },

});
