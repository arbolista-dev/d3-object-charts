import Chart from './../base';

class OverlapBar extends Chart {
  get chart_options() {
    return Object.assign(Object.assign({}, Chart.DEFAULTS), {
      outer_width: 600,
      outer_height: 400,
      margin: {
        top: 20,
        left: 30,
        bottom: 20,
        right: 30
      },
      y_ticks: 7,
      chart_class: 'd3-overlap-bar-chart',
      seriesClass: function(series){ return series.name; },
      xTickFormat: function(d, i){ return d; },
      yTickFormat: function(d, i){ return d; }
    });
  }

  defineAxes() {
    var overlap_bar = this;
    // y scale is dependent on number of months.
    overlap_bar.y_axis = d3.svg.axis()
      .orient("left")
      .ticks(overlap_bar.y_ticks)
      .outerTickSize(0)
      .tickFormat(overlap_bar.yTickFormat);
    overlap_bar.y_scale = d3.scale.linear();

    overlap_bar.drawOne('.d3-chart-range.d3-chart-axis', 'g', (range_axis)=>{
      range_axis.attr("class", "d3-chart-range d3-chart-axis");
    });

    overlap_bar.x_scale = d3.scale.ordinal();

    overlap_bar.x_axis = d3.svg.axis()
      .orient('bottom')
      .outerTickSize(0)
      .tickFormat(overlap_bar.xTickFormat);

    // append x axis
    overlap_bar.drawOne('.d3-chart-domain.d3-chart-axis', 'g', (domain_axis)=>{
      domain_axis.attr("class", "d3-chart-domain d3-chart-axis")
                  .attr("transform", "translate(0," + overlap_bar.height + ")");
    });

    overlap_bar.fnColor = overlap_bar.fnColor || d3.scale.category20();
  }

  drawData(data) {
    var overlap_bar = this;

    overlap_bar.x_scale.domain(data.categories)
      .rangeRoundBands([0, overlap_bar.width], 0.1, 0);;
    overlap_bar.x_axis.scale(overlap_bar.x_scale);

    let extent = overlap_bar.dataExtent(data);
    overlap_bar.y_scale.domain(extent)
      .range([overlap_bar.height, 0]);
    overlap_bar.y_axis.scale(overlap_bar.y_scale);

    overlap_bar.svg.select(".d3-chart-range")
      .call(overlap_bar.y_axis);

    overlap_bar.svg.select(".d3-chart-domain").call(overlap_bar.x_axis);

    data.series.forEach((data_series)=>{
      let series_class = overlap_bar.seriesClass(data_series),
          bars = overlap_bar.svg.selectAll(`.${series_class}`)
                      .data(data_series.values);
      overlap_bar.applyData(data_series, bars, data.categories);
      overlap_bar.applyData(data_series, bars.enter().append("rect"), data.categories);
      bars.exit().remove();
    });
    overlap_bar.data = data;
    return overlap_bar;
  }

  dataExtent(data){
    let min = 0, max = 0;
    for (let i=0; i<data.series.length; i++){
      let series = data.series[i];
      for (let value of series.values){
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
    }
    return [min, max];
  }

  applyData(data_series, bars, categories){
    var overlap_bar = this,
      series_class = "d3-overlap-bar " + overlap_bar.seriesClass(data_series);

    bars
      .attr("class", series_class)
      .attr("y", function(d) {
        return overlap_bar.y_scale(d);
      })
      .attr("height", function(d){
        return overlap_bar.height - overlap_bar.y_scale(d);
      })
      .attr("x", function(d, i) {
        return overlap_bar.x_scale(categories[i]);
      })
      .attr("width", function(d) {
        return overlap_bar.x_scale.rangeBand();
      });
  }

  redraw(opts){
    let chart = this;
    Object.assign(chart, opts);
    chart.height = chart.outer_height - chart.margin.top - chart.margin.bottom;
    chart.width = chart.outer_width - chart.margin.left - chart.margin.right;
    d3.select(chart.container + ' svg')
        .attr("width", chart.outer_width)
        .attr("height", chart.outer_height)
      .select(".d3-object-container")
        .attr("transform", "translate(" + chart.margin.left + "," + chart.margin.top + ")");
    chart.defineAxes();
    if (chart.afterAxes) chart.afterAxes();
    chart.drawData(chart.data);
  }

}

export default OverlapBar;
