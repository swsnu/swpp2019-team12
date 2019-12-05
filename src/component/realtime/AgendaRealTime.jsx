import React, { Component } from 'react';
import axios from 'axios';

export default class AgendaRealTime extends Component {
    constructor(props) {
        super(props);

        this.state = {
            agendas: [],
            current_agenda_id: 0,
            is_creating: true
        };
    }

    handleOnClick = () => {
        axios.post();
    };
    render() {
        return (
            <div>
                <button onClick={this.handleOnClick}>
                    Create a new agenda
                </button>
            </div>
        );
    }
}
