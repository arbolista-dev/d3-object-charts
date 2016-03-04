import CalendarGridChart from '../../../src/grid/calendar_grid.js';

describe('CalendarGridChart', () => {
  var nowDate = new Date(),
    now = nowDate.getTime(),
    day = 3600 * 24 * 1000,
    one_year_ago = now - day * 365 * 1,
    cursor = one_year_ago,
    data = [];
  while (cursor < now) {
    data.push({
      date: new Date(cursor),
      production: 100 * Math.random()
    });
    cursor += day;
  }

  var chart = new CalendarGridChart({
    container: '#chart',
  });

  chart.drawData({
    values: data
  });

  it('should be created', () => {
    let svg = d3.select('#chart svg');
    expect(svg).not.toBeNull();
  });

  it('should generate an axis without data', () => {
      let ticks = d3.select('.c3-axis-x').selectAll('g.tick');
      expect(ticks.size()).toBe(0);
  });

  describe('size', () => {

      it('should have same width', () => {
          let svg = d3.select('#chart svg');
          expect(+svg.attr('width')).toBe(chart.outer_width);
      });

      it('should have same height', () => {
          let svg = d3.select('#chart svg');
          expect(+svg.attr('height')).toBe(chart.outer_height);
      });

  });

});
