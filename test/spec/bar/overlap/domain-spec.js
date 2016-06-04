describe('OverlapBar axis', () => {

  var chart;

  beforeEach((done) => {
    chart = global.initOverlapBar(chart, done);
  });


  it('should be created', () => {
    let x_axis = d3.select('#overlap-bar-chart .d3-chart-domain');
    expect(x_axis).not.toBeNull();
  });

  it('should be placed with a padding to the top', () => {
    let domainTransform = d3.transform(d3.select('#overlap-bar-chart .d3-chart-domain').attr('transform'));
    // see default dimensions and margins in src/bar/overlap.js
    expect(chart.outer_height).toBe(400);
    expect(chart.height).toBe(360);
    expect(domainTransform.translate[1]).toBe(360);
  });

  it('should have specified amount of ticks', () => {
    let ticks = d3.select('#overlap-bar-chart .d3-chart-domain').selectAll('g.tick');
    // see test/helper initOverlapBar - initializes with 3 categories.
    expect(ticks.size()).toBe(3);
  });

});

