import React, { Component } from 'react';
import NoteRightUnfocused from './NoteRightUnfocused';

class Note extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (
            <div>
                <div>meeting note page</div>
                <NoteRightUnfocused />
            </div>
        );
    }
}

export default Note;
