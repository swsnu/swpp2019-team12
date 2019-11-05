import React, { Component } from 'react';
import NoteLeftBlock from '../../component/note_left/NoteLeftBlock';
import NoteLeftInfo from '../../component/note_left/NoteLeftInfo';

class NoteLeft extends Component {
    constructor(props) {
        super(props);
        this.state = {
            note_title: this.props.note_title,
            note_id: this.props.note_id,
            meeting_date: this.props.meeting_date,
            participants: this.props.participants,
        }
    }

    render() {
        return (
            <div 
                className="Note-left" 
                onClick={this.props.handleClickNoteLeft}
            >
                <div className="Note-left-page__title">Note Left</div>
                    <div className="Note-left-page__line" />
                    <div className="Note-left-container">
                        <NoteLeftInfo
                            note_title={this.state.note_title}
                            meeting_date={this.state.meeting_date}
                            participants={this.state.participants}
                            />
                        <NoteLeftBlock 
                            note_id={this.state.note_id}
                            handleClickBlock={this.props.handleClickBlock}
                        />
                    </div>
            </div>
        );
    }
}

export default NoteLeft;