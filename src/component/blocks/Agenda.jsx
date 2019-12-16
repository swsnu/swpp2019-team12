import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import Websocket from 'react-websocket';
import AgendaInside from '../agenda_in/AgendaInside';
import { find } from 'lodash';
import { Button, Menu, Dropdown, Icon } from 'antd';
import Tag from '../blocks/Tag';
class Agenda extends Component {
    constructor(props) {
        super(props);
        this.AgendaRef = React.createRef();
        this.state = {
            agenda_id: this.props.blk_id,
            agenda_title: '',
            current_title: '',
            typingTimeout: 0,
            typing: false,
            blocks: [],
            agendaTags: [],
            workspaceTags: this.props.workspaceTags
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.content !== prevState.agenda_title) {
            return {
                agenda_title: nextProps.content,
                current_title: nextProps.content
            };
        } else if (nextProps.workspaceTags != prevState.workspaceTags) {
            return {
                workspaceTags: nextProps.workspaceTags
            };
        }
        return prevState;
    }

    componentDidMount() {
        axios
            .get(`/api/agenda/${this.state.agenda_id}/`)
            .then(res => {
                let blocks = null;
                if (res.data['agenda']['children_blocks'] === '') {
                    blocks = [];
                } else {
                    blocks = JSON.parse(res.data['agenda']['children_blocks']);
                }
                const agendaTags = res['data']['tags'];

                this.setState({
                    blocks: blocks,
                    current_title: res.data['agenda']['content'],
                    agendaTags
                });
            })
            .catch(err => console.log('this agenda has no child block'));
    }

    onDragEnd = result => {
        if (!result.destination) {
            return;
        }

        const blocks = reorder(
            this.state.blocks,
            result.source.index,
            result.destination.index
        );

        const stringifiedBlocks = {
            children_blocks: JSON.stringify(blocks)
        };

        const JSON_data = {
            operation_type: 'drag_inside_of_agenda',
            children_blocks: blocks
        };

        axios
            .patch(
                `/api/agenda/${this.state.agenda_id}/childrenblocks/`,
                stringifiedBlocks
            )
            .then(res => {
                this.AgendaRef.current.state.ws.send(JSON.stringify(JSON_data));
            })
            .catch(err => console.log(err));
    };

    handleAddTextBlock = () => {
        const document_id = handleDocIdInUrl();
        const text_info = {
            a_id: this.state.agenda_id,
            n_id: this.props.noteId,
            content: '어젠다 속 새로운 텍스트 블록',
            layer_x: 0,
            layer_y: 0,
            document_id: document_id,
            block_type: 'Text'
        };

        const JSON_data = {
            operation_type: 'add_block',
            block: text_info
        };

        this.AgendaRef.current.state.ws.send(JSON.stringify(JSON_data));
    };

