describe('StackedBar axis', () => {

  var chart;

  beforeEach((done) => {
    chart = global.initStackedBar(chart, done);
  });


  it('should be created', () => {
    let x_axis = d3.select('#stacked-bar-chart .d3-chart-domain');
    expect(x_axis).not.toBeNull();
  });

  it('should be placed with a padding to the top', () => {
    let domainTransform = d3.transform(d3.select('#stacked-bar-chart .d3-chart-domain').attr('transform'));
    expect(chart.outer_height).toBe(400);
    expect(chart.height).toBe(360);
    expect(domainTransform.translate[1]).toBe(360);
  });

  it('should have specified amount of ticks', () => {
    let ticks = d3.select('#stacked-bar-chart .d3-chart-domain').selectAll('g.tick');
    expect(ticks.size()).toBe(2);
  });

});
