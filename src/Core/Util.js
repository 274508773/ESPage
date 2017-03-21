/*
 * @namespace Util
 *
 * Various utility functions, used by Leaflet internally.
 */

ES.Util = {

	// @function extend(dest: Object, src?: Object): Object
	// Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter. Has an `ES.extend` shortcut.
	extend: function (dest) {
		var i, j, len, src;
		dest = dest || {};

		for (j = 1, len = arguments.length; j < len; j++) {
			src = arguments[j];
			for (i in src) {
				dest[i] = src[i];
			}
		}
		return dest;
	},

	// @function create(proto: Object, properties?: Object): Object
	// Compatibility polyfill for [Object.create](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
	create: Object.create || (function () {
		function F() {
		}

		return function (proto) {
			F.prototype = proto;
			return new F();
		};
	})(),

	// @function trim(str: String): String
	// Compatibility polyfill for [String.prototype.trim](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)
	trim: function (str) {
		return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
	},

	// @function splitWords(str: String): String[]
	// Trims and splits the string on whitespace and returns the array of parts.
	splitWords: function (str) {
		return ES.Util.trim(str).split(/\s+/);
	},

	// @function setOptions(obj: Object, options: Object): Object
	// Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`. Has an `ES.setOptions` shortcut.
	setOptions: function (obj, oOption) {
		if (!obj.hasOwnProperty('oOption')) {
			obj.oOption = obj.oOption ? ES.Util.create(obj.oOption) : {};
		}
		for (var i in oOption) {
			obj.oOption[i] = oOption[i];
		}
		return obj.oOption;
	},


	//获得url的参数信息，以字典形式给出
	//@cUrl url参数
	getArgs: function (cUrl) {
		var query = location.search.substring(1);
		if (!cUrl) {
			query = cUrl;
		}
		var args = {};
		var pairs = query.split('&');
		for (var i = 0; i < pairs.length; i++) {
			var pos = pairs[i].indexOf('=');
			if (pos === -1) {
				continue;
			}
			var argname = pairs[i].substring(0, pos);
			var value = pairs[i].substring(pos + 1);
			value = decodeURIComponent(value);
			args[argname] = value;
		}
		return args;
	},

	// @function template(str: String, data: Object): String
	// Simple templating facility, accepts a template string of the form `'Hello {a}, {b}'`
	// and a data object like `{a: 'foo', b: 'bar'}`, returns evaluated string
	// `('Hello foo, bar')`. You can also specify functions instead of strings for
	// data values — they will be evaluated passing `data` as an argument.
	template: function (str, data) {
		return str.replace(ES.Util.templateRe, function (str, key) {
			var value = data[key];

			if (value === undefined) {
				throw new Error('No value provided for variable ' + str);

			} else if (typeof value === 'function') {
				value = value(data);
			}
			return value;
		});
	},

	templateRe: /\{ *([\w_\-]+) *\}/g,


	// @function isArray(obj): Boolean
	// Compatibility polyfill for [Array.isArray](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
	isArray: Array.isArray || function (obj) {
		return (Object.prototype.toString.call(obj) === '[object Array]');
	},

	// @function indexOf(array: Array, el: Object): Number
	// Compatibility polyfill for [Array.prototype.indexOf](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
	indexOf: function (array, el) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] === el) {
				return i;
			}
		}
		return -1;
	},


	//getData:ajax请求函数
	//@oParam：为请求的数据对象；
	//@cUrl：为请求的URL
	//@fnCallBack为回调函数；
	//@oContext为继承类；
	//@oExParam 只能为对象，不能为字符串
	getData: function (oParam, cUrl, fnCallBack, oContext, oExParam, oReqTemp) {
		if (!cUrl) {
			console.log(ES.Lang.Util.Err[2]);
			return;
		}
		if (!fnCallBack) {
			console.log(ES.Lang.Util.Err[3]);
			return;
		}


		var oReqParam = {
			type: 'POST',
			url: cUrl,
			dataType: 'json',
			data: oParam,
			success: function (oData) {
				//执行数据,不能用实例方法，在这里this为$对象,合并参数
				if (oExParam) {
					oExParam.oData = oData;
					fnCallBack.call(oContext, oExParam);
				}
				else {
					fnCallBack.call(oContext, oData);
				}
			},
			error: function (e, f, g) {
				if (oExParam) {
					oExParam.oData = null;
					fnCallBack.call(oContext, oExParam);
				}
				else {
					fnCallBack.call(oContext, null);
				}

				console.log(cUrl + ES.Lang.Util.Err[1]);

			},
		}

		ES.extend(oReqParam, oReqTemp);

		$.ajax(oReqParam);
	},

	// 判断数组中是否存在当前元素,
	// @aoTemp 为对象数组 ，@ao 为相同对象
	// @oTemp 为对象
	// @cKey 为对象属性
	isInArray: function (aoTemp, oTemp, cKey) {
		if (ES.Util.arrayIndex(aoTemp, oTemp, cKey) === -1) {
			return false;
		}
		return true;
	},

	// 把对象拆分为cMark 的字符串 , 如果cMark为空则用，分割
	// @aoTemp 为对象数组 ，@ao 为相同对象
	// @cMark 为分割参数
	// @cKey 为对象属性
	joinC: function (aoTemp, cKey, cMark) {
		var cVal = '';
		if (!cMark) {
			cMark = ',';
		}
		if (!aoTemp || !aoTemp.length || aoTemp.length <= 0 || !cKey) {
			return cVal;
		}

		var acTemp = [];
		for (var i = 0; i < aoTemp.length; i++) {
			if (!aoTemp[i].hasOwnProperty(cKey)) {
				continue;
			}
			acTemp.push(aoTemp[i][cKey]);
		}

		return acTemp.join(cMark);
	},

	// 返回数组索引,没有找到 返回-1
	// @aoTemp 为对象数组 ，@ao 为相同对象
	// @oTemp 为对象
	// @cKey 为对象属性
	arrayIndex: function (aoTemp, oTemp, cKey) {

		var nVal = -1;
		if (!aoTemp || aoTemp.length <= 0) {
			return nVal;
		}
		if (!cKey || !oTemp) {
			return nVal;
		}
		if (!oTemp.hasOwnProperty(cKey)) {
			return nVal;
		}
		if (!aoTemp[0].hasOwnProperty(cKey)) {
			return nVal;
		}
		for (var i = 0; i < aoTemp.length; i++) {
			if (aoTemp[i][cKey] === oTemp[cKey]) {
				nVal = i;
				break;
			}
		}

		return nVal;
	},


	//做一个递归生成html对象的例子
	//@oTag 为jquery 对象
	//@oOption 为生成对象
	initTag: function (oTag, oOption) {
		if (!oTag || !oOption) {
			return;
		}

		//检索对象所有属性
		for (var cItem in oOption) {
			if (ES.Util.isArray(oOption[cItem])) {
				//添加option对象
				var cTemp = cItem;
				for (var i = 0; i < oOption[cTemp].length; i++) {
					var oItem = $('<' + cTemp + '/>');
					this.initTag(oItem, oOption[cTemp][i]);
					oTag.append(oItem);
				}
			}
			else if (typeof oOption[cItem] === 'object' && oOption[cItem] !== null) {
				// 重复出现
				var cTagTemp = ES.Util.replaceAll(cItem, '1', '');
				var oItem1 = $('<' + cTagTemp + '/>');
				this.initTag(oItem1, oOption[cItem]);
				oTag.append(oItem1);
			}
			else if (cItem === 'html') {
				var html = oTag.html();
				oTag.html(html + ((oOption[cItem] !== null) ? oOption[cItem] : ''));
			}
			else {
				oTag.attr(cItem, oOption[cItem]);
			}
		}
	},

	getTag: function (oUIConfig) {
		var oDivTemp = $('<div></div>');
		ES.initTag(oDivTemp,oUIConfig);
		//var oNode = oDivTemp.first().addClass(this.oOption.cFlag);
		var $_oPanel = $(oDivTemp.html());
		delete oDivTemp;

		return $_oPanel
	},


	//字符串全局替换
	//@s 要操作字符串
	//@s1 替换 字符串
	//@s2 替换后 的字符串
	replaceAll: function (s, s1, s2) {
		return s.replace(new RegExp(s1, 'gm'), s2);
	},

	//将字符串转换成日期时间，有默认格式
	//@date 字符串
	//@pattern 转化的格式
	toDate: function (date, pattern) {
		if (!pattern || pattern === null) {
			pattern = 'yyyy-MM-dd hh:mm:ss';
		}

		var compare = {
			'y+': 'y',
			'M+': 'M',
			'd+': 'd',
			'h+': 'h',
			'm+': 'm',
			's+': 's'
		};
		var result = {
			'y': '',
			'M': '',
			'd': '',
			'h': '00',
			'm': '00',
			's': '00'
		};
		var tmp = pattern;
		for (var k in compare) {
			if (new RegExp('(' + k + ')').test(pattern)) {
				result[compare[k]] = date.substring(tmp.indexOf(RegExp.$1), tmp.indexOf(RegExp.$1) + RegExp.$1.length);
			}
		}
		//return new Date(result['y'], result['M'] - 1, result['d'], result['h'], result['m'], result['s']);
		return new Date(result.y, result.M - 1, result.d, result.h, result.m, result.s);
	},

	// 时间搓转化为时间格式
	// @value 为tick 或者 为时间
	// @format 为传化的字符串
	dateFormat: function (value, format) {
		if (value === '') {
			return '';
		}
		if (value.time) {
			value = new Date(value.time);
		}
		else {
			value = new Date(value);
		}

		var o = {
			'M+': value.getMonth() + 1, //month
			'd+': value.getDate(),    //day
			'h+': value.getHours(),   //hour
			'm+': value.getMinutes(), //minute
			's+': value.getSeconds(), //second
			'q+': Math.floor((value.getMonth() + 3) / 3), //quarter
			'S': value.getMilliseconds() //millisecond
		};
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (value.getFullYear() + '').substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp('(' + k + ')').test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
			}
		}
		return format;
	},

	/*
	 加载进度条,进度条是基于jquery
	 @cTag:为加载进度条的容器,或者为jquery对象
	 @cFlag：为标志:"."或者"#"
	 */
	loadAn: function (cTag, cFlag) {
		//加载进度条
		//var loadMaskHtml = '<div class="k-loading-mask" style="z-index:99999;width:100%;height:100%;left:0;top:0">' +
		//	'<span class="k-loading-text">Loading...</span>' +
		//	'<div class="k-loading-image"/>' +
		//	'<div class="k-loading-color"/>' +
		//	'</div>';
		var loadMaskHtml = '<div class="ex-layout-loading"><i>Loading...</i></div>';
		var oDiv = $(loadMaskHtml);
		if (typeof cTag === 'object') {
			cTag.append(oDiv);
			return;
		}

		if (!cFlag) {
			cFlag = '.';
		}

		$(cFlag + cTag).append(oDiv);
	},


	/*
	 移除进度条
	 加载进度条,进度条是基于jquery
	 @cTag:为加载进度条的容器,或者为jquery对象 .k-loading-mask
	 @cFlag：为标志:"."或者"#"
	 */
	removeAn: function (cTag, cFlag) {
		if (typeof cTag === 'object') {
			cTag.find('.ex-layout-loading').remove();
			return;
		}

		if (!cFlag) {
			cFlag = '.';
		}
		$(cFlag + cTag).find('.ex-layout-loading').remove();
	},


	aBase: function (oData) {

		var _alertHtml = '<div class="ec-alert {cColor} slidedown in"><button type="button" class="ec-close">&times;</button>{cMsg}</div>';
		_alertHtml = ES.Util.template(_alertHtml, oData);
		$('body').append(_alertHtml);
		$('.ec-alert').alert();
		setTimeout(function () {
			$('.ec-alert').alert('close');
		}, 1000);
	},

	aSucess: function (cMsg) {

		ES.Util.aBase({cColor: 'ec-alert-success', cMsg: cMsg});
	},

	aErr: function (cMsg) {
		ES.Util.aBase({cColor: 'ec-alert-danger', cMsg: cMsg});
	},

	aWarn: function (cMsg) {

		ES.Util.aBase({cColor: 'ec-alert-warning', cMsg: cMsg});
	},
};

