import React from 'react';
import { shallow, mount } from 'enzyme';
import { NoteCard, AgendaCard, TodoCard } from './OverviewCard';
import axios from 'axios';
import moment from 'moment';

const mockAgendas = [
    {
        children_blocks: '[]',
        content: 'test',
        has_agenda_block: false,
        has_calendar_block: false,
        has_file_block: false,
        has_image_block: false,
        has_table_block: false,
        has_text_block: false,
        has_todo_block: false,
        id: 1,
        is_done: false,
        is_parent_note: true,
        layer_x: 0,
        layer_y: 0,
        note: 1,
        parent_agenda: null,
        tags: []
    }
];
const mockNotes = [
    {
        children_blocks: '[]',
        created_at: '2019-11-11T04:30:42.493000Z',
        id: 1,
        last_modified_at: '2019-11-11T04:30:42.493000Z',
        location: 'test',
        ml_speech_text: null,
        participants: [1],
        tags: [1],
        title: 'test',
        workspace: 1
    }
];
const mockTodos = [
    {
        assignees: [1],
        content: 'test',
        due_date: '2019-12-16',
        id: 1,
        is_done: false,
        is_parent_note: false,
        layer_x: 0,
        layer_y: 0,
        note: 1,
        parent_agenda: null,
        workspace: null
    }
];
const mockTodosDone = [
    {
        assignees: [1],
        content: 'test',
        due_date: '2019-12-16',
        id: 1,
        is_done: true,
        is_parent_note: true,
        layer_x: 0,
        layer_y: 0,
        note: 1,
        parent_agenda: null,
        workspace: null
    }
];

describe('<NoteCard />', () => {
    let component;
    let instance;

    let overviewComponent;
    let overviewInstance;

    let mockHistory = { push: jest.fn(), location: { pathname: 'test' } };
    let mockEvent = { stopPropagation: jest.fn() };

    beforeEach(() => {
        delete window.location;
        window.location = { reload: jest.fn() };
        axios.get = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: {}
                };
                resolve(result);
            });
        });
        axios.post = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 201,
                    data: {}
                };
                resolve(result);
            });
        });

        const handleNoteClick = jest.fn();

        component = shallow(
            <NoteCard
                key={1}
                history={mockHistory}
                note={mockNotes[0]}
                clicked={-1}
                handleNoteClick={handleNoteClick}
            />
        );
        instance = component.instance();
    });
    afterEach(() => {
        jest.clearAllMocks();
        window.location = location;
    });

    it('should render without error', () => {
        let wrapper = component.find('.noteCard-container');
        expect(wrapper.length).toBe(1);
    });
});

describe('<AgendaCard />', () => {
    let component;
    let instance;

    let mockHistory = { push: jest.fn(), location: { pathname: 'test' } };
    let mockEvent = { stopPropagation: jest.fn() };

    beforeEach(() => {
        delete window.location;
        window.location = { reload: jest.fn() };
        axios.get = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: [{ content: 'test' }]
                };
                resolve(result);
            });
        });
        axios.post = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 201,
                    data: {}
                };
                resolve(result);
            });
        });

        component = shallow(
            <AgendaCard
                key={1}
                history={mockHistory}
                agenda={mockNotes[0]}
                clicked={-1}
            />
        );
        instance = component.instance();
    });
    afterEach(() => {
        jest.clearAllMocks();
        window.location = location;
    });

    it('should render without error', () => {
        let wrapper = component.find('.agendaCard-container');
        expect(wrapper.length).toBe(1);
    });
    it('label', () => {
        let wrapper = component.find('.agendaCard-content-label-element');
        expect(wrapper.length).toBe(2);
    });

    it('cdm', async () => {
        await instance.componentDidMount();
        expect(instance.state.text).toEqual('test');
    });
});

describe('<TodoCard />', () => {
    let component;
    let instance;

    let mockHistory = { push: jest.fn(), location: { pathname: 'test' } };
    let mockEvent = { stopPropagation: jest.fn() };

    beforeEach(() => {
        delete window.location;
        window.location = { reload: jest.fn() };
        axios.get = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: {}
                };
                resolve(result);
            });
        });
        axios.post = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 201,
                    data: {}
                };
                resolve(result);
            });
        });

        component = shallow(
            <TodoCard
                key={1}
                history={mockHistory}
                clicked={-1}
                notes={mockNotes}
                todos={mockTodos}
                agendas={mockAgendas}
            />
        );
        instance = component.instance();
    });
    afterEach(() => {
        jest.clearAllMocks();
        window.location = location;
    });

    it('should render without error', () => {
        let wrapper = component.find('.todoCard-container');
        expect(wrapper.length).toBe(1);
    });
    it('should render without error todo content', () => {
        let wrapper = component.find('.todoCard-content-element');
        expect(wrapper.length).toBe(1);
    });

    it('should render without error todo done', () => {
        let wrapper = component.find(
            '.todoCard-content-element__checkbox-icon'
        );
        expect(wrapper.length).toBe(1);
        wrapper = component.find('.todoCard-content-element__todo-text');
        expect(wrapper.length).toBe(1);

        component = shallow(
            <TodoCard
                key={1}
                history={mockHistory}
                clicked={-1}
                notes={mockNotes}
                todos={mockTodosDone}
                agendas={mockAgendas}
            />
        );
        wrapper = component.find(
            '.todoCard-content-element__checkbox-icon.done'
        );
        expect(wrapper.length).toBe(1);
        wrapper = component.find('.todoCard-content-element__todo-text.done');
        expect(wrapper.length).toBe(1);
    });

    it('redirect', () => {
        let wrapper = component.find('.noteCard-title-redirect');
        expect(wrapper.length).toBe(0);

        // wrapper.simulate('click');
        // expect(history.push).toHaveBeenCalledTimes(100);
    });

    it('render due', () => {
        let wrapper = component.find('.todoCard-content-element__due');
        expect(wrapper.text()).toEqual('Dec 16');
    });

    it('render title', () => {
        let wrapper = component.find('.todoCard-title-index');
        expect(wrapper.text()).toEqual('안건 - 0');

        component = shallow(
            <TodoCard
                key={1}
                history={mockHistory}
                clicked={-1}
                notes={mockNotes}
                todos={mockTodosDone}
                agendas={mockAgendas}
            />
        );
        wrapper = component.find('.todoCard-title-index');
        expect(wrapper.text()).toEqual('회의록 - test');
    });
});
