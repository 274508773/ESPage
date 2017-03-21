/**
 * Created by exsun on 2017-01-10.
 */
ES.HGT.CloudMap.Layout = ES.Class.extend({
    oUIConfig: {
        div: [
            {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left tree-layout-map'},
        ]
    },

    oOption: {
        cContainerSel: '#MapView',
        //cDidId: 'MapView',
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.$_oPContainer = oOption.cContainerSel;
        if (typeof  oOption.cContainerSel !== 'object') {
            this.$_oPContainer = $(this.oOption.cContainerSel);
        }

        // 初始化界面
        this.initUI();

    },

    initUI: function () {
        this.$_oContainer = ES.initTag(this.$_oPContainer,this.oUIConfig);
        //this.$_oContainer.attr({'id': this.oOption.cDidId});
        //this.$_oPContainer.append(this.$_oContainer);
    },
});