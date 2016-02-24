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

    // Y Axis Left - Bar chart
    chart.y_scale_left = d3.scale.linear()
      .range([chart.height, 0]);
    chart.y_axis_left = d3.svg.axis()
      .scale(chart.y_scale_left)
      .orient("left")
      .outerTickSize(1);

    // Y Axis Right - Line chart
    chart.y_scale_right = d3.scale.linear()
      .range([chart.height, 0]);
    chart.y_axis_right = d3.svg.axis()
      .scale(chart.y_scale_right)
      .orient("right")
      .outerTickSize(1);

    // X Axis
    if (chart.domain_attr === 'date') {
      chart.x_scale = d3.time.scale()
        .range([0, chart.width]);
    } else {
      chart.x_scale = d3.scale.ordinal()
        .rangeBands([0, chart.width]);
    }

    chart.x_axis = d3.svg.axis()
      .scale(chart.x_scale)
      .orient("bottom")
      .outerTickSize(1);

    // chart.x_axis.tickFormat(d3.time.format('%b %d at %H'))
    // chart.x_axis.ticks(d3.time.hour, 12);
    chart.svg.append("g")
      .attr("class", "d3-chart-range d3-chart-range-left d3-chart-axis");
    chart.svg.append("g")
      .attr("class", "d3-chart-range d3-chart-range-right d3-chart-axis")
      .attr("transform", "translate(" + (chart.width) + " ,0)");
    chart.svg.append("g")
      .attr("class", "d3-chart-domain d3-chart-axis")
      .attr("transform", "translate(0, " + (chart.height) + ")");
  }

  afterAxes() {
    var chart = this;
    chart.fnLine = d3.svg.line()
      .interpolate(chart.chart_options.interpolation)
      .x(function(d) {
        return chart.x_scale(d.date);
      })
      .y(function(d) {
        return chart.y_scale_right(d.value);
      });

    chart.fnColor = d3.scale.category10();
  }

  nestedExtent(data_series, series_values, domain_attr) {
    var extent = {
      min_domain: Infinity,
      max_domain: -Infinity,
      min_range: Infinity,
      max_range: -Infinity
    };
    data_series.forEach((series) => {
      series[series_values].forEach((date) => {
        extent.min_domain = Math.min(extent.min_domain, date.value);
        extent.max_domain = Math.max(extent.max_domain, date.value);
        extent.min_range = Math.min(extent.min_range, date.value);
        extent.max_range = Math.max(extent.max_range, date.value);
      });
    });
    return extent;
  }


  serializeData(data) {
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
          // Check if Object with specified date already exists. If yes, append values
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

  drawLineData(data) {
    var chart = this;

    // calibrate axes
    var nested_extent = chart.nestedExtent(data.line_series, 'values', chart.domain_attr);
    chart.y_scale_right.domain([nested_extent.min_domain, nested_extent.max_domain]);
    chart.svg.select(".d3-chart-range-right")
      .call(chart.y_axis_right);


    // draw lines
    var line = chart.svg.selectAll(".d3-chart-line")
      .data(data.line_series);

    chart.applyLineData(line.enter().append('g').attr("class", "line"), line.transition());
    line.exit().remove();
  }

  applyLineData(groups) {
    var chart = this;
    groups
      .attr("title", function(d) {
        return d.name;
      })
      .attr("class", "line");
    chart.svg.selectAll(".line")
      .append("path")
      .style("stroke", function(d) {
        return chart.fnColor(d.name);
      })
      .attr("d", function(d) {
        return chart.fnLine(d.values);
      });
  }


  drawBarData(data) {
    var chart = this;
    data = chart.serializeBarData(data);
    chart.defineDomain()

    chart.x_scale.domain(data.domain_extent);
    chart.svg.select(".d3-chart-domain").call(chart.x_axis);
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
    data = chart.serializeData(data);

    chart.x_scale.domain(data.domain_extent);
    chart.svg.select(".d3-chart-domain.d3-chart-axis").call(chart.x_axis);

    chart.drawLineData(data);

  }
}

export default CompositeBarChart;
