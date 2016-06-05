import Chart from './../base';

class ComparativePie extends Chart {
  get chart_options() {
    return Object.assign(Object.assign({}, Chart.DEFAULTS), {
      outer_width: 600,
      outer_height: 400,
      margin: {
        top: 20,
        left: 30,
        bottom: 20,
        right: 30
      },
      chart_class: 'd3-comparative-pie-chart',
      fnColor: d3.scale.category20()
    });
  }

  defineAxes(){
    let comparative_pie = this;
  }

  drawData(data) {
    let comparative_pie = this,
        value_sum = d3.sum(data.values),
        max_r = Math.min(comparative_pie.width, comparative_pie.height) / 2,
        max_sum = Math.max(data.comparative_sum, value_sum),
        min_sum = Math.min(data.comparative_sum, value_sum),
        min_r = Math.sqrt(min_sum / max_sum) * max_r,
        // pythagorean theorem to get displace x/y value.
        displace = Math.sqrt(Math.pow(Math.abs(max_r - min_r), 2)/2);

    if (value_sum >= data.comparative_sum){
      comparative_pie.drawPie(data, max_r, 0);
      comparative_pie.drawComparativeArc(min_r, displace);
    } else {
      comparative_pie.drawPie(data, min_r, displace);
      comparative_pie.drawComparativeArc(max_r, 0);
    }
    comparative_pie.data = data;
    return comparative_pie;
  }

  drawPie(data, r, displace){
    let comparative_pie = this;
    let arc = d3.svg.arc()
        .outerRadius(r)
        .innerRadius(0);

    let labelArc = d3.svg.arc()
        .outerRadius(r - 30)
        .innerRadius(r - 30);

    let pie = d3.layout.pie()
        .sort(null);

    let cx = comparative_pie.width / 2 - displace,
        cy = comparative_pie.height / 2 + displace;

    let arcs = comparative_pie.svg.selectAll(".d3-value-arc")
        .data(pie(data.values))
    arcs.exit().remove();
    [arcs.enter().append('g'), arcs].forEach((g)=>{
      g.attr("class", "d3-value-arc")
        .attr('transform', `translate(${cx}, ${cy})`)
    });

    let paths = arcs.selectAll("path")
        .data(pie(data.values))
    paths.exit().remove();
    [paths.enter().append('path'), paths].forEach((path)=>{
      path
        .attr("d", arc)
        .style("fill", function(d, i) {
          return comparative_pie.fnColor(data.categories[i]);
        });
    });

    let labels = arcs.selectAll("text")
        .data(pie(data.values))
    labels.exit().remove();
    [labels.enter().append('text'), labels].forEach((label)=>{
      label
        .attr("dy", ".35em")
        .text(function(d, i) { return data.categories[i]; })
        .attr("transform", function(d) {
          let node = this,
              centroid = labelArc.centroid(d);
          centroid[0] -= node.getBBox().width / 2;
          return "translate(" + centroid + ")";
        });
    });

  }

  drawComparativeArc(r, displace){
    let comparative_pie = this,
        cx = comparative_pie.width/2 - displace,
        cy = comparative_pie.height/2 + displace,
        comparative_arc = comparative_pie.svg.selectAll('.d3-comparative-arc')
          .data([0]);
    comparative_arc.exit().remove();

    [comparative_arc.enter().append('circle'), comparative_arc].forEach((circle)=>{
      circle
        .attr('class', 'd3-comparative-arc')
        .style('stroke', 'black')
        .style('stroke-width', 2)
        .style('fill', 'none')
        .style('stroke-dasharray', '5,5')
        .attr('r', r)
        .attr('cx', cx)
        .attr('cy', cy);
    })
  }

  redraw(opts){
    let chart = this;
    Object.assign(chart, opts);
    chart.height = chart.outer_height - chart.margin.top - chart.margin.bottom;
    chart.width = chart.outer_width - chart.margin.left - chart.margin.right;

    d3.select(chart.container + ' svg')
        .attr("width", chart.outer_width)
        .attr("height", chart.outer_height)
      .select(".d3-object-container")
        .attr("transform", "translate(" + chart.margin.left + "," + chart.margin.top + ")");
    chart.defineAxes();
    if (chart.afterAxes) chart.afterAxes();
    chart.drawData(chart.data);
  }

}

export default ComparativePie;
