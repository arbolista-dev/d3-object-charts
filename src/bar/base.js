import extend from 'extend';

// This class is inspired by // http://bl.ocks.org/mbostock/3885304.

const DEFAULTS = {
  outer_width: 500,
  outer_height: 300,
  margin: {top: 0, left: 70, bottom: 50, right: 20},
  horizontal: true,
  range_ticks: 10,
  container: "container",
  range_label: "range",
  titleize: function(series, datum){
    var s = datum ? datum.name : series.name,
      words = s.split(' ');
    var array = [];
    for (var i=0; i<words.length; ++i) {
      array.push(words[i].charAt(0).toUpperCase() + words[i].toLowerCase().slice(1));
    }
    return array.join(' ');
  },
  toClass: function(series, datum){
    return datum ? datum.name.toLowerCase(): series.name.toLowerCase();
  },
  series_opacity_gradient: true
}

class BarChart {

  constructor(options){
    var bar_chart = this;
    bar_chart =  extend(bar_chart, DEFAULTS, bar_chart.chart_options, options);

    bar_chart.height = bar_chart.outer_height - bar_chart.margin.top - bar_chart.margin.bottom;
    bar_chart.width = bar_chart.outer_width - bar_chart.margin.left - bar_chart.margin.right;

    bar_chart.init();
  }

  init(){
    var bar_chart = this;

    bar_chart.svg = d3.select(bar_chart.container).append("svg")
        .attr("width", bar_chart.outer_width)
        .attr("height", bar_chart.outer_height)
      .append("g")
        .attr("transform", "translate(" + bar_chart.margin.left + "," + bar_chart.margin.top + ")");
    bar_chart.defineAxes();
  }

  serializeData(data){
    var bar_chart = this,
      serialized_data = {
        max: undefined,
        series: []
      };

    data.forEach(function(data_set){
      var series = extend({
        css_class: bar_chart.toClass ? bar_chart.toClass(data_set) : "",
        title: bar_chart.titleize ? bar_chart.titleize(data_set) : ""
      }, data_set);
      series.total = 0;
      series.values = [];
      data_set.values.forEach(function(datum, j){
        var series_datum = extend({
          name: datum.name,
          value: datum.value,
          cummulative: series.total,
          css_class: bar_chart.toClass ? bar_chart.toClass(data_set, datum) : "",
          title: bar_chart.titleize ? bar_chart.titleize(data_set, datum) : "",
          opacity: 1.0 - 0.5 * (j / data_set.values.length)
        }, datum);
        series_datum.series = series;
        series.total += datum.value;
        series.values.push(series_datum);
      });
      serialized_data.series.push(series);
      serialized_data.max = serialized_data.max === undefined ?
          series.total :
          Math.max(serialized_data.max, Math.abs(series.total));
    });
    return serialized_data;
  };

}
