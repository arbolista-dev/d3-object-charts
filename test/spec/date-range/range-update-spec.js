import RangeSlider from '../../../src/range/range_slider.js';

describe('RangeSlider update min/max', () => {


  var chart,
    new_min = 300,
    new_max = 350,
    updated_min,
    updated_width;

  beforeEach((done) => {
    chart = global.initRangeSlider(chart, done);

    // Trigger update of handles and re-brush
    chart.min_handle.attr('cx', chart.x_scale(new_min));
    chart.max_handle.attr('cx', chart.x_scale(new_max));
    d3.select('#range-chart .d3-chart-slider').call(chart.brush.extent([new_min, new_max])).call(chart.brush.event);

    updated_min = parseInt(chart.x_scale.invert(d3.select('#range-chart .d3-chart-slider .extent').attr('x')));
    updated_width = parseInt(chart.x_scale.invert(d3.select('#range-chart .d3-chart-slider .extent').attr('width')));
  });

  it('should update min value after brush has been moved', () => {
    expect(updated_min).toBe(new_min);
  });

  it('should update max value after brush has been moved', () => {
    expect(updated_min + updated_width).toBe(new_max);
  });

  /*
   * Test of onRangeUpdated callback fails! Error: Timeout - Async callback was
   * not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL
   */
  // it('should update min and max on brush move', (done) => {
  //   var chart,
  //     new_min = 300,
  //     new_max = 350,
  //     updated_min,
  //     updated_max;
  //
  //   chart = new RangeSlider({
  //     container: '#range-chart',
  //     delta: {
  //       'min': 50,
  //       'max': 100
  //     },
  //     onRangeUpdated: function(updated_min, updated_max) {
  //       console.log(updated_min);
  //       expect(updated_min).toBe(new_min);
  //       expect(updated_max).toBe(new_max);
  //       done();
  //     }
  //   });
  //
  //   chart.min_handle.attr('cx', chart.x_scale(new_min));
  //   chart.max_handle.attr('cx', chart.x_scale(new_max));
  //   d3.select('#range-chart .d3-chart-slider').call(chart.brush.extent([new_min, new_max])).call(chart.brush.event);
  //
  // });

});
