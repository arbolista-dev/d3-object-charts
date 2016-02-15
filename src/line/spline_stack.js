import LineChart from './line';

const INTERPOLATION = 'cardinal';

// inspired by https://bl.ocks.org/mbostock/3885211
class SplineStackChart extends LineChart {

  init(){
    var spline_stack = this;

    spline_stack.svg = d3.select(spline_stack.container).append("svg")
        .attr("width", spline_stack.outer_width)
        .attr("height", spline_stack.outer_height)
      .append("g")
        .attr("transform", "translate(" + spline_stack.margin.left + "," + spline_stack.margin.top + ")");

    spline_stack.area = d3.svg.area.interpolate(INTERPOLATION)
        .x(function(d, i) { return spline_stack.x_scale(d.x); })
        .y0(function(d) { return spline_stack.y_scale(d.y0); })
        .y1(function(d) { return spline_stack.y_scale(d.y0 + d.y); });

    spline_stack.stack = d3.layout.stack()
        .values(function(d) { return d.values; });

        // function that returns unique color based on series_title.
        spline_stack.color = d3.scale.category20();
        spline_stack.defineAxes();
  }

  get chart_options(){
    return {
      interpolation: INTERPOLATION
    };
  }

  serializeData(data){
    var spline_stack = this,
      serialized_data = {
        range_min: -Infinity,
        range_max: Infinity,
        domain_min: -Infinity,
        domain_max: Infinity };

    data.series.forEach(function(series, i){
      series.css_class = series.css_class || spline_stack.toClass ? spline_stack.toClass(series) : "";
      series.title = series.title || spline_stack.toClass ? spline_stack.titleize(series) : "";
      series.xy_values = series.values.map((value)=>{
        series_data.range_min = Math.min(series_data.range_min, value[line_chart.range_attr]);
        series_data.range_max = Math.max(series_data.range_max, value[line_chart.range_attr]);
        series_data.domain_min = Math.min(series_data.domain_min, value[line_chart.domain_attr]);
        series_data.domain_max = Math.max(series_data.domain_max, value[line_chart.domain_attr]);
        return {x: value[spline_stack.domain_attr], y: value[spline_stack.range_attr]};
      });
      serialized_data.series.push(series);
    });
    return serialized_data;
  };

  drawData(data){
    var spline_stack = this;
    data = spline_stack.serialize_data;

    // calibrate axes.
    bar_chart.y_scale.domain([Math.min(0, data.range_min), data.range_max]);
    bar_chart.svg.select(".d3-chart-range.d3-chart-axis")
      .call(bar_chart.y_axis);

    bar_chart.x_scale.domain([Math.min(data.domain_min), data.domain_max]);
    bar_chart.svg.select(".d3-chart-domain.d3-chart-axis").call(bar_chart.x_axis);

    var stack_data = spline_stack.stack(data.series),
      stack = svg.selectAll(".d3-chart-spline-stack")
        .data(stack_data);

    [stack.enter().append("g"), stack.transition()].forEach((groups)=>{
      applyData(groups);
    });
    stack.exit().remove();
  }

  applyData(groups){
    var spline_stack = this;
    groups
      .attr("class", function(series){"d3-chart-spline-stack " + series.css_class;})
      .append("path")
        .attr("d", function(series){ return spline_stack.area(series.xy_values); })
        .style("fill", function(series){ return spline_stack.color(series.name); });
  }
}
