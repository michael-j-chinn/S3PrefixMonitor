import React, { Component } from 'react';
import ChartsRow from './ChartsRow';



class ChartContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            intervalId: '',
            settings: { rows:[] }
        };

        this.getChartSettings = this.getChartSettings.bind(this);
        this.forceRefresh = this.forceRefresh.bind(this);
        this.clearAllData = this.clearAllData.bind(this);
    }

    componentDidMount() {
        this.getChartSettings();

        let intervalId = setInterval(() => this.getChartSettings(), 15000);

        this.setState({intervalId});
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    getChartSettings() {
        axios.get('/api/v1/charts')
            .then(response => {
                this.setState({ settings: response.data });
            });
    }

    forceRefresh(e) {
        e.preventDefault();

        axios.post('/api/v1/charts/getcounts')
            .then(response => {

            })
            .catch(reason => {
                console.log(reason);
            });
    }

    clearAllData(e) {
        e.preventDefault();

        axios.delete('/api/v1/charts');
    }

    render() {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col s12'>
                        <h1>Charts</h1>
                        <a className="waves-effect waves-light btn" style={{marginRight: '15px'}} onClick={this.forceRefresh}><i className="material-icons left">refresh</i>Force Refresh</a>
                        <a className="waves-effect waves-light btn red" onClick={this.clearAllData}><i className="material-icons left">clear_all</i>Clear All Data</a>
                        <div className='fixed-action-btn click-to-toggle'>
                            <a className='btn-floating btn-large red'>
                                <i className='large material-icons'>mode_edit</i>
                            </a>
                            <ul>
                                <li><a className='btn-floating green' onClick={this.forceRefresh}><i className='material-icons'>refresh</i></a></li>
                                <li><a className='btn-floating red'  onClick={this.clearAllData}><i className='material-icons'>clear_all</i></a></li>
                            </ul>
                        </div>
                        {this.state.settings.rows.map(row => 
                            <ChartsRow 
                                key={row.id}
                                id={row.id}
                                title={row.title}
                                charts={row.charts}
                                colSize={row.colSize}
                            /> 
                        )}
                    </div>
                </div>
            </div>
        );
    }
};

export default ChartContainer;