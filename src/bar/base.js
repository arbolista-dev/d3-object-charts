import extend from 'extend';

// This class is inspired by // http://bl.ocks.org/mbostock/3885304.
class BarChart {

  get chart_options(){
    return {
      series_opacity_gradient: true,
      margin: {top: 0, left: 70, bottom: 50, right: 20}
    };
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

export default BarChart;
