import CalendarGridChart from '../src/grid/calendar_grid.js';
import RangeSlider from '../src/range/range_slider.js';

global.initDom = function(id) {
  var div = document.createElement('div');
  div.id = id;
  document.body.appendChild(div);
};

typeof global.initDom !== 'undefined';


global.initData = function() {

  var fixture = JSON.parse(window.__html__['test/fixtures/calendar-grid-data.json']);
  fixture.raw.forEach((item) => {
    item.date = new Date(item.date);
  });

  return fixture;
};

global.initCalendarGrid = function(chart, data, done) {

  if (typeof chart === 'undefined') {
    global.initDom('grid-chart');
  }

  chart = new CalendarGridChart({
    container: '#grid-chart',
  });

  if (data) {
    chart.drawData({
      values: data
    });
  }

  window.setTimeout(function() {
    done();
  }, 10);


  return chart;
};
typeof global.initCalendarGrid !== 'undefined';

global.initRangeSlider = function(chart, done) {

  if (typeof chart === 'undefined') {
    global.initDom('range-chart');
  }

  chart = new RangeSlider({
    container: '#range-chart',
    delta: {
      'min': 50,
      'max': 100
    },
    onRangeUpdated: function(min, max) {
    }
  });

  chart.drawData({
    abs_min: 0,
    abs_max: 1000,
    current_min: 100,
    current_max: 200,
  });

  window.setTimeout(function() {
    done();
  }, 10);


  return chart;
};
typeof global.initRangeSlider !== 'undefined';
