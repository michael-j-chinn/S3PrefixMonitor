import React, { Component } from 'react';

class SettingsChart extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        Materialize.updateTextFields();
    }

    handleChange(e) {
        this.props.handleChartChange(this.props.id, e.target.name, e.target.value);
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
            </div>
        );
    }
}

export default SettingsChart;