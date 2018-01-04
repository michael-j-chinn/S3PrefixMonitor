import React, { Component } from 'react';
import SettingsRow from './SettingsRow';

class SettingsContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: []
        };

        this.addRow = this.addRow.bind(this);
    }

    addRow(e) {
        e.preventDefault();

        var existingRows = this.state.rows;

        existingRows.push({ key: existingRows.length + 1 });

        this.setState({rows: existingRows});
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col s12">
                        <h1>Settings</h1>
                        <p className="flow-text">You can setup your charts here. Add rows with titles, then add one or more Charts to each row. All you need to specify for a Chart is the S3 prefix and buckets to track.</p>
                        <a className="btn-floating btn-large waves-effect waves-light red" onClick={this.addRow}><i className="material-icons">add</i></a>
                    </div>
                </div>
                {this.state.rows.map(row => <SettingsRow key={row.key} /> )}
            </div>
        );
    }
}

export default SettingsContainer;