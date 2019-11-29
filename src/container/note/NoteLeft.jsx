import React, { Component } from 'react';
import NoteLeftBlock from '../../component/note_left/NoteLeftBlock';
import NoteLeftInfo from '../../component/note_left/NoteLeftInfo';

class NoteLeft extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUserProfile: this.props.currentUserProfile
        };
        // this.state = {
        //     note_title: this.props.note_title,
        //     noteId: this.props.noteId,
        //     meeting_date: this.props.meeting_date,
        //     participants: this.props.participants,
        // }
    }

    render() {
        return (
            <div className="Note-left" onClick={this.props.handleClickNoteLeft}>
                <div className="Note-left-page__title">Note Left</div>
                <div className="Note-left-page__line" />
                <div className="Note-left-container">
                    <NoteLeftInfo
                        note_title={this.props.note_title}
                        meeting_date={this.props.meeting_date}
                        participants={this.props.participants}
                        moment={this.props.moment}
                        handleChangeTitle={this.props.handleChangeTitle}
                        handleChangeDatetime={this.props.handleChangeDatetime}
                    />
                    <NoteLeftBlock
                        currentUserProfile={this.props.currentUserProfile}
                        noteId={this.props.noteId}
                        blocks={this.props.blocks}
                        handleAddAgendaBlock={this.props.handleAddAgendaBlock}
                        handleAddTextBlock={this.props.handleAddTextBlock}
                        handleClickBlock={this.props.handleClickBlock}
                    />
                </div>
            </div>
        );
    }
}

export default NoteLeft;
