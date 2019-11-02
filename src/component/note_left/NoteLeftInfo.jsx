import React from 'react'
import { Label } from './Label';

const NoteLeftInfo = props => {
    const {
        note_title,
        meeting_date,
        participants
    } = props;

    return (
        <div className="NoteLeftInfo">
            <div className="NoteLeftInfo-title__contanier">
                <Label title="Note Title"/>
                <div className="NoteLeftInfo__currentNote">{note_title}</div>            
            </div>
        </div>
    )
}

export default NoteLeftInfo