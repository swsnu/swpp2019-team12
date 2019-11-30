import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import Websocket from 'react-websocket';

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
            participants_id: [],
            participants: [],
            moment: null,
            blocks: [],
            block_focused_id: '',
            block_focused_name: ''
        };
    }

    componentDidMount() {
        console.log(this.refs);
        const n_id = this.props.match.params.n_id;

        //이거 동시에 나오게 처리하기, 저장된 순서 처리
        axios
            .get(`/api/note/${n_id}/agendas/`)
            .then(res => {
                res['data'].forEach(blk => {
                    this.setState({
                        blocks: this.state.blocks.concat({
                            block_type: 'agenda',
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
                res['data'].forEach(blk => {
                    this.setState({
                        blocks: this.state.blocks.concat({
                            block_type: 'textblock',
                            id: blk['id'],
                            content: blk['content'],
                            layer_x: blk['layer_x'],
                            layer_y: blk['layer_y']
                        })
                    });
                });
            })
            .catch(err => console.log('No Texts'));

        axios
            .get(`/api/note/${n_id}/todos/`)
            .then(res => {
                let todoContainer = {
                    block_type: 'TodoContainer',
                    todos: res['data']
                };
                todoContainer.todos.forEach(todo => {
                    todo.assignees_info = [];
                    todo.assignees.forEach(assignee_id => {
                        axios.get(`/api/profile/${assignee_id}`).then(res => {
                            todo.assignees_info.push({
                                id: res['data']['id'],
                                nickname: res['data']['nickname']
                            });
                        });
                    });
                });

                this.setState({
                    blocks: this.state.blocks.concat(todoContainer)
                });
            })
            .catch(err => {
                console.log(err);
            });

        axios
            .get(`/api/note/${n_id}/`)
            .then(res => {
                this.setState({
                    ...this.state,
                    note_id: res['data']['id'],
                    title: res['data']['title'],
                    location: res['data']['location'],
                    created_at: res['data']['created_at'],
                    last_modified_at: res['data']['last_modified_at'],
                    ml_speech_text: res['data']['ml_speech_text'],
                    participants_id: res['data']['participants'],
                    moment: moment(res['data']['created_at'])
                });
                return res['data']['participants'];
            })
            .then(participants => {
                participants.forEach(participant => {
                    axios.get(`/api/profile/${participant}`).then(res => {
                        this.setState({
                            participants: this.state.participants.concat({
                                id: res['data']['id'],
                                nickname: res['data']['nickname']
                            })
                        });
                    });
                });
            });
    }

    getNickName = u_id => {
        axios.get(`/api/profile/${u_id}`).then(res => {
            return res['data']['nickname'];
        });
    };

    /* ==================================================================
        ## handleClickBlock & handleNoteLeft
    handleClickBlock은 NoteLeft에 있는 Block에 해당하는 부분이 클릭되었을 때,
    handleNoteLeft는 Block들을 제외한 모든 부분이 클릭되었을 때 클릭이벤트 감지.
    우리가 원하는 기능이 특정 Block을 클릭하면 해당 Block이 우측 창에 Focus되면서
    큰 화면에서 보고 수정할 수 있도록 하는 것. 따라서 NoteLeft에서는 즉시 수정은 불가.
        
    =================================================================== */

    handleClickBlock = (block_name, block_id) => {
        this.setState({ block_focused_id: block_id });
        if (block_name === 'agenda')
            this.setState({ block_focused_name: 'agenda' });
        else this.setState({ block_focused_name: block_name });

        if (this.state.isNoteLeftClicked && !this.state.isBlockClicked) {
            this.setState({
                isBlockClicked: true,
                isNoteLeftClicked: false
            });
            // document.getElementsByClassName('Note-left')[0].className =
            //     'Note-left-block-click';
        } else {
            this.setState({
                isBlockClicked: false,
                isNoteLeftClicked: true
            });
            // document.getElementsByClassName(
            //     'Note-left-block-click'
            // )[0].className = 'Note-left';
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

    handleChangeLocation = e => {
        this.setState({ location: e.target.value });
    };

    handleAddAgendaBlock = note_id => {
        // Block Create API call 할 곳.
        // const agenda_info = {
        //     content: 'Empty Content in Agenda',
        //     // *******이 부분 실제로 Drag & Drop 구현시 변경해야 함*******
        //     layer_x: 0,
        //     layer_y: 0
        // };
        // axios.post(`/api/note/${note_id}/agendas/`, agenda_info).then(res => {
        //     this.setState({
        //         blocks: this.state.blocks.concat({
        //             block_type: 'agenda',
        //             id: res['data']['id'],
        //             content: res['data']['content'],
        //             layer_x: res['data']['layer_x'],
        //             layer_y: res['data']['layer_y'],
        //             child_blocks: []
        //         })
        //     });
        // });
        const agenda_info = {
            n_id: note_id,
            content: '',
            layer_x: 0,
            layer_y: 0
        };

        const socket = this.refs.socket;
        socket.state.ws.send(JSON.stringify(agenda_info));
    };

    handleAddTextBlock = note_id => {
        // Block Create API call 할 곳.
        const text_info = {
            content: 'Empty Content in Text',
            layer_x: 0,
            layer_y: 0
        };
        axios.post(`/api/note/${note_id}/textblocks/`, text_info).then(res => {
            this.setState({
                blocks: this.state.blocks.concat({
                    block_type: 'textblock',
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
        // To find out whether there is at least one todo.
        axios
            .get(`/api/note/${note_id}/todos/`)
            // when there is some todos in Note.
            .then(() => {
                this.state.blocks.map(blk => {
                    if (blk.block_type === 'TodoContainer') {
                        const todo_info = {
                            content: '할 일을 추가해보세요!',
                            layer_x: 0,
                            layer_y: 0,
                            assignees: [1]
                        };
                        axios
                            .post(`/api/note/${note_id}/todos/`, todo_info)
                            .then(res => {
                                console.log(res);
                                let new_todos = blk.todos.concat(res['data']);
                                this.setState({
                                    ...this.state,
                                    blocks: [
                                        ...this.state.blocks.filter(
                                            b =>
                                                b.block_type !== 'TodoContainer'
                                        ),
                                        {
                                            block_type: 'TodoContainer',
                                            todos: new_todos
                                        }
                                    ]
                                });
                            });
                    } else {
                        return { ...blk };
                    }
                });
            });
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

    handleAddParticipant = () => {
        console.log(
            'Need to implement add Participant who is a member of specific workspace'
        );
    };

    handleData(data) {
        let res = JSON.parse(data);
        console.log(res);
        this.setState({
            blocks: this.state.blocks.concat({
                block_type: res['block_type'],
                id: res['id'],
                content: res['content'],
                layer_x: res['layer_x'],
                layer_y: res['layer_y'],
                child_blocks: []
            })
        });
    }

    render() {
        const { history } = this.props;
        const n_id = this.props.match.params.n_id;
        return (
            <div className="Note">
                <NoteLeft
                    note_title={this.state.title}
                    meeting_date={this.state.created_at}
                    participants={this.state.participants}
                    note_id={this.state.note_id}
                    moment={this.state.moment}
                    location={this.state.location}
                    blocks={this.state.blocks}
                    handleClickBlock={this.handleClickBlock}
                    handleClickNoteLeft={this.handleClickNoteLeft}
                    handleChangeTitle={this.handleChangeTitle}
                    handleChangeDatetime={this.handleChangeDatetime}
                    handleChangeLocation={this.handleChangeLocation}
                    handleAddAgendaBlock={this.handleAddAgendaBlock}
                    handleAddTextBlock={this.handleAddTextBlock}
                    handleAddTodoBlock={this.handleAddTodoBlock}
                    handleAddParticipant={this.handleAddParticipant}
                />
                <Websocket
                    url={`ws://localhost:8000/ws/${n_id}/agenda/`}
                    ref="socket"
                    onMessage={this.handleData.bind(this)}
                />

                {this.state.isBlockClicked ? (
                    <NoteRightFocused
                        block_focused_id={this.state.block_focused_id}
                        block_focused_name={this.state.block_focused_name}
                        blocks={this.state.blocks}
                    />
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
