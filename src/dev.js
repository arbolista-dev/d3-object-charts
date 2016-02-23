require('./style.scss');

import CompositeBarChart from './bar/composite';
import CalendarGridChart from './grid/calendar_grid';
import SplineStackChart from './line/spline_stack';

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

var after_tomorrow = new Date();
after_tomorrow.setDate(after_tomorrow.getDate() + 2);

var composite = new CompositeBarChart({
  container: '#container-composite',
  outer_width: 800,
  outer_height: 300,
  date_domain: true,
  bar_attrs: ['x', 'y', 'z'],
  bar_title: 'Produced energy',
  line_attrs: ['a', 'b'],
  line_title: 'Daily sunshine hours'
});

console.log(composite);

var composite_data = [{
  title: 'Plant 1',
  date: new Date(),
  values: [{
    x: 20,
    y: 10,
    z: 5,
    a: 20,
    b: 35
  }]
}, {
  title: 'Plant 2',
  date: tomorrow,
  values: [{
    x: 2,
    y: 40,
    z: 5,
    a: 12,
    b: 80
  }]
}, {
  title: 'Plant 3',
  date: after_tomorrow,
  values: [{
    x: 20,
    y: 10,
    z: 5,
    a: 55,
    b: 60
  }]
}];

composite.drawData({
  title: 'Composite graph title',
  css_class: '',
  series: composite_data
});

console.log("Composite graph: ", composite);
console.log("Composite graph data: ", composite_data);

var graph_spline = new SplineStackChart({
  container: '#container-spline',
  margin: {
    top: 100,
    left: 70,
    bottom: 50,
    right: 20
  },
  outer_width: 800,
  outer_height: 300,
  color: '#0404B4'
});

var net_power = {
    title: 'Net Power Consumption',
    values: [{
      x: new Date(),
      y: 40
    },
    {
      x: tomorrow,
      y: 10
    }]
  },
  savings = {
    title: 'Power Production',
    values: [{
      x: new Date(),
      y: 5
    },
    {
      x: tomorrow,
      y: 25
    }]
  };

graph_spline.drawData({
  title: 'graph_title',
  css_class: '',
  series: [
    net_power, savings
  ]
});
console.log("Spline graph: ", graph_spline);

var graph = new CalendarGridChart({
  container: '#container-calendar',
  outer_width: 800,
  outer_height: 200,
  margin: {
    top: 100,
    left: 70,
    bottom: 50,
    right: 20
  },
  date_attr: 'day',
  color: '#0404B4',
  toDate: (datum) => {
    return datum.date;
  }
});
graph.rangeValue = (datum) => {
  return datum.production;
}

graph.drawData({
  title: "cal-grid-val",
  css_class: "prod-value",
  min_range: 0,
  max_range: 150,
  values: [{
    date: new Date(),
    production: 31
  },
  {
    date: tomorrow,
    production: 5
  },
  {
    date: after_tomorrow,
    production: 31
  }]
});
console.log("Calendar grid: ", graph);