(function () {
	// inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

	function getPrefixed(name) {
		return window['webkit' + name] || window['moz' + name] || window['ms' + name];
	}

	var lastTime = 0;

	// fallback for IE 7-8
	function timeoutDefer(fn) {
		var time = +new Date(),
		    timeToCall = Math.max(0, 16 - (time - lastTime));

		lastTime = time + timeToCall;
		return window.setTimeout(fn, timeToCall);
	}

	var requestFn = window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer,
	    cancelFn = window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') ||
	               getPrefixed('CancelRequestAnimationFrame') || function (id) { window.clearTimeout(id); };


	// @function requestAnimFrame(fn: Function, context?: Object, immediate?: Boolean): Number
	// Schedules `fn` to be executed when the browser repaints. `fn` is bound to
	// `context` if given. When `immediate` is set, `fn` is called immediately if
	// the browser doesn't have native support for
	// [`window.requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame),
	// otherwise it's delayed. Returns a request ID that can be used to cancel the request.
	ES.Util.requestAnimFrame = function (fn, context, immediate) {
		if (immediate && requestFn === timeoutDefer) {
			fn.call(context);
		} else {
			return requestFn.call(window, ES.bind(fn, context));
		}
	};

	// @function cancelAnimFrame(id: Number): undefined
	// Cancels a previous `requestAnimFrame`. See also [window.cancelAnimationFrame](https://developer.mozilla.org/docs/Web/API/window/cancelAnimationFrame).
	ES.Util.cancelAnimFrame = function (id) {
		if (id) {
			cancelFn.call(window, id);
		}
	};
})();

// shortcuts for most used utility functions
ES.extend = ES.Util.extend;
ES.bind = ES.Util.bind;
ES.stamp = ES.Util.stamp;
ES.setOptions = ES.Util.setOptions;
ES.template = ES.Util.template;
ES.loadAn = ES.Util.loadAn;
ES.removeAn = ES.Util.removeAn;
ES.getData = ES.Util.getData;
ES.initTag = ES.Util.initTag;
ES.getTag =  ES.Util.getTag;
ES.aSucess = ES.Util.aSucess;
ES.aErr = ES.Util.aErr;
ES.aWarn = ES.Util.aWarn;
