/**
 * Created by liulin on 2016/12/5.
 */


ES.Boss.BSearch = ES.Class.extend({

    oOption: {
        bIsShow: false,

        cSel: '.ex-layout-advSearch',

    },
    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);

        this.initUI();

        this._initOn();
    },

    _initOn: function () {
        this._oParent.on('BSearch.showSearch', this.showSearch, this);
    },

    initUI: function () {

        if (!this.oOption.bIsShow) {
            $(this.oOption.cSel).slideUp(500);
        }

    },

    showSearch: function () {
        $(this.oOption.cSel).slideToggle(500);
    }
});