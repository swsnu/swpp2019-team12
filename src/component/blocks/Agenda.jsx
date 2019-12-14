import React, { Component } from 'react';
import axios from 'axios';
import Websocket from 'react-websocket';
import AgendaInside from '../agenda_in/AgendaInside';
import { find } from 'lodash';
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
            blocks: []
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.content !== prevState.agenda_title) {
            return {
                agenda_title: nextProps.content,
                current_title: nextProps.content
            };
        }
        return prevState;
    }

    componentDidMount() {
        axios.get(`/api/agenda/${this.state.agenda_id}/`).then(res => {
            this.setState({
                current_title: res['data']['content']
            });
        });
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
        const documentId = handleDocIdInUrl();
        const text_info = {
            content: '어젠다 속 새로운 텍스트 블록',
            layer_x: 0,
            layer_y: 0,
            document_id: documentId
        };
        axios
            .post(`/api/agenda/${this.state.agenda_id}/textblocks/`, text_info)
            .then(res => {
                console.log(res);
                console.log('res doc id: ', res.data.document_id);
                console.log(this.state.blocks);
                const block = {
                    block_type: 'Text',
                    id: res['data']['id'],
                    content: res['data']['content'],
                    layer_x: res['data']['layer_x'],
                    layer_y: res['data']['layer_y'],
                    document_id: res['data']['document_id']
                };
                const newBlocks = this.state.blocks.concat(block);
                const JSON_data = {
                    operation_type: 'add_block',
                    block: block
                };
                axios
                    .patch(`/api/agenda/${this.state.agenda_id}/`, {
                        children_blocks: JSON.stringify(newBlocks),
                        has_text_block: true
                    })
                    .then(res => {
                        this.AgendaRef.current.state.ws.send(
                            JSON.stringify(JSON_data)
                        );
                    });
            })
            .catch(err => {
                console.log('textblock insid agenda 생성 실패', err);
            });
    };

    handleSocketAgenda(data) {
        let res = JSON.parse(data);
        console.log(res);
        if (res.hasOwnProperty('block_type')) {
            this.setState({
                blocks: this.state.blocks.concat({
                    block_type: res['block_type'],
                    id: res['id'],
                    content: res['content'],
                    layer_x: res['layer_x'],
                    layer_y: res['layer_y'],
                    documentId: res['document_id']
                })
            });
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

    handleDeleteBlockInAgenda = (axios_path, block_type, block_id) => {
        console.log('axios path:', axios_path);
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
                    .then(res => {
                        console.log(res);
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
                    .catch(e => console.log(e));
            }, 1818)
        });
    };

    modifyAgendaInfo = (res, content) => {
        const noteId = this.props.noteId;
        const agendaId = this.state.agenda_id;
        const socketRef = this.props.socketRef;
        let childrenBlocks = JSON.parse(res['data']['children_blocks']);
        console.log('childrenBlocks', childrenBlocks);

        let agendaBlocks;
        agendaBlocks = childrenBlocks.filter(
            childrenBlock => childrenBlock.block_type === 'Agenda'
        );
        agendaBlocks = find(agendaBlocks, {
            id: this.state.agenda_id
        });
        agendaBlocks['content'] = content;

        console.log('agendaBlocks', agendaBlocks);
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
        console.log('agendaIdx', agendaIdx);

        childrenBlocks.splice(agendaIdx, 1, agendaBlocks);
        console.log('child', childrenBlocks);

        const JSON_data = {
            operation_type: 'change_children_blocks',
            children_blocks: childrenBlocks
        };

        const stringifiedBlocks = {
            children_blocks: JSON.stringify(childrenBlocks)
        };
        axios
            .patch(`/api/note/${noteId}/childrenblocks/`, stringifiedBlocks)
            .then(res => {
                socketRef.current.state.ws.send(JSON.stringify(JSON_data));
            })
            .catch(err => console.log(err));
    };

    render() {
        const { current_title, agenda_title } = this.state;
        return (
            <div
                className="full-size-block-container Agenda"
                onClick={() =>
                    this.props.handleClickBlock(
                        this.props.type,
                        this.props.blk_id
                    )
                }>
                <div className="full-size-block-title Agenda">
                    <div className="full-size-block-title__label Agenda">
                        Agenda
                    </div>
                    <input
                        onChange={this.handleChangeAgendaTitle}
                        value={this.state.current_title}
                    />

                    <button onClick={this.handleAddTextBlock}>Add text</button>
                    <button
                        onClick={this.handleClickDelete}
                        className="delete-button">
                        X
                    </button>
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
                            handleAddTextBlock={
                                this.handleAddTextBlock
                            }></AgendaInside>
                    </div>
                </div>
                <Websocket
                    url={`ws://localhost:8001/ws/${this.state.agenda_id}/agenda/block/`}
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
