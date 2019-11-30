import React, { Component } from 'react';
import Agenda from '../blocks/Agenda';
import Text from '../blocks/Text';
import TodoContainer from '../blocks/TodoContainer';
import axios from 'axios';

const TEXT = 'Text';
const AGENDA = 'Agenda';
const TODO_CONTAINER = 'TodoContainer';
const IMAGE = 'Image';
const TABLE = 'Table';
const CALENDAR = 'Calendar';
const PDF = 'PDF';

class NoteLeftBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            blocks: []
            // isLeft: this.props.isLeft
        };
    }

    handleChangeText = (noteId, editedText) => {};

    render() {
        let count = 0;
        const blocks = this.props.blocks.map(blk => {
            console.log('blk: ', blk);
            count = count + 1;
            console.log('count: ', count);
            if (blk.block_type === TEXT) {
                console.log('blk type: text');
                return (
                    <Text
                        documentId={blk.documentId}
                        blk_id={blk.id}
                        type={blk.block_type}
                        content={blk.content}
                        handleChangeText={this.handleChangeText}
                        handleClickBlock={this.props.handleClickBlock}
                    />
                );
            } else if (blk.block_type === AGENDA) {
                return (
                    <Agenda
                        blk_id={blk.id}
                        type={blk.block_type}
                        content={blk.content}
                        agenda_discussion={blk.agenda_discussion}
                        handleClickBlock={this.props.handleClickBlock}
                    />
                );
            } else if (blk.block_type === TODO_CONTAINER) {
                return (
                    <TodoContainer
                        todos={blk.todos}
                        handleClickBlock={this.props.handleClickBlock}
                    />
                );
            } else {
                return <div>Not Implemented yet.</div>;
            }
        });

        return (
            <div className="NoteLeftBlock-container">
                {/* 이 button들은 스크롤할 떄 따라서 내려가도록 만드는게 좋을 것 같다. */}
                <div className="NoteLeftBlock-create-buttons">
                    <button
                        className="add-block-button"
                        id="add_agenda_block"
                        onClick={() =>
                            this.props.handleAddAgendaBlock(this.state.noteId)
                        }>
                        안건
                    </button>
                    <button
                        className="add-block-button"
                        id="add_text_block"
                        onClick={() =>
                            this.props.handleAddTextBlock(this.state.noteId)
                        }>
                        Text
                    </button>
                    <button
                        className="add-block-button"
                        id="add_todo_block"
                        onClick={() =>
                            this.props.handleAddTodoBlock(this.state.noteId)
                        }
                    />
                    <button
                        className="add-block-button"
                        id="add_image_block"
                        onClick={() =>
                            this.props.handleAddImageBlock(this.state.noteId)
                        }
                    />
                    <button
                        className="add-block-button"
                        id="add_calendar_block"
                        onClick={() =>
                            this.props.handleAddCalendarBlock(this.state.noteId)
                        }
                    />
                    <button
                        className="add-block-button"
                        id="add_pdf_block"
                        onClick={() =>
                            this.props.handleAddPdfBlock(this.state.noteId)
                        }
                    />
                    <button
                        className="add-block-button"
                        id="add_table_block"
                        onClick={() =>
                            this.props.handleAddTableBlock(this.state.noteId)
                        }
                    />
                    <button
                        className="auto-type-button"
                        id="auto_typing"
                        onClick={() =>
                            this.props.handleStartAutoTyping(this.state.noteId)
                        }
                    />
                </div>
                <div className="NoteLeftBlock__blockList">{blocks}</div>
            </div>
        );
    }
}

export default NoteLeftBlock;
