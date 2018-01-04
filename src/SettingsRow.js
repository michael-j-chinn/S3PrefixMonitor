import React, { Component } from 'react';
import SettingsChart from './SettingsChart';

class SettingsRow extends Component {
    constructor(props) {
        super(props);

        this.state = { charts: [] };

        this.addChart = this.addChart.bind(this);
    }

    addChart(e){
        e.preventDefault();

        let charts = this.state.charts;

        charts.push({ key: charts.length + 1 });

        this.setState({charts});
    }

    render() {
        return (
            <div className="row">
                <div className="col s12">
                    <div className="input-field col s12">
                        <input id="email" type="text" className="validate" />
                        <label htmlFor="email">Row Title</label>
                        <a className="waves-effect waves-light btn" onClick={this.addChart}>Add Chart</a>
                        <div className="row">
                            <div className="col s12">
                                {this.state.charts.map(chart => <SettingsChart key={chart.key} />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SettingsRow;