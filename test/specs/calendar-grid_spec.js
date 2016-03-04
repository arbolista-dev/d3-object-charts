import CalendarGridChart from '../src/grid/calendar_grid';

describe('CalendarGridChart', () => {
   it('should create new chart', () => {
       let chart = new CalendarGridChart();
       expect(chart).tobeDefined();
   });
});
