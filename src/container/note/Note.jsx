import React, { Component } from 'react';
// Dummy Data
import {
    dummyNote,
    participants
} from './DummyData';
import NoteLeft from './NoteLeft';
class Note extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isBlockClicked: false,
            isNoteLeftClicked: true,
            isNoteRightClicked: false,
        }
    }

    /* ==================================================================
        ## handleClickBlock & handleNoteLeft
    handleClickBlock은 NoteLeft에 있는 Block에 해당하는 부분이 클릭되었을 때,
    handleNoteLeft는 Block들을 제외한 모든 부분이 클릭되었을 때 클릭이벤트 감지.
    우리가 원하는 기능이 특정 Block을 클릭하면 해당 Block이 우측 창에 Focus되면서
    큰 화면에서 보고 수정할 수 있도록 하는 것. 따라서 NoteLeft에서는 즉시 수정은 불가.
        
    =================================================================== */

    handleClickBlock = (block_name, block_id) => {
        if (this.state.isNoteLeftClicked) {
            this.setState({ 
                            isBlockClicked: true, 
                            isNoteLeftClicked: false
                        })
            document.getElementsByClassName('Note-left')[0].className="Note-left-block-click";
        }
        else {
            this.setState({
                            isBlockClicked: false,
                            isNoteLeftClicked: true
                        })
            document.getElementsByClassName('Note-left-block-click')[0].className="Note-left";
        }
    }

    handleClickNoteLeft = (e) => {
        // Click한 부분의 className을 받아와서 block과 관련 없는 것들에만 NoteLeftClick을 걸어놓는다.
        if (!e.target.className.includes('size-block')) {
            if (this.state.isBlockClicked) {
                this.setState({
                                isBlockClicked: false,
                                isNoteLeftClicked: true,
                                isNoteRightClicked: false,
                            })
                document.getElementsByClassName('Note-left-block-click')[0].className="Note-left";
            }
            else {
                this.setState({
                    isNoteLeftClicked: true,
                    isNoteRightClicked: false,
                })
            }
        }
    }

    handleClickNoteRight = () => {
        this.setState({
                        isNoteLeftClicked: false,
                        isNoteRightClicked: true,
                    })
    }

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
                <div 
                    className="Note-right"
                    onClick={this.handleClickNoteRight}
                >
                    <div className="Note-right-container">
                        RIGHT
                    </div>

                </div>
            </div>
        
        );
    }
}

export default Note;
