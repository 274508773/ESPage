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
			'CloudMap/TreePenal/PosTree.js',

			'CloudMap/TreeFrame.js',
			'CloudMap/PopWnd.js',
			'CloudMap/PopDel.js',
			'CloudMap/ShowLayer.js',

			'CloudMap/Handler/BaseTool.js',
			'CloudMap/Handler/CalEditTool.js',
			'CloudMap/Handler/DeleteTool.js',
			'CloudMap/Handler/EditTool.js',
			'CloudMap/Handler/DrawMarkerTool.js',
			'CloudMap/Handler/SaveTool.js',

			'CloudMap/MenuTool.js',
			'CloudMap/PostPopWnd/PostPosWnd.js',
			'CloudMap/MenuItem/BaseMenu.js',
			'CloudMap/MenuItem/PostPosMenu.js',
		],

		desc: 'HGT 作为基础来包装地图实时监控, 概览页面',
		deps: ['Core']

	},



	CloudMapForPO: {
		src: [
			'CloudMap/MenuItem/PostLineMenu.js',
			'CloudMap/Handler/PostLine/PostLineEditTool.js',
			'CloudMap/Handler/PostLine/PostLineCalTool.js',
			'CloudMap/TreePenal/CreatePos.js',
			'CloudMap/Handler/PostLine/PostLineDrawTool.js',
			'CloudMap/PostPopWnd/PostLineWnd.js',
			'CloudMap/PostPopWnd/PostLineDelWnd.js',
			'CloudMap/TreePenal/LineTree.js',


		],
		desc: 'PO 邮局项目',
		deps: ['CloudMap']
	},
};




if (typeof exports !== 'undefined') {
	exports.deps = deps;

}