    handleAddImageBlock = () => {
        const image_info = {
            a_id: this.state.agenda_id,
            n_id: this.props.noteId,
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

        this.AgendaRef.current.state.ws.send(JSON.stringify(JSON_data));
    };

    handleAddTodoBlock = () => {
        const todo_info = {
            a_id: this.state.agenda_id,
            n_id: this.props.noteId,
            block_type: 'TodoContainer',
            content: '할 일을 채워주세요',
            layer_x: 0,
            layer_y: 0,
            assignees: [],
            due_date: moment()
                .add(1, 'days')
                .format('YYYY-MM-DD')
        };

        const JSON_data = {
            operation_type: 'add_block',
            block: todo_info
        };
        this.AgendaRef.current.state.ws.send(JSON.stringify(JSON_data));
    };

    handleSocketAgenda(data) {
        let newBlocks = null;
        let res = JSON.parse(data);
        if (res.hasOwnProperty('block_type')) {
            if (res['block_type'] === 'Text') {
                newBlocks = this.state.blocks.concat({
                    block_type: res['block_type'],
                    id: res['id'],
                    content: res['content'],
                    layer_x: res['layer_x'],
                    layer_y: res['layer_y'],
                    document_id: res['document_id'],
                    parent_agenda: res['parent_agenda'],
                    note: res['note']
                });
            } else if (res['block_type'] === 'Image') {
                newBlocks = this.state.blocks.concat({
                    block_type: res['block_type'],
                    id: res['id'],
                    content: res['content'],
                    layer_x: res['layer_x'],
                    layer_y: res['layer_y'],
                    image: res['image'],
                    is_parent_note: res['is_parent_note'],
                    is_submitted: res['is_submitted'],
                    parent_agenda: res['parent_agenda']
                });
            } else if (res['block_type'] === 'TodoContainer') {
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
            }
            const stringifiedBlocks = {
                children_blocks: JSON.stringify(newBlocks)
            };

            this.setState({ blocks: newBlocks });

            axios
                .patch(
                    `/api/agenda/${this.state.agenda_id}/childrenblocks/`,
                    stringifiedBlocks
                )
                .then(res_ => console.log(res_));
        } else if (res['operation_type'] === 'change_agenda') {
            this.setState({ agenda_title: res['updated_agenda'] });
        } else {
            this.setState({ blocks: res['children_blocks'] });
        }
    }

    handleClickDelete = e => {
        e.preventDefault();
        const axios_path = `/api/agenda/${this.state.agenda_id}/`;
        this.props.handleDeleteBlock(
            axios_path,
            'Agenda',
            this.state.agenda_id
        );
    };

    handleDeleteTodo = deleted => {
        const todoContainer = this.state.blocks.find(
            blk => blk.block_type == 'TodoContainer'
        );
        if (!todoContainer) {
            console.log('Todo conatiner가 없습니다. ');
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
            .patch(
                `/api/agenda/${this.state.agenda_id}/childrenblocks/`,
                stringifiedBlocks
            )
            .then(res =>
                this.AgendaRef.current.state.ws.send(JSON.stringify(JSON_data))
            );
    };

    handleDeleteBlockInAgenda = (axios_path, block_type, block_id) => {
        axios
            .delete(axios_path)
            .then(res => {
                const newBlocks = [
                    ...this.state.blocks.filter(
                        b => !(b.block_type == block_type && b.id == block_id)
                    )
                ];

                const stringifiedBlocks = {
                    children_blocks: JSON.stringify(newBlocks)
                };

                const JSON_data = {
                    operation_type: 'delete_block',
                    children_blocks: newBlocks
                };

                axios
                    .patch(
                        `/api/agenda/${this.state.agenda_id}/childrenblocks/`,
                        stringifiedBlocks
                    )
                    .then(res_ => {
                        this.AgendaRef.current.state.ws.send(
                            JSON.stringify(JSON_data)
                        );
                    });
            })
            .catch(err => {
                console.log('err: ', err);
            });
    };

    handleClickToDetail = () => {
        console.log(
            'Need to implement changing to Detail mode from preview mode'
        );
    };

    handleChangeAgendaTitle = e => {
        const agendaTitle = e.target.value.length ? e.target.value : ' ';

        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
        }

        this.setState({
            current_title: agendaTitle,
            // agenda_title: agendaTitle,
            typing: false,
            typingTimeout: setTimeout(() => {
                axios
                    .patch(`/api/agenda/${this.state.agenda_id}/`, {
                        content: agendaTitle
                    })
                    .then(res_1 => {
                        axios
                            .get(
                                `/api/note/${this.props.noteId}/childrenblocks/`
                            )
                            .then(res_2 => {
                                this.modifyAgendaInfo(res_2, agendaTitle);
                            });
                        const newAgenda = {
                            operation_type: 'change_agenda',
                            updated_agenda: agendaTitle
                        };
                        this.AgendaRef.current.state.ws.send(
                            JSON.stringify(newAgenda)
                        );
                    })
                    .catch(err => console.log(err));
            }, 1818)
        });
    };

    modifyAgendaInfo = (res, content) => {
        const noteId = this.props.noteId;
        const agendaId = this.state.agenda_id;
        const socketRef = this.props.socketRef;
        let childrenBlocks = JSON.parse(res['data']['children_blocks']);

        let agendaBlocks;
        agendaBlocks = childrenBlocks.filter(
            childrenBlock => childrenBlock.block_type === 'Agenda'
        );
        agendaBlocks = find(agendaBlocks, {
            id: this.state.agenda_id
        });
        agendaBlocks['content'] = content;

        let agendaIdx = -1;
        for (let i = 0; i < childrenBlocks.length; i++) {
            if (
                childrenBlocks[i].block_type === 'Agenda' &&
                childrenBlocks[i].id === agendaId
            ) {
                agendaIdx = i;
                break;
            }
        }

        childrenBlocks.splice(agendaIdx, 1, agendaBlocks);

        const JSON_data = {
            operation_type: 'change_children_blocks',
            children_blocks: childrenBlocks
        };

        const stringifiedBlocks = {
            children_blocks: JSON.stringify(childrenBlocks)
        };
        axios
            .patch(`/api/note/${noteId}/childrenblocks/`, stringifiedBlocks)
            .then(res_ => {
                socketRef.current.state.ws.send(JSON.stringify(JSON_data));
            })
            .catch(err => console.log(err));
    };

    handleMenuClick = e => {
        console.log(e);
        this.handleAddTag(e.key);
    };

    handleAddTag = tagId => {
        const agendaId = this.state.agenda_id;
        const newTag = this.state.workspaceTags.find(tag => tag.id == tagId);
        console.log('newTag: ', newTag);
        console.log(this.state.agendaTags);
        let duplicate = false;
        this.state.agendaTags.forEach(tag => {
            if (tagId == tag.id) {
                duplicate = true;
            }
        });

        if (!duplicate) {
            const tags = this.state.agendaTags.concat(newTag);
            const newAgenda = {
                tags: tags.map(tag => tag.id)
            };
            axios.patch(`/api/agenda/${agendaId}/`, newAgenda).then(res => {
                console.log(res);
                this.setState({
                    agendaTags: tags
                });
            });
        }
    };

    renderTags = () => {
        return (
            this.state.agendaTags &&
            this.state.agendaTags.map((tag, i) => <Tag key={i} tag={tag} />)
        );
    };

    render() {
        console.log(this.props.participants);
        const menu = (
            <Menu>
                {this.state.workspaceTags.map((tag, i) => (
                    <Menu.Item key={tag.id} onClick={this.handleMenuClick}>
                        {tag.content}
                    </Menu.Item>
                ))}
            </Menu>
        );
        return (
            <div
                className="full-size-block-container Agenda"
                id="Agenda-Conatiner"
                onClick={() =>
                    this.props.handleClickBlock(
                        this.props.type,
                        this.props.blk_id
                    )
                }>
                <div className="full-size-block-title" id="Agenda">
                    <div className="full-size-block-title__label Agenda-label">
                        <div>Agenda</div>
                        <button
                            onClick={this.handleClickDelete}
                            className="delete-button">
                            X
                        </button>
                    </div>
                    <div className="agenda-info">
                        <div className="agenda-title">
                            <input
                                onChange={this.handleChangeAgendaTitle}
                                value={this.state.current_title}
                                placeholder="안건 이름을 입력하세요"
                            />
                        </div>
                        <div className="agenda-buttons">
                            <Button
                                onClick={this.handleAddTextBlock}
                                className="agenda-add-text-button">
                                Add text
                            </Button>
                            <Button
                                onClick={this.handleAddImageBlock}
                                className="agenda-add-image-button">
                                Add image
                            </Button>
                            <Button
                                onClick={this.handleAddTodoBlock}
                                className="agenda-add-todo-button">
                                Add Todo
                            </Button>
                            <div>
                                <Dropdown
                                    overlay={menu}
                                    className="add-tag-button">
                                    <Button>
                                        Add Tag <Icon type="down" />
                                    </Button>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Agenda-tags">
                    <div>{this.renderTags()}</div>
                </div>
                <div className="full-size-block-content Agenda">
                    <div className="full-size-block-content__text Agenda">
                        <AgendaInside
                            noteId={this.props.noteId}
                            handleClickBlock={this.props.handleClickBlock}
                            blocks={this.state.blocks}
                            handleDeleteBlock={this.handleDeleteBlockInAgenda}
                            handleChangeTitle={this.handleChangeTitle}
                            onDragEnd={this.onDragEnd}
                            handleAddTextBlock={this.handleAddTextBlock}
                            handleDeleteTodo={this.handleDeleteTodo}
                            socketRef={this.AgendaRef}
                            participants={this.props.participants}
                        />
                    </div>
                </div>
                <Websocket
                    // 로컬 개발서버용
                    url={`ws://localhost:8001/ws/${this.state.agenda_id}/agenda/block/`}
                    // 배포 서버용
                    // url={`wss://www.meetingoverflow.space:8443/ws/${this.state.agenda_id}/agenda/block/`}
                    ref={this.AgendaRef}
                    onMessage={this.handleSocketAgenda.bind(this)}
                />
            </div>
        );
    }
}

function handleDocIdInUrl() {
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

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export default Agenda;
