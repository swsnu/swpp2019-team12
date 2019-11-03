import React from 'react';

import { Label } from './Label';

const CreateNote = props => {
    return (
        <div className="leftbar-component createNote-container">
            <Label title="Create Meeting Note" />
            <div className="createNote__createNoteButton">
                <button className="primary">Create New Note</button>
            </div>
        </div>
    );
};

export default CreateNote;
