import Chart from './../base';

class StackedBar extends Chart {
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
            y_ticks: 7,
            chart_class: 'd3-stacked-bar-chart',
            fnClassName: function(name) {
                return name.replace(/\s+/g, '-').toLowerCase()
            },
            xTickFormat: function(d, i) { return d; },
            yTickFormat: function(d, i) { return d; },
            divider_color: '#fff',
            rect_color: '#0d793e',
            hover_tooltips: true,
            labels: true,
        });
    }

    defineAxes() {
        const stacked_bar = this;
        stacked_bar.y_axis = d3.svg.axis()
            .orient('left')
            .ticks(stacked_bar.y_ticks)
            .outerTickSize(0)
            .tickFormat(stacked_bar.yTickFormat);
        stacked_bar.y_scale = d3.scale.linear();

        stacked_bar.drawOne('.d3-chart-range.d3-chart-axis', 'g', (range_axis) => {
            range_axis.attr('class', 'd3-chart-range d3-chart-axis');
        });

        stacked_bar.x_scale = d3.scale.ordinal();

        stacked_bar.x_axis = d3.svg.axis()
            .orient('bottom')
            .outerTickSize(0)
            .tickFormat(stacked_bar.xTickFormat);

        stacked_bar.drawOne('.d3-chart-domain.d3-chart-axis', 'g', (domain_axis) => {
            domain_axis.attr('class', 'd3-chart-domain d3-chart-axis')
                .attr('transform', 'translate(0,' + stacked_bar.height + ')');
        });

        stacked_bar.fnColor = stacked_bar.fnColor || d3.scale.category20();

        stacked_bar.tooltip = d3.select(stacked_bar.container).append('div').attr('class', 'stacked-bar-tooltip');
    }

    drawData(data) {
        const stacked_bar = this;

        stacked_bar.x_scale.domain(data.map((d) => d.name))
            .rangeRoundBands([0, stacked_bar.width], .1, 0);
        stacked_bar.x_axis.scale(stacked_bar.x_scale);

        stacked_bar.extent = stacked_bar.dataExtent(data);
        stacked_bar.y_scale.domain(stacked_bar.extent)
            .range([stacked_bar.height, 0]);
        stacked_bar.y_axis.scale(stacked_bar.y_scale);

        stacked_bar.svg.select('.d3-chart-range').call(stacked_bar.y_axis);

        stacked_bar.svg.select('.d3-chart-domain').call(stacked_bar.x_axis);

        data.forEach((series, i) => {
            let y0 = 0;

            series.values.map((item) => {
                item.y0 = y0;
                item.y1 = y0 += item.value;
            });
        });
        const bars = stacked_bar.svg.selectAll('g.series')
            .data(data)
            .enter()
            .append('g')
            .attr('class', (d) => `${stacked_bar.fnClassName(d.name)} series`);

        stacked_bar.svg.selectAll('g.series').attr('transform', ((d) => {
            return `translate(${stacked_bar.x_scale(d.name)},0)`
        }));

        const bar_enter = bars.selectAll('rect')
            .data((d) => d.values)
            .enter();

        bar_enter.append('rect');
        bar_enter.append('text');

        const rects = stacked_bar.svg.selectAll('g.series').selectAll('rect');
        const texts = stacked_bar.svg.selectAll('g.series').selectAll('text');

        stacked_bar.applyData(rects);
        if (stacked_bar.labels) stacked_bar.applyLabels(texts);
        if (stacked_bar.hover_tooltips) stacked_bar.applyTooltip(bars);

        stacked_bar.data = data;
        return stacked_bar;
    }

    dataExtent(data) {
        let max = 0;
        for (let i = 0; i < data.length; i++) {
            let sum = 0;
            for (let item of data[i].values) {
                sum += item.value;
            }
            max = Math.max(max, sum)
        }
        return [0, max];
    }

    applyData(bars) {
        var stacked_bar = this;
        bars
            .attr('class', (d) => stacked_bar.fnClassName(d.title))
            .attr('y', (d) => stacked_bar.y_scale(d.y1))
            .attr('height', (d) => stacked_bar.y_scale(d.y0) - stacked_bar.y_scale(d.y1))
            .style('fill', stacked_bar.rect_color)
            .style('stroke', stacked_bar.divider_color)
            .attr('width', stacked_bar.x_scale.rangeBand());
    }

    applyLabels(bars) {
        var stacked_bar = this;
        bars.text((d) => d.title)
            .attr('y', (d) => stacked_bar.y_scale(d.y1) + (stacked_bar.y_scale(d.y0) - stacked_bar.y_scale(d.y1)) / 1.5)
            .attr('x', stacked_bar.x_scale.rangeBand() / 2)
            .attr('text-anchor', 'middle')
            .style('display', (d) => (d.value * 100 / stacked_bar.extent[1] < 7.5) ? 'none' : 'block')
            .style('font-size', function(d) {
                if (stacked_bar.x_scale.rangeBand() < 90) {
                    if (this.getComputedTextLength() > 80) return '0px';
                    return '10px';
                }
                if (this.getComputedTextLength() < 80) return '12px';
                return (1100 / this.getComputedTextLength()) + 'px';
            })
            .style('fill', '#ffffff');
    }

    applyTooltip(bars) {
        const stacked_bar = this;
        bars.on('mousemove', (d) => {
            stacked_bar.tooltip.style('left', d3.event.pageX + 15 + 'px');
            stacked_bar.tooltip.style('top', d3.event.pageY - 25 + 'px');
            stacked_bar.tooltip.style('display', 'inline-block');
            const current = document.querySelectorAll(':hover') || document.querySelectorAll(':focus');
            const item = current[current.length - 1].__data__;
            stacked_bar.tooltip.html(`<b>${item.title}</b> <br> ${(item.value).toFixed(2)} tons CO<sub>2</sub>`)
        });
        bars.on('mouseout', () => stacked_bar.tooltip.style('display', 'none'));
    }

    redraw(opts) {
        let chart = this;
        Object.assign(chart, opts);
        chart.height = chart.outer_height - chart.margin.top - chart.margin.bottom;
        chart.width = chart.outer_width - chart.margin.left - chart.margin.right;
        d3.select(chart.container + ' svg')
            .attr('width', chart.outer_width)
            .attr('height', chart.outer_height)
            .select('.d3-object-container')
            .attr('transform', 'translate(' + chart.margin.left + ',' + chart.margin.top + ')');
        chart.defineAxes();
        if (chart.afterAxes) chart.afterAxes();
        chart.drawData(chart.data);
    }

}

export default StackedBar;