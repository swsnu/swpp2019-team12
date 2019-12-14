import React, { Component } from 'react';
import axios from 'axios';
import Websocket from 'react-websocket';
import AgendaInside from '../agenda_in/AgendaInside';
import { Button, Menu, Dropdown, Icon } from 'antd';
import Tag from '../blocks/Tag';
class Agenda extends Component {
    constructor(props) {
        super(props);
        this.AgendaRef = React.createRef();
        this.state = {
            agenda_id: this.props.blk_id,
            agenda_title: this.props.agenda_title,
            agenda_discussion: this.props.agenda_discussion,
            blocks: [],
            agendaTags: [],
            workspaceTags: this.props.workspaceTags
        };
    }

    componentDidMount() {
        axios
            .get(`/api/agenda/${this.state.agenda_id}/`)
            .then(res => {
                console.log(res);
                // let blocks = [];
                // if (res['data']['children_blocks'] !== '') {
                //     blocks = JSON.parse(res['data']['children_blocks']);
                // }
                let blocks = null;
                if (res.data['agenda']['children_blocks'] === '') {
                    blocks = [];
                } else {
                    blocks = JSON.parse(res.data['agenda']['children_blocks']);
                }
                const agendaTags = res['data']['tags'];
                console.log('agendaTags didmount', agendaTags);
                console.log('blocks: ', blocks);
                // this.props.handleAddAgendaChildrenBlocks(
                //     this.state.agenda_id,
                //     blocks
                // );
                this.setState({ blocks: blocks, agendaTags: agendaTags });
            })
            .catch(err => console.log('this agenda has no child block'));
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.workspaceTags != prevState.workspaceTags) {
            return {
                workspaceTags: nextProps.workspaceTags
            };
        }
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
            content: '어젠다 속 새로운 텍스트 블록',
            layer_x: 0,
            layer_y: 0,
            document_id: document_id
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
                        children_blocks: JSON.stringify(newBlocks)
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
            if (res['block_type'] == 'Text')
                this.setState({
                    blocks: this.state.blocks.concat({
                        block_type: res['block_type'],
                        id: res['id'],
                        content: res['content'],
                        layer_x: res['layer_x'],
                        layer_y: res['layer_y'],
                        document_id: res['document_id']
                    })
                });
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
            console.log('new agenda', newAgenda);
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
        console.log(this.state.workspaceTags);
        console.log(this.props.workspaceTags);
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
                    <Button onClick={this.handleAddTextBlock}>Add text</Button>
                    <div>
                        <Dropdown overlay={menu} className="add-tag-button">
                            <Button>
                                Add Tag <Icon type="down" />
                            </Button>
                        </Dropdown>
                    </div>
                    <button
                        onClick={this.handleClickDelete}
                        className="delete-button">
                        X
                    </button>
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
