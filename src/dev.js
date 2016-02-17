require('./style.scss');

import SplineStackChart from './line/spline_stack';

var graph = new SplineStackChart({
  container: '#container',
  outer_width: 800,
  outer_height: 200,
  color: '#0404B4',
  range_attr: 'y',
  domain_attr: 'x',
  time_series: true
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

graph.drawData({
  title: 'graph_title',
  css_class: '',
  series: [
    net_power, savings
  ]
});

console.log(graph);
