import React, { Component } from 'react';
// Dummy Data
import { dummyNote, participants } from './DummyData';
import NoteLeft from './NoteLeft';
import NoteRightFocused from './NoteRightFocused';

class Note extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isBlockClicked: false,
            isNoteLeftClicked: true,
            isNoteRightClicked: false,
            blocks: [
                {
                    id: 1,
                    block_name: 'Agenda',
                    content: 'TEST Agenda'
                }
            ]
        };
    }

    handleClickBlock = (block_name, block_id) => {
        console.log('Block Clicked');
        if (this.state.isNoteLeftClicked) {
            this.setState({
                isBlockClicked: true,
                isNoteLeftClicked: false
            });
            document.getElementsByClassName('Note-left')[0].className =
                'Note-left-agenda-click';
            document.getElementsByClassName('Note-right')[0].className =
                'Note-right-agenda-click';
        } else {
            this.setState({
                isBlockClicked: false,
                isNoteLeftClicked: true
            });
            document.getElementsByClassName(
                'Note-left-agenda-click'
            )[0].className = 'Note-left';
            document.getElementsByClassName(
                'Note-right-agenda-click'
            )[0].className = 'Note-right';
        }

        console.log(block_name + ' ' + block_id);
    };

    handleClickNoteLeft = e => {
        // Click한 부분의 className을 받아와서 block과 관련 없는 것들에만 LeftClick을 걸어놓는다.
        if (!e.target.className.includes('size-block')) {
            if (this.state.isBlockClicked) {
                this.setState({
                    isBlockClicked: false,
                    isNoteLeftClicked: true,
                    isNoteRightClicked: false
                });

                document.getElementsByClassName(
                    'Note-left-agenda-click'
                )[0].className = 'Note-left';
                console.log(document.getElementsByClassName('Note-right')[0]);
                document.getElementsByClassName(
                    'Note-right-agenda-click'
                )[0].className = 'Note-right';
            } else {
                this.setState({
                    isNoteLeftClicked: true,
                    isNoteRightClicked: false
                });
            }
        }
    };

    handleClickNoteRight = () => {
        this.setState({
            isNoteLeftClicked: false,
            isNoteRightClicked: true
        });
    };

    componentDidMount() {}

    render() {
        const temp_id = 1;
        return (
            <div className="Note">
                <NoteLeft
                    note_title={dummyNote.note_title}
                    meeting_date={dummyNote.meeting_date}
                    participants={participants}
                    note_id={temp_id}
                    handleClickBlock={this.handleClickBlock}
                    handleClickNoteLeft={this.handleClickNoteLeft}
                />
                <NoteRightFocused
                // handleClickNoteRight={this.handleClickNoteRight}
                />
            </div>
        );
    }
}

export default Note;
