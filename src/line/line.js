import extend from 'extend';

const DEFAULTS = {
  outer_width: 500,
  outer_height: 300,
  margin: {top: 0, left: 70, bottom: 50, right: 20},
  domain_ticks: 10,
  range_ticks: 8,
  container: "container",
  time_series: true,
  range_label: "range",
  domain_attr: null,
  range_attr:
  titleize: function(series, datum){
    var s = datum ? datum.name : series.name,
      words = s.split(' '),
      array = [];
    for (var i=0; i<words.length; ++i) {
      array.push(words[i].charAt(0).toUpperCase() + words[i].toLowerCase().slice(1));
    }
    return array.join(' ');
  },
  toClass: function(series){
    return series ? series.title.toLowerCase().replace(/\s+/g, '-') : "";
  }
}

// inspired by https://gist.github.com/mbostock/4b66c0d9be9a0d56484e
class LineChart {

  constructor(options){
    var line_chart = this;
    line_chart =  extend(line_chart, DEFAULTS, options);

    line_chart.height = line_chart.outer_height - line_chart.margin.top - line_chart.margin.bottom;
    line_chart.width = line_chart.outer_width - line_chart.margin.left - line_chart.margin.right;

    line_chart.init();
  }

  get chart_options(){
    return {
      interpolation: 'basis'
    };
  }

  init(){
    var line_chart = this;

    line_chart.svg = d3.select(line_chart.container).append("svg")
        .attr("width", line_chart.outer_width)
        .attr("height", line_chart.outer_height)
      .append("g")
        .attr("transform", "translate(" + line_chart.margin.left + "," + line_chart.margin.top + ")");

    // function that draws the lines.
    line_chart.line = d3.svg.line()
      .interpolate(line_chart.chart_options.interpolation)
      .x(function(d){ return x(d[line_chart.domain_attr]); })
      .y(function(d){ return y(d[line_chart.range_attr]); });

    // function that returns unique color based on series_title.
    line_chart.color = d3.scale.category20();

    line_chart.defineAxes();
  }

  defineAxes(){
    var line_chart = this;

    line_chart.y_scale = d3.scale.linear()
      .range([line_chart.height, 0]);
    line_chart.y_axis = d3.svg.axis()
      .scale(line_chart.y_scale)
      .orient("left");

    if (line_chart.time_series){
      line_chart.x_scale = d3.time.scale(),
        .range([0, line_chart.width]););
    } else {
      line_chart.x_scale = d3.scale.linear()
        .range([0, line_chart.width]);
    }

    line_chart.x_axis = d3.svg.axis()
      .scale(line_chart.x_scale)
      .orient("bottom");

    // append axes
    line_chart.svg.append("g")
        .attr("class", "d3-chart-range d3-chart-axis")
        .attr("transform", "translate(0, " + (line_chart.height - line_chart.margin.top) + ")");
    line_chart.svg.append("g")
        .attr("class", "d3-chart-domain d3-chart-axis");
  }

  serializeData(data){
    var line_chart = this,
      serialized_data = {
        series: [],
        range_min: -Infinity,
        range_max: Infinity,
        domain_min: -Infinity,
        domain_max: Infinity,
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

    bar_chart.x_scale.domain([Math.min(data.domain_min), data.domain_max]);
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
      .attr('class', function(series){ return "d3-chart-line " + series.css_class; )
      .attr("title", function(series){ return series.title; })
      .append("path")
        .attr("d", function(series){ return line_chart.line(series.values); })
        .style("stroke", function(series){ return line_chart.color(series.title); });
  }

}

export default LineChart;
