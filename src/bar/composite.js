import Chart from './../base';

// inspired by https://gist.github.com/mbostock/4b66c0d9be9a0d56484e
class CompositeBarChart extends Chart {

  get chart_options() {
    return Object.assign(Object.assign({}, Chart.DEFAULTS), {
      interpolation: 'basis',
      date_domain: true,
      domain_attr: 'date'
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
    chart.y_axis_right = d3.svg.axis()
      .scale(chart.y_scale_right)
      .orient("right")
      .outerTickSize(1);

    if (chart.domain_attr === 'date') {
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
        return chart.x_scale(d[chart.domain_attr]);
      })
      .y(function(d) {
        return chart.y_scale_right(d[chart.line_attr]);
      });
    chart.color = d3.scale.category10();
  }

  nestedExtent(data_series, series_values, domain_attr) {
    var extent = {
      min_domain: Infinity,
      max_domain: -Infinity,
    };
    data_series.forEach((series) => {
      series[series_values].forEach((date) => {
        extent.min_domain = Math.min(extent.min_domain, date.value);
        extent.max_domain = Math.max(extent.max_domain, date.value);
      });
    });
    return extent;
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

          var attr_index = serialized_data.line_series.findIndex(x => x.date === series.date);
          // Check if Object with specified date already exists. If yes, append values
          if (attr_index < 0) {
            serialized_data.line_series.push({
              date: series.date,
              values: [{
                name: attr,
                value: value[attr]
              }]
            });
          } else {
            serialized_data.line_series[attr_index].values.push({
              name: attr,
              value: value[attr]
            });
          }
        });

        // serialize attributes for bar graph
        chart.bar_attrs.forEach(function(attr) {

          var attr_index = serialized_data.bar_series.findIndex(x => x.date === series.date);
          // Check if Object with specified date already exists. If yes, append values
          if (attr_index < 0) {
            serialized_data.bar_series.push({
              date: series.date,
              values: [{
                name: attr,
                value: value[attr]
              }]
            });
          } else {
            serialized_data.bar_series[attr_index].values.push({
              name: attr,
              value: value[attr]
            });
          }
        });
      });

    });

    console.log("serialized composite data", serialized_data);
    return serialized_data;
  };
  //
  // defineDomain() {
  //   var chart = this;
  //
  //   chart.domain = domain;
  //   chart.x_scale.domain(domain);
  //   chart.svg.select(".d3-chart-domain")
  //     .call(chart.x_axis)
  //     .selectAll("text")
  //     .attr("transform", function() {
  //       var elem = this,
  //         bbox = elem.getBBox(),
  //         middleX = bbox.x + (bbox.width / 2),
  //         middleY = bbox.y + (bbox.height / 2);
  //       return "rotate(-30," + middleX + "," + middleY + ")";
  //     });
  // }

  drawLineData(data) {

    var chart = this;
    console.log("draw line data, chart", chart);
    var nested_extent = chart.nestedExtent(data.line_series, 'values', chart.domain_attr);
    // calibrate axes
    chart.y_scale_right.domain([Math.min(0, nested_extent.domain_min), nested_extent.domain_max]);
    chart.svg.select(".d3-chart-range-right")
      .call(chart.y_axis_right);

    // draw lines
    var line = chart.svg.selectAll(".d3-chart-line")
      .data(data.line_series);

    [line.enter().append('g'), line.transition()].forEach((groups) => {
      chart.applyLineData(groups, data.line_series);
    });
    line.exit().remove();
  }

  applyLineData(groups, series) {
    var chart = this;
    console.log(series);
    groups
      // .attr('class', function(series) {
      //   return "d3-chart-line " + chart.cssClass(series);
      // })
      .attr("title", function(chart) {
        return chart.line_title;
      })
      .append("path")
      .attr("d", function(series) {
        return chart.fnLine(series.values);
      });
      // .style("stroke", function(series) {
      //   return chart.fnColor('bla');
      // });
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
    var chart = this;
      // series_class = "d3-chart-bar " + series.css_class;
    elements
      // .attr("class", function(d) {
      //   return series_class + " " + d.css_class;
      // })
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


  drawData(data) {
    var chart = this;
    chart.defineDomain()
    data = chart.serializeData(data);
    chart.drawLineData(data);

  }
}

export default CompositeBarChart;
