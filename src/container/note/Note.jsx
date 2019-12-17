import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import Websocket from 'react-websocket';

import NoteLeft from './NoteLeft';
import Signout from '../../component/signout/Signout';
import NoteTree from '../../component/note_left/NoteTree';
import googleSTT from '../stt/googleSTT';

class Note extends Component {
    constructor(props) {
        super(props);
        this.BlockRef = React.createRef();
        this.state = {
            workspaceId: null,
            currentUserNickname: null,
            noteId: null,
            title: '',
            location: '',
            created_at: '',
            last_modified_at: '',
            participants: [],
            moment: null,
            blocks: [],
            typing: false,
            typingTimeout: 0,
            noteTags: [],
            workspaceTags: []
        };
    }

    componentDidMount() {
        // Login check through sessionStorage
        const loggedInUserNickname = sessionStorage.getItem(
            'LoggedInUserNickname'
        );
        if (!loggedInUserNickname) {
            this.props.history.push('/signin');
        }

        const noteId = this.props.match.params.n_id;

        axios.get(`/api/note/${noteId}/childrenblocks/`).then(res => {
            let children_blocks = null;
            if (res.data['children_blocks'] === '') {
                children_blocks = [];
            } else {
                children_blocks = JSON.parse(res.data['children_blocks']);
            }

            children_blocks.forEach(blk => {
                let block_type = blk['block_type'];
                if (block_type == 'Agenda') {
                    this.setState({
                        blocks: this.state.blocks.concat({
                            block_type: 'Agenda',
                            id: blk['id'],
                            content: blk['content'],
                            layer_x: blk['layer_x'],
                            layer_y: blk['layer_y']
                        })
                    });
                } else if (block_type == 'Text') {
                    this.setState({
                        blocks: this.state.blocks.concat({
                            block_type: 'Text',
                            id: blk['id'],
                            content: blk['content'],
                            layer_x: blk['layer_x'],
                            layer_y: blk['layer_y'],
                            document_id: blk['document_id']
                        })
                    });
                } else if (block_type == 'TodoContainer') {
                    let todoContainer = {
                        block_type: 'TodoContainer',
                        todos: blk['todos']
                    };
                    todoContainer.todos.forEach(todo => {
                        todo.assignees_info = [];
                        if (todo.assignees) {
                            todo.assignees.forEach(assignee_id => {
                                axios
                                    .get(`/api/profile/${assignee_id}`)
                                    .then(res_ => {
                                        todo.assignees_info.push({
                                            id: res_['data']['id'],
                                            nickname: res_['data']['nickname']
                                        });
                                    });
                            });
                        }
                    });
                    this.setState({
                        blocks: this.state.blocks.concat(todoContainer)
                    });
                } else if (block_type == 'Image') {
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
                }
            });
        });
        console.log('note Id: ', noteId);

        axios
            .get(`/api/note/${noteId}/`)
            .then(res => {
                const noteData = res['data']['note'];
                const tagData = res['data']['tags'];
                const workspaceTags = res['data']['workspace_tags'];
                this.setState({
                    ...this.state,
                    note_id: noteData['id'],
                    title: noteData['title'],
                    location: noteData['location'],
                    created_at: noteData['created_at'],
                    last_modified_at: noteData['last_modified_at'],
                    moment: moment(noteData['created_at']),
                    workspaceId: noteData['workspace'],
                    noteTags: tagData,
                    workspaceTags: workspaceTags
                });
                return res['data']['note']['participants'];
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

    handleDeleteBlock = (axios_path, block_type, block_id) => {
        const noteId = this.props.match.params.n_id;
        const newBlocks = this.state.blocks.filter(
            b => !(b.block_type == block_type && b.id == block_id)
        );
        const stringifiedBlocks = {
            children_blocks: JSON.stringify(newBlocks)
        };

        const JSON_data = {
            operation_type: 'delete_block',
            children_blocks: newBlocks
        };
        axios
            .delete(axios_path)
            .then(res_1 => {
                axios
                    .patch(
                        `/api/note/${noteId}/childrenblocks/`,
                        stringifiedBlocks
                    )
                    .then(res_2 => {
                        this.BlockRef.current.state.ws.send(
                            JSON.stringify(JSON_data)
                        );
                    });
            })
            .catch(err => {
                console.log('err: ', err);
            });
    };

    handleDeleteTodo = deleted => {
        const noteId = this.props.match.params.n_id;
        const todoContainer = this.state.blocks.find(
            blk => blk.block_type == 'TodoContainer'
        );
        if (!todoContainer) {
            // console.log('Todo conatiner가 없습니다. ');
            return;
        }
        let newBlocks = null;
        // 만약 컨테이너가 존재하지만, 단 한개의 Todo가 존재한다면, 그것을 지우고 컨테이너도 삭제
        if (todoContainer.todos.length <= 1) {
            newBlocks = this.state.blocks.filter(
                blk => blk.block_type !== 'TodoContainer'
            );
        } else {
            // 컨테이너가 이미 존재하고 그 안에 2개 이상의 Todo 가 있다면, 지우고자 하는 Todo를 제거한 새로운 배열로 수정
            newBlocks = this.state.blocks.map(blk => {
                if (blk.block_type == 'TodoContainer') {
                    const newTodos = blk.todos.filter(
                        todo => todo.id !== deleted.id
                    );
                    blk.todos = newTodos;
                    return blk;
                } else {
                    return blk;
                }
            });
        }
        const stringifiedBlocks = {
            children_blocks: JSON.stringify(newBlocks)
        };

        const JSON_data = {
            operation_type: 'delete_todo',
            children_blocks: newBlocks
        };
        axios
            .patch(`/api/note/${noteId}/childrenblocks/`, stringifiedBlocks)
            .then(res =>
                this.BlockRef.current.state.ws.send(JSON.stringify(JSON_data))
            );
    };

    handleChangeTitle = e => {
        const n_id = this.props.match.params.n_id;
        const title = e.target.value.length ? e.target.value : ' ';
        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
        }

        this.setState({
            title: title,
            typing: false,
            typingTimeout: setTimeout(() => {
                axios
                    .patch(`/api/note/${n_id}/`, { title: title })
                    .then(res_1 => {
                        const newTitle = {
                            operation_type: 'change_title',
                            updated_title: title
                        };
                        this.BlockRef.current.state.ws.send(
                            JSON.stringify(newTitle)
                        );
                    });
            }, 1818)
        });
    };

    handleChangeDatetime = moment_ => {
        const n_id = this.props.match.params.n_id;
        axios.patch(`/api/note/${n_id}/`, { created_at: moment_ }).then(res => {
            const newDatetime = {
                operation_type: 'change_datetime',
                updated_datetime: moment_
            };
            this.BlockRef.current.state.ws.send(JSON.stringify(newDatetime));
        });
    };

    handleChangeLocation = e => {
        const n_id = this.props.match.params.n_id;
        const location = e.target.value.length ? e.target.value : ' ';
        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
        }

        this.setState({
            location: location,
            typing: false,
            typingTimeout: setTimeout(() => {
                axios
                    .patch(`/api/note/${n_id}/`, { location: location })
                    .then(res_1 => {
                        const newLocation = {
                            operation_type: 'change_location',
                            updated_location: location
                        };
                        this.BlockRef.current.state.ws.send(
                            JSON.stringify(newLocation)
                        );
                    })
                    .catch(err => console.log(err));
            }, 1818)
        });
    };

    handleAddAgendaBlock = () => {
        const noteId = this.props.match.params.n_id;
        const agenda_info = {
            n_id: noteId,
            content: '',
            layer_x: 0,
            layer_y: 0,
            block_type: 'Agenda'
        };
        const JSON_data = {
            operation_type: 'add_block',
            block: agenda_info
        };
        this.BlockRef.current.state.ws.send(JSON.stringify(JSON_data));
    };

    handleAddTextBlock = () => {
        const noteId = this.props.match.params.n_id;
        const document_id = this.handleDocIdInUrl();
        // Block Create API call 할 곳.
        const text_info = {
            n_id: noteId,
            content: '새로 생성된 텍스트 블록',
            layer_x: 0,
            layer_y: 0,
            document_id: document_id,
            block_type: 'Text'
        };

        const JSON_data = {
            operation_type: 'add_block',
            block: text_info
        };

        this.BlockRef.current.state.ws.send(JSON.stringify(JSON_data));
    };

    /**
     * 1. 만약 투두가 전혀 없었다면, 투두 컨테이너가 생성되어야 하고, 첫 투두가 컨테이너에 들어가야함
     * 2. 만약 투두컨테이너가 있고, 투두가 있었다면, 그 컨테이너에 add되어야함
     */
    handleAddTodoBlock = () => {
        const noteId = this.props.match.params.n_id;

        // Where need to call Todo Create API.
        // To find out whether there is at least one todo.
        const todo_info = {
            n_id: noteId,
            content: '할 일을 채워주세요',
            layer_x: 0,
            layer_y: 0,
            assignees: [],
            due_date: moment()
                .add(1, 'days')
                .format('YYYY-MM-DD'),
            block_type: 'TodoContainer'
        };

        const JSON_data = {
            operation_type: 'add_block',
            block: todo_info
        };

        this.BlockRef.current.state.ws.send(JSON.stringify(JSON_data));
    };

    handleAddImageBlock = () => {
        const noteId = this.props.match.params.n_id;
        // Block Create API call 할 곳.
        const image_info = {
            n_id: noteId,
            image: null,
            content: '',
            layer_x: 0,
            layer_y: 0,
            block_type: 'Image'
        };

        const JSON_data = {
            operation_type: 'add_block',
            block: image_info
        };

        this.BlockRef.current.state.ws.send(JSON.stringify(JSON_data));
    };

    handleAddTag = tagId => {
        const noteId = this.props.match.params.n_id;
        const newTag = this.state.workspaceTags.find(tag => tag.id == tagId);
        let duplicate = false;
        this.state.noteTags.forEach(tag => {
            if (tagId == tag.id) {
                duplicate = true;
            }
        });

        if (!duplicate) {
            const tags = this.state.noteTags.concat(newTag);
            const newNote = {
                tags: tags.map(tag => tag.id)
            };
            axios.patch(`/api/note/${noteId}/`, newNote).then(res => {
                this.setState({
                    noteTags: tags
                });
            });
        }
        //        const noteTags = this.state.
    };

    handleSocketBlock(data) {
        const noteId = this.props.match.params.n_id;
        let newBlocks = null;
        let res = JSON.parse(data);
        // Add Block
        if (res.hasOwnProperty('block_type')) {
            if (res['block_type'] == 'Agenda') {
                newBlocks = this.state.blocks.concat({
                    block_type: res['block_type'],
                    id: res['id'],
                    content: res['content'],
                    layer_x: res['layer_x'],
                    layer_y: res['layer_y'],
                    child_blocks: []
                });
            } else if (res['block_type'] == 'Text') {
                newBlocks = this.state.blocks.concat({
                    block_type: res['block_type'],
                    id: res['id'],
                    content: res['content'],
                    layer_x: res['layer_x'],
                    layer_y: res['layer_y'],
                    document_id: res['document_id']
                });
            } else if (res['block_type'] == 'TodoContainer') {
                let todoContainer = this.state.blocks.find(
                    blk => blk.block_type === 'TodoContainer'
                );
                res.assignees_info = [];
                if (todoContainer) {
                    newBlocks = this.state.blocks.map(blk => {
                        if (blk.block_type == 'TodoContainer') {
                            const newTodos = blk.todos.concat(res);
                            blk.todos = newTodos;
                            return blk;
                        } else {
                            return blk;
                        }
                    });
                } else {
                    todoContainer = {
                        todos: [res],
                        block_type: 'TodoContainer'
                    };
                    newBlocks = this.state.blocks.concat(todoContainer);
                }
            } else if (res['block_type'] == 'Image') {
                newBlocks = this.state.blocks.concat({
                    block_type: res['block_type'],
                    id: res['id'],
                    image: res['image'],
                    content: res['content'],
                    layer_x: res['layer_x'],
                    layer_y: res['layer_y'],
                    is_submitted: res['is_submitted']
                });
            }

            const stringifiedBlocks = {
                children_blocks: JSON.stringify(newBlocks)
            };

            this.setState({ blocks: newBlocks });

            axios
                .patch(`/api/note/${noteId}/childrenblocks/`, stringifiedBlocks)
                .then(res_ => console.log(res_));
        } else if (res['operation_type'] === 'change_title') {
            this.setState({ title: res['updated_title'] });
        } else if (res['operation_type'] === 'change_location') {
            this.setState({ location: res['updated_location'] });
        } else if (res['operation_type'] === 'change_datetime') {
            this.setState({ moment: moment(res['updated_datetime']) });
        } else if (res['operation_type'] === 'patch_image') {
            this.setState({});
        }
        // Drag & Drop
        // Delete
        else {
            this.setState({ blocks: res['children_blocks'] });
        }
    }

    onDragEnd = result => {
        const noteId = this.props.match.params.n_id;
        if (!result.destination) {
            return;
        }

        const blocks = this.reorder(
            this.state.blocks,
            result.source.index,
            result.destination.index
        );

        const stringifiedBlocks = {
            children_blocks: JSON.stringify(blocks)
        };

        const JSON_data = {
            operation_type: 'drag',
            children_blocks: blocks
        };

        axios
            .patch(`/api/note/${noteId}/childrenblocks/`, stringifiedBlocks)
            .then(res => {
                this.BlockRef.current.state.ws.send(JSON.stringify(JSON_data));
            })
            .catch(err => console.log(err));
    };

    reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    handleDocIdInUrl() {
        let id = this.randomString();
        this.updateDocIdInUrl(id);
        return id;
    }

    updateDocIdInUrl(id) {
        window.history.replaceState(
            {},
            document.title,
            this.generateUrlWithDocId(id)
        );
    }

    generateUrlWithDocId(id) {
        return `${window.location.href.split('?')[0]}?docId=${id}`;
    }

    randomString() {
        return Math.floor(Math.random() * Math.pow(2, 52)).toString(32);
    }

    render() {
        const { history } = this.props;
        const noteId = this.props.match.params.n_id;
        const loggedInUserNickname = sessionStorage.getItem(
            'LoggedInUserNickname'
        );
        return (
            <div className="Note">
                <div className="file-tree-wrapper">
                    <div className="file-tree">
                        <NoteTree
                            blocks={this.state.blocks}
                            history={history}
                        />
                    </div>
                </div>
                <NoteLeft
                    className="note-left"
                    handleAddTag={this.handleAddTag}
                    handleAddAgendaBlock={this.handleAddAgendaBlock}
                    handleAddTextBlock={this.handleAddTextBlock}
                    handleAddTodoBlock={this.handleAddTodoBlock}
                    handleAddImageBlock={this.handleAddImageBlock}
                    handleAddTextSocketSend={this.handleAddTextSocketSend}
                    handleChangeTitle={this.handleChangeTitle}
                    handleChangeDatetime={this.handleChangeDatetime}
                    handleChangeLocation={this.handleChangeLocation}
                    handleDeleteTodo={this.handleDeleteTodo}
                    handleDeleteBlock={this.handleDeleteBlock}
                    workspaceId={this.state.workspaceId}
                    workspaceTags={this.state.workspaceTags}
                    noteId={noteId}
                    noteTags={this.state.noteTags}
                    note_title={this.state.title}
                    blocks={this.state.blocks}
                    onDragEnd={this.onDragEnd}
                    location={this.state.location}
                    meeting_date={this.state.created_at}
                    participants={this.state.participants}
                    moment={this.state.moment}
                    socketRef={this.BlockRef}
                />
                <Websocket
                    // 로컬 테스트용.
                    url={`ws://localhost:8001/ws/${noteId}/block/`}
                    // 개발서버용.
                    // url={`wss://www.meetingoverflow.space:8443/ws/${noteId}/block/`}
                    ref={this.BlockRef}
                    onMessage={this.handleSocketBlock.bind(this)}
                />
                <div className="note-right-wrapper">
                    <Signout className="note-signout" history={history} />
                </div>
                <googleSTT room={noteId} nickname={loggedInUserNickname} />
                <Signout history={history} />
            </div>
        );
    }
}

export default Note;
