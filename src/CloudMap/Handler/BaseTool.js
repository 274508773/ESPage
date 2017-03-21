/**
 * Created by liulin on 2017/3/17.
 */


ES.CloudMap.BaseTool = ES.Evented.extend({

    addClass: function (cCls) {
        this.$_oLi.addClass(cCls);
    },

    removeClass: function (cCls) {
        this.$_oLi.removeClass(cCls);
    },

    // 绑定事件
    bandClick: function () {

    },
});