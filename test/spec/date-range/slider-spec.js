describe('RangeSlider slider component', () => {

  var chart;

  beforeEach((done) => {
    chart = global.initRangeSlider(chart, done);
  });


  it('should be created', () => {
    let x_axis = d3.select('#range-chart .d3-chart-slider');
    expect(x_axis).not.toBeNull();
  });

  describe('slider handles', () => {

    it('should create min handle', () => {
      let min_handle = d3.select('#range-chart .d3-chart-slider .d3-chart-min-handle');
      expect(min_handle).not.toBeNull();
    });

    it('should create max handle', () => {
      let max_handle = d3.select('#range-chart .d3-chart-slider .d3-chart-max-handle');
      expect(max_handle).not.toBeNull();
    });

    it('should place min handle left of max handle', () => {
      console.log(d3.select('#range-chart .d3-chart-slider .extent').attr('x'));

    });

  });

});
