import React, { Component } from 'react';
import Chart from './Chart';

class ChartsRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='row'>
                <div className='col s12'>
                    <h3>{this.props.title}</h3>
                    {this.props.charts.map(chart =>
                        <Chart 
                            key={chart.id}
                            id={chart.id}
                            title={chart.title}
                            width={800}
                            height={300}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default ChartsRow;