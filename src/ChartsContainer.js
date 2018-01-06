import React, { Component } from 'react';
import ChartsRow from './ChartsRow'

class ChartContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: []
        };
    }

    componentDidMount() {
        axios.get('/api/settings')
            .then(response => {
                this.setState(response.data);
            });
    }

    render() {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col s12'>
                        <h1>Charts</h1>
                        {this.state.rows.map(row => 
                            <ChartsRow 
                                key={row.id}
                                id={row.id}
                                title={row.title}
                                charts={row.charts}
                            /> 
                        )}
                    </div>
                </div>
            </div>
        );
    }
};

export default ChartContainer;