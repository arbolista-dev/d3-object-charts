import BarChart from './bar.base';

class VerticalBarChart extends BarChart {

  defineAxes(){
    var bar_chart = this;
    bar_chart.y_scale = d3.scale.ordinal()
      .rangeRoundBands([bar_chart.height, 0], 0.1);

    bar_chart.y_axis = d3.svg.axis()
      .scale(bar_chart.y_scale)
      .ticks(bar_chart.range_ticks)
      .orient("left")
      .outerTickSize(0);

    bar_chart.x_scale = d3.scale.linear()
      .range([0, bar_chart.width]);

    bar_chart.x_axis = d3.svg.axis()
      .scale(bar_chart.x_scale)
      .orient("bottom");

    // append axes
    bar_chart.svg.append("g")
        .attr("class", "d3-chart-range d3-chart-axis");
    bar_chart.svg.append("g")
        .attr("class", "d3-chart-domain d3-chart-axis")
        .attr("transform", "translate(0, " + (bar_chart.height - bar_chart.margin.top) + ")");
  }

  drawData(data){
    var bar_chart = this;
    data = bar_chart.serializeData(data);

    // calibrate axes
    bar_chart.x_scale.domain(data.series.reverse().map((d)=>{ return d.name; }));
    bar_chart.svg.select(".d3-chart-domain.d3-chart-axis")
      .call(bar_chart.x_axis)
      .selectAll("text")
          .attr("transform", function(){
            var elem = this,
                bbox = elem.getBBox(),
                middleX = bbox.x + (bbox.width / 2),
                middleY = bbox.y + (bbox.height / 2);
            return "rotate(-30,"+middleX + "," + middleY+")";
          });

    bar_chart.y_scale.domain([data.min, data.max]);
    bar_chart.svg.select(".d3-chart-range.d3-chart-axis").call(bar_chart.y_axis);

    data.series.forEach(function(series){
      var bars = bar_chart.svg.selectAll(".d3-chart-rect.d3-chart-bar." + series.css_class)
          .data(series.values);
      bar_chart.applyData(series, bars.enter().append("rect"));
      bar_chart.applyData(series, bars.transition());
      bars.exit().remove();
    });
  }

  // helper method for drawData
  applyData(series, elements){
    var bar_chart = this,
        series_class = "d3-chart-bar " + series.css_class;
      elements
          .attr("class", function(d){ return series_class + " " + d.css_class; })
          .attr("title", function(d){ return d.title; })
          .attr("width", function(d) {  return bar_chart.x_scale.rangeBand(); })
          .attr("x", function(d) { return bar_chart.x_scale(series.name); })
          .attr("height", return bar_chart.y_scale(d.value))
          .attr("y", function(d) { return bar_chart.y_scale(d.cummulative); })
          .attr("opacity", function(d) { return d.opacity;  });
  }

}

export default VerticalBarChart;
