import LineChart from './line';

const INTERPOLATION = 'cardinal';

// inspired by https://bl.ocks.org/mbostock/3885211
class SplineStackChart extends LineChart {

  get chart_options(){
    return Object.assign(LineChart.DEFAULTS, {
      interpolation: INTERPOLATION
    });
  }

  afterAxes(){
    var spline_stack = this;
    spline_stack.fnArea = d3.svg.area()
        .x(function(d, i) { return spline_stack.x_scale(d.x); })
        .y0(function(d) { return spline_stack.y_scale(d.y0); })
        .y1(function(d) { return spline_stack.y_scale(d.y0 + d.y); })
        .interpolate(spline_stack.interpolation);

    spline_stack.fnStack = d3.layout.stack()
        .values(function(d) { return d.values; });

    // function that returns unique color based on series_title.
    spline_stack.fnColor = d3.scale.category20();
  }

  serializeData(data){
    var spline_stack = this,
      serialized_data = {
        series: [] };

    data.series.forEach(function(series, i){
      series.css_class = series.css_class || spline_stack.toClass ? spline_stack.toClass(series) : "";
      series.title = series.title || spline_stack.toClass ? spline_stack.titleize(series) : "";
      if (spline_stack.domain_attr !== 'x' && spline_stack.range_attr !== 'y'){
        series.values = series.values.map((value)=>{
          return {x: value[spline_stack.domain_attr], y: value[spline_stack.range_attr], series: series};
        });
      }
      serialized_data.series.push(series);
    });
    serialized_data.series = spline_stack.fnStack(serialized_data.series);
    // assume all series have same domain, use first series to establish extent.
    serialized_data.domain_extent = d3.extent(serialized_data.series[0].values.map((value)=>{ return value.x; }));
    // final series will have the highest y values.
    serialized_data.range_max = d3.max(serialized_data.series[serialized_data.series.length - 1].values.map((value)=>{ return value.y0 + value.y; }))

    return serialized_data;
  };

  drawData(data){
    var spline_stack = this;
    data = spline_stack.serializeData(data);

    // calibrate axes.
    spline_stack.y_scale.domain([0, data.range_max]);
    spline_stack.svg.select(".d3-chart-range.d3-chart-axis")
      .call(spline_stack.y_axis);

    spline_stack.x_scale.domain(data.domain_extent);
    spline_stack.svg.select(".d3-chart-domain.d3-chart-axis").call(spline_stack.x_axis);

    var stack = spline_stack.svg.selectAll(".d3-chart-spline-stack")
        .data(data.series);
    [stack.enter().append("path"), stack.transition()].forEach((paths)=>{
      spline_stack.applyData(paths);
    });
    stack.exit().remove();
  }

  applyData(paths){
    var spline_stack = this;
    paths
      .attr("class", function(series){"d3-chart-spline-stack " + series.css_class;})
      .attr("d", function(series){ return spline_stack.fnArea(series.values); })
      .style("fill", function(series){ return spline_stack.fnColor(series.title); });
  }
}

export default SplineStackChart;
