import React, { Component } from 'react';
import NoteLeftInfo from '../../component/note_left/NoteLeftInfo';
import NoteLeftBlock from '../../component/note_left/NoteLeftBlock';
import Text from '../../component/block/Text';
// Dummy Data
import {
    dummyNote,
    handleAddAgendaBlock,
    handleAddTextBlock,
    handleAddImageBlock,
    handleAddCalendarBlock,
    handleAddPdfBlock,
    handleAddTableBlock,
    handleAddTodoBlock
} from './DummyData';
import PreviewAgenda from '../../component/block/PreviewAgenda';
import AddMember from '../../component/AddMember';
class Note extends Component {
    constructor(props) {
        super(props);

        this.state = {
            note_id: this.props.note_id,

            blocks: [
                {
                    id: 1,
                    block_name: 'Agenda',
                    content: 'TEST Agenda'
                }
            ]
        };
    }

    componentDidMount() {}

    render() {
        const block = this.state.blocks.map(blk => {
            if (blk.block_name === 'Text') {
                return <Text content={blk.content} />;
            } else if (blk.block_name === 'Agenda') {
                return (
                    <PreviewAgenda
                        content={blk.content}
                        handleChangeText={this.handleChangeText}
                    />
                );
            }
        });

        const temp_id = 1;
        console.log(dummyNote.note_title);

        return (
            <div className="Note">
                <div className="Note-left">
                    <div className="Note-left-page__title">Note Left</div>
                    <div className="Note-left-page__line" />
                    <div className="Note-left-container">
                        <NoteLeftInfo
                            note_title={dummyNote.note_title}
                            meeting_date={dummyNote.meeting_date}
                            participants={dummyNote.participants}
                        />
                        <NoteLeftBlock note_id={temp_id} />
                    </div>
                </div>

                <div className="Note-right">
                    <div className="Note-right-page__title">
                        Note Right Focused
                    </div>
                    <div className="Note-right-page__line" />

                    <div className="Note-right-container">
                        <div className="Note-right-focused__title">title</div>
                        <div className="NoteRightBlock__block">{block}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Note;
