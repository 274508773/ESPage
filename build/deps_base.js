/**
 * 红谷滩编译 文件
 *
 * Created by liulin on 2016/12/22.
 */


var deps = {

	Core: {
		src: [
			'ES.js'
		],
		desc: '版权说明文件.'
	},

	CoreDeps: {
		src: [
			'Core/Lang.js',
			'Core/Util.js',
			'Core/Class.js',
			'Core/Events.js',
			'Core/Handler.js',
			'Core/Page.js',
			'Core/CoordTrans.js',
		],
		desc: '内核文件,所有的基础文件',
		deps: ['Core']
	},

	Unit: {
		src: [
			'Unit/Lang.js',
			'Unit/HubSvr.js',
			'Unit/Timer.js',
		],
		desc: '不可见的组件，如定时器、hub组件.',
		deps: ['CoreDeps']
	},

	ESMapTool:{
		src: [
			'MapControl/ControlConfig.js',
			'MapControl/Layout.js',
			'MapControl/es_tool_new/MapEdit.js',
			'MapControl/es_tool_new/PopMapEdit.js',
			'MapControl/es_tool_new/MapFull.js',
			'MapControl/es_tool_new/MapTile.js',
			'MapControl/es_tool_new/MapToolArea.js',
			'MapControl/es_tool_new/MapToolBox.js',
			'MapControl/es_tool_new/MapSearch.js',
			'MapControl/es_tool_new/MapEditPos.js',
		],
		desc: '地图操作工具控件,地图放大、缩小、编辑',
		deps: ['CoreDeps']
	},

	// 控件基础
	CommonDialog:{
		src: [


			'Common/Dialog/Dialog.js',

		],
		desc: '界面UI操作控件基础， dialog、封装',
		deps: ['CoreDeps']

	},

	// 控件基础
	CommonGrid:{
		src: [

			'Common/Grid/dtGrid.js',
			'Common/Grid/jqGrid.js',

		],
		desc: '界面UI操作控件基础，grid 封装、 ',
		deps: ['CoreDeps']

	},

	// 控件基础
	CommonListView:{
		src: [
			'Common/ListView/ListView.js',
		],
		desc: '界面UI操作控件基础，ListView 封装',
		deps: ['CoreDeps']

	},

	// 控件基础
	CommonTree:{
		src: [
			'Common/Tree/JsTree.js',
			'Common/Tree/SelectTree.js',
			'Common/Tree/SelectTreeNode.js'
		],
		desc: '界面UI操作控件基础，tree 封装',
		deps: ['CoreDeps']

	},

	// 弹出层组件
	CommonPop:{
		src: [
			'Common/pop/Lang.js',
			'Common/pop/DialogDel.js',
			'Common/pop/DialogEdit.js',
			'Common/pop/DialogTree.js',
			'Common/pop/DialogTreeGrid.js',

		],
		desc: '界面UI操作控件',
		deps: ['CommonDialog','CommonTree','CommonListView','CommonGrid']

	},

	// 弹出层组件
	CommonPopMap:{
		src: [
			'Common/pop/MapJs.js',
			'Common/pop/MapMarkerSelect.js',
		],
		desc: '界面UI操作控件',
		deps: ['CommonDialog']

	},

};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}
