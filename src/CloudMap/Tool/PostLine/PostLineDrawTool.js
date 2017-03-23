/**
 * Created by liulin on 2017/3/20.
 */


ES.CloudMap.PostLineDrawTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" data-object="0" ><i class="ec-icon-dot-circle-o"></i></button><p>画邮路</p></li>',

    // 构造函数
    initialize: function (oParent, options) {

        ES.CloudMap.BaseTool.prototype.initialize.call(this,oParent, options);

    },



    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.bandClick.call(this);
        var self =this;
        this.$_oLi.find('button').bind('click', function () {
            self._oParent.oPenalPos.show();

        });
    },


});
