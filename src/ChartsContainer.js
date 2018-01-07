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
        axios.get('/api/charts')
            .then(response => {
                this.setState({ settings: response.data });
            });
    }

    render() {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col s12'>
                        <h1>Charts</h1>
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