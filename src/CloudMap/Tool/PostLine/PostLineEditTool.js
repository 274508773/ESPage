/**
 * Created by liulin on 2017/3/20.
 */

ES.CloudMap.PostLineEditTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" ><i class="ec-icon-dot-circle-o"></i></button><p>编辑</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this,oParent, options);

    },


    // 绑定事件
    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.initOn.call(this);
        var self =this;
        this.$_oLi.find('button').bind('click', function () {
            self._oParent.oPenalPos.show();

        });
    },


    // 可以把编辑的功能包装在这里

});