require('./style.scss');

import RangeSlider from './range/range_slider';
import CalendarGridChart from './grid/calendar_grid';

/* Range Slider */

var range_slider = new RangeSlider({
  container: '#range-slider',
  delta: {
    'min': 3600 * 24 * 1 * 1000,
    'max': 3600 * 24 * 5 * 1000
  },
  date_range: true,
  onRangeUpdated: function(min, max) {
    console.log('min', min);
    console.log('max', max);
  }
});

range_slider.drawData({
  abs_min: new Date(new Date() - 3600 * 24 * 30 * 1000), // 30 days ago
  abs_max: new Date(),
  current_min: new Date(new Date() - 3600 * 24 * 10 * 1000),
  current_max: new Date(new Date() - 3600 * 24 * 6 * 1000)
});
console.log(range_slider);

var range_slider_int = new RangeSlider({
  container: '#range-slider-int',
  delta: {
    'min': 10,
    'max': 20
  },
  tick_amount: 4,
  onRangeUpdated: function(min, max) {
    console.log('min', min);
    console.log('max', max);
  }
});

range_slider_int.drawData({
  abs_min: 10,
  abs_max: 99,
  current_min: 40,
  current_max: 50,
});
console.log(range_slider_int);

var range_slider_int2 = new RangeSlider({
  container: '#range-slider-int2',
  delta: {
    'min': 50,
    'max': 100
  },
  onRangeUpdated: function(min, max) {
    console.log('min', min);
    console.log('max', max);
  }
});

range_slider_int2.drawData({
  abs_min: 0,
  abs_max: 1000,
  current_min: 100,
  current_max: 200,
});
console.log(range_slider_int2);


/* Calendar Grid Chart*/

var nowDate = new Date("December 31, 2015 00:00:00"),
  now = nowDate.getTime(),
  day = 3600 * 24 * 1000,
  three_years_ago = now - day * 365 * 4,
  one_year_ago = now - day * 364 * 1,
  cursor = one_year_ago,
  data1 = [],
  data2 = [];
while (cursor < now) {
  data1.push({
    day_date: new Date(cursor),
    production: 100 * Math.random()
  });
  data2.push({
    date: new Date(cursor),
    value: 1000 * Math.random()
  });
  cursor += day;
};


var calendar = new CalendarGridChart({
  container: '#container-calendar',
});
calendar.drawData({
  values: data2
});
console.log(calendar);

var calendar1 = new CalendarGridChart({
  container: '#container-calendar1',
  date_attr: 'day_date',
  range_attr: 'production',
  outer_width: 800,
  outer_height: 400,
  color_max: '#0404B4'
});

calendar1.drawData({
  css_class: "prod-value",
  values: data1
});

var calendar2 = new CalendarGridChart({
  container: '#container-calendar2',
  grid_padding: 0.3,
  margin: {
    top: 50,
    left: 115,
    bottom: 0,
    right: 0
  },
  display_date_format: '%m %Y',
  date_attr: 'date',
  min_range_zero: true,
  range_attr: 'value',
  color_max: '#339900',
  legend: false
});

calendar2.drawData({
  css_class: "value",
  values: data2
});
