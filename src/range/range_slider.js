import Chart from './../base';

class RangeSlider extends Chart {
  get chart_options() {
    return Object.assign(Object.assign({}, Chart.DEFAULTS), {
      outer_width: 600,
      outer_height: 250,
      margin: {
        top: 20,
        left: 10,
        bottom: 20,
        right: 10
      },
    });
  }

  defineAxes() {
    var range_slider = this;

    range_slider.x_scale = d3.time.scale()
      .range([0, range_slider.width])
      .clamp(true);

    range_slider.x_axis = d3.svg.axis()
      .scale(range_slider.x_scale)
      .orient("bottom")
      .ticks(d3.time.weeks, 1)
      //.tickFormat(function(d) { return d + "°"; })
      .tickSize(1)
      .outerTickSize(1)
      .tickPadding(12)

    range_slider.svg.append("g")
      .attr("class", "d3-chart-domain")
      .attr("transform", "translate(0," + range_slider.height / 2 + ")");
  }

  afterAxes() {
    var range_slider = this;

    range_slider.slider = range_slider.svg.append("g")
      .attr("class", "d3-chart-slider");

    range_slider.min_handle = range_slider.slider.append("circle")
      .attr("class", "d3-chart-min-handle")
      .attr("transform", "translate(0," + range_slider.height / 2 + ")")
      .attr("r", 9);

    range_slider.max_handle = range_slider.slider.append("circle")
      .attr("class", "d3-chart-max-handle")
      .attr("transform", "translate(0," + range_slider.height / 2 + ")")
      .attr("r", 9);

    range_slider.brush = d3.svg.brush()
      .x(range_slider.x_scale);

    range_slider.slider
      .call(range_slider.brush)
      //.select(".background")
      //  .attr("height", range_slider.height);

    range_slider.slider.call(range_slider.brush)
      .selectAll(".extent,.resize")
      .remove();
  }

  drawData(data) {
    var range_slider = this;
    range_slider.x_scale.domain([data.abs_min, data.abs_max]);

    range_slider.svg.select(".d3-chart-domain")
      .call(range_slider.x_axis);

    range_slider.min_handle.attr('cx', range_slider.x_scale(data.current_min));
    range_slider.max_handle.attr('cx', range_slider.x_scale(data.current_max));

    range_slider.brush.extent([data.current_min, data.current_min])
      .on("brush", () => {
        RangeSlider.handleBrush(range_slider, eval('this'));
      });

    range_slider.slider
      .call(range_slider.brush.event)
      .transition() // gratuitous intro!
      .duration(750)
      .call(range_slider.brush.extent([data.current_min, data.current_min]))
      .call(range_slider.brush.event);
  }

  getMaxDelta(changed_date, other_date) {
    var range_slider = this;

    if (Math.abs(changed_date.getTime() - other_date.getTime()) > range_slider.max_delta) {
      if (changed_date > other_date) {
        return new Date(changed_date.getTime() - range_slider.max_delta);
      } else {
        return new Date(changed_date.getTime() + range_slider.max_delta);
      }
    }
    return false;
  }

  static handleBrush(range_slider, elem) {
    var date = range_slider.brush.extent()[0],
      current_min = parseInt(range_slider.min_handle.attr('cx')),
      current_max = parseInt(range_slider.max_handle.attr('cx'));

    if (!current_min && !current_max) return false
    if (d3.event.sourceEvent) { // not a programmatic event
      date = range_slider.x_scale.invert(d3.mouse(elem)[0]);
      range_slider.brush.extent([date, date]);
    }

    var value = range_slider.x_scale(date);

    if (value < current_max && value > current_min) {
      if (Math.abs(value - current_min) < Math.abs(value - current_max)) {
        range_slider.min_handle.attr('cx', value);
        current_min = value;
      } else {
        range_slider.max_handle.attr('cx', value);
        current_max = value;
      }
    } else if (value >= current_max) {
      range_slider.max_handle.attr('cx', value);
      current_max = value;
      if (d3.event.sourceEvent && range_slider.max_delta) {
        var new_current_min = range_slider.getMaxDelta(date, range_slider.x_scale.invert(current_min));
        if (new_current_min) range_slider.min_handle.attr('cx', range_slider.x_scale(new_current_min));
      }
    } else {
      range_slider.min_handle.attr('cx', value);
      current_min = value;
      if (d3.event.sourceEvent && range_slider.max_delta) {
        var new_current_max = range_slider.getMaxDelta(date, range_slider.x_scale.invert(current_max));
        if (new_current_max) range_slider.max_handle.attr('cx', range_slider.x_scale(new_current_max));
      }
    }


    if (d3.event.sourceEvent && range_slider.onRangeUpdated) {
      range_slider.onRangeUpdated(range_slider.x_scale.invert(current_min), range_slider.x_scale.invert(current_max));
    }
  }

}

export default RangeSlider;
