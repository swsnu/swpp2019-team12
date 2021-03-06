import React, { Component } from 'react';
import Agenda from '../blocks/Agenda';
import Text from '../blocks/Text';
import Image from '../blocks/Image';
import TodoContainer from '../blocks/TodoContainer';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TEXT = 'Text';
const AGENDA = 'Agenda';
const TODO_CONTAINER = 'TodoContainer';
const IMAGE = 'Image';

/* block color */
const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    // change background colour if dragging
    background: isDragging ? 'lightblue' : 'white',
    // styles we need to apply on draggables
    ...draggableStyle
});

class NoteLeftBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            noteId: this.props.noteId,
            blocks: this.props.blocks,
            isLeft: this.props.isLeft,
            isUpdate: false
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let block_array;
        if (nextProps.blocks !== prevState.blocks) {
            console.log(prevState.blocks);
            console.log(nextProps.blocks);
            block_array =
                nextProps.blocks &&
                nextProps.blocks.map((blk, index) => {
                    let result;
                    if (blk.block_type === TEXT) {
                        result = (
                            <Text
                                blk_id={blk.id}
                                document_id={blk.document_id}
                                type={blk.block_type}
                                content={blk.content}
                                handleDeleteBlock={nextProps.handleDeleteBlock}
                                handleAddTextSocketSend={
                                    nextProps.handleAddTextSocketSend
                                }
                            />
                        );
                    } else if (blk.block_type === AGENDA) {
                        result = (
                            <Agenda
                                workspaceTags={nextProps.workspaceTags}
                                workspaceId={nextProps.workspaceId}
                                noteId={nextProps.noteId}
                                blk_id={blk.id}
                                type={blk.block_type}
                                content={blk.content}
                                agenda_discussion={blk.agenda_discussion}
                                handleDeleteBlock={nextProps.handleDeleteBlock}
                                socketRef={nextProps.socketRef}
                                participants={nextProps.participants}
                            />
                        );
                    } else if (blk.block_type === TODO_CONTAINER) {
                        result = (
                            <TodoContainer
                                todos={blk.todos}
                                noteId={nextProps.noteId}
                                participants={nextProps.participants}
                                handleDeleteTodo={nextProps.handleDeleteTodo}
                                socketRef={nextProps.socketRef}
                                is_parent_note={true}
                            />
                        );
                    } else if (blk.block_type === IMAGE) {
                        result = (
                            <Image
                                noteId={nextProps.noteId}
                                blk_id={blk.id}
                                type={blk.block_type}
                                content={blk.content}
                                image={blk.image}
                                is_submitted={blk.is_submitted}
                                is_parent_note={true}
                                handleDeleteBlock={nextProps.handleDeleteBlock}
                                socketRef={nextProps.socketRef}
                            />
                        );
                    } else {
                        result = <div>Not Implemented yet.</div>;
                    }
                    const _result = {
                        id: `${blk.block_type}-${index}-${blk.id}`,
                        content: result
                    };
                    return _result;
                });
            return { blocks: block_array };
        }
        return null;
    }

    render() {
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
                        Agenda
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
                        }>
                        Todo
                    </button>

                    <button
                        className="add-block-button"
                        id="add_image_block"
                        onClick={() =>
                            this.props.handleAddImageBlock(this.state.noteId)
                        }>
                        Image
                    </button>
                </div>

                <DragDropContext onDragEnd={this.props.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                className="NoteLeftBlock__blockList"
                                {...provided.droppableProps}
                                ref={provided.innerRef}>
                                {this.state.blocks &&
                                    this.state.blocks.map((blk, index) => (
                                        <Draggable
                                            className="draggable"
                                            key={blk.id}
                                            draggableId={blk.id}
                                            index={index}>
                                            {(provided_, snapshot_) => (
                                                <div
                                                    className="draggable-div"
                                                    id={blk.id.replace(
                                                        /(-\w+$)/g,
                                                        ''
                                                    )}
                                                    ref={provided_.innerRef}
                                                    {...provided_.draggableProps}
                                                    {...provided_.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot_.isDragging,
                                                        provided_.draggableProps
                                                            .style
                                                    )}>
                                                    {blk.content}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    }
}

export default NoteLeftBlock;
