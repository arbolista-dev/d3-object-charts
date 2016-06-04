describe('ComparativePie axis', () => {

  var chart;

  beforeEach((done) => {
    chart = global.initComparativePie(chart, done);
  });


  it('should not be  created', () => {
    let x_axis = d3.select('#comparative-pie-chart .d3-chart-domain');
    expect(x_axis.size()).toBe(0);
  });

});

