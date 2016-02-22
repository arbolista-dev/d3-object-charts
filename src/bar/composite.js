import Chart from './../base';

// inspired by https://gist.github.com/mbostock/4b66c0d9be9a0d56484e
class CompositeBarChart extends Chart {

  get chart_options() {
    return Object.assign(Object.assign({}, Chart.DEFAULTS), {
      interpolation: 'basis',
      date_domain: true
    });
  }

  defineAxes() {
    var chart = this;

    // Axes Left - Bar chart
    chart.y_scale_left = d3.scale.linear()
      .range([chart.height, 0]);
    chart.y_axis_left = d3.svg.axis()
      .scale(chart.y_scale_left)
      .orient("left")
      .outerTickSize(1);

    // Axes Right - Line chart
    chart.y_scale_right = d3.scale.linear()
      .range([chart.height, 0]);
    chart.y_axis_left = d3.svg.axis()
      .scale(chart.y_scale_right)
      .orient("right")
      .outerTickSize(1);

    if (chart.date_domain) {
      chart.line_domain_attr = 'date';
      chart.x_scale = d3.time.scale()
        .range([0, chart.width]);
    } else {
      chart.x_scale = d3.scale.ordinal()
        .rangeBands([0, chart.width]);
    }

    chart.x_axis = d3.svg.axis()
      .scale(chart.x_scale)
      .orient("bottom");
    // .outerTickSize(0)
    //chart.x_axis.tickFormat(d3.time.format('%b %d at %H'))
    //chart.x_axis.ticks(d3.time.hour, 12);

    chart.svg.append("g")
      .attr("class", "d3-chart-range d3-chart-range-left d3-chart-axis");
    chart.svg.append("g")
      .attr("class", "d3-chart-range d3-chart-range-right d3-chart-axis");
    chart.svg.append("g")
      .attr("class", "d3-chart-domain d3-chart-axis")
      .attr("transform", "translate(0, " + (chart.height) + ")");
  }

  afterAxes() {
    var chart = this;
    chart.fnLine = d3.svg.line()
      .interpolate(chart.chart_options.interpolation)
      .x(function(d) {
        return chart.x_scale(d[chart.line_domain_attr]);
      })
      .y(function(d) {
        return chart.y_scale_right(d[chart.line_attr]);
      });
    chart.color = d3.scale.category10();
  }

  serializeData(data) {
    console.log("unserialized composite data", data);
    var chart = this,
      serialized_data = {
        line_series: [],
        bar_series: [],
      };

    // domain, if set to date
    // @ToDo: Handle other domain types
    serialized_data.domain_extent = d3.extent(data.series.map((d) => {
      return d.date
    }));

    data.series.forEach(function(series, i) {
      series.values = series.values.map((value) => {

        // serialize attributes for line graph
        chart.line_attrs.forEach(function(attr) {

          var attr_index = serialized_data.line_series.findIndex(x => x.name === attr);
          // Check if object attribute name already exists

          if (attr_index < 0) {
            serialized_data.line_series.push({
              name: attr,
              values: [{
                date: series.date,
                value: value[attr]
              }]
            });
          } else {
            serialized_data.line_series[attr_index].values.push({
              date: series.date,
              value: value[attr]
            });
          }
        });
      });

    });

    console.log("serialized composite data", serialized_data);
    return serialized_data;
  };

  // groupData(graph_name, series) {
  // };

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
        return chart.y_scale(d[chart.bar_attrs]);
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

  drawData(data) {
    var chart = this;
    data = chart.serializeData(data);
  }
}

export default CompositeBarChart;
