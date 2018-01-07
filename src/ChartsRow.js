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
                    <div className="row">
                        {this.props.charts.map(chart =>
                            <Chart 
                                key={chart.id}
                                id={chart.id}
                                uuid={chart.uuid}
                                title={chart.title}
                                colSize={this.props.colSize}
                                width={800}
                                height={300}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default ChartsRow;