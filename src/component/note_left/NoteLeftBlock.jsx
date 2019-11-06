import React, { Component } from 'react';
import PreviewAgenda from '../blocks/PreviewAgenda';
import Text from '../blocks/Text';
import TodoContainer from '../blocks/TodoContainer';
import axios from 'axios';
class NoteLeftBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            blocks: []
        };
    }

    handleChangeText = () => {};

    render() {
        const blocks = this.props.blocks.map(blk => {
            if (blk.block_type === 'textblock') {
                return (
                    <Text
                        id={blk.id}
                        type={blk.block_type}
                        content={blk.content}
                        handleChangeText={this.handleChangeText}
                        handleClickBlock={this.props.handleClickBlock}
                    />
                );
            } else if (blk.block_type === 'agenda') {
                return (
                    <PreviewAgenda
                        id={blk.id}
                        type={blk.block_type}
                        content={blk.content}
                        agenda_disccusion={blk.agenda_disccusion}
                        handleClickBlock={this.props.handleClickBlock}
                    />
                );
            } else if (blk.block_type === 'TodoContainer') {
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
                            this.props.handleAddAgendaBlock(this.props.note_id)
                        }
                    />
                    <button
                        className="add-block-button"
                        id="add_text_block"
                        onClick={() =>
                            this.props.handleAddTextBlock(this.props.note_id)
                        }
                    />
                    <button
                        className="add-block-button"
                        id="add_todo_block"
                        onClick={() =>
                            this.props.handleAddTodoBlock(this.props.note_id)
                        }
                    />
                    <button
                        className="add-block-button"
                        id="add_image_block"
                        onClick={() =>
                            this.props.handleAddImageBlock(this.props.note_id)
                        }
                    />
                    <button
                        className="add-block-button"
                        id="add_calendar_block"
                        onClick={() =>
                            this.props.handleAddCalendarBlock(
                                this.props.note_id
                            )
                        }
                    />
                    <button
                        className="add-block-button"
                        id="add_pdf_block"
                        onClick={() =>
                            this.props.handleAddPdfBlock(this.props.note_id)
                        }
                    />
                    <button
                        className="add-block-button"
                        id="add_table_block"
                        onClick={() =>
                            this.props.handleAddTableBlock(this.props.note_id)
                        }
                    />
                    <button
                        className="auto-type-button"
                        id="auto_typing"
                        onClick={() =>
                            this.props.handleStartAutoTyping(this.props.note_id)
                        }
                    />
                </div>
                <div className="NoteLeftBlock__blockList">{blocks}</div>
            </div>
        );
    }
}

export default NoteLeftBlock;
