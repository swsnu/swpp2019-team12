import React, { Component } from 'react';
import PreviewAgenda from '../blocks/PreviewAgenda';
import Text from '../blocks/Text';
import TodoContainer from '../blocks/TodoContainer';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

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
            blocks: this.props.blocks,
            isLeft: this.props.isLeft,
            isUpdate: false
        };
    }

    onDragEnd = result => {
        if (!result.destination) {
            return;
        }
        const blocks = reorder(
            this.state.blocks,
            result.source.index,
            result.destination.index
        );
        console.log(result.source.index + ' ' + result.destination.index);

        blocks.map(blk => {
            console.log('this is const: ' + blk.id);
        });

        this.setState({ blocks: blocks });
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        // console.log('get derived state from props');
        let block_array;
        if (nextProps.blocks !== prevState.blocks) {
            block_array =
                nextProps.blocks &&
                nextProps.blocks.map((blk, index) => {
                    let result;
                    if (blk.block_type === 'textblock') {
                        result = (
                            <Text
                                id={blk.id}
                                type={blk.block_type}
                                content={blk.content}
                                handleChangeText={nextProps.handleChangeText}
                                handleClickBlock={nextProps.handleClickBlock}
                            />
                        );
                    } else if (blk.block_type === 'agenda') {
                        result = (
                            <PreviewAgenda
                                id={blk.id}
                                type={blk.block_type}
                                content={blk.content}
                                agenda_discussion={blk.agenda_discussion}
                                handleClickBlock={nextProps.handleClickBlock}
                            />
                        );
                    } else if (blk.block_type === 'TodoContainer') {
                        result = (
                            <TodoContainer
                                todos={blk.todos}
                                handleClickBlock={nextProps.handleClickBlock}
                            />
                        );
                    } else {
                        result = <div>Not Implemented yet.</div>;
                    }
                    const _result = {
                        id: `block-${index}`,
                        content: result
                    };
                    return _result;
                });
            return { blocks: block_array };
        }
        return null;
    }

    handleChangeText = () => {};

    render() {
        this.state.blocks.map(blk => {
            console.log('this is state: ' + blk.id);
        });
        const block_array = [];
        // console.log('inside render', this.props.blocks);
        // const blocks = this.props.blocks.map((blk, index) => {
        //     console.log(this.props.blocks);
        //     let result;
        //     if (blk.block_type === 'textblock') {
        //         result = (
        //             <Text
        //                 id={blk.id}
        //                 type={blk.block_type}
        //                 content={blk.content}
        //                 handleChangeText={this.handleChangeText}
        //                 handleClickBlock={this.props.handleClickBlock}
        //             />
        //         );
        //     } else if (blk.block_type === 'agenda') {
        //         result = (
        //             <PreviewAgenda
        //                 id={blk.id}
        //                 type={blk.block_type}
        //                 content={blk.content}
        //                 agenda_discussion={blk.agenda_discussion}
        //                 handleClickBlock={this.props.handleClickBlock}
        //             />
        //         );
        //     } else if (blk.block_type === 'TodoContainer') {
        //         result = (
        //             <TodoContainer
        //                 todos={blk.todos}
        //                 handleClickBlock={this.props.handleClickBlock}
        //             />
        //         );
        //     } else {
        //         result = <div>Not Implemented yet.</div>;
        //     }
        //     block_array.push({
        //         id: `block-${index}`,
        //         content: result
        //     });
        //     return result;
        // });

        return (
            <div className="NoteLeftBlock-container">
                {/* 이 button들은 스크롤할 떄 따라서 내려가도록 만드는게 좋을 것 같다. */}
                <div className="NoteLeftBlock-button-container">
                    {this.state.isLeft && (
                        <div className="NoteLeftBlock-create-buttons">
                            <button
                                className="add-block-button"
                                id="add_agenda_block"
                                onClick={() =>
                                    this.props.handleAddAgendaBlock(
                                        this.props.note_id
                                    )
                                }
                            />
                            <button
                                className="add-block-button"
                                id="add_text_block"
                                onClick={() =>
                                    this.props.handleAddTextBlock(
                                        this.props.note_id
                                    )
                                }
                            />
                            <button
                                className="add-block-button"
                                id="add_todo_block"
                                onClick={() =>
                                    this.props.handleAddTodoBlock(
                                        this.props.note_id
                                    )
                                }
                            />
                            <button
                                className="add-block-button"
                                id="add_image_block"
                                onClick={() =>
                                    this.props.handleAddImageBlock(
                                        this.props.note_id
                                    )
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
                                    this.props.handleAddPdfBlock(
                                        this.props.note_id
                                    )
                                }
                            />
                            <button
                                className="add-block-button"
                                id="add_table_block"
                                onClick={() =>
                                    this.props.handleAddTableBlock(
                                        this.props.note_id
                                    )
                                }
                            />
                            <button
                                className="auto-type-button"
                                id="auto_typing"
                                onClick={() =>
                                    this.props.handleStartAutoTyping(
                                        this.props.note_id
                                    )
                                }
                            />
                        </div>
                    )}
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
                                                        provided.draggableProps
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
