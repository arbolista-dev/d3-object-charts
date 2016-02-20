require('./style.scss');

import CompositeBarChart from './bar/composite';
import CalendarGridChart from './grid/calendar_grid';
import SplineStackChart from './line/spline_stack';

// var composite = new CompositeBarChart({
//   container: '#container-composite',
//   outer_width: 800,
//   outer_height: 300,
//   color: '#0404B4'
// });
//
// var composite_data = {
//   title: "cal-grid-val",
//   css_class: "prod-value",
//   min_range: 0,
//   max_range: 150,g
//   series: [{
//     title: 'Net Power Consumption',
//     values: [{
//       x: new Date(),
//       y: 10
//     }]
//   }]
// };
//
// composite.drawLineData(composite_data);
// composite.drawBarData(composite_data);
//
// console.log("Composite bar chart", composite);

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
      y: 10
    }]
  },
  savings = {
    title: 'Power Production',
    values: [{
      x: new Date(),
      y: 5
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
  }]
});
console.log("Calendar grid: ", graph);
