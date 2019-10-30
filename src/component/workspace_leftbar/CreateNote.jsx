import React from 'react';

import { Label } from './Label';

const CreateNote = props => {
    const { handleCreateMeetingNote } = props;
    return (
        <div className="leftbar-component createNote-container">
            <Label title="Create Meeting Note" />
            <div className="createNote__createNoteButton">
                <button className="primary" onClick={handleCreateMeetingNote}>
                    Create New Note
                </button>
            </div>
        </div>
    );
};

export default CreateNote;
