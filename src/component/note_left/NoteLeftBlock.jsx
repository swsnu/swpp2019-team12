import React, {Component} from 'react'
import PreviewAgenda from '../blocks/PreviewAgenda';
import Text from '../blocks/Text';
import TodoContainer from '../blocks/TodoContainer';
import axios from 'axios';
class NoteLeftBlock extends Component { 
    constructor(props) {
        super(props);

        /* 
            Note에서 굳이 Method들 전달해줄 필요없이, Note_id만 전달해주고 여기서
            axios이용해서 API 호출하여 block 생성하고, Redux로 state 변환시켜서 추가하는게 더 나을 것 같다.
        */
        this.state = {
            note_id: this.props.note_id,

            blocks: [
                {
                    id: 1,
                    block_name: "Agenda",
                    agenda_disccusion: "TEST Agenda",
                },
                {
                    id: 2,
                    block_name: "Text",
                    content: "TEST Text",
                },
                {
                    id: 3,
                    block_name: "TodoContainer",
                    todos : [
                            {
                                id:10,
                                content: "Test todo1",
                                is_done:false,
                                assignee: "Sangyeon"
                            },
                            {
                                id:11,
                                content: "Test todo2",
                                is_done:true,
                                assignee: "Taeyoung"
                            },
                            {
                                id:12,
                                content: "Test todo3",
                                is_done:false,
                                assignee: "Chaemin"
                            }
                        ]
                    }
            ]
        }
    }

    componentDidMount() {
        // // Get all Text blocks of note.
        // axios.get(`/api/note/${this.state.note_id}/textblock/`)
        //     .then(res => console.log(res))

        // // Get all Agenda blocks of note.
        // axios.get(`/api/note/${this.state.note_id}/agendas/`)
        //     .then(res => console.log(res))
            
        // // Get all Todo blocks of note.
        // axios.get(`/api/note/${this.state.note_id}/todos/`)
        //     .then(res => console.log(res))
            
    }

    handleAddAgendaBlock = (note_id) => {
        // Block Create API call 할 곳.
        this.setState({
                ...this.state, 
                blocks: this.state.blocks.concat({
                        id: 3,
                        block_name: "Agenda",
                        agenda_disccusion: "Added Agenda"
                    }
                )
            }
        )
    }

    handleAddTextBlock = (note_id) => {
        // Block Create API call 할 곳.
        this.setState({
            ...this.state, 
            blocks: this.state.blocks.concat({
                    id: 3,
                    block_name: "Text",
                    content: "Added Text"
                    }
                )
            }
        )
    }

    handleAddTodoBlock = (note_id) => {
        // Where need to call Todo Create API.
        console.log("TEST");
        this.setState({
            ...this.state, 
            blocks: this.state.blocks.map(blk => {
                if(blk.block_name === 'TodoContainer') {
                    console.log("TodoContainer")
                    blk.todos = blk.todos.concat({
                                    id: 99,
                                    content: "Test Todo",
                                    is_done:false,
                                    assignee: "TEST"
                    })
                    return blk;
                }
                else {
                    console.log("Else")
                    return blk;
                }
            }
            )}
        )
    }

    handleAddImageBlock = (note_id) => {
        console.log(`Need to Implement adding Image Block to specific note whose id is ${note_id}`);
    }

    handleAddCalendarBlock = (note_id) => {
        console.log(`Need to Implement adding Calendar Block to specific note whose id is ${note_id}`);
    }

    handleAddPdfBlock = (note_id) => {
        console.log(`Need to Implement adding Pdf Block to specific note whose id is ${note_id}`);
    }

    handleAddTableBlock = (note_id) => {
        console.log(`Need to Implement adding Table Block to specific note whose id is ${note_id}`);
    }

    handleStartAutoTyping = (note_id) => {
        console.log(`Need to Implement auto-typing in the note ${note_id}`);
    }

    handleChangeText = () => {

    }

    render() {
        console.log(this.state.blocks[2]);
        const blocks = this.state.blocks.map((blk) => {
            if(blk.block_name === 'Text') {
                return(<Text
                            content={blk.content}
                            handleChangeText={this.handleChangeText}
                            handleClickBlock={this.props.handleClickBlock}
                        />
                    )
            }
            else if (blk.block_name === 'Agenda') {
                return (<PreviewAgenda
                            agenda_disccusion={blk.agenda_disccusion}
                            handleClickBlock={this.props.handleClickBlock}
                        />
                    )
            }
            else if (blk.block_name === 'TodoContainer') {
                return (<TodoContainer
                            todos={blk.todos}
                            handleClickBlock={this.props.handleClickBlock}
                        />
                    )
            }
            else {
                return (<div>Not Implemented yet.</div>)
            }

        })

        return (
            <div className="NoteLeftBlock-container">
                {/* 이 button들은 스크롤할 떄 따라서 내려가도록 만드는게 좋을 것 같다. */}
                <div className="NoteLeftBlock-create-buttons">
                    <button
                        className="add-block-button" 
                        id="add_agenda_block" 
                        onClick={() => this.handleAddAgendaBlock(this.state.note_id)}
                    />
                    <button 
                        className="add-block-button"
                        id="add_text_block" 
                        onClick={() => this.handleAddTextBlock(this.state.note_id)}
                    />
                    <button 
                        className="add-block-button"
                        id="add_todo_block" 
                        onClick={() => this.handleAddTodoBlock(this.state.note_id)}
                    />
                    <button 
                        className="add-block-button"
                        id="add_image_block" 
                        onClick={() => this.handleAddImageBlock(this.state.note_id)}
                    />
                    <button
                        className="add-block-button" 
                        id="add_calendar_block" 
                        onClick={() => this.handleAddCalendarBlock(this.state.note_id)}
                    />
                    <button 
                        className="add-block-button"
                        id="add_pdf_block" 
                        onClick={() => this.handleAddPdfBlock(this.state.note_id)}
                    />
                    <button 
                        className="add-block-button"
                        id="add_table_block" 
                        onClick={() => this.handleAddTableBlock(this.state.note_id)}
                    />
                    <button 
                        className="auto-type-button"
                        id="auto_typing" 
                        onClick={() => this.handleStartAutoTyping(this.state.note_id)}
                    />
                </div>
                <div className="NoteLeftBlock__blockList">
                    {blocks}
                </div>
                
            </div>
        )
    }
}

export default NoteLeftBlock
