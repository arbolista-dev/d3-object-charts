require('./style.scss');

import CalendarGridChart from './grid/calendar_grid';
import RangeSlider from './range/range_slider';

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

var range_slider = new RangeSlider({
  container: '#range-slider',
  outer_height: 100,
  max_delta: 3600 * 24 * 4 * 1000,
  onRangeUpdated: function(min, max) {
    console.log('min', min);
    console.log('max', max);
    // if (power.range_slider_update) clearTimeout(power.range_slider_update);
    // power.range_slider_update = setTimeout(() => {
    //   var power_range = [Math.round(min.getTime() / 1000), Math.round(max.getTime() / 1000)];
    //   power.state_manager.setParams({
    //     power_range: power_range
    //   }, power);
    // }, 500);
  }

});

range_slider.drawData({
  abs_min: new Date() - 3600 * 24 * 30 * 1000, // 30 days ago
  abs_max: new Date(),
  current_min: new Date() - 3600 * 24 * 4 * 1000, // 4 days ago
  current_max: new Date()
});

console.log(range_slider);


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
