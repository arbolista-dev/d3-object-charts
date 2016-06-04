describe('ComparativePie', () => {

  var chart;

  beforeEach((done) => {
    chart = global.initComparativePie(chart, done);
  });

  describe('init', ()=>{
    it('should be created', () => {
      let svg = d3.select('#comparative-pie-chart svg');
      expect(svg).not.toBeNull();
    });

    describe('size', () => {

      it('should have same width', () => {
        let svg = d3.select('#comparative-pie-chart svg');
        expect(+svg.attr('width')).toBe(chart.outer_width);
      });

      it('should have same height', () => {
        let svg = d3.select('#comparative-pie-chart svg');
        expect(+svg.attr('height')).toBe(chart.outer_height);
      });

    });

    describe('position', () => {

      it('should have top margin', () => {
        let svg = d3.transform(d3.select('#comparative-pie-chart svg').selectAll('g').attr('transform'));
        expect(svg.translate[1]).toBe(chart.margin.top);
      });

      it('should have left margin', () => {
        let svg = d3.transform(d3.select('#comparative-pie-chart svg').selectAll('g').attr('transform'));
        expect(svg.translate[0]).toBe(chart.margin.left);
      });

      it('has the correct transformations for the circles', ()=>{
        let svg = d3.select('#comparative-pie-chart svg'),
            comparative_arc = svg.select('.d3-comparative-arc'),
            value_translate = d3.transform(svg.selectAll('.d3-value-arc').attr('transform')).translate;
        expect(Math.round(value_translate[0])).toBe(253);
        expect(Math.round(value_translate[1])).toBe(197);
        expect(comparative_arc.attr('r')).toBe('180');
        expect(comparative_arc.attr('cx')).toBe('270');
        expect(comparative_arc.attr('cy')).toBe('180');
      });

    });
  });

  describe('redraw', () => {

    it('should have top margin', () => {
      let svg = d3.select('#comparative-pie-chart svg'),
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
