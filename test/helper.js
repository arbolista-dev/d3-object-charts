import CalendarGridChart from '../src/grid/calendar_grid.js';

global.initDom = function() {
  var div = document.createElement('div');
  div.id = 'chart';
  document.body.appendChild(div);
};

typeof global.initDom !== 'undefined';


global.initData = function() {
  // var nowDate = new Date("December 31, 2015 00:00:00"),
  //   now = nowDate.getTime(),
  //   day = 3600 * 24 * 1000,
  //   one_year_ago = now - day * 364 * 1,
  //   cursor = one_year_ago,
  //   data = [],
  //   chart;
  // while (cursor < now) {
  //   data.push({
  //     date: new Date(cursor),
  //     value: 100 * Math.random()
  //   });
  //   cursor += day;
  // }

  var fixture = JSON.parse(window.__html__['test/fixtures/calendar-grid-data.json']);
  fixture.forEach((item) => {
    item.date = new Date(item.date);
  });

  return fixture;
};


global.initChart = function(chart, data, done) {

  if (typeof chart === 'undefined') {
    global.initDom();
  }

  chart = new CalendarGridChart({
    container: '#chart',
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

typeof global.initChart !== 'undefined';
