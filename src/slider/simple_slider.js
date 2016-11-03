import Chart from './../base';

class SimpleSlider extends Chart {
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
      callback_debounce: 200,
      chart_class: 'd3-simple-slider',
      handle_r: 9
    });
  }

  defineAxes() {
    var simple_slider = this;

    simple_slider.ensureTickHelpers();

    if (simple_slider.date_range) {
      simple_slider.x_scale = d3.time.scale()
        .range([0, simple_slider.width])
        .clamp(true);
    } else {
      simple_slider.x_scale = d3.scale.linear()
        .range([0, simple_slider.width])
        .clamp(true);
    }

    simple_slider.x_axis = d3.svg.axis()
      .scale(simple_slider.x_scale)
      .orient("bottom")
      .tickSize(1)
      .tickValues(simple_slider.tick_values)
      .tickFormat((d)=>{ return simple_slider.tickLabel(d); })
      .outerTickSize(1)
      .tickPadding(12);

    simple_slider.drawOne('.d3-chart-domain.d3-slider-axis', 'g', (axis)=>{
      axis
        .attr("class", "d3-chart-domain d3-slider-axis")
        .attr("transform", "translate(0," + simple_slider.height / 2 + ")");
    });
  }

  ensureTickHelpers(){
    let simple_slider = this;
    if (simple_slider.tick_values === undefined){
      simple_slider.tick_values = Object.keys(simple_slider.tick_labels).map((val)=>{ return parseInt(val) });
    }
    if (simple_slider.tickLabel === undefined && simple_slider.tick_labels === undefined){
      simple_slider.tickLabel = (tick_value)=>{ return tick_value; }
    } else if (simple_slider.tickLabel === undefined){
      simple_slider.tickLabel = (tick_value)=>{ return simple_slider.tick_labels[tick_value]; }
    }
  }

  afterAxes() {
    var simple_slider = this;

    simple_slider.slider = simple_slider.drawOne('.d3-chart-slider', 'g', (slider)=>{
      slider.attr("class", "d3-chart-slider");
    })

    simple_slider.handle = simple_slider.drawOne('.d3-chart-handle', 'circle', (handle)=>{
      handle
        .attr("class", "d3-chart-handle")
        .attr("transform", "translate(0," + simple_slider.height / 2 + ")")
        .attr("r", simple_slider.handle_r)
    },  simple_slider.slider);

    simple_slider.brush = d3.svg.brush()
      .x(simple_slider.x_scale);

    simple_slider.slider
      .call(simple_slider.brush);

    simple_slider.slider.call(simple_slider.brush)
      .selectAll(".extent,.resize")
      .remove();

    if(simple_slider.background_drag) {
      simple_slider.svg.select(".background")
        .attr("height", simple_slider.outer_height);
    }
  }

  drawData(data) {
    var simple_slider = this;
    simple_slider.x_scale.domain([data.abs_min, data.abs_max]);

    simple_slider.svg.select(".d3-chart-domain")
      .call(simple_slider.x_axis);

    simple_slider.handle.attr('cx', simple_slider.x_scale(data.current_value));

    simple_slider.brush.extent([data.current_value, data.current_value])
      .on("brush", () => {
        // weird event context hack.
        SimpleSlider.handleBrush(simple_slider, eval('this'));
      });

    simple_slider.slider
      .call(simple_slider.brush.event)
      .transition()
      .duration(750)
      .call(simple_slider.brush.extent([data.current_value, data.current_value]))
      .call(simple_slider.brush.event);

    d3.select(simple_slider.container)
        .selectAll('.tick')
        .on('click',(d)=>{
          let click_position = simple_slider.x_scale(d);
          simple_slider.handle.attr('cx', click_position)
          if (simple_slider.onChange) {
            simple_slider.onChange(d);
          }
        });

    simple_slider.data = data;
    simple_slider.current_value = data.current_value;
  }

  setValue(value, opts){
    opts = Object.assign({
      exec_callback: true
    }, opts || {});
    let simple_slider = this;
    simple_slider.data.current_value = value;

    simple_slider.current_value = value;
    let value_position = simple_slider.x_scale(value);
    simple_slider.handle.attr('cx', value_position);

    if (simple_slider.onChange && opts.exec_callback) {
      simple_slider.onChange(value);
    }
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

    if(chart.background_drag) {
      d3.select(chart.container + ' svg')
        .select(".background")
        .attr("height", chart.outer_height);
    }

    chart.defineAxes();
    if (chart.afterAxes) chart.afterAxes();
    chart.drawData(chart.data);
  }

  static handleBrush(simple_slider, elem) {
    var brush_value = simple_slider.brush.extent()[0],
        handle_position = parseInt(simple_slider.handle.attr('cx'));

    let source_event = d3.event.sourceEvent
    if (handle_position === null || !source_event) return false;

    if (source_event) { // UI triggered event
      brush_value = simple_slider.x_scale.invert(d3.mouse(elem)[0]);
      simple_slider.brush.extent([brush_value, brush_value]);
    }

    var brush_position = simple_slider.x_scale(brush_value);

    simple_slider.handle.attr('cx', brush_position);

    if (!simple_slider.onChange || !source_event) return false;

    // don't continually snap - debounce according to callback_debounce.
    if (simple_slider.$handle_brush) clearTimeout(simple_slider.$handle_brush);

    simple_slider.$handle_brush = setTimeout(()=>{
      simple_slider.onChange(brush_value);
    }, simple_slider.callback_debounce)

  }

}

export default SimpleSlider;
