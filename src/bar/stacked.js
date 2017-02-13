import Chart from './../base';

class StackedBar extends Chart {
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
      chart_class: 'd3-chart-slider',
      fnSeriesClass: function(series){
        return series.name.replace(/\s+/g, '-').toLowerCase()
      },
      fnCategoryClass: function(category){
        return category.replace(/\s+/g, '-').toLowerCase();
      },
      xTickFormat: function(d, i){ return d; },
      yTickFormat: function(d, i){ return d; }
    });
  }

  defineAxes() {
    var stacked_bar = this;
    stacked_bar.y_axis = d3.svg.axis()
      .orient("left")
      .ticks(stacked_bar.y_ticks)
      .outerTickSize(0)
      .tickFormat(stacked_bar.yTickFormat);
    stacked_bar.y_scale = d3.scale.linear();

    stacked_bar.drawOne('.d3-chart-range.d3-chart-axis', 'g', (range_axis)=>{
      range_axis.attr("class", "d3-chart-range d3-chart-axis");
    });

    stacked_bar.x_scale = d3.scale.ordinal();

    stacked_bar.x_axis = d3.svg.axis()
      .orient('bottom')
      .outerTickSize(0)
      .tickFormat(stacked_bar.xTickFormat);

    stacked_bar.drawOne('.d3-chart-domain.d3-chart-axis', 'g', (domain_axis)=>{
      domain_axis.attr("class", "d3-chart-domain d3-chart-axis")
                  .attr("transform", "translate(0," + stacked_bar.height + ")");
    });

    stacked_bar.fnColor = stacked_bar.fnColor || d3.scale.category20();
  }

  drawData(data) {
    var stacked_bar = this;

    stacked_bar.x_scale.domain(data.categories)
                       .rangeRoundBands([0, stacked_bar.width], .1, 0);
    stacked_bar.x_axis.scale(stacked_bar.x_scale);

    stacked_bar.y_scale.domain(stacked_bar.dataExtent(data))
                       .range([stacked_bar.height, 0]);
    stacked_bar.y_axis.scale(stacked_bar.y_scale);

    stacked_bar.svg.select(".d3-chart-range").call(stacked_bar.y_axis);

    stacked_bar.svg.select(".d3-chart-domain").call(stacked_bar.x_axis);

    stacked_bar.tooltip = d3.select(stacked_bar.container).append('div').attr('class', 'tooltip');

    data.series.forEach((data_series, i) => {
      let y0 = 0;

      data_series.values.map((item) => {
        item.y0 = y0;
        item.y1 = y0 += item.value;
      })

      const series_class = stacked_bar.fnSeriesClass(data_series);
      const bars = stacked_bar.svg.selectAll(`.${series_class}`)
                                  .data(data_series.values);

      stacked_bar.applyData(data_series, bars, data.categories[i]);
      stacked_bar.applyData(data_series, bars.enter().append("rect"), data.categories[i]);

      bars.exit().remove();
    });

    stacked_bar.data = data;
    return stacked_bar;
  }

  dataExtent(data){
    let max = 0;
    for (let i = 0; i < data.series.length; i++){
      let sum = 0;
      for (let item of data.series[i].values){
        sum += item.value;
      }
      max = Math.max(max, sum)
    }
    return [0, max];
  }

  calculateRectExtent(data) {

  }

  applyData(data_series, bars, category){
    var stacked_bar = this,
      series_class = "d3-stacked-bar " + stacked_bar.fnSeriesClass(data_series);

    bars
      .attr("class", (d, i)=>{
        let category_class = stacked_bar.fnCategoryClass(data_series.values[i].title);
        return [series_class, category_class].join(' ');
      })
      .attr("y", function(d) {
        return stacked_bar.y_scale(d.y1);
      })
      .attr("height", function(d){
        return stacked_bar.y_scale(d.y0) - stacked_bar.y_scale(d.y1);
      })
      .attr("x", function(d, i) {
        return stacked_bar.x_scale(category);
      })
      .style('stroke', '#fff')
      .attr("width", function(d) {
        return stacked_bar.x_scale.rangeBand();
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

export default StackedBar;
