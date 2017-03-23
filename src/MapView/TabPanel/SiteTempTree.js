/**
 * Created by liulin on 2017/1/2.
 *
 * 临时工地
 */


ES.MapView.TabPanel.SiteTempTree = ES.MapView.TabPanel.SiteTree.extend({

    drawSite: function (oData) {
        this._oPage.fire('MV:SiteTemp.setSiteData', { aoSiteInfo: oData });
    },
    removeDrawSite:function(oNode) {
        var anId = this.oPopTree.getSelfChildNode(oNode);
        this._oPage.fire('MV:SiteTemp.clearSites', { anId: anId });
    },
});