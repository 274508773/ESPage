/**
 * Created by liulin on 2016/11/29.
 *
 * 弹出层
 *
 */

ES.Common.Pop = ES.Evented.extend({

    oOption: {
        fixed: true,
        align: 'right bottom',
        title: 'title',
        content: '',
        //width: 500,

        cancel: function () {
            this.close();
            return false;
        },
        //cTreeUrl
    },

    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);

        this.initButton();

        this.initDialog();

        // 注册监听事件
        this.initOn();

        // 监听窗体事件
        this.initEvent();
    },

    // 接口
    initOn: function () {
        //this._oParent.on('fire');
    },

    // 初始化窗体
    initDialog: function () {
        var oDiaLog = dialog(this.oOption);

        this.oDialog = oDiaLog;

        return oDiaLog;
    },


    // 初始化 button
    initButton: function () {

        var aoButton = [
            {
                value: '同意',
                callback: function () {
                    this.content('你同意了');
                    return false;
                },
                autofocus: true
            },
            {
                value: '不同意',
                callback: function () {

                }
            },
            {
                id: 'button-disabled',
                value: '无效按钮',
                disabled: true
            },
            {
                value: '关闭我'
            }
        ];

        if (aoButton) {

            this.oOption.button = aoButton;
        }
        else {
            this.oOption.button = [];
        }

    },

    // 注册窗体事件
    initEvent: function () {
        if (!this.oDialog) {
            return;
        }
        var self = this;
        this.oDialog.addEventListener('show', function () {
            self.afterOpen();
        });

        this.oDialog.addEventListener('close', function () {
            self.afterClose();
        });
    },

    // 打开后执行事件
    afterOpen: function () {

    },

    // 关闭事件
    afterClose: function () {

    },

    showModal: function (oData) {
        //this.oBusData = oData.oModel;
        //this.oDialog.title(ES.Lang.Boss[4]);
        this.oDialog.showModal();
    },

    // 内容赋值后，需要重新设置事件
    setContent: function (cHTML) {

        this.oDialog.content(cHTML);

        return this;
    },

    hideDefaultButton: function () {
        this.oDialog._$('footer').hide();
    },

});






