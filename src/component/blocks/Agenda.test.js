import React from 'react';
import { shallow, mount } from 'enzyme';
import Agenda from './Agenda';
import axios from 'axios';

function mockComponent(props, className) {
    return <div className={className}>{props.title}</div>;
}

const stubWorkspaceTags = [{ id: 1 }, { id: 2 }];
const stubWorkspaceId = 1;
const stubNoteId = 1;
const stubBlk_id = 1;
const stubType = 'Text';
const stubContent = 'Test content';
const stubAgendaDiscussion = 'Test discusssion';
const stubHandleClickBlock = jest.fn();
const stubHandleDeleteBlock = jest.fn();
const stubSocketRef = {
    current: { state: { ws: { send: jest.fn(str => {}) } } }
};
const stubParticipants = [{ id: 1, nickname: 'TEST_USER' }];

jest.mock('../agenda_in/AgendaInside', () =>
    jest.fn(props => mockComponent(props, 'spyAgendaInside'))
);

describe('<Agenda />', () => {
    let agenda;
    let websocketComponent;
    let component;
    let agendaInsideComponent;
    let instance;
    beforeEach(() => {
        agenda = (
            <Agenda
                workspaceTags={stubWorkspaceTags}
                workspaceId={stubWorkspaceId}
                noteId={stubNoteId}
                blk_id={stubBlk_id}
                type={stubType}
                content={stubContent}
                agenda_discussion={stubAgendaDiscussion}
                handleClickBlock={stubHandleClickBlock}
                handleDeleteBlock={stubHandleDeleteBlock}
                socketRef={stubSocketRef}
                participants={stubParticipants}
            />
        );
        component = shallow(agenda);
        instance = component.instance();
        websocketComponent = component.find('.agenda-web-socket');
        agendaInsideComponent = component.find('.AgendaInside');

        axios.get = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: {
                        agenda: {
                            children_blocks: '',
                            content: 'STUB_CONTENT'
                        },
                        tags: ['STUB_TAG']
                    }
                };
                resolve(result);
            });
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without error', () => {
        let wrapper = component.find('#Agenda-Container');
        expect(wrapper.length).toBe(1);
    });

    it('ComponentDidMount', () => {
        instance.componentDidMount();
        axios.get('', res => {
            instance.setState({
                blocks: res.data.agenda.children_blocks,
                current_title: res.data.agenda.content,
                tags: res.data.tags
            });
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(instance.state.blocks).toEqual([]);
            expect(instance.current_title).toEqual('STUB_CONTENT');
            expect(instance.agendaTags).toEqual(['STUB_TAG']);
        });
    });

    it('ComponentDidMount when children_blocks exists ', () => {
        axios.get = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: {
                        agenda: {
                            children_blocks: 'TEST_CHILDREN_BLOCK',
                            content: 'STUB_CONTENT'
                        },
                        tags: ['STUB_TAG']
                    }
                };
                resolve(result);
            });
        });
        // JSON.parse = jest.fn(data => {
        //     return 'PARSED_DATA';
        // });
        instance.componentDidMount();
        axios.get('', res => {
            instance.setState({
                blocks: res.data.agenda.children_blocks,
                current_title: res.data.agenda.content,
                tags: res.data.tags
            });
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(instance.state.blocks).toEqual('PARSED_DATA');
        });
    });

    it('handleClickDelete ', () => {
        instance.handleClickDelete();

        expect(stubHandleDeleteBlock).toHaveBeenCalledTimes(1);
        expect(stubHandleDeleteBlock).toHaveBeenCalledWith(
            '/api/agenda/1/',
            'Agenda',
            1
        );
    });

    it('handleAddTextBlock ', () => {
        let spyHandleAddTextBlock = jest.spyOn(instance, 'handleAddTextBlock');
        let spyRandomString = jest.spyOn(instance, 'randomString');
        let spyHandleDocIdInUrl = jest.spyOn(instance, 'handleDocIdInUrl');
        let spyUpdateDocIdInUrl = jest.spyOn(instance, 'updateDocIdInUrl');
        let spyGenerateUrlWithDocId = jest.spyOn(
            instance,
            'generateUrlWithDocId'
        );

        instance.AgendaRef = {
            current: { state: { ws: { send: jest.fn() } } }
        };
        instance.handleAddTextBlock();
        expect(spyHandleAddTextBlock).toHaveBeenCalledTimes(1);
        expect(spyRandomString).toHaveBeenCalledTimes(1);
        expect(spyHandleDocIdInUrl).toHaveBeenCalledTimes(1);
        expect(spyUpdateDocIdInUrl).toHaveBeenCalledTimes(1);
        expect(spyGenerateUrlWithDocId).toHaveBeenCalledTimes(1);
    });

    it('handleAddImageBlock ', () => {
        instance.handleAddImageBlock = jest.fn();
        instance.forceUpdate();
        let wrapper = component.find('.agenda-add-image-button');
        wrapper.simulate('click');
        expect(instance.handleAddImageBlock).toHaveBeenCalledTimes(1);
    });

    it('handleChangeAgendaTitle ', () => {
        const title = 'TEST_TITLE';

        let wrapper = component.find('.agenda-title-input');
        wrapper.simulate('change', { target: { value: title } });
        const instance = component.instance();
        expect(instance.state.current_title).toEqual('TEST_TITLE');
        expect(instance.state.typing).toEqual(false);
    });

    it('handleAddTodoBlock ', () => {
        instance.handleAddTodoBlock = jest.fn();
        instance.forceUpdate();
        let wrapper = component.find('.agenda-add-todo-button');
        wrapper.simulate('click');
        expect(instance.handleAddTodoBlock).toHaveBeenCalledTimes(1);
    });

    it('handleDeleteBlockInAgenda ', async () => {
        const axios_path = 'url';
        const block_type = 'Text';
        const block_id = '1';

        axios.delete = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: {}
                };
                resolve(result);
            });
        });

        axios.patch = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: {}
                };
                resolve(result);
            });
        });

        JSON.stringify = jest.fn(str => {
            return 'DATA';
        });
        const spyHandleDeleteBlockInAgenda = jest.spyOn(
            instance,
            'handleDeleteBlockInAgenda'
        );
        instance.forceUpdate();
        await agendaInsideComponent
            .props()
            .handleDeleteBlock(axios_path, block_type, block_id);

        expect(agendaInsideComponent.length).toBe(1);
        expect(spyHandleDeleteBlockInAgenda).toHaveBeenCalledTimes(0);
        expect(axios.delete).toHaveBeenCalledTimes(1);
        expect(axios.patch).toHaveBeenCalledTimes(1);
    });

    it('handleDeleteTodo ', () => {
        const deleted = {
            id: 1
        };
        instance.handleDeleteTodo = jest.fn();
        let wrapper = component.find('.AgendaInside');
        wrapper.props().handleDeleteTodo(deleted);
        expect(instance.handleDeleteTodo).toHaveBeenCalledTimes(0);

        instance.setState({
            blocks: [{ block_type: 'TodoContainer', todos: [{ id: 1 }] }]
        });
        instance.handleDeleteTodo = jest.fn();
        instance.forceUpdate();
        wrapper.props().handleDeleteTodo(deleted);
        expect(instance.handleDeleteTodo).toHaveBeenCalledTimes(0);

        instance.setState({
            blocks: [
                { block_type: 'TodoContainer', todos: [{ id: 1 }, { id: 2 }] }
            ]
        });

        wrapper.props().handleDeleteTodo(deleted);
        expect(instance.handleDeleteTodo).toHaveBeenCalledTimes(0);
    });

    it('should handle websocket properly', () => {
        const spyHandleSocketAgenda = jest.spyOn(
            instance,
            'handleSocketAgenda'
        );
        console.log(websocketComponent.props());
        let data =
            '{"id": 1, "block_type": "Text", "content": "content", "layer_x": "layer_x", "layer_y": "layer_y", "document_id": "document_id", "parent_agenda": "parent_agenda", "note": 1, "is_parent_note": "False"}';
        websocketComponent.props().onMessage(data);
        expect(spyHandleSocketAgenda).toHaveBeenCalledTimes(0);
        data =
            '{"id": 1, "block_type": "TodoContainer", "content": "content","layer_x": 0,"layer_y": 0,"due_date": "2019-09-09","is_parent_note": "True","parent_agenda": 1,"assignees": [], "is_done": "False"}';
        websocketComponent.props().onMessage(data);
        expect(spyHandleSocketAgenda).toHaveBeenCalledTimes(0);
        data =
            '{"id": 1, "block_type": "Image", "content": "content", "layer_x": "layer_x", "layer_y": "layer_y", "parent_agenda": "parent_agenda", "note": 1, "is_parent_note": "False"}';
        websocketComponent.props().onMessage(data);
        expect(spyHandleSocketAgenda).toHaveBeenCalledTimes(0);
        data =
            '{"block_type":"TodoContainer","todos":[{"id":1,"block_type":"TodoContainer","content":"Competitive Analysis","layer_x":0,"layer_y":0,"assignees":[3,14],"due_date":"2019-12-01","note":"23","is_parent_note":true,"is_done":false,"parent_agenda":null,"assignees_info":[{"id":14,"nickname":"채민"},{"id":3,"nickname":"태영"}]},{"id":2,"block_type":"TodoContainer","content":"Customer Needs","layer_x":0,"layer_y":0,"assignees":[13,12],"due_date":"2019-12-01","note":"23","is_parent_note":true,"is_done":false,"parent_agenda":null,"assignees_info":[{"id":12,"nickname":"예지"},{"id":13,"nickname":"상연"}]},{"id":23,"block_type":"TodoContainer","content":"할 일을 채워주세요","layer_x":0,"layer_y":0,"assignees":[],"due_date":"2019-12-16","note":"23","is_parent_note":true,"is_done":false,"parent_agenda":null,"assignees_info":[]}]}';

        instance.setState({
            blocks: [
                {
                    block_type: 'TodoContainer',
                    todos: [{ todo: 1 }]
                },
                {
                    block_type: 'Text'
                }
            ]
        });
        websocketComponent.props().onMessage(data);
        expect(spyHandleSocketAgenda).toHaveBeenCalledTimes(0);

        data = '{"children_blocks" : []}';
        websocketComponent.props().onMessage(data);
        expect(spyHandleSocketAgenda).toHaveBeenCalledTimes(0);
        data =
            '{"operation_type": "change_agenda", "updated_agenda":"content"}';
        websocketComponent.props().onMessage(data);
        expect(spyHandleSocketAgenda).toHaveBeenCalledTimes(0);
    });

    it('should hande dnd', () => {
        const spyOnDragEnd = jest.spyOn(instance, 'onDragEnd');
        let result = {
            destination: 1,
            source: {
                index: 0
            }
        };
        agendaInsideComponent.props().onDragEnd(result);
        expect(spyOnDragEnd).toHaveBeenCalledTimes(0);
        result = {
            destination: null,
            source: {
                index: 0
            }
        };
        agendaInsideComponent.props().onDragEnd(result);
        expect(spyOnDragEnd).toHaveBeenCalledTimes(0);
    });

    it('should handle add image block', () => {
        const spyHandleAddImageBlock = jest.spyOn(
            instance,
            'handleAddImageBlock'
        );
        instance.AgendaRef = {
            current: { state: { ws: { send: jest.fn() } } }
        };
        let addImageBlock = component.find('.agenda-add-image-button');
        addImageBlock.simulate('click');
        expect(spyHandleAddImageBlock).toHaveBeenCalledTimes(0);
    });

    it('should handle add todo block', () => {
        const spyHandleAddTodoBlock = jest.spyOn(
            instance,
            'handleAddTodoBlock'
        );
        instance.AgendaRef = {
            current: { state: { ws: { send: jest.fn() } } }
        };
        let addTodoBlock = component.find('.agenda-add-todo-button');
        addTodoBlock.simulate('click');
        expect(spyHandleAddTodoBlock).toHaveBeenCalledTimes(0);
    });

    it('should handle add tag', async () => {
        const spyHandleAddTag = jest.spyOn(instance, 'handleAddTag');
        const stubTagId = 1;
        instance.setState({
            workspaceTags: [
                {
                    id: 1
                },
                {
                    id: 2
                }
            ],
            agendaTags: [
                {
                    id: 1
                }
            ]
        });
        console.log(instance.state);
        axios.patch = jest.fn((url, data) => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200
                };
                resolve(result);
            });
        });
        await instance.handleAddTag(stubTagId);
        expect(spyHandleAddTag).toHaveBeenCalledTimes(1);
        expect(axios.patch).toHaveBeenCalledTimes(0);
        await instance.handleAddTag(2);
        expect(spyHandleAddTag).toHaveBeenCalledTimes(2);
        expect(axios.patch).toHaveBeenCalledTimes(1);
        const e = { key: 1 };
        instance.handleMenuClick(e);
        expect(spyHandleAddTag).toHaveBeenCalledTimes(3);
    });

    it('should handle change agenda title', async () => {
        const spyHandleChangeAgendaTitle = jest.spyOn(
            instance,
            'handleChangeAgendaTitle'
        );
        const mockEvent = { target: { value: ['mockValue'] } };
        agendaInsideComponent.simulate('change', mockEvent);
        expect(spyHandleChangeAgendaTitle).toHaveBeenCalledTimes(0);
        instance.setState({
            typingTimeout: 1,
            typing: true
        });
        axios.patch = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: {}
                };
                resolve(result);
            });
        });
        agendaInsideComponent.simulate('change', mockEvent);
        expect(spyHandleChangeAgendaTitle).toHaveBeenCalledTimes(0);
        expect(instance.state.typing).toBe(true);
    });
});
