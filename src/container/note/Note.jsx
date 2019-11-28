import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

import NoteLeft from './NoteLeft';
import NoteRightFocused from './NoteRightFocused';

class Note extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUserProfile: null,
            isBlockClicked: false,
            isNoteLeftClicked: true,
            // isNoteRightClicked: false,
            isTitleClicked: false,
            isDateClicked: false,
            noteId: null,
            title: '',
            created_at: '',
            last_modified_at: '',
            // ml_speech_text: '',
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

        // 추후 여기에서 그냥 순서대로 넣는 것이 아닌, 기존의 위치대로 배열에 넣어야함
        axios
            .get(`/api/note/${n_id}/textblocks/`)
            .then(res => {
                console.log('axios get textblocks', res);
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
                noteId: res['data']['id'],
                title: res['data']['title'],
                created_at: res['data']['created_at'],
                last_modified_at: res['data']['last_modified_at'],
                ml_speech_text: res['data']['ml_speech_text'],
                participants: res['data']['participants'],
                moment: moment(res['data']['created_at'])
            });
        });

        // 현재 사용자 Profile 정보 가져옴
        axios.get('/api/profile/').then(res => {
            this.setState({
                currentUserProfile: res['data']['profile']
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

    handleClickBlock = (block_name, block_id) => {};

    handleClickNoteLeft = e => {};

    handleClickNoteRight = () => {};

    handleChangeTitle = e => {
        this.setState({ title: e.target.value });
    };

    handleChangeDatetime = moment => {
        this.setState({
            moment
        });
    };

    handleAddAgendaBlock = noteId => {
        // Block Create API call 할 곳.
        const agenda_info = {
            content: 'Empty Content in Agenda',
            // *******이 부분 실제로 Drag & Drop 구현시 변경해야 함*******
            layer_x: 0,
            layer_y: 0
        };
        axios
            .post(`/api/note/${this.state.noteId}/agendas/`, agenda_info)
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

    handleAddTextBlock = noteId => {
        // Block Create API call 할 곳.
        const text_info = {
            content: '새로 생성된 텍스트 블록',
            layer_x: 0,
            layer_y: 0
        };
        axios
            .post(`/api/note/${this.state.noteId}/textblocks/`, text_info)
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

    handleAddTodoBlock = noteId => {
        // Where need to call Todo Create API.
    };

    handleAddImageBlock = noteId => {
        console.log(
            `Need to Implement adding Image Block to specific note whose id is ${noteId}`
        );
    };

    handleAddCalendarBlock = noteId => {
        console.log(
            `Need to Implement adding Calendar Block to specific note whose id is ${noteId}`
        );
    };

    handleAddPdfBlock = noteId => {
        console.log(
            `Need to Implement adding Pdf Block to specific note whose id is ${noteId}`
        );
    };

    handleAddTableBlock = noteId => {
        console.log(
            `Need to Implement adding Table Block to specific note whose id is ${noteId}`
        );
    };

    handleStartAutoTyping = noteId => {
        console.log(`Need to Implement auto-typing in the note ${noteId}`);
    };

    render() {
        console.log('note blocks: ', this.state.blocks);
        return (
            <div className="Note">
                <NoteLeft
                    note_title={this.state.title}
                    meeting_date={this.state.created_at}
                    participants={this.state.participants}
                    noteId={this.state.noteId}
                    moment={this.state.moment}
                    blocks={this.state.blocks}
                    handleClickBlock={this.handleClickBlock}
                    // handleClickNoteLeft={this.handleClickNoteLeft}
                    handleChangeTitle={this.handleChangeTitle}
                    handleChangeDatetime={this.handleChangeDatetime}
                    handleAddAgendaBlock={this.handleAddAgendaBlock}
                    handleAddTextBlock={this.handleAddTextBlock}
                />
            </div>
        );
    }
}

export default Note;
