import React, {Component} from 'react'
import PreviewAgenda from '../block/PreviewAgenda';
import Text from '../block/Text';
class NoteLeftBlock extends Component {
    constructor(props) {
        super(props);

        /* 
            Note에서 굳이 Method들 전달해줄 필요없이, Note_id만 전달해주고 여기서
            axios이용해서 API 호출하여 block 생성하고, Redux로 state 변환시켜서 추가하는게 더 나을 것 같다.
        */
        this.state = {
            note_id: this.props.note_id,
            
            // Redux로 특정 Note의 모든 Block들을 저장해놓고 있어야할 것 같다.
            blocks: [
                {
                    id: 1,
                    block_name: "Agenda",
                    content: "TEST Agenda",
                },
                {
                    id: 2,
                    block_name: "Text",
                    content: "TEST Text",
                }
            ]
        }
    }
    handleAddAgendaBlock = (note_id) => {
        // Block Create API call 할 곳.
        this.setState({
                ...this.state, 
                blocks: this.state.blocks.concat({
                        id: 3,
                        block_name: "Agenda",
                        content: "Added Agenda"
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
    handleAddTodoBlock = (note_id) => {
        console.log(`Need to Implement adding Todo Block to specific note whose id is ${note_id}`);
    }
    

    handleChangeText = () => {

    }

    render() {
        const blocks = this.state.blocks.map((blk) => {
            if(blk.block_name === 'Text') {
                return(<Text
                            content={blk.content}
                        />
                    )

            }
            else if (blk.block_name === 'Agenda') {
                return (<PreviewAgenda
                            content={blk.content}
                            handleChangeText={this.handleChangeText}
                        />
                    )
            }
        })

        return (
            <div className="NoteLeftBlock-container">
                <div className="NoteLeftBlock-create-buttons">
                    <button 
                        id="add_agenda_block" 
                        onClick={this.handleAddAgendaBlock}
                    />
                    <button 
                        id="add_text_block" 
                        onClick={this.handleAddTextBlock}
                    />
                    <button 
                        id="add_image_block" 
                        onClick={this.handleAddImageBlock}
                    />
                    <button 
                        id="add_calendar_block" 
                        onClick={this.handleAddCalendarBlock}
                    />
                    <button 
                        id="add_pdf_block" 
                        onClick={this.handleAddPdfBlock}
                    />
                    <button 
                        id="add_table_block" 
                        onClick={this.handleAddTableBlock}
                    />
                    <button 
                        id="add_todo_block" 
                        onClick={this.handleAddTodoBlock}
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
