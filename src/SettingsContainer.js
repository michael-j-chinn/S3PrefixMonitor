import React, { Component } from 'react';
import SettingsRow from './SettingsRow';

class SettingsContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: []
        };

        this.addRow = this.addRow.bind(this);
        this.addChart = this.addChart.bind(this);
        this.save = this.save.bind(this);
        this.handleRowChange = this.handleRowChange.bind(this);
        this.handleChartChange = this.handleChartChange.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.deleteChart = this.deleteChart.bind(this);
    }

    componentDidMount() {
        axios.get('/api/settings')
            .then(response => {
                this.setState(response.data);
            });
    }

    componentDidUpdate() {
        $('ul.tabs').tabs();
    }

    addRow(e) {
        e.preventDefault();

        var rows = this.state.rows;

        var newRow = {
            id: rows.length + 1,
            title: '',
            charts: []
        };

        rows.push(newRow);

        this.setState({rows});
    }

    deleteRow(e, id) {
        e.preventDefault();

        var rows = this.state.rows;

        var indexToDelete = -1;
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].id == id) {
                indexToDelete = i;
                break;
            }
        }

        rows.splice(indexToDelete, 1);

        this.setState({rows});
    }

    deleteChart(e, rowId, chartId) {
        e.preventDefault();

        var rows = this.state.rows;

        rows.forEach(row => {
            if (row.id == rowId) {
                let charts = row.charts;
                let indexToDelete = -1;

                for (let i = 0; i < charts.length; i++) {
                    if (charts[i].id == chartId) {
                        indexToDelete = i;
                        break;
                    }
                }

                charts.splice(indexToDelete, 1);
                row.charts = charts;
            }
        });

        this.setState({rows});
    }

    addChart(e, rowId){
        e.preventDefault();

        let rows = this.state.rows;

        rows.forEach(row => {
            if (row.id == rowId) {
                let id = row.charts.length + 1;
                let newChart = {
                    id,
                    title: 'Chart - #' + id,
                    prefix: '',
                    buckets: ''
                };

                row.charts.push(newChart);
            }
        });

        this.setState({rows});
    }

    handleRowChange(id, field, value) {
        let rows = this.state.rows;

        rows.forEach(row => {
            if (row.id == id) {
                row[field] = value;
            }
        });

        this.setState({rows});
    }

    handleChartChange(rowId, chartId, field, value) {
        let rows = this.state.rows;

        rows.forEach(row => {
            if (row.id == rowId) {
                let charts = row.charts;

                charts.forEach(chart => {
                    if (chart.id == chartId) {
                        chart[field] = value;
                    }
                });
            }
        });

        this.setState({rows});
    }

    save() {
        axios.post('/api/settings', this.state);
    }

    render() {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col s12'>
                        <h1>Settings</h1>
                        <p className='flow-text'>You can setup your charts here. Add rows with titles, then add one or more Charts to each row. All you need to specify for a Chart is the S3 prefix and buckets to track.</p>
                        <a className="waves-effect waves-light btn" onClick={this.addRow}><i className="material-icons left">add</i>Add Row</a>
                        <a className="waves-effect waves-light btn right blue" onClick={this.save}><i className="material-icons left">save</i>Save</a>
                        <div className='fixed-action-btn click-to-toggle'>
                            <a className='btn-floating btn-large red'>
                                <i className='large material-icons'>mode_edit</i>
                            </a>
                            <ul>
                                <li><a className='btn-floating green' onClick={this.save}><i className='material-icons'>save</i></a></li>
                                <li><a className='btn-floating red'  onClick={this.addRow}><i className='material-icons'>add</i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                {this.state.rows.map(row => 
                    <SettingsRow 
                        key={row.id}
                        id={row.id}
                        title={row.title}
                        charts={row.charts}
                        addChart={this.addChart}
                        handleRowChange={this.handleRowChange}
                        handleChartChange={this.handleChartChange}
                        deleteRow={this.deleteRow}
                        deleteChart={this.deleteChart}
                    /> 
                )}
            </div>
        );
    }
}

export default SettingsContainer;