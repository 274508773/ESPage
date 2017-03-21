/**
 * Created by liulin on 2017/3/17.
 */


ES.CloudMap.BaseTool = ES.Evented.extend({

    addClass: function (cCls) {
        this.$_oLi.find('button').addClass(cCls);
    },

    removeClass: function (cCls) {
        this.$_oLi.find('button').removeClass(cCls);
    },

    removeActive: function () {
        this.$_oLi.find('button').removeClass('ec-active');
    },

    // 获得兄弟

    // 绑定事件
    bandClick: function () {

    },
});