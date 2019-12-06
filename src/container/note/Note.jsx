import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import NoteLeft from './NoteLeft';
import Signout from '../../component/signout/Signout';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

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
            location: '',
            created_at: '',
            last_modified_at: '',
            //ml_speech_text: '',
            participants_id: [],
            participants: [],
            moment: null,
            blocks: [],
            block_focused_id: '',
            block_focused_name: ''
        };
    }

    componentDidMount() {
        const loggedInUserNickname = sessionStorage.getItem(
            'LoggedInUserNickname'
        );
        if (!loggedInUserNickname) {
            this.props.history.push('/signin');
        }

        const n_id = this.props.match.params.n_id;

        //이거 동시에 나오게 처리하기, 저장된 순서 처리
        axios
            .get(`/api/note/${n_id}/agendas/`)
            .then(res => {
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
                //console.log('axios get textblocks', res);
                res['data'].forEach(blk => {
                    this.setState({
                        blocks: this.state.blocks.concat({
                            block_type: 'Text',
                            id: blk['id'],
                            content: blk['content'],
                            layer_x: blk['layer_x'],
                            layer_y: blk['layer_y'],
                            documentId: blk['document_id']
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
                console.log('no todos in this note');
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
            })
            .catch(err => console.log('note error'));
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

    handleDeleteBlock = (axios_path, block_type, block_id) => {
        console.log('axios path:', axios_path);
        axios
            .delete(axios_path)
            .then(res => {
                console.log('res.data: ', res.data);
                this.setState({
                    ...this.state,
                    blocks: [
                        ...this.state.blocks.filter(
                            b =>
                                !(
                                    b.block_type == block_type &&
                                    b.id == block_id
                                )
                        )
                    ]
                });
            })
            .catch(err => {
                console.log('err: ', err);
            });
    };

    handleDeleteTodo = deleted => {
        const todoContainer = this.state.blocks.filter(
            blk => blk.block_type == 'TodoContainer'
        );
        if (!todoContainer) {
            console.log('Todo conatiner가 없습니다. ');
        }

        // 만약 컨테이너가 존재하지만, 단 한개의 Todo가 존재한다면, 그것을 지우고 컨테이너도 삭제
        if (todoContainer.todos.length <= 1) {
            this.setState({
                blocks: this.state.blocks.filter(
                    blk => blk.block_type !== 'TopoContainer'
                )
            });
        } else {
            // 컨테이너가 이미 존재하고 그 안에 2개 이상의 Todo 가 있다면, 지우고자 하는 Todo를 제거한 새로운 배열로 수정
            const newBlocks = this.state.blocks.map(blk => {
                if (blk.block_type == 'TodoContainer') {
                    return blk.filter(todo => todo.id !== deleted.id);
                }
            });
            blocks.this.setState({
                blocks: newBlocks
            });
        }
        console.log('찍히나');
        this.forceUpdate();
    };

    handleClickBlock = e => {};

    handleClickNoteLeft = e => {};

    handleClickNoteRight = () => {};

    handleChangeTitle = e => {
        const n_id = this.props.match.params.n_id;
        this.setState({ title: e.target.value }, () => {
            axios
                .patch(`/api/note/${n_id}/`, { title: this.state.title })
                .then()
                .catch();
        });
    };

    handleChangeDatetime = moment => {
        const n_id = this.props.match.params.n_id;
        this.setState({ moment }, () => {
            axios
                .patch(`/api/note/${n_id}/`, { created_at: this.state.moment })
                .then()
                .catch();
        });
        /*
        this.setState({
            moment
        });
        */
    };

    handleChangeLocation = e => {
        const n_id = this.props.match.params.n_id;
        this.setState({ location: e.target.value }, () => {
            axios
                .patch(`/api/note/${n_id}/`, { location: this.state.location })
                .then()
                .catch();
        });
    };

    handleAddAgendaBlock = () => {
        const noteId = this.props.match.params.n_id;
        // Block Create API call 할 곳.
        const agenda_info = {
            content: 'Empty Content in Agenda',
            // *******이 부분 실제로 Drag & Drop 구현시 변경해야 함*******
            layer_x: 0,
            layer_y: 0
        };
        axios.post(`/api/note/${noteId}/agendas/`, agenda_info).then(res => {
            this.setState({
                blocks: this.state.blocks.concat({
                    block_type: 'Agenda',
                    id: res['data']['id'],
                    content: res['data']['content'],
                    layer_x: res['data']['layer_x'],
                    layer_y: res['data']['layer_y']
                })
            });
        });
    };

    handleAddTextBlock = () => {
        const noteId = this.props.match.params.n_id;

        const documentId = handleDocIdInUrl();
        console.log('새 document Id: ', documentId);
        // Block Create API call 할 곳.
        const text_info = {
            content: '새로 생성된 텍스트 블록',
            layer_x: 0,
            layer_y: 0,
            document_id: documentId
        };
        axios.post(`/api/note/${noteId}/textblocks/`, text_info).then(res => {
            this.setState({
                blocks: this.state.blocks.concat({
                    block_type: 'Text',
                    id: res['data']['id'],
                    content: res['data']['content'],
                    layer_x: res['data']['layer_x'],
                    layer_y: res['data']['layer_y'],
                    documentId: res['data']['document_id']
                })
            });
        });
    };

    /**
     * 1. 만약 투두가 전혀 없었다면, 투두 컨테이너가 생성되어야 하고, 첫 투두가 컨테이너에 들어가야함
     * 2. 만약 투두컨테이너가 있고, 투두가 있었다면, 그 컨테이너에 add되어야함
     * 3.
     */
    handleAddTodoBlock = () => {
        const noteId = this.props.match.params.n_id;

        // Where need to call Todo Create API.
        // To find out whether there is at least one todo.
        const todo_info = {
            content: '할 일을 채워주세요',
            layer_x: 0,
            layer_y: 0,
            assignees: [],
            due_date: '2020-02-07'
        };

        let todoContainer = this.state.blocks.find(
            blk => blk.block_type === 'TodoContainer'
        );
        console.log('todo container: ', todoContainer);
        axios.post(`/api/note/${noteId}/todos/`, todo_info).then(res => {
            console.log(res.data);
            if (todoContainer) {
                const newBlocks = this.state.blocks.map(blk => {
                    if (blk.block_type == 'TodoContainer') {
                        const newTodos = blk.todos.concat(res.data);
                        blk.todos = newTodos;
                        return blk;
                    } else {
                        return blk;
                    }
                });
                console.log(newBlocks);
                this.setState({
                    blocks: newBlocks
                });
            } else {
                console.log('else');
                todoContainer = {
                    todos: [res.data],
                    block_type: 'TodoContainer'
                };
                this.setState({
                    blocks: this.state.blocks.concat(todoContainer)
                });
            }
        });

        // axios.get(`/api/note/${noteId}/todos/`, todo_info).then(res => {
        //     const todo_info = {
        //         content: '할 일을 추가해보세요',
        //         layer_x: 0,
        //         layer_y: 0,
        //         assignees: []
        //     };

        //     // No need to make todo container
        //     if (res.length) {
        //     }
        //     // Need to make todo container
        //     else {
        //     }
        //     this.state.blocks.map(blk => {
        //         if (blk.block_type === 'TodoContainer') {
        //             axios
        //                 .post(`/api/note/${noteId}/todos/`, todo_info)
        //                 .then(res => {
        //                     console.log(res);
        //                     let new_todos = blk.todos.concat(res['data']);
        //                     this.setState({
        //                         ...this.state,
        //                         blocks: [
        //                             ...this.state.blocks.filter(
        //                                 b => b.block_type !== 'TodoContainer'
        //                             ),
        //                             {
        //                                 block_type: 'TodoContainer',
        //                                 todos: new_todos
        //                             }
        //                         ]
        //                     });
        //                 });
        //         } else {
        //             return { ...blk };
        //         }
        //     });
        // });
    };

    handleAddImageBlock = noteId => {
        console.log(
            `Need to Implement adding Image Block to specific note whose id is ${noteId}`
        );
    };

    handleAddCalendarBlock = () => {
        const noteId = this.props.match.params.n_id;

        // Block Create API call 할 곳.
        const text_info = {
            content: '새로 생성된 텍스트 블록',
            layer_x: 0,
            layer_y: 0,
            document_id: documentId
        };
        axios.post(`/api/note/${noteId}/textblocks/`, text_info).then(res => {
            this.setState({
                blocks: this.state.blocks.concat({
                    block_type: 'Text',
                    id: res['data']['id'],
                    content: res['data']['content'],
                    layer_x: res['data']['layer_x'],
                    layer_y: res['data']['layer_y'],
                    documentId: res['data']['document_id']
                })
            });
        });
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

    handleAddParticipant = () => {
        console.log(
            'Need to implement add Participant who is a member of specific workspace'
        );
    };

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

        // socket 으로 블록을 날리는 부분

        this.setState({ blocks: blocks });
    };

    render() {
        // console.log(
        //     'render todo container: ',
        //     this.state.blocks.filter(blk => blk.block_type === 'TodoConatiner'),
        //     this.state.blocks.find(blk => blk.block_type === 'TodoContainer')
        // );
        const { history } = this.props;
        const noteId = this.props.match.params.n_id;
        return (
            <div className="Note">
                <Signout history={history} />
                <NoteLeft
                    handleDeleteBlock={this.handleDeleteBlock}
                    note_title={this.state.title}
                    meeting_date={this.state.created_at}
                    participants={this.state.participants}
                    noteId={noteId}
                    moment={this.state.moment}
                    location={this.state.location}
                    blocks={this.state.blocks}
                    handleClickBlock={this.handleClickBlock}
                    // handleClickNoteLeft={this.handleClickNoteLeft}
                    handleChangeTitle={this.handleChangeTitle}
                    handleChangeDatetime={this.handleChangeDatetime}
                    handleChangeLocation={this.handleChangeLocation}
                    handleAddAgendaBlock={this.handleAddAgendaBlock}
                    handleAddTextBlock={this.handleAddTextBlock}
                    handleAddTodoBlock={this.handleAddTodoBlock}
                    handleAddCalendarBlock={this.handleAddCalendarBlock}
                    handleAddParticipant={this.handleAddParticipant}
                    onDragEnd={this.onDragEnd}
                />
            </div>
        );
    }
}

function handleDocIdInUrl() {
    // let id = getDocIdFromUrl();

    let id = randomString();
    updateDocIdInUrl(id);

    return id;
}

function updateDocIdInUrl(id) {
    window.history.replaceState({}, document.title, generateUrlWithDocId(id));
}

function generateUrlWithDocId(id) {
    return `${window.location.href.split('?')[0]}?docId=${id}`;
}

function getDocIdFromUrl() {
    const docIdMatch = window.location.search.match(/docId=(.+)$/);

    return docIdMatch ? decodeURIComponent(docIdMatch[1]) : null;
}

function randomString() {
    return Math.floor(Math.random() * Math.pow(2, 52)).toString(32);
}

export default Note;
