/**
 * 红谷滩编译 文件
 *
 * Created by liulin on 2016/12/22.
 */


var deps = {

	Core: {
		src: [
			'HGT/HGTConfig.js',
		],
		desc: '版权说明文件.'
	},


	CloudMap: {
		src: [
			// 云图的做法
			'CloudMap/CloudMap.js',
			'CloudMap/Layout.js',
			'CloudMap/EditTool.js',
			'CloudMap/TagTree.js',

			'CloudMap/TreeFrame.js',
			'CloudMap/PopWnd.js',
			'CloudMap/PopDel.js',
			'CloudMap/ShowLayer.js',

			'CloudMap/Handler/BaseTool.js',
			'CloudMap/Handler/CalEditTool.js',
			'CloudMap/Handler/DeleteTool.js',
			'CloudMap/Handler/EditTool.js',
			'CloudMap/Handler/DrawMarker.js',
			'CloudMap/Handler/SaveTool.js',

			'CloudMap/MenuTool.js',
			'CloudMap/PostPopWnd/PostPosWnd.js',
			'CloudMap/MenuItem/PostPos.js',
		],

		desc: 'HGT 作为基础来包装地图实时监控, 概览页面',
		deps: ['Core']

	},



	CloudMapForPO: {
		src: [
			'CloudMap/MenuItem/PostLine.js',
			'CloudMap/Handler/PostLine/PostLineEditTool.js',
			'CloudMap/PO/CreatePos.js',
			'CloudMap/Handler/PostLine/PostLineDrawTool.js',
			'CloudMap/PostPopWnd/PostLineWnd.js',

			'CloudMap/TreePenal/LineTree.js',
			//'CloudMap/PO/TagTree.js',
			//'CloudMap/PO/TreeFrame.js',
			//'CloudMap/PO/PostPosLayer.js',

		],
		desc: 'PO 邮局项目',
		deps: ['CloudMap']
	},
};




if (typeof exports !== 'undefined') {
	exports.deps = deps;

}
