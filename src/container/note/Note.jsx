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
            .get(`/api/note/${n_id}/images/`)
            .then(res => {
                console.log('axios get images', res);
                res['data'].forEach(blk => {
                    this.setState({
                        blocks: this.state.blocks.concat({
                            block_type: 'Image',
                            id: blk['id'],
                            image: blk['image'],
                            content: blk['content'],
                            is_submitted: blk['is_submitted'],
                            layer_x: blk['layer_x'],
                            layer_y: blk['layer_y']
                        })
                    });
                });
            })
            .catch(err => console.log('No Images'));

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

    handleDeleteBlock = (axios_path, block_type, block_id) => {
        axios
            .delete(axios_path)
            .then(res => {
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

    handleChangeLocation = e => {
        this.setState({ location: e.target.value });
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
                    layer_y: res['data']['layer_y'],
                    child_blocks: []
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

    handleAddTodoBlock = () => {
        const noteId = this.props.match.params.n_id;

        // Where need to call Todo Create API.
        // To find out whether there is at least one todo.
        axios
            .get(`/api/note/${noteId}/todos/`)
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
                            .post(`/api/note/${noteId}/todos/`, todo_info)
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

    handleAddImageBlock = () => {
        const noteId = this.props.match.params.n_id;
        // Block Create API call 할 곳.
        const image_info = {
            content: '',
            layer_x: 0,
            layer_y: 0
        };
        axios.post(`/api/note/${noteId}/images/`, image_info).then(res => {
            this.setState({
                blocks: this.state.blocks.concat({
                    block_type: 'Image',
                    // image: null,
                    id: res['data']['id'],
                    content: res['data']['content'],
                    layer_x: res['data']['layer_x'],
                    layer_y: res['data']['layer_y'],
                    is_submitted: false
                })
            });
        });
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
        this.setState({ blocks: blocks });
    };

    render() {
        const { history } = this.props;
        return (
            <div className="Note">
                <Signout history={history} />
                <NoteLeft
                    handleDeleteBlock={this.handleDeleteBlock}
                    note_title={this.state.title}
                    meeting_date={this.state.created_at}
                    participants={this.state.participants}
                    noteId={this.state.noteId}
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
                    handleAddImageBlock={this.handleAddImageBlock}
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
