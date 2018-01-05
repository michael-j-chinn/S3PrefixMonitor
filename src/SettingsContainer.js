import React, { Component } from 'react';
import SettingsRow from './SettingsRow';

class SettingsContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: []
        };

        this.addRow = this.addRow.bind(this);
        this.save = this.save.bind(this);
    }

    addRow(e) {
        e.preventDefault();

        var existingRows = this.state.rows;

        existingRows.push({ key: existingRows.length + 1 });

        this.setState({rows: existingRows});
    }

    save() {

    }

    render() {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col s12'>
                        <h1>Settings</h1>
                        <p className='flow-text'>You can setup your charts here. Add rows with titles, then add one or more Charts to each row. All you need to specify for a Chart is the S3 prefix and buckets to track.</p>
                        <a className="waves-effect waves-light btn" onClick={this.addRow}><i className="material-icons left">add</i>Add Row</a>
                        <a className="waves-effect waves-light btn right" onClick={this.save}><i className="material-icons left">save</i>Save</a>
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
                {this.state.rows.map(row => <SettingsRow key={row.key} id={row.key} /> )}
            </div>
        );
    }
}

export default SettingsContainer;