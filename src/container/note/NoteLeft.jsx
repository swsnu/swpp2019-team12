import React, { Component } from 'react';
import NoteLeftBlock from '../../component/note_left/NoteLeftBlock';
import NoteLeftInfo from '../../component/note_left/NoteLeftInfo';
import NoteTree from '../../component/note_left/NoteTree';

class NoteLeft extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="Note-left" onClick={this.props.handleClickNoteLeft}>
                <div className="Note-left-container">
                    <NoteLeftInfo
                        note_title={this.props.note_title}
                        meeting_date={this.props.meeting_date}
                        participants={this.props.participants}
                        moment={this.props.moment}
                        location={this.props.location}
                        handleChangeTitle={this.props.handleChangeTitle}
                        handleChangeDatetime={this.props.handleChangeDatetime}
                        handleAddParticipant={this.props.handleAddParticipant}
                        handleChangeLocation={this.props.handleChangeLocation}
                    />
                    <NoteLeftBlock
                        noteId={this.props.noteId}
                        blocks={this.props.blocks}
                        participants={this.props.participants}
                        handleDeleteBlock={this.props.handleDeleteBlock}
                        handleAddTextSocketSend={
                            this.props.handleAddTextSocketSend
                        }
                        handleAddAgendaBlock={this.props.handleAddAgendaBlock}
                        handleAddTextBlock={this.props.handleAddTextBlock}
                        handleAddTodoBlock={this.props.handleAddTodoBlock}
                        handleAddCalendarBlock={
                            this.props.handleAddCalendarBlock
                        }
                        handleDeleteTodo={this.props.handleDeleteTodo}
                        handleClickBlock={this.props.handleClickBlock}
                        onDragEnd={this.props.onDragEnd}
                        handleAddAgendaChildrenBlocks={
                            this.props.handleAddAgendaChildrenBlocks
                        }
                        socketRef={this.props.socketRef}
                    />
                </div>
            </div>
        );
    }
}

export default NoteLeft;
