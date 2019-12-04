import React, { Component } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AgendaInside from '../agenda_in/AgendaInside';
class Agenda extends Component {
    constructor(props) {
        super(props);
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
                const blocks = JSON.parse(res.data.children_blocks);
                console.log('blocks: ', blocks);
                this.setState({ blocks: blocks });
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

        console.log('agenda 속 텍스트 document Id: ', documentId);
        const text_info = {
            content: '어젠다 속 새로운 텍스트 블록',
            layer_x: 0,
            layer_y: 0,
            document_id: documentId
        };
        axios
            .post(`/api/agenda/${this.state.agenda_id}/textblocks/`, text_info)
            .then(res => {
                console.log('res doc id: ', res.data.document_id);
                const blocks = this.state.blocks.concat({
                    block_type: 'Text',
                    id: res['data']['id'],
                    content: res['data']['content'],
                    layer_x: res['data']['layer_x'],
                    layer_y: res['data']['layer_y'],
                    documentId: res['data']['document_id']
                });
                axios
                    .patch(`/api/agenda/${this.state.agenda_id}/`, {
                        children_blocks: JSON.stringify(blocks)
                    })
                    .then(res => {
                        console.log('patch 후 blocks:', blocks);
                        this.setState({ blocks: blocks });
                    });
                // this.setState({
                //     blocks: this.state.blocks.concat({
                //         block_type: 'Text',
                //         id: res['data']['id'],
                //         content: res['data']['content'],
                //         layer_x: res['data']['layer_x'],
                //         layer_y: res['data']['layer_y'],
                //         documentId: res['data']['document_id']
                //     })
                // });
            })
            .catch(err => {
                console.log('textblock insid agenda 생성 실패', err);
            });
    };

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

    handleClickToDetail = () => {
        console.log(
            'Need to implement changing to Detail mode from preview mode'
        );
    };

    render() {
        console.log('blocks in agenda: ', this.state.blocks);
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
