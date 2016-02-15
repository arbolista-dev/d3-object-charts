import extend from 'extend';

const DEFAULTS = {
  outer_width: 500,
  outer_height: 300,
  margin: {top: 0, left: 70, bottom: 50, right: 20},
  domain_ticks: 10,
  range_ticks: 8,
  container: "container",
  time_series: false,
  range_label: undefined,
  domain_attr: undefined,
  range_attr: undefined,
  titleize: function(series, datum){
    var s = datum ? datum.name : series.title;
    if (!s) return '';
    var words = s.split(' '),
      array = [];
    for (var i=0; i<words.length; ++i) {
      array.push(words[i].charAt(0).toUpperCase() + words[i].toLowerCase().slice(1));
    }
    return array.join(' ');
  },
  toClass: function(series){
    return series ? series.title.toLowerCase().replace(/\s+/g, '-') : "";
  }
};


class Chart {

  constructor(options){
    var chart = this;
    chart =  extend(chart, chart.chart_options, options);

    chart.height = chart.outer_height - chart.margin.top - chart.margin.bottom;
    chart.width = chart.outer_width - chart.margin.left - chart.margin.right;

    chart.svg = d3.select(chart.container).append("svg")
        .attr("width", chart.outer_width)
        .attr("height", chart.outer_height)
      .append("g")
        .attr("transform", "translate(" + chart.margin.left + "," + chart.margin.top + ")");
    chart.defineAxes();
    if (chart.afterAxes) chart.afterAxes();
  }

}

Chart.DEFAULTS = DEFAULTS;

export default Chart;
