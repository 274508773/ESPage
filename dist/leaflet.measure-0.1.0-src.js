/*
	Leaflet.measure, a plugin that adds measure  distance to Leaflet powered maps.
	(c) 2016-2018, liulin, ExSun


	http://leafletjs.com
*/
(function (window, document, undefined) {/**
 * Created by liulin on 2016/11/4.
 */

L.measureVersion = '0.0.1-dev';

L.measure = {
    TipMarker: {
        setText: {
            beginText: 'begin  ',
            // distance until
            until: ' Km  '

        },
        createIcon: {
            closeText: 'X'
        },
        addTotalPenal: {

            total: ' total ',
            until: ' Km '
        },
        setSubTotalDistTag: {
            total: ' subtotal ',
            until: ' Km '
        }
    },
    Dist: {
        _getTooltipText: {
            start: 'Click to start measure  dist.',
            cont: 'Click to continue measure dist.',
            end: 'Click last point to finish measure.'
        }
    },

    error: '<strong>Error:</strong> shape edges cannot cross!'

};

L.Map.mergeOptions({
	touchExtend: true
});

L.Map.TouchExtend = L.Handler.extend({

	initialize: function (map) {
		this._map = map;
		this._container = map._container;
		this._pane = map._panes.overlayPane;
	},

	addHooks: function () {
		L.DomEvent.on(this._container, 'touchstart', this._onTouchStart, this);
		L.DomEvent.on(this._container, 'touchend', this._onTouchEnd, this);
		L.DomEvent.on(this._container, 'touchmove', this._onTouchMove, this);
		if (this._detectIE()) {
			L.DomEvent.on(this._container, 'MSPointerDown', this._onTouchStart, this);
			L.DomEvent.on(this._container, 'MSPointerUp', this._onTouchEnd, this);
			L.DomEvent.on(this._container, 'MSPointerMove', this._onTouchMove, this);
			L.DomEvent.on(this._container, 'MSPointerCancel', this._onTouchCancel, this);

		} else {
			L.DomEvent.on(this._container, 'touchcancel', this._onTouchCancel, this);
			L.DomEvent.on(this._container, 'touchleave', this._onTouchLeave, this);
		}
	},

	removeHooks: function () {
		L.DomEvent.off(this._container, 'touchstart', this._onTouchStart);
		L.DomEvent.off(this._container, 'touchend', this._onTouchEnd);
		L.DomEvent.off(this._container, 'touchmove', this._onTouchMove);
		if (this._detectIE()) {
			L.DomEvent.off(this._container, 'MSPointerDowm', this._onTouchStart);
			L.DomEvent.off(this._container, 'MSPointerUp', this._onTouchEnd);
			L.DomEvent.off(this._container, 'MSPointerMove', this._onTouchMove);
			L.DomEvent.off(this._container, 'MSPointerCancel', this._onTouchCancel);
		} else {
			L.DomEvent.off(this._container, 'touchcancel', this._onTouchCancel);
			L.DomEvent.off(this._container, 'touchleave', this._onTouchLeave);
		}
	},

	_touchEvent: function (e, type) {
		// #TODO: fix the pageX error that is do a bug in Android where a single touch triggers two click events
		// _filterClick is what leaflet uses as a workaround.
		// This is a problem with more things than just android. Another problem is touchEnd has no touches in
		// its touch list.
		var touchEvent = {};
		if (typeof e.touches !== 'undefined') {
			if (!e.touches.length) {
				return;
			}
			touchEvent = e.touches[0];
		} else if (e.pointerType === 'touch') {
			touchEvent = e;
            if (!this._filterClick(e)) {
                return;
            }
		} else {
			return;
		}

		var containerPoint = this._map.mouseEventToContainerPoint(touchEvent),
			layerPoint = this._map.mouseEventToLayerPoint(touchEvent),
			latlng = this._map.layerPointToLatLng(layerPoint);

		this._map.fire(type, {
			latlng: latlng,
			layerPoint: layerPoint,
			containerPoint: containerPoint,
			pageX: touchEvent.pageX,
			pageY: touchEvent.pageY,
			originalEvent: e
		});
	},

    /** Borrowed from Leaflet and modified for bool ops **/
    _filterClick: function (e) {
        var timeStamp = (e.timeStamp || e.originalEvent.timeStamp),
            elapsed = L.DomEvent._lastClick && (timeStamp - L.DomEvent._lastClick);

        // are they closer together than 500ms yet more than 100ms?
        // Android typically triggers them ~300ms apart while multiple listeners
        // on the same event should be triggered far faster;
        // or check if click is simulated on the element, and if it is, reject any non-simulated events
        if ((elapsed && elapsed > 100 && elapsed < 500) || (e.target._simulatedClick && !e._simulated)) {
            L.DomEvent.stop(e);
            return false;
        }
        L.DomEvent._lastClick = timeStamp;
        return true;
    },

	_onTouchStart: function (e) {
		if (!this._map._loaded) {
			return;
		}

		var type = 'touchstart';
		this._touchEvent(e, type);

	},

	_onTouchEnd: function (e) {
		if (!this._map._loaded) {
			return;
		}

		var type = 'touchend';
		this._touchEvent(e, type);
	},

	_onTouchCancel: function (e) {
		if (!this._map._loaded) {
			return;
		}

		var type = 'touchcancel';
		if (this._detectIE()) {
			type = 'pointercancel';
		}
		this._touchEvent(e, type);
	},

	_onTouchLeave: function (e) {
		if (!this._map._loaded) {
			return;
		}

		var type = 'touchleave';
		this._touchEvent(e, type);
	},

	_onTouchMove: function (e) {
		if (!this._map._loaded) {
			return;
		}

		var type = 'touchmove';
		this._touchEvent(e, type);
	},

	_detectIE: function () {
		var ua = window.navigator.userAgent;

		var msie = ua.indexOf('MSIE ');
		if (msie > 0) {
			// IE 10 or older => return version number
			return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		}

		var trident = ua.indexOf('Trident/');
		if (trident > 0) {
			// IE 11 => return version number
			var rv = ua.indexOf('rv:');
			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}

		var edge = ua.indexOf('Edge/');
		if (edge > 0) {
			// IE 12 => return version number
			return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		}

		// other browser
		return false;
	}
});

L.Map.addInitHook('addHandler', 'touchExtend', L.Map.TouchExtend);

// This isn't full Touch support. This is just to get makers to also support dom touch events after creation
// #TODO: find a better way of getting markers to support touch.
L.Marker.Touch = L.Marker.extend({

	_initInteraction: function () {
		if (!this.addInteractiveTarget) {
			// 0.7.x support
			return this._initInteractionLegacy();
		}
		// TODO this may need be updated to re-add touch events for 1.0+
		return L.Marker.prototype._initInteraction.apply(this);
	},

	// This is an exact copy of https://github.com/Leaflet/Leaflet/blob/v0.7/src/layer/marker/Marker.js
	// with the addition of the touch events on line 15.
	_initInteractionLegacy: function () {

		if (!this.options.clickable) {
			return;
		}

		// TODO refactor into something shared with Map/Path/etc. to DRY it up

		var icon = this._icon,
			events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu', 'touchstart', 'touchend', 'touchmove'];
		if (this._detectIE) {
			events.concat(['MSPointerDown', 'MSPointerUp', 'MSPointerMove', 'MSPointerCancel']);
		} else {
			events.concat(['touchcancel']);
		}

		L.DomUtil.addClass(icon, 'leaflet-clickable');
		L.DomEvent.on(icon, 'click', this._onMouseClick, this);
		L.DomEvent.on(icon, 'keypress', this._onKeyPress, this);

		for (var i = 0; i < events.length; i++) {
			L.DomEvent.on(icon, events[i], this._fireMouseEvent, this);
		}

		if (L.Handler.MarkerDrag) {
			this.dragging = new L.Handler.MarkerDrag(this);

			if (this.options.draggable) {
				this.dragging.enable();
			}
		}
	},
	_detectIE: function () {
		var ua = window.navigator.userAgent;

		var msie = ua.indexOf('MSIE ');
		if (msie > 0) {
			// IE 10 or older => return version number
			return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		}

		var trident = ua.indexOf('Trident/');
		if (trident > 0) {
			// IE 11 => return version number
			var rv = ua.indexOf('rv:');
			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}

		var edge = ua.indexOf('Edge/');
		if (edge > 0) {
			// IE 12 => return version number
			return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		}

		// other browser
		return false;
	}
});


/*
 * L.LatLngUtil contains different utility functions for LatLngs.
 */

L.LatLngUtil = {
	// Clones a LatLngs[], returns [][]
	cloneLatLngs: function (latlngs) {
		var clone = [];
		for (var i = 0, l = latlngs.length; i < l; i++) {
			// Check for nested array (Polyline/Polygon)
			if (Array.isArray(latlngs[i])) {
				clone.push(L.LatLngUtil.cloneLatLngs(latlngs[i]));
			} else {
				clone.push(this.cloneLatLng(latlngs[i]));
			}
		}
		return clone;
	},

	cloneLatLng: function (latlng) {
		return L.latLng(latlng.lat, latlng.lng);
	}
};


L.GeometryUtil = L.extend(L.GeometryUtil || {}, {
	// Ported from the OpenLayers implementation. See https://github.com/openlayers/openlayers/blob/master/lib/OpenLayers/Geometry/LinearRing.js#L270
	geodesicArea: function (latLngs) {
		var pointsCount = latLngs.length,
			area = 0.0,
			d2r = Math.PI / 180,
			p1, p2;

		if (pointsCount > 2) {
			for (var i = 0; i < pointsCount; i++) {
				p1 = latLngs[i];
				p2 = latLngs[(i + 1) % pointsCount];
				area += ((p2.lng - p1.lng) * d2r) *
						(2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
			}
			area = area * 6378137.0 * 6378137.0 / 2.0;
		}

		return Math.abs(area);
	},

	readableArea: function (area, isMetric) {
		var areaStr;

		if (isMetric) {
			if (area >= 10000) {
				areaStr = (area * 0.0001).toFixed(2) + ' ha';
			} else {
				areaStr = area.toFixed(2) + ' m&sup2;';
			}
		} else {
			area /= 0.836127; // Square yards in 1 meter

			if (area >= 3097600) { //3097600 square yards in 1 square mile
				areaStr = (area / 3097600).toFixed(2) + ' mi&sup2;';
			} else if (area >= 4840) {//48040 square yards in 1 acre
				areaStr = (area / 4840).toFixed(2) + ' acres';
			} else {
				areaStr = Math.ceil(area) + ' yd&sup2;';
			}
		}

		return areaStr;
	},

	readableDistance: function (distance, isMetric, useFeet) {
		var distanceStr;

		if (isMetric) {
			// show metres when distance is < 1km, then show km
			if (distance > 1000) {
				distanceStr = (distance  / 1000).toFixed(2) + ' km';
			} else {
				distanceStr = Math.ceil(distance) + ' m';
			}
		} else {
			distance *= 1.09361;

			if (distance > 1760) {
				distanceStr = (distance / 1760).toFixed(2) + ' miles';
			} else {
				var suffix = ' yd';
				if (useFeet) {
					distance = distance * 3;
					suffix = ' ft';
				}
				distanceStr = Math.ceil(distance) + suffix;
			}
		}

		return distanceStr;
	}
});


L.Util.extend(L.LineUtil, {
	// Checks to see if two line segments intersect. Does not handle degenerate cases.
	// http://compgeom.cs.uiuc.edu/~jeffe/teaching/373/notes/x06-sweepline.pdf
	segmentsIntersect: function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2, /*Point*/ p3) {
		return	this._checkCounterclockwise(p, p2, p3) !==
				this._checkCounterclockwise(p1, p2, p3) &&
				this._checkCounterclockwise(p, p1, p2) !==
				this._checkCounterclockwise(p, p1, p3);
	},

	// check to see if points are in counterclockwise order
	_checkCounterclockwise: function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
		return (p2.y - p.y) * (p1.x - p.x) > (p1.y - p.y) * (p2.x - p.x);
	}
});

L.Polyline.include({
	// Check to see if this polyline has any linesegments that intersect.
	// NOTE: does not support detecting intersection for degenerate cases.
	intersects: function () {
		var points = this._getProjectedPoints(),
			len = points ? points.length : 0,
			i, p, p1;

		if (this._tooFewPointsForIntersection()) {
			return false;
		}

		for (i = len - 1; i >= 3; i--) {
			p = points[i - 1];
			p1 = points[i];


			if (this._lineSegmentsIntersectsRange(p, p1, i - 2)) {
				return true;
			}
		}

		return false;
	},

	// Check for intersection if new latlng was added to this polyline.
	// NOTE: does not support detecting intersection for degenerate cases.
	newLatLngIntersects: function (latlng, skipFirst) {
		// Cannot check a polyline for intersecting lats/lngs when not added to the map
		if (!this._map) {
			return false;
		}

		return this.newPointIntersects(this._map.latLngToLayerPoint(latlng), skipFirst);
	},

	// Check for intersection if new point was added to this polyline.
	// newPoint must be a layer point.
	// NOTE: does not support detecting intersection for degenerate cases.
	newPointIntersects: function (newPoint, skipFirst) {
		var points = this._getProjectedPoints(),
			len = points ? points.length : 0,
			lastPoint = points ? points[len - 1] : null,
			// The previous previous line segment. Previous line segment doesn't need testing.
			maxIndex = len - 2;

		if (this._tooFewPointsForIntersection(1)) {
			return false;
		}

		return this._lineSegmentsIntersectsRange(lastPoint, newPoint, maxIndex, skipFirst ? 1 : 0);
	},

	// Polylines with 2 sides can only intersect in cases where points are collinear (we don't support detecting these).
	// Cannot have intersection when < 3 line segments (< 4 points)
	_tooFewPointsForIntersection: function (extraPoints) {
		var points = this._getProjectedPoints(),
			len = points ? points.length : 0;
		// Increment length by extraPoints if present
		len += extraPoints || 0;

		return !points || len <= 3;
	},

	// Checks a line segment intersections with any line segments before its predecessor.
	// Don't need to check the predecessor as will never intersect.
	_lineSegmentsIntersectsRange: function (p, p1, maxIndex, minIndex) {
		var points = this._getProjectedPoints(),
			p2, p3;

		minIndex = minIndex || 0;

		// Check all previous line segments (beside the immediately previous) for intersections
		for (var j = maxIndex; j > minIndex; j--) {
			p2 = points[j - 1];
			p3 = points[j];

			if (L.LineUtil.segmentsIntersect(p, p1, p2, p3)) {
				return true;
			}
		}

		return false;
	},

	_getProjectedPoints: function () {
		if (!this._defaultShape) {
			return this._originalPoints;
		}
		var points = [],
			_shape = this._defaultShape();

		for (var i = 0; i < _shape.length; i++) {
			points.push(this._map.latLngToLayerPoint(_shape[i]));
		}
		return points;
	}
});


L.Polygon.include({
	// Checks a polygon for any intersecting line segments. Ignores holes.
	intersects: function () {
		var polylineIntersects,
			points = this._getProjectedPoints(),
			len, firstPoint, lastPoint, maxIndex;

		if (this._tooFewPointsForIntersection()) {
			return false;
		}

		polylineIntersects = L.Polyline.prototype.intersects.call(this);

		// If already found an intersection don't need to check for any more.
		if (polylineIntersects) {
			return true;
		}

		len = points.length;
		firstPoint = points[0];
		lastPoint = points[len - 1];
		maxIndex = len - 2;

		// Check the line segment between last and first point. Don't need to check the first line segment (minIndex = 1)
		return this._lineSegmentsIntersectsRange(lastPoint, firstPoint, maxIndex, 1);
	}
});


L.Measure = L.Measure || {};
L.Measure.Tooltip = L.Class.extend({
	initialize: function (map) {
		this._map = map;
		this._popupPane = map._panes.popupPane;

		this._container = map.options.drawControlTooltips ? L.DomUtil.create('div', 'leaflet-draw-tooltip', this._popupPane) : null;
		this._singleLineLabel = false;

		this._map.on('mouseout', this._onMouseOut, this);
	},

	dispose: function () {
		this._map.off('mouseout', this._onMouseOut, this);

		if (this._container) {
			this._popupPane.removeChild(this._container);
			this._container = null;
		}
	},

	updateContent: function (labelText) {
		if (!this._container) {
			return this;
		}
		labelText.subtext = labelText.subtext || '';

		// update the vertical position (only if changed)
		if (labelText.subtext.length === 0 && !this._singleLineLabel) {
			L.DomUtil.addClass(this._container, 'leaflet-draw-tooltip-single');
			this._singleLineLabel = true;
		}
		else if (labelText.subtext.length > 0 && this._singleLineLabel) {
			L.DomUtil.removeClass(this._container, 'leaflet-draw-tooltip-single');
			this._singleLineLabel = false;
		}

		this._container.innerHTML =
			(labelText.subtext.length > 0 ? '<span class="leaflet-draw-tooltip-subtext">' + labelText.subtext + '</span>' + '<br />' : '') +
			'<span>' + labelText.text + '</span>';

		return this;
	},

	updatePosition: function (latlng) {
		var pos = this._map.latLngToLayerPoint(latlng),
			tooltipContainer = this._container;

		if (this._container) {
			tooltipContainer.style.visibility = 'inherit';
			L.DomUtil.setPosition(tooltipContainer, pos);
		}

		return this;
	},

	showAsError: function () {
		if (this._container) {
			L.DomUtil.addClass(this._container, 'leaflet-error-draw-tooltip');
		}
		return this;
	},

	removeError: function () {
		if (this._container) {
			L.DomUtil.removeClass(this._container, 'leaflet-error-draw-tooltip');
		}
		return this;
	},

	_onMouseOut: function () {
		if (this._container) {
			this._container.style.visibility = 'hidden';
		}
	}
});


/**
 * Created by liulin on 2016/9/12.
 * name:            measure.dist.js
 * des:             public distance
 * author:          liulin
 * date:            2016-09-12
 *
 * think:
 * 1.manage draw distance object
 *
 */

L.Measure =L.Measure || {};

// inherit the class Feature
// control measure,manage distance object
L.Measure.DistMgr = L.Handler.extend({

    options: {},

    // catch distance obj

    initialize: function (map, options) {
        // set map for handler
        this._map = map;

        L.setOptions(this, options);
        this.aoDistHandker = [];

    },

    // start execute
    addHooks: function () {
        var oDist = L.Measure.dist(this._map, this, this.options);
        this.oLastDist = oDist;
        this.aoDistHandker.push(oDist);
        oDist.createDist();
    },

    // end execute
    removeHooks: function () {
        this.oLastDist.removeDist();
    },

});

L.Measure.distMgr = function (map, options) {

    return new L.Measure.DistMgr(map, options);
};





/**
 * Created by liulin on 2016/9/12.
 * name:            measure.dist.js
 * des:             public distance
 * author:          liulin
 * date:            2016-09-12
 */



// inherit the class Feature
// draw marker  with draw one TipMarker
L.Measure.Dist = L.Class.extend({
    // add event for dist
    includes: L.Mixin.Events,

    statics: {
        TYPE: 'DIST'
    },

    Poly: L.Polyline,

    options: {
        allowIntersection: true,
        repeatMode: false,
        drawError: {
            color: '#b00b00',
            timeout: 2500
        },

        touchIcon: new L.DivIcon({
            iconSize: new L.Point(20, 20),
            className: 'leaflet-div-icon leaflet-editing-icon leaflet-touch-icon'
        }),
        guidelineDistance: 20,
        maxGuideLineLength: 4000,
        shapeOptions: {
            stroke: true,
            color: '#f06eaa',
            weight: 2,
            opacity: 1,
            fill: false,
            clickable: true
        },
        metric: true, // Whether to use the metric measurement system or imperial
        feet: true, // When not metric, to use feet instead of yards for display.
        showLength: true, // Whether to display distance in the tooltip
        //zIndexOffset: 2000 // This should be > than the highest z-index any map layers
        // is show total dist for measure
        bIsTotalDist: true
    },

    // distance for the line  when tip show de dTatol distance
    //dTotalDist: 0,

    initialize: function (map, oParent, options) {
        // if touch, switch to touch icon
        if (L.Browser.touch) {
            this.options.icon = this.options.touchIcon;
        }

        this._oParent = oParent;

        // Need to set this here to ensure the correct message is used.
        this.options.drawError.message = L.measure.error;

        // Merge default drawError options with custom options
        if (options && options.drawError) {
            options.drawError = L.Util.extend({}, this.options.drawError, options.drawError);
        }

        // draw type
        this.type = L.Measure.Dist.TYPE;

        this._map = map;
        // the map outer div for control
        this._container = map._container;
        // vector layer
        this._overlayPane = map._panes.overlayPane;
        // layer for  popup obj
        this._popupPane = map._panes.popupPane;

        // Merge default shapeOptions options with custom shapeOptions
        if (options && options.shapeOptions) {
            options.shapeOptions = L.Util.extend({}, this.options.shapeOptions, options.shapeOptions);
        }

        L.setOptions(this, options);

    },

    // begin execute draw distance
    createDist: function () {

        if (!this._map) {
            return;
        }

        L.DomUtil.disableTextSelection();

        this._container.focus();

        this._tooltip = new L.Measure.Tooltip(this._map);

        L.DomEvent.on(this._container, 'keyup', this._cancelDrawing, this);

        // manager marker in line distance
        this._oMarkerMgr = new L.Measure.MarkerMgr(this._map, this);

        // manager tip marker in line distance
        this._oTipMarkerMgr = new L.Measure.TipMarkerMgr(this._map, this);

        // draw line
        this._poly = new L.Polyline([], this.options.shapeOptions);

        // uodate tooltip text
        this._tooltip.updateContent(this._getTooltipText());

        // Make a transparent marker that will used to catch click events. These click
        // events will create the vertices. We need to do this so we can ensure that
        // we can create vertices over other map layers (markers, vector layers). We
        // also do not want to trigger any click handlers of objects we are clicking on
        // while drawing.
        if (!this._mouseMarker) {
            this._mouseMarker = L.marker(this._map.getCenter(), {
                icon: L.divIcon({
                    className: 'leaflet-mouse-marker',
                    iconAnchor: [20, 20],
                    iconSize: [40, 40]
                }),
                opacity: 0,
                zIndexOffset: this.options.zIndexOffset
            });
        }

        if (!L.Browser.touch) {
            this._map.on('mouseup', this._onMouseUp, this); // Necessary for 0.7 compatibility
        }

        this._mouseMarker
            .on('mousedown', this._onMouseDown, this)
            .on('mouseout', this._onMouseOut, this)
            .on('mouseup', this._onMouseUp, this) // Necessary for 0.8 compatibility
            .on('mousemove', this._onMouseMove, this) // Necessary to prevent 0.8 stutter
            .addTo(this._map);

        this._map
            .on('mouseup', this._onMouseUp, this) // Necessary for 0.7 compatibility
            .on('mousemove', this._onMouseMove, this)
            .on('zoomlevelschange', this._onZoomEnd, this)
            .on('click', this._onTouch, this)
            .on('zoomend', this._onZoomEnd, this);

    },

    // finish execute draw distance
    removeDist: function () {

        L.DomUtil.enableTextSelection();

        this._tooltip.dispose();
        this._tooltip = null;

        L.DomEvent.off(this._container, 'keyup', this._cancelDrawing, this);

        this._clearHideErrorTimeout();

        // remove last marker event
        this._oMarkerMgr.cleanUpShape();

        //this._map.removeLayer(this._poly);

        //delete this._poly;

        this._mouseMarker
            .off('mousedown', this._onMouseDown, this)
            .off('mouseout', this._onMouseOut, this)
            .off('mouseup', this._onMouseUp, this)
            .off('mousemove', this._onMouseMove, this);
        this._map.removeLayer(this._mouseMarker);
        delete this._mouseMarker;

        // clean up DOM
        this._clearGuides();

        this._map
            .off('mouseup', this._onMouseUp, this)
            .off('mousemove', this._onMouseMove, this)
            .off('zoomlevelschange', this._onZoomEnd, this)
            .off('zoomend', this._onZoomEnd, this)
            .off('click', this._onTouch, this);
    },

    deleteLastVertex: function () {
        if (this._markers.length <= 1) {
            return;
        }

        var lastMarker = this._markers.pop(),
            poly = this._poly,
            latlng = this._poly.spliceLatLngs(poly.getLatLngs().length - 1, 1)[0];

        this._markerGroup.removeLayer(lastMarker);

        if (poly.getLatLngs().length < 2) {
            this._map.removeLayer(poly);
        }

        this._vertexChanged(latlng, false);
    },

    // add marker and tipmarker for dist handler
    addVertex: function (latlng) {
        var markersLength = this._oMarkerMgr.getLen();

        if (markersLength > 0 && !this.options.allowIntersection && this._poly.newLatLngIntersects(latlng)) {
            this._showErrorTooltip();
            return;
        }
        else if (this._errorShown) {
            this._hideErrorTooltip();
        }

        // add marker
        var oRelaMarker = this._oMarkerMgr.createMarker(latlng);
        // add tip marker
        this._oTipMarkerMgr.createMarker(latlng, oRelaMarker, {
            className: 'rule_text_box',
            iconAnchor: [-10, 20]
        });

        this._poly.addLatLng(latlng);

        // add line for disctance
        if (this._poly.getLatLngs().length === 2) {
            this._map.addLayer(this._poly);
        }

        this._vertexChanged(latlng, true);
    },

    completeShape: function () {
        if (this._markers.length <= 1) {
            return;
        }


        this.removeDist();

        if (this.options.repeatMode) {
            this._oParent.enable();
        }
    },


    deleteHandler: function (oRelaMarker) {
        if (!this._oMarkerMgr || this._oMarkerMgr.getLen() <= 0) {
            return;
        }
        this._oMarkerMgr.removeMarker(oRelaMarker);

        var aoLatLng = this._oMarkerMgr.getPointMarkers();
        //redraw line for handler
        this._poly.setLatLngs(aoLatLng);
    },

    clearData: function () {
        if (!this._oMarkerMgr || this._oMarkerMgr.getLen() <= 0) {
            return;
        }
        this._oMarkerMgr.clearData();
        this._poly.setLatLngs([]);
    },

    // finish dist when click last marker
    _finishShape: function () {
        var intersects = this._poly.newLatLngIntersects(this._poly.getLatLngs()[this._poly.getLatLngs().length - 1]);

        if ((!this.options.allowIntersection && intersects) || !this._shapeIsValid()) {
            this._showErrorTooltip();
            return;
        }

        this._oTipMarkerMgr.addCloseBtn();
        if (this.options.bIsTotalDist) {
            this._oTipMarkerMgr.addTotalDist();
        }
        this._oParent.disable();
        if (this.options.repeatMode) {
            this.enable();
        }
    },

    //Called to verify the shape is valid when the user tries to finish it
    //Return false if the shape is not valid
    _shapeIsValid: function () {
        return true;
    },

    _onZoomEnd: function () {
        if (this._markers !== null) {
            this._updateGuide();
        }
    },

    // move mouse update point and guide flag
    _onMouseMove: function (e) {

        // screen point to latlng
        var newPos = this._map.mouseEventToLayerPoint(e.originalEvent);
        var latlng = this._map.layerPointToLatLng(newPos);

        // Save current  latlng to update tip obj
        this._currentLatLng = latlng;

        this._updateTooltip(latlng);

        // Update the guide line
        this._updateGuide(newPos);

        // Update the mouse marker position
        this._mouseMarker.setLatLng(latlng);

        L.DomEvent.preventDefault(e.originalEvent);
    },

    _vertexChanged: function () {
        this._map.fire('draw:drawvertex', {layers: this._markerGroup});

        // update marker event,init event for last marker
        this._oMarkerMgr.updateFinishHandler();

        this._clearGuides();

        this._updateTooltip();
    },

    // start execute,get start pos is judge is distance for map
    _onMouseDown: function (e) {
        var originalEvent = e.originalEvent;
        this._mouseDownOrigin = L.point(originalEvent.clientX, originalEvent.clientY);
    },

    // besause the distance is 0 so add marker for distance
    _onMouseUp: function (e) {
        if (this._mouseDownOrigin) {
            // We detect clicks within a certain tolerance, otherwise let it
            // be interpreted as a drag by the map
            var distance = L.point(e.originalEvent.clientX, e.originalEvent.clientY)
                .distanceTo(this._mouseDownOrigin);
            if (Math.abs(distance) < 9 * (window.devicePixelRatio || 1)) {
                this.addVertex(e.latlng);
            }
        }
        this._mouseDownOrigin = null;
    },

    _onTouch: function (e) {
        // #TODO: use touchstart and touchend vs using click(touch start & end).
        if (L.Browser.touch) { // #TODO: get rid of this once leaflet fixes their click/touch.
            this._onMouseDown(e);
            this._onMouseUp(e);
        }
    },

    _onMouseOut: function () {
        if (this._tooltip) {
            this._tooltip._onMouseOut.call(this._tooltip);
        }
    },

    // create marker
    _createMarker: function (latlng) {
        var marker = new L.Marker(latlng, {
            icon: this.options.icon,
            zIndexOffset: this.options.zIndexOffset * 2
        });

        this._markerGroup.addLayer(marker);

        return marker;
    },

    // draw guide where move mouse  newpos is mouse pos,
    _updateGuide: function (newPos) {
        var markerCount = this._oMarkerMgr ? this._oMarkerMgr.getLen() : 0;

        if (markerCount > 0) {
            newPos = newPos || this._map.latLngToLayerPoint(this._currentLatLng);

            // draw the guide line
            this._clearGuides();
            this._drawGuide(
                this._map.latLngToLayerPoint(this._oMarkerMgr.getLastGeoPos()),
                newPos
            );
        }
    },

    // update text for last
    _updateTooltip: function (latLng) {
        var text = this._getTooltipText();

        if (latLng) {
            this._tooltip.updatePosition(latLng);
        }

        if (!this._errorShown) {
            this._tooltip.updateContent(text);
        }
    },

    _drawGuide: function (pointA, pointB) {
        var length = Math.floor(Math.sqrt(Math.pow((pointB.x - pointA.x), 2) + Math.pow((pointB.y - pointA.y), 2))),
            guidelineDistance = this.options.guidelineDistance,
            maxGuideLineLength = this.options.maxGuideLineLength,
        // Only draw a guideline with a max length
            i = length > maxGuideLineLength ? length - maxGuideLineLength : guidelineDistance,
            fraction,
            dashPoint,
            dash;

        //create the guides container if we haven't yet
        if (!this._guidesContainer) {
            this._guidesContainer = L.DomUtil.create('div', 'leaflet-draw-guides', this._overlayPane);
        }

        //draw a dash every GuildeLineDistance
        for (; i < length; i += this.options.guidelineDistance) {
            //work out fraction along line we are
            fraction = i / length;

            //calculate new x,y point
            dashPoint = {
                x: Math.floor((pointA.x * (1 - fraction)) + (fraction * pointB.x)),
                y: Math.floor((pointA.y * (1 - fraction)) + (fraction * pointB.y))
            };

            //add guide dash to guide container
            dash = L.DomUtil.create('div', 'leaflet-draw-guide-dash', this._guidesContainer);
            dash.style.backgroundColor =
                !this._errorShown ? this.options.shapeOptions.color : this.options.drawError.color;

            L.DomUtil.setPosition(dash, dashPoint);
        }
    },

    _updateGuideColor: function (color) {
        if (this._guidesContainer) {
            for (var i = 0, l = this._guidesContainer.childNodes.length; i < l; i++) {
                this._guidesContainer.childNodes[i].style.backgroundColor = color;
            }
        }
    },

    // removes all child elements (guide dashes) from the guides container
    _clearGuides: function () {
        if (this._guidesContainer) {
            while (this._guidesContainer.firstChild) {
                this._guidesContainer.removeChild(this._guidesContainer.firstChild);
            }
        }
    },

    _getTooltipText: function () {
        var showLength = this.options.showLength,
            labelText, distanceStr;
        var nLen = this._oMarkerMgr.getLen();
        if (nLen === 0) {
            labelText = {
                text: L.measure.Dist._getTooltipText.start
            };
        } else {
            distanceStr = showLength ? this._getMeasurementString() : '';

            if (nLen === 1) {
                labelText = {
                    text: L.measure.Dist._getTooltipText.cont,
                    subtext: distanceStr
                };
            } else {
                labelText = {
                    text: L.measure.Dist._getTooltipText.end,
                    subtext: distanceStr
                };
            }
        }
        return labelText;
    },

    // get tipMarker distance
    _getMeasurementString: function () {
        var currentLatLng = this._currentLatLng,
            previousLatLng = this._oMarkerMgr.getLastGeoPos(),//this._markers[this._markers.length - 1].getLatLng(),
            distance;

        // calculate the distance from the last fixed point to the mouse position
        //this._measurementRunningTotal + currentLatLng.distanceTo(previousLatLng);
        distance = this._oTipMarkerMgr.getTotalDist() + currentLatLng.distanceTo(previousLatLng);


        return L.GeometryUtil.readableDistance(distance, this.options.metric, this.options.feet);
    },

    _showErrorTooltip: function () {
        this._errorShown = true;

        // Update tooltip
        this._tooltip
            .showAsError()
            .updateContent({text: this.options.drawError.message});

        // Update shape
        this._updateGuideColor(this.options.drawError.color);
        this._poly.setStyle({color: this.options.drawError.color});

        // Hide the error after 2 seconds
        this._clearHideErrorTimeout();
        this._hideErrorTimeout = setTimeout(L.Util.bind(this._hideErrorTooltip, this), this.options.drawError.timeout);
    },

    _hideErrorTooltip: function () {
        this._errorShown = false;

        this._clearHideErrorTimeout();

        // Revert tooltip
        this._tooltip
            .removeError()
            .updateContent(this._getTooltipText());

        // Revert shape
        this._updateGuideColor(this.options.shapeOptions.color);
        this._poly.setStyle({color: this.options.shapeOptions.color});
    },

    _clearHideErrorTimeout: function () {
        if (this._hideErrorTimeout) {
            clearTimeout(this._hideErrorTimeout);
            this._hideErrorTimeout = null;
        }
    },


    // Cancel drawing when the escape key is pressed
    _cancelDrawing: function (e) {
        this._map.fire('draw:canceled', {layerType: this.type});
        if (e.keyCode === 27) {
            this._oParent.disable();
        }
    }
});

L.Measure.dist = function (map, options) {

    return new L.Measure.Dist(map, options);
};





/**
 * Created by liulin on 2016/9/12.
 * name:            measure.dist.js
 * des:             public distance
 * author:          liulin
 * date:            2016-09-12
 */


// inhicnt class
// draw marker  with draw one TipMarker
// manage marker and tip marker
L.Measure.MarkerMgr = L.Class.extend({
    statics: {
        TYPE: 'DIST'
    },

    //Marker data,in line marker ,where dist line in the line
    //_markers: [],

    // point total distance for map
    //_dTotalDist: 0,


    options: {
        icon: new L.DivIcon({
            iconSize: new L.Point(8, 8),
            className: 'leaflet-div-icon leaflet-editing-icon'
        }),
        zIndexOffset: 2000
    },

    initialize: function (map, oParent, options) {
        this._map = map;
        this._oParent = oParent;
        L.setOptions(this, options);

        this._dTotalDist = 0;
        this._markers = [];
        this._layerGroup = L.featureGroup();
        this._map.addLayer(this._layerGroup);

    },

    // create marker
    createMarker: function (latlng, options) {

        var oTemp = L.extend({}, options, {
            icon: this.options.icon,
            zIndexOffset: this.options.zIndexOffset * 2
        });
        var oMarker = new L.Marker(latlng, oTemp);

        this._layerGroup.addLayer(oMarker);
        this._markers.push(oMarker);
        return oMarker;
    },

    // get marker length for de array
    getLen: function () {
        if (!this._markers) {
            return 0;
        }
        return this._markers.length;

    },

    getLastMarker: function () {

        if (!this._markers || this._markers.length <= 0) {
            return null;
        }

        return this._markers[this._markers.length - 1];
    },

    getLastGeoPos: function () {
        var oMarker = this.getLastMarker();

        return oMarker.getLatLng();
    },

    // get all marker  point  in the array
    getPointMarkers: function () {
        var aoLatLng = [];
        if (!this._markers || this._markers.length <= 0) {
            return aoLatLng;
        }
        for (var i = 0; i < this._markers.length; i++) {
            aoLatLng.push(this._markers[i].getLatLng());
        }
        return aoLatLng;
    },

    // judge finish draw for map
    updateFinishHandler: function () {
        var markerCount = this._markers.length;
        // The last marker should have a click handler to close the polyline
        //if (markerCount > 1) {
        //    this._markers[markerCount - 1].on('click', this._finishShape, this);
        //}
        //
        //// Remove the old marker click handler (as only the last point should close the polyline)
        //if (markerCount > 2) {
        //    this._markers[markerCount - 2].off('click', this._finishShape, this);
        //}

        // The first marker should have a click handler to close the polygon
        if (markerCount === 1) {
            this._markers[0].on('click', this._finishShape, this);
        }

        // Add and update the double click handler
        if (markerCount > 2) {
            this._markers[markerCount - 1].on('dblclick', this._finishShape, this);
            // Only need to remove handler if has been added before
            if (markerCount > 3) {
                this._markers[markerCount - 2].off('dblclick', this._finishShape, this);
            }
        }
    },


    cleanUpShape: function () {

        if (this._markers <= 1) {

            return;
        }

        this.getLastMarker().off('click', this._finishShape, this);

    },


    _finishShape: function () {

        //delegated parent execute
        this._oParent._finishShape();

    },

    // delete tipmarker and marker catch
    removeMarker: function (marker) {

        // Update Tipmarker text  for distance
        for (var i = this._markers.length - 1; i >= 0; i--) {
            if (this._markers[i] === marker) {
                // delete layer
                this._markers.splice(i, 1);
                break;
            }
        }

        this._layerGroup.removeLayer(marker);

    },


    updateDist: function () {
        for (var i = 0; i < this._markers; i++) {
            if (i === 0) {
                this._tipMarkers[i].setDist(0);
                continue;
            }

            var dist = this._tipMarkers[i].getLatLng().distanceTo(this._tipMarkers[i - 1]);
            this._tipMarkers[i].setDist(dist);
        }
    },


    clearData: function () {
        this._markers.splice(0, this._markers.length);
        this._layerGroup.clearLayers();
    },

    remove: function () {
        this._map.removeLayer(this._layerGroup);
        delete this._layerGroup;
        delete this._markers;
    }
});


/**
 * Created by liulin on 2016/9/12.
 * name:            measure.dist.js
 * des:             public distance
 * author:          liulin
 * date:            2016-09-12
 */


// inhicnt class
// draw marker  with draw one TipMarker
// manage marker and tip marker
L.Measure.TipMarkerMgr = L.Class.extend({
    statics: {
        TYPE: 'DIST'
    },


    initialize: function (map, oParent, options) {
        this._map = map;
        L.setOptions(this, options);

        this._markers = [];
        // create layergourp add marker
        this._layerGroup = L.featureGroup();
        // add marker layer
        this._map.addLayer(this._layerGroup);
        // distance
        this._oParent = oParent;
    },

    options: {},

    // create marker
    createMarker: function (oLatLng, oRelaMarker, options) {

        var tipMarker = L.Measure.tipMarker(oLatLng, this, options);
        tipMarker.addTo(this._layerGroup);
        this._markers.push(tipMarker);


        var oPreMarker = this.getSecLastMarker();
        var dDist = this.calDist(tipMarker, oPreMarker);
        tipMarker.setDist(dDist);

        if (this._markers.length > 1) {
            dDist = this.getTotalDist();
            // set sub total dist for marker
            tipMarker.setSubTotalDist(dDist);
        }

        // rela marker that show in map
        if (oRelaMarker) {
            tipMarker.oRelaMarker = oRelaMarker;
        }

        return tipMarker;
    },

    // cal distance for two marker and set label for de oCurMarker
    calDist: function (oCurMarker, oPreMarker) {

        if (!oPreMarker) {

            return 0;
        }

        var oELatLng = oCurMarker.getLatLng();
        var oBLatLng = oPreMarker.getLatLng();
        return oELatLng.distanceTo(oBLatLng);
    },

    // get total distance
    getTotalDist: function () {
        if (this._markers.length <= 0) {
            return 0;
        }
        var dToTalDist = 0;
        for (var i = 0; i < this._markers.length; i++) {
            dToTalDist += this._markers[i].dDist;
        }

        return dToTalDist;
    },

    getLastMarker: function () {

        if (!this._markers || this._markers.length <= 0) {
            return null;
        }
        return this._markers[this.getLen() - 1];
    },

    getLastGeoPos: function () {
        var oMarker = this.getLastMarker();
        return oMarker.getLatLng();
    },

    getSecLastMarker: function () {
        if (!this._markers || this._markers.length <= 1) {
            return null;
        }
        return this._markers[this.getLen() - 2];

    },

    // get marker length
    getLen: function () {
        if (!this._markers) {
            return 0;
        }
        return this._markers.length;
    },


    // when finish dist  add close btn
    addCloseBtn: function () {
        var oMarker = this.getLastMarker();
        if (!oMarker) {
            return;
        }
        oMarker.addAllClose();
    },

    // add total tag
    addTotalDist: function () {

        var oMarker = this.getLastMarker();
        if (!oMarker) {
            return;
        }
        var dDist = this.getTotalDist();
        oMarker.addTotalPenal(dDist);

    },

    setTipTotalDist: function () {

        var oMarker = this.getLastMarker();
        if (!oMarker) {
            return;
        }
        var dDist = this.getTotalDist();

        oMarker.setTotalDist(dDist);
    },

    // set all marker distance and label
    setSubDist: function () {

        if (!this._markers || this._markers.length <= 0) {
            return;
        }

        this._markers[0].setDist(0);
        this._markers[0].deleteSubTotalTag();

        for (var i = 1; i < this._markers.length; i++) {
            var dDist = this.calDist(this._markers[i], this._markers[i - 1]);
            this._markers[i].setDist(dDist);
        }
    },

    // befor cal ,you need update marker dist
    setTipSubTotalDist: function () {

        if (!this._markers || this._markers.length <= 0) {
            return;
        }


        var dDist = 0;
        for (var i = 1; i < this._markers.length; i++) {
            dDist = this._markers[i].dDist + dDist;

            this._markers[i].setSubTotalDist(dDist);
        }

    },

    update: function () {

        this.setSubDist();

        this.setTipSubTotalDist();

        if (this._oParent.options.bIsTotalDist) {
            this.addTotalDist();
        }
        else {
            this.setTipTotalDist();
        }

        this.addCloseBtn();
    },

    // delete tipmarker and marker catch
    removeTipMarker: function (marker) {

        if (this._markers.length === 2) {
            this.clearData();
            this._oParent.clearData();
            return;
        }

        // Update Tipmarker text  for distance
        for (var i = this._markers.length - 1; i >= 0; i--) {
            if (this._markers[i] === marker) {
                // delete layer
                this._markers.splice(i, 1);
                break;
            }
        }

        this.update();


        if (marker.oRelaMarker) {
            // remove rela marker
            this._oParent.deleteHandler(marker.oRelaMarker);//fire("removeRelaMarker", {oRelaMarler: marker.oRelaMarler});
        }

        this._layerGroup.removeLayer(marker);


    },

    clearData: function () {
        // delete all data
        this._markers.splice(0, this._markers.length);
        this._layerGroup.clearLayers();
    },

    // delete dist,but draw dist is exist in catch
    deleteDist: function () {
        this.clearData();
        this._oParent.clearData();
    },

    remove: function () {
        this._map.removeLayer(this._layerGroup);
        delete this._layerGroup;
        delete  this._markers;
    }

});


/**
 * Created by liulin on 2016/9/12.
 * name:            measure.dist.js
 * des:             public distance
 * author:          liulin
 * date:            2016-09-12
 */


// inhicnt Class
// TipMarker is new obj for marker
L.Measure.TipMarker = L.Marker.extend({
    options: {
        oShowConfig: {
            bIsSubDist: true,
            bIsSubTotalDist: true,
            bIsSubClose: true

        },

    },

    // config tag is create or order,set all site
    oUIConfig: {
        oSubDist: {
            nOrder: 1,
            cTagName: 'span',
        },
        oSubTotalDist: {
            nOrder: 2,
            cTagName: 'span'
        },

        oTotalDist: {
            nOrder: 3,
            cTagName: 'span'
        },

        oSubClose: {
            nOrder: 4,
            cTagName: 'a',
            cText: L.measure.TipMarker.createIcon.closeText,
            bIsClick: true
        },

        oTotalClose: {
            nOrder: 5,
            cTagName: 'a',
            cClassName: '',
            cText: L.measure.TipMarker.createIcon.closeText
            //fnCallBack:null
        },

    },

    initialize: function (latlng, oParent, options) {

        L.Util.extend(this.oUIConfig, options.oUIConfig);

        L.Marker.prototype.initialize.call(this, latlng, options);

        this.bIsSubTotalDist = this.options.bIsSubTotalDist;

        this._oParent = oParent;

        // save tag for the tip marker
        this.aoTag = [];
    },

    _initIcon: function () {
        var options = this.options,
            map = this._map,
            animation = (map.options.zoomAnimation && map.options.markerZoomAnimation),
            classToAdd = animation ? 'leaflet-zoom-animated' : 'leaflet-zoom-hide';

        // create div for marker
        var icon = this.createIcon();

        L.DomUtil.addClass(icon, classToAdd);

        if (options.keyboard) {
            icon.tabIndex = '0';
        }

        this._icon = icon;

        this._initInteraction();

        if (options.riseOnHover) {
            this.on({
                mouseover: this._bringToFront,
                mouseout: this._resetZIndex
            });
            //this
            //    .on(icon, 'mouseover', this._bringToFront, this)
            //    .on(icon, 'mouseout', this._resetZIndex, this);
        }


        if (options.opacity < 1) {
            this._updateOpacity();
        }

        var panes = this._map._panes;

        panes.markerPane.appendChild(this._icon);

    },

    // set position for the marker div
    _setIconStyles: function (img, name) {
        var options = this.options,
            size = L.point(options[name + 'Size']),
            anchor;

        anchor = L.point(options.iconAnchor);

        if (!anchor && size) {
            anchor = size.divideBy(2, true);
        }

        img.className = 'leaflet-marker-' + name + ' ' + options.className;

        if (anchor) {
            img.style.marginLeft = (-anchor.x) + 'px';
            img.style.marginTop = (-anchor.y) + 'px';
        }

        if (size) {
            img.style.width = size.x + 'px';
            img.style.height = size.y + 'px';
        }
    },

    // create icon and init event
    createIcon: function () {
        var divContainer = L.DomUtil.create('div', '');
        this._setIconStyles(divContainer, 'icon');

        this.oTagContanier = divContainer;
        var oShowConfig = this.options.oShowConfig;
        for (var cKey in oShowConfig) {
            if (!oShowConfig[cKey]) {
                continue;
            }
            var cTag = cKey.replace('bIs', 'o');
            if (this.oUIConfig.hasOwnProperty(cTag)) {
                var oTag = L.Measure.tipTag(this, this.oUIConfig[cTag]);
                oTag.setFlag(cTag);
                this.addTag(oTag);
                if (this.oUIConfig[cTag].bIsClick) {

                    oTag.setClick(this.closeHanler, this);
                }
            }
        }

        return divContainer;
    },

    // add html tag for list
    addTag: function (oTag) {
        var aoTag = this.aoTag;

        if (aoTag.length <= 0) {
            aoTag.push(oTag);
            this.oTagContanier.appendChild(oTag.oTag);
            return;
        }
        var nIndex = aoTag.length;
        for (var i = 0; i < aoTag.length; i++) {
            if (oTag.nOrder < aoTag[i].nOrder) {
                nIndex = i;
                break;
            }
        }
        if (nIndex === aoTag.length) {
            this.oTagContanier.appendChild(oTag.oTag);
            this.aoTag.push(oTag);
        }
        else {

            this.oTagContanier.insertBefore(oTag.oTag, this.aoTag[nIndex].oTag);
            this.aoTag.splice(nIndex, 0, oTag);
        }

    },

    // add tag close all marker
    addAllClose: function () {

        var oTag = this.getTagByFlag('oTotalClose');
        if (oTag) {
            return;
        }
        oTag = L.Measure.tipTag(this, this.oUIConfig.oTotalClose);
        oTag.setFlag('oTotalClose');
        this.addTag(oTag);

        oTag.setClick(function () {
            //L.DomEvent.off(this._icon, 'click', this._onMouseClick);
            this._oParent.deleteDist();
        }, this);
    },


    // delet oTag
    deleteTag: function (cFlag) {
        var aoTag = this.aoTag;
        if (!aoTag || aoTag.length <= 0) {
            return;
        }

        for (var i = 0; i < aoTag.length; i++) {
            if (aoTag[i].cFlag === cFlag) {
                this.oTagContanier.removeChild(aoTag[i].oTag);
                aoTag.splice(i, 1);
                break;
            }
        }
    },

    deleteSubTotalTag: function () {

        this.deleteTag('oSubTotalDist');
    },

    addTotalPenal: function (dTotal) {
        var oTag = this.getTagByFlag('oTotalDist');
        if (!oTag) {
            oTag = L.Measure.tipTag(this, this.oUIConfig.oTotalDist);
            oTag.setFlag('oTotalDist');
            this.addTag(oTag);
        }
        this.setTotalDist(dTotal, oTag);
    },

    setTotalDist: function (dTotal, oTag) {
        if (!oTag) {
            oTag = this.getTagByFlag('oTotalDist');
        }
        if (!oTag) {
            return;
        }
        this.deleteTag('oSubTotalDist');
        var cTemp = L.measure.TipMarker.addTotalPenal.total;
        var cDist = (dTotal / 1000).toFixed(2) + L.measure.TipMarker.addTotalPenal.until;
        oTag.setText(cTemp + cDist);
    },

    // set marker length
    setDist: function (dDist) {
        this.dDist = dDist;
        var oTag = this.getTagByFlag('oSubDist');
        if (!oTag) {
            return;
        }

        oTag.setText(dDist);
    },

    getTagByFlag: function (cFlag) {
        var aoTag = this.aoTag;
        if (!aoTag || aoTag.length <= 0) {
            return undefined;
        }
        for (var i = 0; i < aoTag.length; i++) {
            if (aoTag[i].cFlag === cFlag) {
                return aoTag[i];

            }
        }

        return undefined;
    },

    setSubTotalDist: function (dTotal) {
        var oTag = this.getTagByFlag('oSubTotalDist');
        if (!oTag) {
            return;
        }
        var cTemp = L.measure.TipMarker.setSubTotalDistTag.total;
        var cDist = (dTotal / 1000).toFixed(2) + L.measure.TipMarker.setSubTotalDistTag.until;
        oTag.setText(cTemp + cDist);
    },


    closeHanler: function () {
        //this.off({
        //    mouseover: this._bringToFront,
        //    mouseout: this._resetZIndex
        //});
        //L.DomEvent.off(this._icon, 'click', this._onMouseClick);

        this._oParent.removeTipMarker(this);
    },

});


L.Measure.tipMarker = function (oLatLng, tipMgr, options) {

    return new L.Measure.TipMarker(oLatLng, tipMgr, options);
};


/**
 * Created by liulin on 2016/9/12.
 * name:            measure.TipTag.js
 * des:             tag for the tip
 * author:          liulin
 * date:            2016-09-27
 */


// inhicnt Class
// TipMarker is new obj for markertipmarker
L.Measure.TipTag = L.Class.extend({
    // config tag is create or order
    options: {
        // show sub distance in marker
        cTagName: 'span',
        // class for the tag
        cClassName: '',
        // show sub marker total distance
        nOrder: 1,
        // show total dist
        cText: '',

    },

    // init tag for control
    initialize: function (oParent, options) {
        L.setOptions(this, options);
        this._oParent = oParent;
        this.createTag();
    },

    // create icon and init event
    createTag: function () {
        var oTag = L.DomUtil.create(this.options.cTagName, '');
        this.nOrder = this.options.nOrder;
        if (this.options.cClassName) {
            L.DomUtil.addClass(oTag, this.options.cClassName);
        }

        oTag.text = this.options.cText;

        this.oTag = oTag;

        return oTag;
    },

    setFlag: function (cFlag) {
        this.cFlag = cFlag;
        this.oTag.setAttribute('cFlag', cFlag);
    },

    setText: function (dDist) {
        if (typeof dDist === 'string') {
            this.oTag.innerText = dDist;
            return;
        }

        var cDist = L.measure.TipMarker.setText.beginText;
        if (dDist !== 0) {
            cDist = (dDist / 1000).toFixed(2) + L.measure.TipMarker.setText.until;
        }
        this.oTag.innerText = cDist;
    },

    setClick: function (fnCall, oContext) {
        L.DomEvent.on(this.oTag, 'click', fnCall, oContext);
    }

});


L.Measure.tipTag = function (oParent, options) {

    return new L.Measure.TipTag(oParent, options);
};


}(window, document));