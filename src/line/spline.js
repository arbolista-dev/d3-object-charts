import LineChart from './line';

const INTEPOLATION = 'cardinal';

class SplineChart extends LineChart {

  get chart_options(){
    return {
      interpolation: INTEPOLATION
    }
  }

}
