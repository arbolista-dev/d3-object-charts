describe('CalendarGridChart axis', () => {

  var chart, data;

  beforeEach(function(done) {
    data = global.initData();
    chart = global.initChart(chart, data, done);
  });

  describe('x axis', () => {

    let x_ticks = d3.range(31).map((n) => {
      return n + 1;
    });

    it('should be created', () => {
      let x_axis = d3.select('.d3-chart-domain');
      expect(x_axis).not.toBeNull();
    });

    it('should have specified amount of ticks', function() {
      let xTicksSize = d3.select('.d3-chart-domain').selectAll('g.tick').size();
      expect(xTicksSize).toBe(31);
    });

    it('should have specified tick texts', function() {
      d3.select('.d3-chart-domain').selectAll('g.tick').each(function(d, i) {
        var text = d3.select(this).select('text').text();
        expect(+text).toBe(x_ticks[i]);
      });
    });

  });

  describe('y axis', () => {
    let y_ticks = ["January 2015", "February 2015", "March 2015", "April 2015", "May 2015", "June 2015",
      "July 2015", "August 2015", "September 2015", "October 2015", "November 2015", "December 2015"
    ];

    it('should be created', () => {
      let svg = d3.select('#chart svg');
      let y_axis = d3.select('.d3-chart-range');
      expect(svg).not.toBeNull();
    });

    it('should have specified amount of ticks on', function() {
      let yTicksSize = d3.select('.d3-chart-range').selectAll('g.tick').size();
      expect(yTicksSize).toBe(12);
    });

    it('should have specified tick texts', function() {
      d3.select('.d3-chart-range').selectAll('g.tick').each(function(d, i) {
        var text = d3.select(this).select('text').text();
        expect(text).toBe(y_ticks[i]);
      });
    });
  });


});
