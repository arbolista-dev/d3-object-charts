require('./style.scss');

// import CalendarGridChart from './grid/calendar_grid';
// import RangeSlider from './slider/range_slider';
// import SnapSlider from './slider/snap_slider';
// import SimpleSlider from './slider/simple_slider';
import OverlapBar from './bar/overlap';
import StackedBar from './bar/stacked';
// import ComparativePie from './pie/comparative';

const stacked_bar = new StackedBar({
  container: '#stacked-bar',
  y_ticks: 3
});

stacked_bar.drawData([
  {
    name: 'Travel',
    values: [
      {
        title: 'Car Fuel',
        value: 11
      },
      {
        title: 'Car MFG',
        value: 1.5
      },
      {
        title: 'Public Transit',
        value: 2.5
      },
      {
        title: 'Air Travel',
        value: 3
      },
      {
        title: 'Reduction',
        value: 15
      }
    ]
  }, {
    name: 'Home',
    values: [
      {
        title: 'Electricity',
        value: 7
      },
      {
        title: 'Natural Gas',
        value: 3
      },
      {
        title: 'Other Fuels',
        value: 4
      },
      {
        title: 'Water',
        value: 2
      },
      {
        title: 'Construction',
        value: 2
      },
      {
        title: 'Reduction',
        value: 3
      }
    ]
  }, {
    name: 'Food',
    values: [
      {
        title: 'Meat',
        value: 5
      },
      {
        title: 'Dairy',
        value: 4
      },
      {
        title: 'Fruits & Vegetables',
        value: 3
      },
      {
        title: 'Cereals',
        value: 2
      },
      {
        title: 'Other Food',
        value: 1
      },
      {
        title: 'Reduction',
        value: 0
      }
    ]
  }, {
    name: 'Goods',
    values: [
      {
        title: 'Clothing',
        value: 3
      },
      {
        title: 'Furniture',
        value: 2
      },
      {
        title: 'Other Goods',
        value: 1
      },
      {
        title: 'Reduction',
        value: 0.5
      }
    ]
  }, {
    name: 'Services',
    values: [
      {
        title: 'Services',
        value: 2
      },
      {
        title: 'Reduction',
        value: 2
      }
    ]
  },
]);

console.log('stacked_bar', stacked_bar);

var overlap = new OverlapBar({
  container: '#overlap-bar',
  y_ticks: 3,
  seriesClass: function(series){
    return series.name.replace(/\s+/g, '-');
  }
});

overlap.drawData({
  categories: [
    'Travel', 'Home', 'Food', 'Goods', 'Services'
  ], series: [
    {
      name: 'travel',
      values: [1, 2, 3, 5, 6]
    }, {
      name: 'yada 2',
      values: [0.5, 1, 4, 2, 1]
    }, {
      name: 'yada 2',
      values: [0.5, 1, 4, 3, 6]
    }, {
      name: 'yada 2',
      values: [0.5, 1, 4, 2, 1]
    }, {
      name: 'yada 2',
      values: [0.5, 1, 4, 5, 7]
    }
  ]
});
