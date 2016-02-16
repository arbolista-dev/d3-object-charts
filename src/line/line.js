import extend from 'extend';

import Chart from './../base';


// inspired by https://gist.github.com/mbostock/4b66c0d9be9a0d56484e
class LineChart extends Chart {

  get chart_options(){
    return {
      interpolation: 'basis'
    };
  }

  defineAxes(){
    var chart = this;

    chart.y_scale = d3.scale.linear()
      .range([chart.height, 0]);
    chart.y_axis = d3.svg.axis()
      .scale(chart.y_scale)
      .orient("left")
      .outerTickSize(1);

    if (chart.time_series){
      chart.x_scale = d3.time.scale()
        .range([0, chart.width]);
    } else {
      chart.x_scale = d3.scale.linear()
        .range([0, chart.width]);
    }

    chart.x_axis = d3.svg.axis()
      .scale(chart.x_scale)
      .orient("bottom")
      .outerTickSize(0)
    //chart.x_axis.tickFormat(d3.time.format('%b %d at %H'))
    //chart.x_axis.ticks(d3.time.hour, 12);

    // append axes
    chart.svg.append("g")
        .attr("class", "d3-chart-range d3-chart-axis");
    chart.svg.append("g")
        .attr("class", "d3-chart-domain d3-chart-axis")
        .attr("transform", "translate(0, " + (chart.height) + ")");
  }

  afterAxes(){
    var line_chart = this;
    // function that draws the lines.
    line_chart.line = d3.svg.line()
      .interpolate(line_chart.chart_options.interpolation)
      .x(function(d){ return line_chart.x_scale(d[line_chart.domain_attr]); })
      .y(function(d){ return line_chart.y_scale(d[line_chart.range_attr]); });

    // function that returns unique color based on series_title.
    line_chart.color = d3.scale.category20();
  }

  serializeData(data){
    var line_chart = this,
      serialized_data = {
        series: [],
        range_min: Infinity,
        range_max: -Infinity,
        domain_min: Infinity,
        domain_max: -Infinity,
      };

    data.forEach(function(data_set){
      var series = extend({
          css_class: line_chart.toClass ? line_chart.toClass(data_set) : "",
          title: line_chart.titleize ? line_chart.titleize(data_set) : "",
          color: ''
        }, data_set);

      series.values.forEach((value)=>{
        series_data.range_min = Math.min(series_data.range_min, value[line_chart.range_attr]);
        series_data.range_max = Math.max(series_data.range_max, value[line_chart.range_attr]);
        series_data.domain_min = Math.min(series_data.domain_min, value[line_chart.domain_attr]);
        series_data.domain_max = Math.max(series_data.domain_max, value[line_chart.domain_attr]);
      });
      serialized_data.series.push(series);
    });
    return serialized_data;
  };

  drawData(data){
    var line_chart = this;
    data = line_chart.serialize_data;

    // calibrate axes
    bar_chart.y_scale.domain([Math.min(0, data.range_min), data.range_max]);
    bar_chart.svg.select(".d3-chart-range.d3-chart-axis")
      .call(bar_chart.y_axis);

    bar_chart.x_scale.domain([data.domain_max, Math.min(data.domain_min)]);
    bar_chart.svg.select(".d3-chart-domain.d3-chart-axis").call(bar_chart.x_axis);

    // draw lines
    var line = g.selectAll(".d3-chart-series")
        .data(data.series);

    [line.enter().append('g'), line.transition()].forEach((groups)=>{
      line_chart.applyData(groups);
    });
    line.exit().remove();
  }

  applyData(groups){
    var line_chart = this;
    groups
      .attr('class', function(series){ return "d3-chart-line " + series.css_class; })
      .attr("title", function(series){ return series.title; })
      .append("path")
        .attr("d", function(series){ return line_chart.line(series.values); })
        .style("stroke", function(series){ return line_chart.color(series.title); });
  }

}

export default LineChart;
