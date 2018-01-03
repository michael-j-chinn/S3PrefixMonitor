import React, { Component } from 'react';

class Chart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <svg width={props.width} height={props.height}></svg>
        );
    }
}

export default Chart;