describe('RangeSlider init', () => {

  var chart;

  beforeEach((done) => {
    chart = global.initRangeSlider(chart, done);
  });

  it('should be created', () => {
    let svg = d3.select('#range-chart svg');
    expect(svg).not.toBeNull();
  });

  describe('size', () => {

    it('should have same width', () => {
      let svg = d3.select('#range-chart svg');
      expect(+svg.attr('width')).toBe(chart.outer_width);
    });

    it('should have same height', () => {
      let svg = d3.select('#range-chart svg');
      expect(+svg.attr('height')).toBe(chart.outer_height);
    });

  });

  describe('position', () => {

    it('should have top margin', () => {
      let svg = d3.transform(d3.select('#range-chart svg').selectAll('g').attr('transform'));
      expect(svg.translate[1]).toBe(chart.margin.top);
    });

    it('should have left margin', () => {
      let svg = d3.transform(d3.select('#range-chart svg').selectAll('g').attr('transform'));
      expect(svg.translate[0]).toBe(chart.margin.left);
    });

  });

});
