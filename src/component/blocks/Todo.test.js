import React from 'react';
import { shallow, mount } from 'enzyme';
import Todo from './Todo';
import axios from 'axios';

const mockTodo = {
    id: 60,
    block_type: 'TodoContainer',
    content: '할 일을 채워주세요',
    layer_x: 0,
    layer_y: 0,
    due_date: '2019-12-18',
    is_parent_note: false,
    parent_agenda: 50,
    assignees: [],
    is_done: false,
    assignees_info: [
        { id: 1, nickname: 'TEST' },
        { id: 2, nickname: 'TEST2' }
    ]
};
const mockNoteId = 1;
const mockHandleDeleteTodo = jest.fn();
const mockParticipants = [1, 2];
const mockSocketRef = { current: { state: { ws: { send: jest.fn() } } } };
const mock_is_parent_note = true;

describe('<Todo />', () => {
    let component;
    beforeEach(() => {
        component = shallow(
            <Todo
                key={60}
                todo={mockTodo}
                noteId={mockNoteId}
                participants={mockParticipants}
                handleDeleteTodo={mockHandleDeleteTodo}
                socketRef={mockSocketRef}
                is_parent_note={mock_is_parent_note}
            />
        );
        axios.patch = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: {}
                };
                resolve(result);
            });
        });

        axios.delete = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: {}
                };
                resolve(result);
            });
        });

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

    it('should render without errors', () => {
        const wrapper = component.find('#Todo');
        expect(wrapper.length).toBe(1);
    });

    it('ComponentDidMount when is_parent_note is true', async () => {
        const instance = component.instance();
        instance.componentDidMount();
        expect(instance.state.assignees).toBe(mockTodo.assignees_info);
        expect(instance.state.todo).toEqual(mockTodo);
        expect(instance.state.content).toEqual(mockTodo.content);
        expect(instance.state.APIPath).toEqual('/api/note/1/childrenblocks/');
    });

    it('ComponentDidMount when is_parent_note is false', async () => {
        component = shallow(
            <Todo
                key={60}
                todo={mockTodo}
                noteId={mockNoteId}
                participants={mockParticipants}
                handleDelteTodo={mockHandleDeleteTodo}
                socketRef={mockSocketRef}
                is_parent_note={false}
            />
        );

        const instance = component.instance();
        instance.componentDidMount();
        expect(instance.state.assignees).toEqual([
            { id: 1, nickname: 'TEST' },
            { id: 2, nickname: 'TEST2' }
        ]);
        expect(instance.state.todo).toEqual(mockTodo);
        expect(instance.state.content).toEqual(mockTodo.content);
        expect(instance.state.APIPath).toEqual(
            '/api/agenda/50/childrenblocks/'
        );
    });

    it('handleDeleteTodo', () => {
        let wrapper = component.find('#todo-delete-id');
        wrapper.simulate('click');
        expect(axios.delete).toHaveBeenCalledTimes(1);
        expect(mockHandleDeleteTodo).toHaveBeenCalledTimes(0);
    });

    it('handleFocus when is_done is false', async () => {
        const instance = component.instance();
        instance.setState({ todo: mockTodo });
        instance.inputRef = {
            current: { focus: jest.fn() }
        };
        instance.forceUpdate();

        let wrapper = component.find('#Todo').at(0);
        wrapper.simulate('click');
        expect(instance.inputRef.current.focus).toHaveBeenCalledTimes(1);
    });

    it('handleFocus when is_done is true', () => {
        let mockTodo = {
            id: 60,
            block_type: 'TodoContainer',
            content: '할 일을 채워주세요',
            layer_x: 0,
            layer_y: 0,
            due_date: '2019-12-18',
            is_parent_note: false,
            parent_agenda: 50,
            assignees: [],
            is_done: true,
            assignees_info: []
        };
        component = shallow(
            <Todo
                key={60}
                todo={mockTodo}
                noteId={mockNoteId}
                participants={mockParticipants}
                handleDeleteTodo={mockHandleDeleteTodo}
                socketRef={mockSocketRef}
                is_parent_note={mock_is_parent_note}
            />
        );
        const instance = component.instance();
        instance.inputRef = {
            current: { focus: jest.fn() }
        };
        instance.forceUpdate();
        let wrapper = component.find('#Todo').at(0);
        wrapper.simulate('click');
        expect(instance.inputRef.current.focus).toHaveBeenCalledTimes(0);
    });

    it('handleChangeTodo', async () => {
        jest.useFakeTimers();
        const title = 'TEST_TITLE';
        const instance = component.instance();
        await instance.componentDidMount();
        let wrapper = component.find(
            '.todoCard-content-element__todo-text-content'
        );
        wrapper.simulate('change', { target: { value: title } });
        expect(instance.state.content).toEqual('TEST_TITLE');
        expect(instance.state.typing).toEqual(false);
    });

    it('handleChangeTodo When timeout', async () => {
        const instance = component.instance();
        jest.useFakeTimers();
        await instance.setState({ typingTimeout: 1000 });

        const title = 'TEST_TITLE';
        await instance.componentDidMount();
        let wrapper = component.find(
            '.todoCard-content-element__todo-text-content'
        );
        wrapper.simulate('change', { target: { value: title } });
        expect(instance.state.content).toEqual('TEST_TITLE');
        expect(instance.state.typing).toEqual(false);
        expect(clearTimeout).toHaveBeenCalledTimes(1);
    });

    it('handleChangeStatus', async () => {
        const instance = component.instance();
        instance.setState({ todo: mockTodo });
        let wrapper = component.find(
            '.todoCard-content-element__checkbox-icon'
        );
        wrapper.simulate('click');
        expect(axios.patch).toHaveBeenCalledTimes(1);
    });

    it('handleDeleteAssignee ', () => {
        const instance = component.instance();
        let wrapper = component
            .find('.todoCard-content-element__todo-assignee')
            .at(0);
        wrapper.simulate('click');
        expect(instance.state.assignees).toEqual([
            { id: 2, nickname: 'TEST2' }
        ]);
    });

    it('handleSelectAssignee ', () => {
        const instance = component.instance();
        let wrapper = component
            .find('.todoCard-content-element__todo-assignee')
            .at(0);
        wrapper.simulate('click');
        expect(instance.state.assignees).toEqual([
            { id: 2, nickname: 'TEST2' }
        ]);
    });
});
