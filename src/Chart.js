import React, { Component } from 'react';

class Chart extends Component {
    constructor(props) {
        super(props);

        this.getChartData = this.getChartData.bind(this);
        this.buildChartSvg = this.buildChartSvg.bind(this);
        this.buildChart = this.buildChart.bind(this);
    }

    getChartData(chartUuid, timerange) {
        return new Promise((resolve, reject) =>{
            axios.get(`/api/chart/${chartUuid}/${timerange}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(reason => {
                    reject(reason);
                });
        });
    }

    buildChartSvg(chartData, containerId) {
        let $container = $('#'+ containerId),
            margin = {top: 5, right: 15, bottom: 30, left: 22},
            width = $container.width(),
            height = (.7 * width),
            columns = chartData.columns,
            data = chartData.rows.map(d => type(d, '', columns));
        
        $container.empty();
    
        let svg = d3
            .select('#'+ containerId)
            .append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
            .attr('viewBox',`0 0 ${width+margin.left+margin.right} ${height+margin.bottom+margin.top}`);
            //.attr('preserveAspectRatio','xMinYMin');

        let g = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    
        var parseTime = d3.timeParse("%Y%m%d%H%M");
    
        var x = d3.scaleTime().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            z = d3.scaleOrdinal(d3.schemeCategory10);
    
        var line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.totalFiles); });
    
        var regions = columns.slice(1).map(function(id) {
            return {
                id: id,
                values: data.map(function(d) {
                    return {date: d.date, totalFiles: d[id]};
                })
            };
        });

        x.domain(d3.extent(data, function(d) { return d.date; }));

        y.domain([
            d3.min(regions, function(c) { return d3.min(c.values, function(d) { return 0; }); }),
            d3.max(regions, function(c) { return d3.max(c.values, function(d) { return d.totalFiles; }); })
        ]);

        z.domain(regions.map(function(c) { return c.id; }));

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("Total Files");

        var region = g.selectAll(".region")
            .data(regions)
            .enter().append("g")
            .attr("class", "region");

        region.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d) { return z(d.id); });

        region.append("text")
            .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.totalFiles) + ")"; })
            .attr("x", -170) // TODO: Figure out how to dynamically calculate this value based on length of the word.
            .attr("dy", "0.4em")
            .style("font", "14px sans-serif")
            .text(function(d) { return d.id; });
    
        function type(d, _, columns) {
            var parseTime = d3.timeParse("%Y%m%d%H%M");
            d.date = parseTime(d.date);
            for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
            return d;
        }
    }

    buildChart() {
        this.getChartData(this.props.uuid, 'ALL')
            .then(data => {
                this.buildChartSvg(data, `chart-${this.props.uuid}`);
            })
            .catch(reason => {
                console.log(reason);
            });
    }

    componentDidMount() {
        // Set an interval to keep the data fresh
        let intervalId = setInterval(() => this.buildChart(), 30000);

        // Build the SVG
        this.buildChart();

        // Remember the refresh interval so we can clear it
        this.setState({intervalId});
    }

    componentWillUnmount() {
        console.log('chart-componentWillUnmount');
        clearInterval(this.state.intervalId);
    }

    render() {
        return (
            <div className={"col s12 m" + this.props.colSize}>
                <h5>{this.props.title}</h5>
                <div id={'chart-' + this.props.uuid}>
                </div>
            </div>
        );
    }
}

export default Chart;