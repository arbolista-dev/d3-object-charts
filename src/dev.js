require('./style.scss');

import SplineStackChart from './line/spline_stack';
import CalendarGridChart from './grid/calendar_grid';
import CompositeBarChart from './bar/composite';

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
}).drawData({
  values: data2
});

var calendar1 = new CalendarGridChart({
  container: '#container-calendar1',
  date_attr: 'day_date',
  range_attr: 'production',
  outer_width: 800,
  outer_height: 400,
  color: '#0404B4'
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
  color: '#339900',
  legend: false
});

calendar2.drawData({
  css_class: "value",
  values: data2
});
