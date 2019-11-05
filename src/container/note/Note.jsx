import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

import NoteLeft from './NoteLeft';
import NoteRightFocused from './NoteRightFocused';
import NoteRightUnfocused from './NoteRightUnfocused';

class Note extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isBlockClicked: false,
            isNoteLeftClicked: true,
            isNoteRightClicked: false,
            isTitleClicked: false,
            isDateClicked: false,
            note_id: null,
            title: '',
            created_at: '',
            last_modified_at: '',
            ml_speech_text: '',
            participants: [],
            moment: null,
            blocks: []
        };
    }

    componentDidMount() {
        const n_id = this.props.match.params.n_id;

        //이거 동시에 나오게 처리하기, 저장된 순서 처리
        axios
            .get(`/api/note/${n_id}/agendas/`)
            .then(res => {
                console.log(res);
                res['data'].forEach(blk => {
                    this.setState({
                        blocks: this.state.blocks.concat({
                            block_type: 'Agenda',
                            id: blk['id'],
                            content: blk['content'],
                            layer_x: blk['layer_x'],
                            layer_y: blk['layer_y']
                        })
                    });
                });
            })
            .catch(err => console.log('No agendas'));

        axios
            .get(`/api/note/${n_id}/textblocks/`)
            .then(res => {
                console.log(res);
                res['data'].forEach(blk => {
                    this.setState({
                        blocks: this.state.blocks.concat({
                            block_type: 'Text',
                            id: blk['id'],
                            content: blk['content'],
                            layer_x: blk['layer_x'],
                            layer_y: blk['layer_y']
                        })
                    });
                });
            })
            .catch(err => console.log('No Texts'));

        axios.get(`/api/note/${n_id}/`).then(res => {
            this.setState({
                ...this.state,
                note_id: res['data']['id'],
                title: res['data']['title'],
                created_at: res['data']['created_at'],
                last_modified_at: res['data']['last_modified_at'],
                ml_speech_text: res['data']['ml_speech_text'],
                participants: res['data']['participants'],
                moment: moment(res['data']['created_at'])
            });
        });
    }

    /* ==================================================================
        ## handleClickBlock & handleNoteLeft
    handleClickBlock은 NoteLeft에 있는 Block에 해당하는 부분이 클릭되었을 때,
    handleNoteLeft는 Block들을 제외한 모든 부분이 클릭되었을 때 클릭이벤트 감지.
    우리가 원하는 기능이 특정 Block을 클릭하면 해당 Block이 우측 창에 Focus되면서
    큰 화면에서 보고 수정할 수 있도록 하는 것. 따라서 NoteLeft에서는 즉시 수정은 불가.
        
    =================================================================== */

    handleClickBlock = (block_name, block_id) => {
        if (this.state.isNoteLeftClicked && !this.state.isBlockClicked) {
            this.setState({
                isBlockClicked: true,
                isNoteLeftClicked: false
            });
            // document.getElementsByClassName('Note-left')[0].className =
            //     'Note-left-block-click';
            // document.getElementsByClassName('Note-right')[0].className =
            //     'Note-right-block-click';
        } else {
            if (this.state.isBlockClicked) {
                // this.setState({
                //     isBlockClicked: false,
                //     isNoteLeftClicked: true
                // });
                // document.getElementsByClassName(
                //     'Note-left-block-click'
                // )[0].className = 'Note-left';
                // document.getElementsByClassName(
                //     'Note-right-block-click'
                // )[0].className = 'Note-right';
            }
        }
    };

    handleClickNoteLeft = e => {
        // Click한 부분의 className을 받아와서 block과 관련 없는 것들에만 NoteLeftClick을 걸어놓는다.
        if (!e.target.className.includes('size-block')) {
            if (this.state.isBlockClicked) {
                this.setState({
                    isBlockClicked: false,
                    isNoteLeftClicked: true,
                    isNoteRightClicked: false
                });
                // document.getElementsByClassName(
                //     'Note-left-block-click'
                // )[0].className = 'Note-left';
                // document.getElementsByClassName(
                //     'Note-right-block-click'
                // )[0].className = 'Note-right';
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

    handleChangeTitle = e => {
        this.setState({ title: e.target.value });
    };

    handleChangeDatetime = moment => {
        this.setState({
            moment
        });
    };

    handleAddAgendaBlock = note_id => {
        // Block Create API call 할 곳.
        const agenda_info = {
            content: 'Empty Content in Agenda',
            // *******이 부분 실제로 Drag & Drop 구현시 변경해야 함*******
            layer_x: 0,
            layer_y: 0
        };
        axios
            .post(`/api/note/${this.state.note_id}/agendas/`, agenda_info)
            .then(res => {
                this.setState({
                    blocks: this.state.blocks.concat({
                        block_type: 'Agenda',
                        id: res['data']['id'],
                        content: res['data']['content'],
                        layer_x: res['data']['layer_x'],
                        layer_y: res['data']['layer_y'],
                        child_blocks: []
                    })
                });
            });
    };

    handleAddTextBlock = note_id => {
        // Block Create API call 할 곳.
        const text_info = {
            content: 'Empty Content in Text',
            layer_x: 0,
            layer_y: 0
        };
        axios
            .post(`/api/note/${this.state.note_id}/textblocks/`, text_info)
            .then(res => {
                this.setState({
                    blocks: this.state.blocks.concat({
                        block_type: 'Text',
                        id: res['data']['id'],
                        content: res['data']['content'],
                        layer_x: res['data']['layer_x'],
                        layer_y: res['data']['layer_y']
                    })
                });
            });
    };

    handleAddTodoBlock = note_id => {
        // Where need to call Todo Create API.
    };

    handleAddImageBlock = note_id => {
        console.log(
            `Need to Implement adding Image Block to specific note whose id is ${note_id}`
        );
    };

    handleAddCalendarBlock = note_id => {
        console.log(
            `Need to Implement adding Calendar Block to specific note whose id is ${note_id}`
        );
    };

    handleAddPdfBlock = note_id => {
        console.log(
            `Need to Implement adding Pdf Block to specific note whose id is ${note_id}`
        );
    };

    handleAddTableBlock = note_id => {
        console.log(
            `Need to Implement adding Table Block to specific note whose id is ${note_id}`
        );
    };

    handleStartAutoTyping = note_id => {
        console.log(`Need to Implement auto-typing in the note ${note_id}`);
    };

    render() {
        console.log(this.state.blocks);
        const { history } = this.props;
        return (
            <div className="Note">
                <NoteLeft
                    note_title={this.state.title}
                    meeting_date={this.state.created_at}
                    participants={this.state.participants}
                    note_id={this.state.note_id}
                    moment={this.state.moment}
                    blocks={this.state.blocks}
                    handleClickBlock={this.handleClickBlock}
                    handleClickNoteLeft={this.handleClickNoteLeft}
                    handleChangeTitle={this.handleChangeTitle}
                    handleChangeDatetime={this.handleChangeDatetime}
                    handleAddAgendaBlock={this.handleAddAgendaBlock}
                    handleAddTextBlock={this.handleAddTextBlock}
                />
                {this.state.isBlockClicked ? (
                    <NoteRightFocused />
                ) : (
                    this.state.note_id && (
                        <NoteRightUnfocused
                            history={history}
                            note_id={this.state.note_id}
                        />
                    )
                )}
            </div>
        );
    }
}

export default Note;
