import React, { Component } from 'react';
import SettingsChart from './SettingsChart';

class SettingsRow extends Component {
    constructor(props) {
        super(props);

        this.getRowId = this.getRowId.bind(this);
        this.getTabId = this.getTabId.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    getRowId() {
        return 'setting-row-' + this.props.id;
    }

    getTabId(tabId) {
        return this.getRowId() + '-tab-' + tabId;
    }

    handleChange(e) {
        e.preventDefault();

        this.props.handleRowChange(this.props.id, e.target.name, e.target.value);
    }

    render() {
        return (
            <div id={this.getRowId()} className="card">
                <div className="card-content">
                    <div className="row">
                        <div className="input-field col s12">
                            <input id={this.getRowId() + '-title'} name='title' type="text" onChange={this.handleChange} value={this.props.title } />
                            <label className="active" htmlFor={this.getRowId() + '-title'}>Row Title</label>
                            <a className="waves-effect waves-light btn" style={{marginRight: '15px'}} onClick={(e) => this.props.addChart(e, this.props.id)}><i className="material-icons left">add</i>Add Chart</a>
                            <a className="waves-effect waves-light btn red" onClick={(e) => this.props.deleteRow(e, this.props.id)}><i className="material-icons left">delete_sweep</i>Delete Row</a>
                        </div>
                    </div>
                </div>
                <div className="card-tabs">
                    <ul className="tabs">
                        {this.props.charts.map(chart => <li className="tab" key={chart.id}><a href={'#' + this.getTabId(chart.id) }>{chart.title}</a></li>)}
                    </ul>
                </div>
                <div className="card-content grey lighten-4">
                    {this.props.charts.map(chart =>
                        <SettingsChart 
                            key={chart.id}
                            id={chart.id}
                            rowId={this.props.id}
                            containerId={this.getTabId(chart.id)}
                            title={chart.title}
                            prefix={chart.prefix}
                            buckets={chart.buckets}
                            handleChartChange={this.props.handleChartChange}
                            deleteChart={this.props.deleteChart}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default SettingsRow;