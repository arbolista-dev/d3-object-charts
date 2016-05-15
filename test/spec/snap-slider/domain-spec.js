describe('RangeSlider slider axis', () => {

  var chart;

  beforeEach((done) => {
    chart = global.initSnapSlider(chart, done);
  });


  it('should be created', () => {
    let x_axis = d3.select('#snap-chart .d3-chart-domain');
    expect(x_axis).not.toBeNull();
  });

  it('should be placed with a padding to the top', () => {
    let domainTransform = d3.transform(d3.select('#snap-chart .d3-chart-domain').attr('transform'));
    expect(domainTransform.translate[1]).toBe(30);
  });

  it('should have specified amount of ticks', () => {
    let ticks = d3.select('#snap-chart .d3-chart-domain').selectAll('g.tick').size();
    expect(ticks).toBe(chart.tick_values.length);
  });

  it('should have specified tick description', () => {
    let tick_description = ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'];
    d3.select('#snap-chart .d3-chart-domain').selectAll('g.tick').each(function(d, i) {
      let text = d3.select(this).select('text').text();
      expect(text).toBe(tick_description[i]);
    });
  });


});
