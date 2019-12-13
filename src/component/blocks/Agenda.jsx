import React, { Component } from 'react';
import axios from 'axios';
import Websocket from 'react-websocket';
import AgendaInside from '../agenda_in/AgendaInside';
class Agenda extends Component {
    constructor(props) {
        super(props);
        this.AgendaRef = React.createRef();
        this.state = {
            agenda_id: this.props.blk_id,
            agenda_title: this.props.agenda_title,
            agenda_discussion: this.props.agenda_discussion,
            blocks: []
        };
    }

    componentDidMount() {
        console.log('component did mount');
        axios
            .get(`/api/agenda/${this.state.agenda_id}/`)
            .then(res => {
                console.log('res of agenda: ', res);
                let blocks = [];
                if (res['data']['children_blocks'] !== null) {
                    blocks = JSON.parse(res['data']['children_blocks']);
                }
                console.log('blocks: ', blocks);
                this.setState({ blocks: blocks });
            })
            // 이 catch는 agenda가 NOT_FOUND일 때, 걸리는 거라서 no child block은 아닌 것 같습니다.
            .catch(err => console.log('this agenda has no child block'));

        // // api/agenda/:agenda_id/textblock/ 으로 GET을 날려야 맞는 것 같습니다.
        // axios
        //     .get(`/api/agenda/${this.state.agenda_id}/textblocks/`)
        //     .then(res => {
        //         console.log('res of agenda: ', res['data']);
        //         this.setState({ blocks: res['data'] });
        //     })
        //     // 지금 이 catch구문은 agenda가 아예 존재하지 않는 경우를 말하는거고
        //     // children block이 없어도 위에 then으로 빠지는 상황입니다.
        //     .catch(err => console.log('this agenda has no child block'));
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
        console.log(result.source.index + ' ' + result.destination.index);

        // socket 으로 블록을 날리는 부분
        axios
            .patch(`/api/agenda/${this.state.agenda_id}/`, {
                children_blocks: JSON.stringify(blocks)
            })
            .then(res => {
                console.log('patch 후 blocks:', blocks);
                this.setState({ blocks: blocks });
            });
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
                axios
                    .patch(`/api/agenda/${this.state.agenda_id}/`, {
                        children_blocks: JSON.stringify(newBlocks)
                    })
                    .then(res => {
                        this.AgendaRef.current.state.ws.send(
                            JSON.stringify(block)
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
        } else {
            this.setState({ blocks: res['children_blocks'] });
        }
    }

    handleClickDelete = e => {
        e.preventDefault();
        console.log('delete agenda');
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

                axios
                    .patch(
                        `/api/agenda/${this.state.agenda_id}/childrenblocks/`,
                        stringifiedBlocks
                    )
                    .then(res => {
                        console.log(res);
                        this.AgendaRef.current.state.ws.send(
                            JSON.stringify(newBlocks)
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

    render() {
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
                    <button onClick={this.handleAddTextBlock}>Add text</button>
                    <button
                        onClick={this.handleClickDelete}
                        className="delete-button">
                        X
                    </button>
                </div>
                <div className="full-size-block-content Agenda">
                    <div className="full-size-block-content__text Agenda">
                        <pre>{this.props.content}</pre>
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

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export default Agenda;
