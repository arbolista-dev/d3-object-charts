import Chart from './../base';

class SnapSlider extends Chart {
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
      chart_class: 'd3-snap-slider',
      snap_debounce: 150
    });
  }

  defineAxes() {
    var snap_slider = this;

    snap_slider.ensureTickHelpers();

    if (snap_slider.date_range) {
      snap_slider.x_scale = d3.time.scale()
        .range([0, snap_slider.width])
        .clamp(true);
    } else {
      snap_slider.x_scale = d3.scale.linear()
        .range([0, snap_slider.width])
        .clamp(true);
    }

    snap_slider.x_axis = d3.svg.axis()
      .scale(snap_slider.x_scale)
      .orient("bottom")
      .tickSize(1)
      .tickValues(snap_slider.tick_values)
      .tickFormat((d)=>{ return snap_slider.tickLabel(d); })
      .outerTickSize(1)
      .tickPadding(12);

    snap_slider.svg.append("g")
      .attr("class", "d3-chart-domain d3-slider-axis")
      .attr("transform", "translate(0," + snap_slider.height / 2 + ")");
  }

  ensureTickHelpers(){
    let snap_slider = this;
    if (snap_slider.tick_values === undefined){
      snap_slider.tick_values = Object.keys(snap_slider.tick_labels).map((val)=>{ return parseInt(val) });
    }
    if (snap_slider.tickLabel === undefined && snap_slider.tick_labels === undefined){
      snap_slider.tickLabel = (tick_value)=>{ return tick_value; }
    } else if (snap_slider.tickLabel === undefined){
      snap_slider.tickLabel = (tick_value)=>{ return snap_slider.tick_labels[tick_value]; }
    }
  }

  afterAxes() {
    var snap_slider = this;

    snap_slider.slider = snap_slider.svg.append("g")
      .attr("class", "d3-chart-slider");

    snap_slider.handle = snap_slider.slider.append("circle")
      .attr("class", "d3-chart-handle")
      .attr("transform", "translate(0," + snap_slider.height / 2 + ")")
      .attr("r", 9);

    snap_slider.brush = d3.svg.brush()
      .x(snap_slider.x_scale);

    snap_slider.slider
      .call(snap_slider.brush);

    snap_slider.slider.call(snap_slider.brush)
      .selectAll(".extent,.resize")
      .remove();
  }

  drawData(data) {
    var snap_slider = this;
    snap_slider.x_scale.domain([data.abs_min, data.abs_max]);

    snap_slider.svg.select(".d3-chart-domain")
      .call(snap_slider.x_axis);

    snap_slider.handle.attr('cx', snap_slider.x_scale(data.current_value));

    snap_slider.brush.extent([data.current_value, data.current_value])
      .on("brush", () => {
        SnapSlider.handleBrush(snap_slider, eval('this'));
      });

    snap_slider.slider
      .call(snap_slider.brush.event)
      .transition()
      .duration(750)
      .call(snap_slider.brush.extent([data.current_value, data.current_value]))
      .call(snap_slider.brush.event);

    d3.select(snap_slider.container)
        .selectAll('.tick')
        .on('click',(d)=>{
          let click_position = snap_slider.x_scale(d);
          snap_slider.handle.attr('cx', click_position)
          if (snap_slider.onSnap) {
            snap_slider.onSnap(d);
          }
        });

    snap_slider.current_value = data.current_value;
  }

  setValue(value, opts){
    opts = Object.assign({
      exec_callback: true
    }, opts || {});

    let snap_slider = this;
    value = snap_slider.findNearestTickValue(value);

    snap_slider.current_value = value;
    let value_position = snap_slider.x_scale(value);
    snap_slider.handle.attr('cx', value_position);

    if (snap_slider.onSnap && opts.exec_callback) {
      snap_slider.onSnap(value);
    }
  }

  findNearestTickValue(value){
    let snap_slider = this,
        snap_value = undefined;
    // SnapSlider#ticks must be sorted ASC.

    for (let i=0; i<snap_slider.tick_values.length; i++){
      let this_value = snap_slider.tick_values[i],
          next_value = snap_slider.tick_values[i+1];
      if (next_value === undefined){
        return this_value;
      } else if (value < next_value){
        let snap_position;
        if (Math.abs(value - this_value) < Math.abs(value - next_value)){
          return this_value;
        } else {
          return next_value;
        }
      }
    }
  }

  static handleBrush(snap_slider, elem) {
    var brush_value = snap_slider.brush.extent()[0],
        handle_position = parseInt(snap_slider.handle.attr('cx'));

    let source_event = d3.event.sourceEvent
    if (handle_position === null || !source_event) return false;

    if (source_event) { // UI triggered event
      brush_value = snap_slider.x_scale.invert(d3.mouse(elem)[0]);
      snap_slider.brush.extent([brush_value, brush_value]);
    }

    var brush_position = snap_slider.x_scale(brush_value);

    snap_slider.handle.attr('cx', brush_position);

    // don't continually snap - debounce every 500ms.
    if (snap_slider.$handle_brush) clearTimeout(snap_slider.$handle_brush);

    snap_slider.$handle_brush = setTimeout(()=>{
      // set handle position to closes tick mark.
      let snap_value = snap_slider.findNearestTickValue(brush_value),
          snap_position = snap_slider.x_scale(snap_value);
      snap_slider.handle.attr('cx', snap_position);
      snap_slider.current_value = snap_value;

      // execute callback after handle has been snapped.
      if (source_event && snap_slider.onSnap) {
        snap_slider.onSnap(snap_value);
      }

    }, snap_slider.snap_debounce)

  }
}

export default SnapSlider;
