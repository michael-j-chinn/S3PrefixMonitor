import React, { Component } from 'react';

function buildChart(containerId, svgId) {
    let $container = $('#'+ containerId)
        width = container.width()
        height = container.height();

    let svg = d3.select('#'+ containerId).append("svg")
        .attr("width", '100%')
        .attr("height", '100%')
        .attr('viewBox','0 0 '+Math.min(width,height) +' '+Math.min(width,height) )
        .attr('preserveAspectRatio','xMinYMin')
        .append("g")
        .attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")");

    var parseTime = d3.timeParse("%Y%m%d%H%M");

    var x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal(d3.schemeCategory10);

    var line = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.totalFiles); });

    d3.tsv("/data/" + config.tsv + ".tsv", type, function(error, data) {
        if (error) throw error;

        var regions = data.columns.slice(1).map(function(id) {
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
            .attr("x", 3)
            .attr("dy", "0.35em")
            .style("font", "10px sans-serif")
            .text(function(d) { return d.id; });
    });

    function type(d, _, columns) {
        d.date = parseTime(d.date);
        for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
        return d;
    }
};

class Chart extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <div id={this.props.containerId} className={"col s12 m" + this.props.colSize}>
                <h5>{this.props.title}</h5>
            </div>
        );
    }
}

export default Chart;