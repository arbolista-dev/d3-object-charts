import Chart from './../base';

class RangeSlider extends Chart {
  get chart_options() {
    return Object.assign(Object.assign({}, Chart.DEFAULTS), {
      outer_width: 600,
      outer_height: 100,
      margin: {
        top: 20,
        left: 30,
        bottom: 20,
        right: 30
      },
      tick_amount: 6,
      chart_class: 'd3-range-slider'
    });
  }

  defineAxes() {
    var range_slider = this;

    if (range_slider.date_range) {
      range_slider.x_scale = d3.time.scale()
        .range([0, range_slider.width])
        .clamp(true);
    } else {
      range_slider.x_scale = d3.scale.linear()
        .range([0, range_slider.width])
        .clamp(true);
    }

    range_slider.x_axis = d3.svg.axis()
      .scale(range_slider.x_scale)
      .orient("bottom")
      .tickSize(1)
      .ticks(range_slider.tick_amount)
      .outerTickSize(1)
      .tickPadding(12);

    range_slider.svg.append("g")
      .attr("class", "d3-chart-domain d3-slider-axis")
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
      .call(range_slider.brush);

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
      .transition()
      .duration(750)
      .call(range_slider.brush.extent([data.current_min, data.current_min]))
      .call(range_slider.brush.event);
  }

  getDelta(type, changed_datum, other_datum) {
    var range_slider = this;

    if (type === 'max') {
      if (range_slider.date_range) {
        if (Math.abs(changed_datum.getTime() - other_datum.getTime()) > range_slider.delta.max) {
          if (changed_datum > other_datum) {
            return new Date(changed_datum.getTime() - range_slider.delta.max);
          } else {
            return new Date(changed_datum.getTime() + range_slider.delta.max);
          }
        }
      } else {
        if (Math.abs(changed_datum - other_datum) > range_slider.delta.max) {
          if (changed_datum > other_datum) {
            return (changed_datum - range_slider.delta.max);
          } else {
            return (changed_datum + range_slider.delta.max);
          }
        }
      }
      return false;
    } else if (type === 'min') {
      if (range_slider.date_range) {
        if (Math.abs(changed_datum.getTime() - other_datum.getTime()) <= range_slider.delta.min) {
          if (changed_datum < other_datum) {
            return new Date(changed_datum.getTime() + range_slider.delta.min);
          } else {
            return new Date(changed_datum.getTime() - range_slider.delta.min);
          }
        }
      } else {
        if (Math.abs(changed_datum - other_datum) <= range_slider.delta.min) {
          if (changed_datum < other_datum) {
            return (changed_datum + range_slider.delta.min);
          } else {
            return (changed_datum - range_slider.delta.min);
          }
        }
      }
      return false;
    }
  }

  static handleBrush(range_slider, elem) {
    var datum = range_slider.brush.extent()[0],
      current_min = parseInt(range_slider.min_handle.attr('cx')),
      current_max = parseInt(range_slider.max_handle.attr('cx'));

    if (!current_min && !current_max) return false
    if (d3.event.sourceEvent) { // not a programmatic event
      datum = range_slider.x_scale.invert(d3.mouse(elem)[0]);
      range_slider.brush.extent([datum, datum]);
    }

    var value = range_slider.x_scale(datum);

    if (value < current_max && value > current_min) {
      // move min / max handle towards the other handle
      if (Math.abs(value - current_min) < Math.abs(value - current_max)) {
        // move min towards max
        range_slider.min_handle.attr('cx', value);
        current_min = value;
        if (d3.event.sourceEvent && range_slider.delta.min) {
          var new_current_min = range_slider.getDelta('min', datum, range_slider.x_scale.invert(current_max));
          if (new_current_min) range_slider.max_handle.attr('cx', range_slider.x_scale(new_current_min));
        }
      } else {
        // move max towards min
        range_slider.max_handle.attr('cx', value);
        current_max = value;
        if (d3.event.sourceEvent && range_slider.delta.min) {
          var new_current_min = range_slider.getDelta('min', datum, range_slider.x_scale.invert(current_min));
          if (new_current_min) range_slider.min_handle.attr('cx', range_slider.x_scale(new_current_min));
        }
      }
    } else if (value >= current_max) {
      // move max handle
      range_slider.max_handle.attr('cx', value);
      current_max = value;
      if (d3.event.sourceEvent && range_slider.delta.max) {
        var new_current_min = range_slider.getDelta('max', datum, range_slider.x_scale.invert(current_min));
        if (new_current_min) range_slider.min_handle.attr('cx', range_slider.x_scale(new_current_min));
      }
    } else if (value <= current_min) {
      range_slider.min_handle.attr('cx', value);
      current_min = value;
      if (d3.event.sourceEvent && range_slider.delta.max) {
        var new_current_max = range_slider.getDelta('max', datum, range_slider.x_scale.invert(current_max));
        if (new_current_max) range_slider.max_handle.attr('cx', range_slider.x_scale(new_current_max));
      }
    }

    if (d3.event.sourceEvent && range_slider.onRangeUpdated) {
      range_slider.onRangeUpdated(range_slider.x_scale.invert(current_min), range_slider.x_scale.invert(current_max));
    }
  }
}

export default RangeSlider;
