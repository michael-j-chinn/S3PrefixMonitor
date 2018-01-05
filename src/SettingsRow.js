import React, { Component } from 'react';
import SettingsChart from './SettingsChart';

class SettingsRow extends Component {
    constructor(props) {
        super(props);

        this.state = { charts: [] };

        this.addChart = this.addChart.bind(this);
        this.getRowId = this.getRowId.bind(this);
        this.getTabId = this.getTabId.bind(this);
        this.handleChartChange = this.handleChartChange.bind(this);
    }

    componentDidMount() {
        console.log('componentDidMount'); 
    }

    componentDidUpdate() {
        console.log('componentDidUpdate');
        let length = this.state.charts.length;

        if (length > 0) {
            let row_id = this.getRowId();

            $('#' + row_id + ' > div > ul.tabs').tabs();

            // Always select the last tab
            // let lastTabId = this.getTabId(this.state.charts[length-1].id);
            // $('#' + row_id + ' > div > ul.tabs').tabs('select_tab', lastTabId);
        }
    }

    getRowId() {
        return 'setting-row-' + this.props.id;
    }

    getTabId(tabId) {
        return this.getRowId() + '-tab-' + tabId;
    }

    addChart(e){
        e.preventDefault();

        console.log('addChart');
        let charts = this.state.charts;

        let id = charts.length + 1;
        let newChart = {
            id,
            title: 'Chart - #' + id,
            prefix: '',
            buckets: ''
        };

        charts.push(newChart);

        this.setState({charts});
    }

    handleChartChange(id, field, value) {
        let charts = this.state.charts;

        charts.forEach(chart => {
            if (chart.id == id) {
                chart[field] = value;
            }
        });

        this.setState({charts});
    }

    render() {
        return (
            <div id={"setting-row-" + this.props.id} className="card">
                <div className="card-content">
                    <div className="row">
                        <div className="input-field col s12">
                            <input id="email" type="text" className="validate" />
                            <label htmlFor="email">Row Title</label>
                            <a className="waves-effect waves-light btn" onClick={this.addChart}><i className="material-icons left">add</i>Add Chart</a>
                        </div>
                    </div>
                </div>
                <div className="card-tabs">
                    <ul className="tabs">
                        {this.state.charts.map(chart => <li className="tab" key={chart.id}><a href={'#' + this.getTabId(chart.id) }>{chart.title}</a></li>)}
                    </ul>
                </div>
                <div className="card-content grey lighten-4">
                    {this.state.charts.map(chart =>
                            <SettingsChart 
                                key={chart.id}
                                id={chart.id}
                                containerId={this.getTabId(chart.id)}
                                title={chart.title}
                                prefix={chart.prefix}
                                buckets={chart.buckets}
                                handleChartChange={this.handleChartChange}
                            />
                    )}
                </div>
            </div>
        );
    }
}

export default SettingsRow;