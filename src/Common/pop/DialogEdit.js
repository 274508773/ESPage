/**
 * Created by liulin on 2016/12/6.
 */

// 新增修改角色
ES.Common.Pop.EditEntity = ES.Common.Pop.extend({

    // 注册事件
    initOn: function () {
        this._oParent.on(this._oParent.getEventName('cEdit'), this.editShow, this);
        this._oParent.on(this._oParent.getEventName('cAdd'), this.addShow, this);
    },

    // 加载html
    editShow: function (oData) {
        this.oBusData = oData.oModel;
        this.oDialog.title('编辑');

        this.oDialog.showModal();
    },

    addShow: function () {
        this.oBusData = null;
        this.oDialog.title('新增');
        this.oDialog.showModal();
    },

    initButton: function () {

        var self = this;

        var aoButton = [
            {
                value: '保存',
                callback: function () {
                    self.save();
                    return false;
                },
                autofocus: true
            }
        ];

        this.oOption.button = aoButton;
    },


    // 保存数据成功后回调
    saveHandler: function (oTemp) {
        ES.removeAn($(this.oDialog.node));
        var oData = oTemp.oData;
        var bAdd = false;
        if (!oTemp.nId) {
            bAdd = true;
        }

        if (oData && oData.IsSuccess) {
            ES.aSucess(bAdd ? ES.Common.Pop.Lang[10] : ES.Common.Pop.Lang[20]);
            // 刷新grid列表
            //this._oParent.fire(this._oParent.getEventName('cQuery'));
            // 刷新listview
            this._oParent.fire('ListView.reflesh');
            // 保存数据成功，触发事件
            this._oParent.fire('Edit:saveSuccess');

            this.oDialog.close();
        }
        else {
            ES.aErr(ES.template(bAdd ? ES.Common.Pop.Lang[21] : ES.Common.Pop.Lang[21], oData));
            this._oParent.fire('Edit:saveFail');
        }
    },
});

