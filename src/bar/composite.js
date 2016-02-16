import Chart from './../base';
import extend from 'extend';

// inspired by https://gist.github.com/mbostock/4b66c0d9be9a0d56484e
class CalendarGridChart extends Chart{

  get chart_options(){
    var chart = this;
    return extend(Chart.DEFAULTS, {
      margin: {top: 30, left: 150, bottom: 0, right: 0},
      grid_padding: 0.05,
      parse_date_format: '%Y-%m-%d',
      display_date_format: '%B %Y',
      date_attr: 'date',
      range_attr: undefined,
      min_range_zero: false,
      color: '#FFF',
      extent: []
    })
  }

  defineAxes(){
    var grid_chart = this;

    // y scale is dependent on number of months.
    grid_chart.y_axis = d3.svg.axis().orient("left").outerTickSize(0);
    grid_chart.y_scale = d3.scale.ordinal()
    grid_chart.svg.append("g")
        .attr("class", "d3-chart-range d3-chart-axis");

    grid_chart.x_scale = d3.scale.ordinal()
      .domain(d3.range(31).map((n)=>{ return n+1; }))
      .rangeRoundBands([0, grid_chart.width], grid_chart.grid_padding, 0);

    grid_chart.x_axis = d3.svg.axis()
      .scale(grid_chart.x_scale)
      .orient("top")
      .outerTickSize(0);

    // append x axis
    grid_chart.svg.append("g").attr("class", "d3-chart-domain d3-chart-axis");
  }

  afterAxes(){
    var grid_chart = this;
    grid_chart.grid_unit_size = grid_chart.width / 31 - grid_chart.grid_padding * grid_chart.width / 30;

    if (grid_chart.display_date_format) grid_chart.displayDate = d3.time.format(grid_chart.display_date_format);

    if (!grid_chart.toDate && grid_chart.parse_date_format){
      grid_chart.parseDate = d3.time.format(grid_chart.parse_date_format);
      grid_chart.toDate = (datum)=>{
        grid_chart.parseDate(datum[grid_chart.date_attr]);
      }
    } else if (!grid_chart.toDate){
      grid_chart.toDate = (datum)=>{ return datum[grid_chart.date_attr] };
    }


    grid_chart.monthFormat = d3.time.format('%B %Y');
    grid_chart.toMonthString = (datum)=>{
      return grid_chart.monthFormat(grid_chart.toDate(datum));
    }
  }

  serializeData(data){
    var grid_chart = this;
    data.css_class = data.css_class || grid_chart.toClass ? grid_chart.toClass(data) : "";

    grid_chart.rangeValue = grid_chart.range_attr ? function(d){ return d[grid_chart.range_attr]; } : grid_chart.rangeValue;

    data.months = [];
    if (data.min_range !== undefined && data.max_range !== undefined){
      data.range = {min: data.min_range, max: data.max_range};
      data.values.forEach((value)=>{
        var date = grid_chart.toDate(value),
          date_s = grid_chart.monthFormat(date);
        if (data.months.indexOf(date_s) < 0) data.months.push(date_s);
      });
    } else {
      var min_range = Infinity,
        max_range = -Infinity;
      data.values.forEach((value)=>{
        var date = grid_chart.toDate(value),
          date_s = grid_chart.monthFormat(date),
          range_value =grid_chart.rangeValue(value);
        min_range = Math.min(min_range, range_value);
        max_range = Math.max(max_range, range_value);
        if (data.months.indexOf(date_s) < 0) data.months.push(date_s);
      });
      if (grid_chart.min_range_zero) min_range = Math.min(min_range, 0);
      data.range = { min: min_range, max: max_range };
    }
    data.range.diff = data.range.max - data.range.min;

    data.months = data.months.sort((date_s1, date_s2)=>{
      var date1 = grid_chart.monthFormat.parse(date_s1),
        date2 = grid_chart.monthFormat.parse(date_s2);
      return date1.getTime() - date2.getTime();
    });
    return data;
  };

  drawData(data){
    var grid_chart = this;
    data = grid_chart.serializeData(data);

    // calibrate axes
    var y_axis_height = grid_chart.grid_unit_size * (1 + grid_chart.grid_padding) * data.months.length;
    grid_chart.y_scale.rangeRoundBands([0, y_axis_height], grid_chart.grid_padding, 0);
    grid_chart.y_scale.domain(data.months);
    grid_chart.y_axis.scale(grid_chart.y_scale);

    grid_chart.svg.select(".d3-chart-range")
      .call(grid_chart.y_axis);

    grid_chart.svg.select(".d3-chart-domain").call(grid_chart.x_axis);

   var grid_units = grid_chart.svg.selectAll(".d3-chart-grid-unit")
        .data(data.values);
    grid_chart.applyData(data, grid_units.enter().append("rect"));
    grid_chart.applyData(data, grid_units.transition());
    grid_units.exit().remove();
  }

  // helper method for drawData.
  applyData(data, elements){
    var grid_chart = this,
        series_class = "d3-chart-grid-unit " + data.css_class;
      elements
          .attr("class", function(d){ return series_class; })
          .attr("y", function(d) {
            var bottom = grid_chart.y_scale(grid_chart.toMonthString(d)),
              middle = grid_chart.y_scale.rangeBand() / 2 - grid_chart.grid_unit_size / 2;
            return bottom + middle;
          })
          .attr("height", grid_chart.grid_unit_size)
          .attr("x", function(d) {
            return grid_chart.x_scale(grid_chart.toDate(d).getDate());
          })
          .attr("width", function(d) { return grid_chart.grid_unit_size; })
          .attr('fill', grid_chart.color)
          .attr("opacity", function(d) { return grid_chart.applyOpacity(grid_chart.rangeValue(d), data.range);  });
  }

  applyOpacity(value, range){
    return Math.max(0, Math.min(1, 1 - (range.max - (value - range.min)) / range.diff));
  };

}

export default CalendarGridChart;
