/**
 * Created by liulin on 2016/12/26.
 *
 * 负责管理整个界面的布局,如果有布局，就不用加载，直接加载地图
 *
 *
 */

ES.MapControl.Layout = ES.Class.extend({
    oUIConfig: {
        div: {
            'class': 'ex-layout-map-content',
            div: [
                {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left'},
                {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-right'},
                {'class': 'ex-layout-maptool ex-map-bottom ex-map-left'},
                {'class': 'ex-layout-maptool ex-theme-maptool ex-map-bottom ex-map-right'}
            ]
        }
    },

    oOption: {
        cContainerSel: '.ex-layout-content',
        cDidId: 'MapView',
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.$_oPContainer = oOption.cContainerSel;
        if (typeof oOption.cContainerSel !== 'object') {
            this.$_oPContainer = $(this.oOption.cContainerSel);
        }

        // 初始化界面
        this.initUI();

    },

    initUI: function () {
        this.$_oContainer = ES.getTag(this.oUIConfig);
        this.$_oContainer.attr({'id': this.oOption.cDidId});
        this.$_oPContainer.append(this.$_oContainer);
    },
});