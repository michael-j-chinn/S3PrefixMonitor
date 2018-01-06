import React, { Component } from 'react';

class Chart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h5>{this.props.title}</h5>
                <img width={this.props.width} height={this.props.height} src="http://via.placeholder.com/800x300" />
            </div>
        );
    }
}

export default Chart;