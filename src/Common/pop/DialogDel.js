/**
 * Created by liulin on 2016/12/6.
 */


ES.Common.Pop.DelEntity = ES.Common.Pop.extend({

    // 注册事件
    initOn: function () {
        this._oParent.on(this._oParent.getEventName('cDel'), this.del, this);
    },

    // 加载html
    del: function (oData) {
        this.oBusData = oData.oModel;
        this.oDialog.showModal();
    },

    initButton: function () {

        var self = this;
        var aoButton = [
            {
                value: ES.Common.Pop.Lang[1],
                callback: function () {
                    self.save();
                    return false;
                },
                autofocus: true
            }
        ];
        this.oOption.button = aoButton;

    },

    // 保存数据
    save: function () {
        if (!this.oBusData) {
            ES.aWarn(ES.Common.Pop.Lang[30]);
            return;
        }

        ES.loadAn($(this.oDialog.node));


        ES.getData(this.oBusData, this.oOption.cUrl, this.saveHandler, this);
    },

    saveHandler: function (oData) {
        ES.removeAn($(this.oDialog.node));

        if (oData && oData.IsSuccess) {
            ES.aSucess(ES.Common.Pop.Lang[32]);


            if(this._oParent.getEventName){
                this._oParent.fire(this._oParent.getEventName('cQuery'));
            }

            this._oParent.fire('ListView.reflesh');
        }
        else {
            ES.aErr(ES.template(ES.Common.Pop.Lang[33], oData));
        }


        this.oDialog.close();
    },
});