describe('SnapSlider slider component', () => {

  var chart;

  beforeEach((done) => {
    chart = global.initSnapSlider(chart, done);
  });


  it('should be created', () => {
    let x_axis = d3.select('#snap-chart .d3-chart-slider');
    expect(x_axis).not.toBeNull();
  });

  describe('slider handles', () => {

    it('should create handle', () => {
      let min_handle = d3.select('#snap-chart .d3-chart-slider .d3-chart-handle');
      expect(min_handle).not.toBeNull();
    });

    it('should initiate with correct value', () => {
      expect(chart.current_value).toBe(30);
    });

  });

});
