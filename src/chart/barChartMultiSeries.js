import * as d3 from "d3";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Reusable 3D Bar Chart
 *
 * @module
 *
 * @see https://datavizproject.com/data-type/3d-bar-chart/
 * @example
 * var chartHolder = d3.select("#chartholder");
 * var myData = [...];
 * var myChart = d3.x3dom.chart.barChartMultiSeries();
 * chartHolder.datum(myData).call(myChart);
 */
export default function barChartMultiSeries() {

	/* Default Properties */
	let width = 500;
	let height = 500;
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["green", "red", "yellow", "steelblue", "orange"];
	let classed = "x3dBarChartMultiSeries";
	let debug = false;

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;
	
	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const { rowKeys, columnKeys, maxValue } = dataTransform(data).summary();
		const extent = [0, maxValue];
	
		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand().domain(columnKeys).rangeRound([0, dimensions.x]).padding(0.5);
		}

		if (typeof yScale === "undefined") {
			d3.scaleLinear().domain(extent).range([0, dimensions.y]).nice();
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleBand().domain(rowKeys).range([0, dimensions.z]).padding(0.7);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias barChartMultiSeries
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		const x3d = selection.append("x3d")
			.attr("width", width + "px")
			.attr("height", height + "px");

		if (debug) {
			x3d.attr("showLog", "true").attr("showStat", "true")
		}

		const scene = x3d.append("scene");

		// Update the chart dimensions and add layer groups
		const layers = ["axis", "chart"];
		scene.classed(classed, true)
			.selectAll("group")
			.data(layers)
			.enter()
			.append("group")
			.attr("class", d => d);

		const viewpoint = component.viewpoint()
			.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);
		scene.call(viewpoint);

		scene.append("directionallight")
			.attr("direction", "1 0 -1")
			.attr("on", "true")
			.attr("intensity", "0.4")
			.attr("shadowintensity", "0");

		scene.each(data => {
			init(data);

			// Construct Axis Component
			const axis = component.axisThreePlane()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale);

			// Construct Bars Component
			const chart = component.barsMultiSeries()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.colors(colors);

			scene.select(".axis")
				.call(axis);

			scene.select(".chart")
				.datum(data)
				.call(chart);
		});
	}

	/**
	 * Width Getter / Setter
	 *
	 * @param {number} _x - X3D canvas width in px.
	 * @returns {*}
	 */
	my.width = function(_x) {
		if (!arguments.length) return width;
		width = _x;
		return this;
	};

	/**
	 * Height Getter / Setter
	 *
	 * @param {number} _x - X3D canvas height in px.
	 * @returns {*}
	 */
	my.height = function(_x) {
		if (!arguments.length) return height;
		height = _x;
		return this;
	};

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: number, y: number, z: number}} _x - 3D object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(_x) {
		if (!arguments.length) return dimensions;
		dimensions = _x;
		return this;
	};

	/**
	 * X Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 scale.
	 * @returns {*}
	 */
	my.xScale = function(_x) {
		if (!arguments.length) return xScale;
		xScale = _x;
		return my;
	};

	/**
	 * Y Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 scale.
	 * @returns {*}
	 */
	my.yScale = function(_x) {
		if (!arguments.length) return yScale;
		yScale = _x;
		return my;
	};

	/**
	 * Z Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 scale.
	 * @returns {*}
	 */
	my.zScale = function(_x) {
		if (!arguments.length) return zScale;
		zScale = _x;
		return my;
	};

	/**
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 color scale.
	 * @returns {*}
	 */
	my.colorScale = function(_x) {
		if (!arguments.length) return colorScale;
		colorScale = _x;
		return my;
	};

	/**
	 * Colors Getter / Setter
	 *
	 * @param {Array} _x - Array of colours used by color scale.
	 * @returns {*}
	 */
	my.colors = function(_x) {
		if (!arguments.length) return colors;
		colors = _x;
		return my;
	};

	/**
	 * Debug Getter / Setter
	 *
	 * @param {boolean} _x - Show debug log and stats. True/False.
	 * @returns {*}
	 */
	my.debug = function(_x) {
		if (!arguments.length) return debug;
		debug = _x;
		return my;
	};

	return my;
}
