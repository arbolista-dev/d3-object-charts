import Chart from './../base';

// inspired by https://gist.github.com/mbostock/4b66c0d9be9a0d56484e
class CompositeBarChart extends Chart {

  get chart_options() {
    return Object.assign({}, Chart.DEFAULTS);
  }

  afterAxes() {
    var composite_chart = this;
    composite_chart.fnLine = d3.svg.line()
      .interpolate(composite_chart.chart_options.interpolation)
      .x(function(d) {
        return line_chart.x_scale(d[line_chart.domain_attr]);
      })
      .y(function(d) {
        return line_chart.y_scale_right(d[line_chart.line_attr]);
      });
  }

  defineAxes() {
    var chart = this;

    // Axes Left
    chart.y_scale_left = d3.scale.linear()
      .range([chart.height, 0]);
    chart.y_axis_left = d3.svg.axis()
      .scale(chart.y_scale_left)
      .orient("left")
      .outerTickSize(0);

    // Axes Right
    chart.y_scale_right = d3.scale.linear()
      .range([chart.height, 0]);
    chart.y_axis_left = d3.svg.axis()
      .scale(chart.y_scale_right)
      .orient("right")
      .outerTickSize(0);

    chart.x_scale = d3.scale.ordinal()
      .rangeRoundBands([chart.height, 0], 0.1);

    chart.x_axis = d3.svg.axis()
      .scale(chart.x_scale)
      .orient("bottom")
      .outerTickSize(0)
      //chart.x_axis.tickFormat(d3.time.format('%b %d at %H'))
      //chart.x_axis.ticks(d3.time.hour, 12);

    // append axis groups.
    chart.svg.append("g")
      .attr("class", "d3-chart-range d3-chart-range-left d3-chart-axis");
    chart.svg.append("g")
      .attr("class", "d3-chart-range d3-chart-range-right d3-chart-axis");
    chart.svg.append("g")
      .attr("class", "d3-chart-domain d3-chart-axis")
      .attr("transform", "translate(0, " + (chart.height) + ")");
  }

  defineDomain(domain) {
    var chart = this;

    chart.domain = domain;
    chart.x_scale.domain(domain);
    chart.svg.select(".d3-chart-domain")
      .call(chart.x_axis)
      .selectAll("text")
      .attr("transform", function() {
        var elem = this,
          bbox = elem.getBBox(),
          middleX = bbox.x + (bbox.width / 2),
          middleY = bbox.y + (bbox.height / 2);
        return "rotate(-30," + middleX + "," + middleY + ")";
      });
  }

  drawBarData(data) {
    var chart = this;
    data = chart.serializeBarData(data);

    chart.y_scale_left.domain(data.range_extent);
    chart.svg.select(".d3-chart-range").call(chart.y_axis_left);

    data.series.forEach(function(series) {
      var filtered_values = series.values.filter((value) => {
        return chart.domain.indexOf(value[chart.domain_attr]) < 0;
      })
      bars = chart.svg.selectAll(".d3-chart-bar")
        .data(series.values);
      chart.applyData(series, bars.enter().append("rect"));
      chart.applyData(series, bars.transition());
      bars.exit().remove();
    });
  }

  // helper method for drawData
  applyBarData(series, elements) {
    var chart = this,
      series_class = "d3-chart-bar " + series.css_class;
    elements
      .attr("class", function(d) {
        return series_class + " " + d.css_class;
      })
      .attr("title", function(d) {
        return d.title;
      })
      .attr("width", chart.x_scale.rangeBand())
      .attr("x", chart.x_scale(series.title))
      .attr("height", function(d) {
        return chart.y_scale(d[chart.bar_attr]);
      })
      .attr("y", function(d) {
        return chart.y_scale(d.cummulative);
      })
      .attr('fill', function(d) {
        return chart.fnColor(d.title);
      });
  }

  drawLineData(data) {

    var chart = this;
    var nested_extent = chart.nestedExtent(data.series, 'values', chart.domain_attr, chart.line_attr);

    // calibrate axes
    bar_chart.y_scale_right.domain([Math.min(0, nested_extent.range_min), nested_extent.range_max]);
    bar_chart.svg.select(".d3-chart-range-right")
      .call(bar_chart.y_axis_right);

    // draw lines
    var line = g.selectAll(".d3-chart-line")
      .data(data.series);

    [line.enter().append('g'), line.transition()].forEach((groups) => {
      line_chart.applyLineData(groups, data.series);
    });
    line.exit().remove();
  }

  applyLineData(groups) {
    var chart = this;
    groups
      .attr('class', function(series) {
        return "d3-chart-line " + chart.cssClass(series);
      })
      .attr("title", function(series) {
        return series.title;
      })
      .append("path")
      .attr("d", function(series) {
        return chart.fnLine(series.values.filter((value) => {
          return chart.domain.indexOf(value[chart.domain_attr]) < 0;
        }));
      })
      .style("stroke", function(series) {
        return line_chart.fnColor(series.title);
      });
  }
}

export default CompositeBarChart;
