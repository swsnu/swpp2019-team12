import React, { Component } from 'react';
import PreviewAgenda from '../../component/blocks/PreviewAgenda';
import Text from '../../component/blocks/Text';
import { AST_Block } from 'terser';

class NoteRightFocused extends Component {
    constructor(props) {
        super(props);
        this.state = {
            note_id: this.props.note_id,

            block: {
                id: 1,
                block_name: 'Agenda',
                agenda_discussion: 'TEST Agenda'
            }
        };
    }

    render() {
        const block_focused = this.state.block;
        let block_focused_box = null;
        if (block_focused.block_name === 'Text')
            block_focused_box = <Text content={block_focused.content} />;
        else if (block_focused.block_name === 'Agenda') {
            block_focused_box = (
                <PreviewAgenda
                    agenda_disccusion={block_focused.agenda_disccusion}
                    handleChangeText={this.handleChangeText}
                    handleClickAgenda={this.props.handleClickAgenda}
                />
            );
        }

        const block_name = block_focused.block_name;

        return (
            <div
                className="Note-right"
                onClick={this.props.handleClickNoteLeft}>
                <div className="Note-right-page__title">Note Right Focused</div>
                <div className="Note-right-page__line" />
                <div className="Note-right-container">
                    <div className="Note-right-focused__title">
                        {block_name}
                    </div>
                    <div className="NoteRightBlock__blockList">
                        {block_focused_box}
                    </div>
                </div>
            </div>
        );
    }
}

export default NoteRightFocused;
