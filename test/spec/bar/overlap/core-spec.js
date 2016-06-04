describe('OverlapBar', () => {

  var chart;

  beforeEach((done) => {
    chart = global.initOverlapBar(chart, done);
  });

  describe('init', ()=>{
    it('should be created', () => {
      let svg = d3.select('#overlap-bar-chart svg');
      expect(svg).not.toBeNull();
    });

    describe('size', () => {

      it('should have same width', () => {
        let svg = d3.select('#overlap-bar-chart svg');
        expect(+svg.attr('width')).toBe(chart.outer_width);
      });

      it('should have same height', () => {
        let svg = d3.select('#overlap-bar-chart svg');
        expect(+svg.attr('height')).toBe(chart.outer_height);
      });

    });

    describe('position', () => {

      it('should have top margin', () => {
        let svg = d3.transform(d3.select('#overlap-bar-chart svg').selectAll('g').attr('transform'));
        expect(svg.translate[1]).toBe(chart.margin.top);
      });

      it('should have left margin', () => {
        let svg = d3.transform(d3.select('#overlap-bar-chart svg').selectAll('g').attr('transform'));
        expect(svg.translate[0]).toBe(chart.margin.left);
      });

    });
  });

  describe('redraw', () => {

    it('should have top margin', () => {
      let svg = d3.select('#overlap-bar-chart svg'),
          transform;
      chart.redraw({outer_height: 100, outer_width: 200, margin: {top: 5, bottom: 2, left: 3, right: 4}});
      transform = d3.transform(svg.select('.d3-object-container').attr('transform'));
      expect(transform.translate[0]).toBe(3); // left
      expect(transform.translate[1]).toBe(5); // top
      expect(svg.attr('height')).toBe('100');
      expect(svg.attr('width')).toBe('200');
    });

  });

});
