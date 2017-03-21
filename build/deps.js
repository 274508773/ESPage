var deps = {

	Core: {
		src: [
			'ES.js'
		],
		desc: 'The core of the plugin. Currently only includes the version.'
	},

	CoreDeps: {
		src: [
			'Core/Util.js',
			'Core/Class.js',
			'Core/Events.js',
			'Core/Handler.js',
			'Core/Page.js',
			'Core/Lang.js',
			'Core/CoordTrans.js',
		],
		desc: 'Core.',
		deps: ['Core']
	},



	Lang:{
		src: [
			'Language/ES.ZH-CN.js',
		],
		desc: 'Language.',
		deps: ['Core']

	},

	Unit: {
		src: [
			'Unit/HubSvr.js',
			'Unit/Timer.js',
		],
		desc: 'Core.',
		deps: ['CoreDeps','Lang']
	},

	ESMapTool:{
		src: [
			'ESMapTool/ControlConfig.js',
			'ESMapTool/Layout.js',
			'ESMapTool/es_tool_new/MapEdit.js',
			'ESMapTool/es_tool_new/PopMapEdit.js',
			'ESMapTool/es_tool_new/MapFull.js',
			'ESMapTool/es_tool_new/MapTile.js',
			'ESMapTool/es_tool_new/MapToolArea.js',
			'ESMapTool/es_tool_new/MapToolBox.js',
			'ESMapTool/es_tool_new/MapSearch.js'
		],
		desc: '渣土车2.0版本用的地图控件',
		deps: ['Core','CoreDeps']
	},

	Common:{
		src: [
			'Common/Common.js',
			'Common/grid/dtGrid.js',
			'Common/pop/Dialog.js',
			'Common/pop/DialogDel.js',
			'Common/pop/DialogEdit.js',
			'Common/tree/JsTree.js',
			'Common/pop/DialogTree.js',
			'Common/pop/DialogTreeGrid.js',
			'Common/Grid/jqGrid.js',
			'Common/ListView/ListView.js',
			'Common/Map/MapJs.js',

			'Common/SelectTree/SelectTree.js',
			'Common/SelectTree/SelectTreeNode.js'
		],
		desc: 'Boss.',
		deps: ['Unit','Lang']

	},

	MuckOperat:{

		src: [
			'MuckOperat/MuckOperat.js',
		],
		desc: 'MuckOperat.',
		deps: ['Unit']
	},

	MapMonitor:{
		src: [
			'MuckOperat/MapMonitor/MonitorPage.js',
			'MuckOperat/MapMonitor/HeadTab.js',
			'MuckOperat/MapMonitor/MapView.js',
			'MuckOperat/MapMonitor/MapMonitor.js',
		],
		desc: 'MuckOperat.',
		deps: ['MuckOperat']
	},

	Boss:{

		src: [
			'Boss/Boss.js',
			'Boss/BossConfig.js',
			'Boss/BestSearch/BSearch.js',
		],
		desc: 'Boss.',
		deps: ['Unit','Lang','Common']
	},

	HGT_MapView:{

		src: [

			'HGT/HGTConfig.js',
			'HGT/MapView/MapView.js',
			// hub 定义
			'HGT/HubSvr/hubSvr.js',
			'HGT/MapView/Menu.js',
			// 小部分 右边小部分
			'HGT/MapView/TabPanel/TabPanel.js',
			'HGT/MapView/TabPanel/JsTreeEx.js',
			'HGT/MapView/TabPanel/SiteTree.js',
			'HGT/MapView/TabPanel/VideoTree.js',
			//临时工地
			'HGT/MapView/TabPanel/SiteTempTree.js',
			// 设备树控制
			'HGT/MapView/TabPanel/VehTree.js',
			// 人员树控制
			'HGT/MapView/TabPanel/UserTree.js',
			// 路网树控制
			'HGT/MapView/TabPanel/LineTree.js',

			// 车辆列表和分页控件
			'HGT/MapView/TabPanel/ListView/LstPager.js',
			'HGT/MapView/TabPanel/ListView/VehLst.js',
			'HGT/MapView/TabPanel/ListView/UserLst.js',

			// 地图基础控件
			'HGT/MapView/PageContent/Layout.js',
			'HGT/MapView/PageContent/AlarmCtrl.js',
			'HGT/MapView/PageContent/PopSubAlarmType.js',


			'HGT/MapView/Box/ReceiveAlarm.js',
			'HGT/MapView/Box/VehInOut.js',
			'HGT/MapView/Box/SiteStatic.js',
			//'HGT/MapView/Box/PopMarkerInfo.js',
			'HGT/MapView/Box/PopSiteInfo.js',
			// 图层管理
			// 工地图层
			'HGT/MapView/Layer/SiteLayer.js',
			// 边界图层
			'HGT/MapView/Layer/RegionBoundLayer.js',
			// 云图图层
			'HGT/MapView/Layer/CloudLayer.js',

			'HGT/MapView/Layer/VehRealTrack/LiveMange.js',
			'HGT/MapView/Layer/VehRealTrack/MapLive.js',

			'HGT/MapView/Layer/UserRealTrack/LiveMange.js',
			'HGT/MapView/Layer/UserRealTrack/MapLive.js',
			'HGT/MapView/Layer/UserRealTrack/UserLayer.js',

			// 图层管理
			'HGT/MapView/PopTabPage/TabPage.js',
			'HGT/MapView/VideTabPanel.js',

			// 视频监控
			'HGT/MapView/Video/VideoBox.js',

			// 数据请求
			'HGT/MapView/ReqTrack/ReqTrack.js',



			// 概览页面管理
			'HGT/OverView/OverView.js',
			'HGT/OverView/Header.js',
			'HGT/OverView/Region.js',
			'HGT/OverView/TodayStatic.js',
			'HGT/OverView/YesdayStatic.js',


			// 概览页面的图表操作
			'HGT/OverView/chart/BaseChart.js',
			'HGT/OverView/chart/AlarmStaticChart.js',
			'HGT/OverView/chart/DataStaticChart.js',
			'HGT/OverView/chart/CuteStaticChart.js',
			 // 当日违规统计
			'HGT/OverView/chart/DayAlarmStaticChart.js',


			// 云图的做法
			'HGT/CloudMap/CloudMap.js',
			'HGT/CloudMap/EditTool.js',
			'HGT/CloudMap/TagTree.js',
			'HGT/CloudMap/CloudMapLayout.js',
			'HGT/CloudMap/TreeFrame.js',
			'HGT/CloudMap/PopWnd/PopWnd.js',
			'HGT/CloudMap/PopWnd/PopDel.js',
			'HGT/CloudMap/ShowLayer.js',
			// 考核配置
			'HGT/EventConfig/EventConfig.js',
			'HGT/EventConfig/Menu.js',
			'HGT/EventConfig/Grid.js',
		],

		desc: 'HGT 作为基础来包装地图实时监控, 概览页面',
		deps: ['Unit','Lang','ESTool','Common']
	},


};


// 编译环境，可以多个文件一起生成
// 分
var oHgt = {

	//历史轨迹部分
	VehHisTrack:{
		Core:{
			Link:[''],
			desc:'这个是历史轨迹所依赖关系文件'

		},

		Track:{


		}

	},



};


if (typeof exports !== 'undefined') {
	exports.deps = deps;

	// 红谷滩的编译环境
	exports.oHgt = oHgt;
}
