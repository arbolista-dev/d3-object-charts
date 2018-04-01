import CalendarGridChart from '../src/grid/calendar_grid.js';
import RangeSlider from '../src/slider/range_slider.js';
import SnapSlider from '../src/slider/snap_slider.js';
import SimpleSlider from '../src/slider/simple_slider.js';
import OverlapBar from '../src/bar/overlap.js';
import StackedBar from '../src/bar/stacked.js';
import ComparativePie from '../src/pie/comparative.js';

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

global.initSnapSlider = function(chart, done) {

  if (typeof chart === 'undefined') {
    global.initDom('snap-chart');
  }

  chart = new SnapSlider({
    container: '#snap-chart',
    tick_labels: {
      0: '0%',
      10: '10%',
      20: '20%',
      30: '30%',
      40: '40%',
      50: '50%',
      60: '60%',
      70: '70%',
      80: '80%',
      90: '90%',
      100: '100%'
    },
    onSnap: function(snap_value) {}
  });

  chart.drawData({
    abs_min: 0,
    abs_max: 100,
    current_value: 30
  });

  window.setTimeout(function() {
    done();
  }, 10);

  return chart;
};

typeof global.initSnapSlider !== 'undefined';

global.initSimpleSlider = function(chart, done) {

  if (typeof chart === 'undefined') {
    global.initDom('simple-slider-chart');
  }

  chart = new SimpleSlider({
    container: '#simple-slider-chart',
    tick_labels: {
      0: '0%',
      10: '10%',
      20: '20%',
      30: '30%',
      40: '40%',
      50: '50%',
      60: '60%',
      70: '70%',
      80: '80%',
      90: '90%',
      100: '100%'
    },
    onSnap: function(snap_value) {}
  });

  chart.drawData({
    abs_min: 0,
    abs_max: 100,
    current_value: 30
  });

  window.setTimeout(function() {
    done();
  }, 10);

  return chart;
};

typeof global.initSimpleSlider !== 'undefined';

global.initOverlapBar = function(chart, done) {

  if (typeof chart === 'undefined') {
    global.initDom('overlap-bar-chart');
  }

  chart = new OverlapBar({
    container: '#overlap-bar-chart',
    y_ticks: 3,
    seriesClass: function(series){
      return series.name.replace(/\s+/g, '-');
    }
  }).drawData({
    categories: [
      'a', 'b', 'c'
    ], series: [
      {
        name: 'yada 1',
        values: [1, 2, 3]
      }, {
        name: 'yada 2',
        values: [0.5, 1, 4]
      }
    ]
  });

  window.setTimeout(function() {
    done();
  }, 10);

  return chart;
};

typeof global.initOverlapBar !== 'undefined';

global.initStackedBar = function(chart, done) {

  if (typeof chart === 'undefined') {
    global.initDom('stacked-bar-chart');
  }

  chart = new StackedBar({
    container: '#stacked-bar-chart',
    y_ticks: 3
  }).drawData([
    {
      name: 'ya 1',
      values: [
        {
          title: 'yada 11',
          value: 22
        },
        {
          title: 'yada 12',
          value: 5
        },
        {
          title: 'yada 13',
          value: 2
        }
      ]
    }, {
      name: 'ya 2',
      values: [
      {
        title: 'yada 21',
        value: 2
      },
      {
        title: 'yada 22',
        value: 1
      },
      ]
    }
  ]);

  window.setTimeout(function() {
    done();
  }, 10);

  return chart;
};

typeof global.initStackedBar !== 'undefined';

global.initComparativePie = function(chart, done) {

  if (typeof chart === 'undefined') {
    global.initDom('comparative-pie-chart');
  }

  chart = new ComparativePie({
    container: '#comparative-pie-chart'
  }).drawData({
    categories: [
      'a', 'b', 'c'
    ],
    values: [3, 4, 8],
    comparative_sum: 20
  });

  window.setTimeout(function() {
    done();
  }, 10);

  return chart;
};

typeof global.initComparativePie !== 'undefined';
