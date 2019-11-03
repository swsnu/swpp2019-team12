import React, { Component } from 'react';
import NoteLeftInfo from '../../component/note_left/NoteLeftInfo';
import NoteLeftBlock from '../../component/note_left/NoteLeftBlock';
// Dummy Data
import {
    dummyNote,
    handleAddAgendaBlock,
    handleAddTextBlock,
    handleAddImageBlock,
    handleAddCalendarBlock,
    handleAddPdfBlock,
    handleAddTableBlock,
    handleAddTodoBlock
} from './DummyData';
class Note extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}
    
    render() {
        const temp_id = 1;
        console.log(dummyNote.note_title)
        return (
            <div className="Note">
                <div className="Note-left">
                    <div className="Note-left-page__title">Note Left</div>
                    <div className="Note-left-page__line" />
                    <div className="Note-left-container">
                        <NoteLeftInfo 
                            note_title={dummyNote.note_title}
                            meeting_date={dummyNote.meeting_date}
                            participants={dummyNote.participants}
                        />
                        <NoteLeftBlock 
                            note_id={temp_id}
                        />

                    </div>
                </div>
                <div className="Note-right">
                    <div className="Note-right-container">
                        RIGHT
                    </div>

                </div>
            </div>
        
        );
    }
}

export default Note;
