/**
 * Created by liulin on 2016/11/24.
 *
 * Boss js
 *
 * name：        Boss.js
 *
 * author:      LIULIN
 * date:        2016-11-24
 *
 */


ES.Boss = {};

ES.Boss.vertion = '0.1.1';


ES.Page.Entity = ES.Page.extend({

    oOption: {
        cAddSel: 'div.ec-text-center > a',
        // 快速 查询按钮
        cQBtnSel: 'div.ex-title-search-sm>.ec-form-group>.ec-input-group-btn>button',
        // 快速 查询文本框
        cQTxtSel: 'div.ex-title-search-sm>.ec-form-group>input.ex-title-search',

        cBtnSel: '.ex-btn-advSearch',

        bIsBSearch: false,

        cFlag: '角色',


    },

    // 窗体事件
    oEventNameTemp: {
        cDel: 'Pop:Del',
        cQuery: 'DtGrid.query',
        cAdd: 'EditEntity.addShow',
        cEdit: 'EditEntity.editShow',
        cBSearch: 'BSearch.showSearch'
    },

    getEventName: function (cKey) {
        if (this.oEventName[cKey]) {
            return this.oEventName[cKey];
        }

        return 'event:undefined';
    },


    initialize: function (id, oOption) {
        ES.Page.prototype.initialize.call(this, id, oOption);
        this.oEventName = {};

        ES.extend(this.oEventName, this.oEventNameTemp, oOption.oEventName);
        // 页面的中文标志
        this.cFlag = this.oOption.cFlag;

    },

    initLayout: function () {
        if (this.oOption.bIsBSearch) {
            $(this.oOption.cBtnSel).show();
        } else {
            $(this.oOption.cBtnSel).hide();
        }
    },

    initEvent: function () {
        var self = this;

        // 注册页面添加事件
        $(this.oOption.cAddSel).bind('click', function () {
            self.fire(self.getEventName('cAdd'));
        });

        // 注册页面快速查询事件
        $(this.oOption.cQBtnSel).bind('click', function () {
            self.fire(self.getEventName('cQuery'), {oParam: {Name: $(self.oOption.cQTxtSel).val()}});
        });

        $(this.oOption.cBtnSel).on('click', function () {
            self.fire(self.getEventName('cBSearch'));
        });

        var bTo = false;
        var oQtxtSel = $(self.oOption.cQTxtSel);
        oQtxtSel.keyup(function () {
            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {
                self.fire(self.getEventName('cQuery'), {oParam: {Name: oQtxtSel.val()}});
            }, 250);
        });
    },
});