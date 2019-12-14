import React, { Component } from 'react';
import Text from '../blocks/Text';
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

    handleClickBlock = (type, blk_id) => {
        console.log('text block inside agenda clicked');
    };

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
            <div>
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
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided
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
