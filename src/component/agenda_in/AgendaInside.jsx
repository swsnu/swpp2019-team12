import React, { Component } from 'react';
import Text from '../blocks/Text';
import Image from '../blocks/Image';
import TodoContainer from '../blocks/TodoContainer';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TEXT = 'Text';
const TODO_CONTAINER = 'TodoContainer';
const IMAGE = 'Image';
const TABLE = 'Table';
const CALENDAR = 'Calendar';
const PDF = 'PDF';

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    // change background colour if dragging
    background: isDragging ? 'lightblue' : 'white',
    // styles we need to apply on draggables
    ...draggableStyle
});

export default class AgendaInside extends Component {
    constructor(props) {
        super(props);

        this.state = {
            noteId: this.props.noteId,
            agendaId: this.props.agendaId,
            blocks: this.props.blocks
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let block_array;
        if (nextProps.blocks !== prevState.blocks) {
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
                                handleClickBlock={nextProps.handleClickBlock}
                            />
                        );
                    } else if (blk.block_type == IMAGE) {
                        result = (
                            <Image
                                noteId={nextProps.noteId}
                                blk_id={blk.id}
                                type={blk.block_type}
                                content={blk.content}
                                image={blk.image}
                                is_submitted={blk.is_submitted}
                                parent_agenda={blk.parent_agenda}
                                is_parent_note={false}
                                handleClickBlock={nextProps.handleClickBlock}
                                handleDeleteBlock={nextProps.handleDeleteBlock}
                                socketRef={nextProps.socketRef}
                            />
                        );
                    } else if (blk.block_type === TODO_CONTAINER) {
                        console.log(nextProps.participants);
                        result = (
                            <TodoContainer
                                todos={blk.todos}
                                noteId={nextProps.noteId}
                                participants={nextProps.participants}
                                handleClickBlock={nextProps.handleClickBlock}
                                handleDeleteTodo={nextProps.handleDeleteTodo}
                                socketRef={nextProps.socketRef}
                                is_parent_note={false}
                            />
                        );
                    } else {
                        result = <div>not implemented yet</div>;
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
            <div className="agenda-inside">
                <div>
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
                                                key={blk.id}
                                                draggableId={blk.id}
                                                index={index}>
                                                {(provided_, snapshot_) => (
                                                    <div
                                                        ref={provided_.innerRef}
                                                        {...provided_.draggableProps}
                                                        {...provided_.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot_.isDragging,
                                                            provided_
                                                                .draggableProps
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
            </div>
        );
    }
}
