require('../../src/style.scss');

import RangeSlider from '../../src/slider/range_slider';
import SnapSlider from '../../src/slider/snap_slider';
import SimpleSlider from '../../src/slider/simple_slider';
import CalendarGridChart from '../../src/grid/calendar_grid';
import OverlapBar from '../../src/bar/overlap';
import ComparativePie from '../../src/pie/comparative';

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


/* Snap Slider */

var snap_slider = new SnapSlider({
  container: '#snap-slider',
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
  axis_click_handle: true,
  onSnap: function(snap_value) {
    console.log('snap_value', snap_value);
  }
});

snap_slider.drawData({
  abs_min: 0,
  abs_max: 100,
  current_value: 30
});

/* Simple Slider */

var simple_slider = new SimpleSlider({
  container: '#simple-slider',
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
  axis_click_handle: true,
  onChange: function(new_value) {
    console.log('new_value', new_value);
  }
});

simple_slider.drawData({
  abs_min: 0,
  abs_max: 100,
  current_value: 30
});

setTimeout(()=>{
  simple_slider.redraw({outer_width: 400});
  simple_slider.setValue(75);
  snap_slider.setValue(80);
  snap_slider.redraw({outer_width: 800});
}, 6000)

/* Overlap Bar */

var overlap_bar = new OverlapBar({
  container: '#overlap-bar',
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

/* Comparative Pie */

new ComparativePie({
  container: '#comparative-pie1',
  max_r: 150,
  label_r: 30
}).drawData({
  categories: [
    'A', 'B', 'C'
  ],
  values: [3, 4, 8],
  comparative_sum: 20
});

let comparative_pie2 = new ComparativePie({
  container: '#comparative-pie2'
}).drawData({
  categories: [
    'apples', 'bananas', 'cherries', 'donuts'
  ],
  values: [3, 4, 8, 6],
  comparative_sum: 12
});

setTimeout(()=>{
  comparative_pie2.redraw({outer_height: 300, outer_width: 400})
  overlap_bar.redraw({outer_height: 300, outer_width: 400})
  range_slider.redraw({outer_width: 400})
}, 3000)

/* Calendar Grid Chart*/

var nowDate = new Date(),
  now = nowDate.getTime(),
  day = 3600 * 24 * 1000,
  three_years_ago = now - day * 365 * 4,
  one_year_ago = now - day * 365 * 1,
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
}

var calendar = new CalendarGridChart({
  container: '#container-calendar',
});
calendar.drawData({
  values: data2
});
console.log("Calendar grid: ", calendar);

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
console.log("Calendar grid 1: ", calendar1);

var calendar2 = new CalendarGridChart({
  container: '#container-calendar2',
  grid_padding: 0.3,
  margin: {
    top: 50,
    left: 115,
    bottom: 50,
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
console.log("Calendar grid 2: ", calendar2);
