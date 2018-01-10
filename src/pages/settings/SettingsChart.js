import React, { Component } from 'react';

class SettingsChart extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        e.preventDefault();

        this.props.handleChartChange(this.props.rowId, this.props.id, e.target.name, e.target.value);
    }

    render() {
        return (
            <div id={this.props.containerId}>
                <div className='row'>
                    <div className='input-field col s12'>
                        <input id={this.props.containerId + 'chart-title'} name='title' type='text' className='validate' onChange={this.handleChange} value={this.props.title} />
                        <label htmlFor={this.props.containerId + 'chart-title'}>Chart Title</label>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-field col s12'>
                        <input id={this.props.containerId + 'chart-prefix'} name='prefix' type='text' className='validate' onChange={this.handleChange} value={this.props.prefix} />
                        <label htmlFor={this.props.containerId + 'chart-prefix'}>Prefix to Monitor</label>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-field col s12'>
                        <input id={this.props.containerId + 'chart-buckets'} name='buckets' type='text' className='validate' onChange={this.handleChange} value={this.props.buckets} />
                        <label htmlFor={this.props.containerId + 'chart-buckets'}>Buckets CSV</label>
                    </div>
                </div>
                <a className="waves-effect waves-light btn red" onClick={(e) => this.props.deleteChart(e, this.props.rowId, this.props.id)}><i className="material-icons left">delete</i>Delete Chart</a>
            </div>
        );
    }
}

export default SettingsChart;