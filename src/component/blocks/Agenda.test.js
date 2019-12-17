import React from 'react';
import { shallow, mount } from 'enzyme';
import Agenda from './Agenda';
import axios from 'axios';

function mockComponent(props, className) {
    return <div className={className}>{props.title}</div>;
}

const stubWorkspaceTags = [1, 2];
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
        const component = shallow(agenda);
        let wrapper = component.find('#Agenda-Container');
        expect(wrapper.length).toBe(1);
    });

    it('ComponentDidMount', () => {
        const component = shallow(agenda);
        const instance = component.instance();
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
        JSON.parse = jest.fn(data => {
            return 'PARSED_DATA';
        });
        const component = shallow(agenda);
        const instance = component.instance();
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
        const component = shallow(agenda);
        const instance = component.instance();
        instance.handleClickDelete();

        expect(stubHandleDeleteBlock).toHaveBeenCalledTimes(1);
        expect(stubHandleDeleteBlock).toHaveBeenCalledWith(
            '/api/agenda/1/',
            'Agenda',
            1
        );
    });

    it('handleAddTextBlock ', () => {
        JSON.stringify = jest.fn(data => {
            return 'DATA';
        });
        const text_info = {
            a_id: 1,
            n_id: 1,
            content: '어젠다 속 새로운 텍스트 블록',
            layer_x: 0,
            layer_y: 0,
            document_id: 1004,
            block_type: 'Text'
        };

        const JSON_data = {
            operation_type: 'add_block',
            block: text_info
        };

        const component = shallow(agenda);
        const instance = component.instance();
        instance.handleDocIdInUrl = jest.fn(() => {
            return 1004;
        });
        instance.AgendaRef = {
            current: { state: { ws: { send: jest.fn() } } }
        };
        instance.forceUpdate();
        instance.handleAddTextBlock();

        expect(JSON.stringify).toHaveBeenCalledTimes(1);
        expect(JSON.stringify).toHaveBeenCalledWith(JSON_data);
        expect(instance.AgendaRef.current.state.ws.send).toHaveBeenCalledWith(
            'DATA'
        );
    });

    it('handleAddImageBlock ', () => {
        const component = shallow(agenda);

        const instance = component.instance();
        instance.handleAddImageBlock = jest.fn();
        instance.forceUpdate();
        let wrapper = component.find('.agenda-add-image-button');
        wrapper.simulate('click');
        expect(instance.handleAddImageBlock).toHaveBeenCalledTimes(1);
    });

    it('handleChangeAgendaTitle ', () => {
        const component = shallow(agenda);
        const title = 'TEST_TITLE';

        let wrapper = component.find('.agenda-title-input');
        wrapper.simulate('change', { target: { value: title } });
        const instance = component.instance();
        expect(instance.state.current_title).toEqual('TEST_TITLE');
        expect(instance.state.typing).toEqual(false);
    });

    it('handleAddTodoBlock ', () => {
        const component = shallow(agenda);
        const instance = component.instance();
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
        const component = mount(agenda);
        const instance = component.instance();
        instance.handleDeleteBlockInAgenda = jest.fn();
        instance.forceUpdate();
        let wrapper = component.find('.AgendaInside');
        await wrapper
            .props()
            .handleDeleteBlock(axios_path, block_type, block_id);

        expect(wrapper.length).toBe(1);
        expect(instance.handleDeleteBlockInAgenda).toHaveBeenCalledTimes(0);
        expect(axios.delete).toHaveBeenCalledTimes(1);
        expect(axios.patch).toHaveBeenCalledTimes(1);
    });

    it('handleDeleteTodo ', () => {
        const deleted = {
            id: 1
        };

        const component = mount(agenda);
        const instance = component.instance();
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
});
