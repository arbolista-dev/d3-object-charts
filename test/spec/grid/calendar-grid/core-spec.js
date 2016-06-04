describe('CalendarGridChart init', () => {

  var chart, data;

  beforeEach((done) => {
    data = global.initData();
    chart = global.initCalendarGrid(chart, data.raw, done);
  });

  it('should be created', () => {
    let svg = d3.select('#grid svg');
    expect(svg).not.toBeNull();
  });

  it('should generate an axis without data', () => {
    let ticks = d3.select('.c3-axis-x').selectAll('g.tick');
    expect(ticks.size()).toBe(0);
  });

  describe('size', () => {

    it('should have same width', () => {
      let svg = d3.select('#grid-chart svg');
      expect(+svg.attr('width')).toBe(chart.outer_width);
    });

    it('should have same height', () => {
      let svg = d3.select('#grid-chart svg');
      expect(+svg.attr('height')).toBe(chart.outer_height);
    });

  });

  describe('position', () => {

    it('should have top margin', () => {
      let svg = d3.transform(d3.select('#grid-chart svg').selectAll('g').attr('transform'));
      expect(svg.translate[1]).toBe(chart.margin.top);
    });

    it('should have left margin', () => {
      let svg = d3.transform(d3.select('#grid-chart svg').selectAll('g').attr('transform'));
      expect(svg.translate[0]).toBe(chart.margin.left);
    });

  });

});
