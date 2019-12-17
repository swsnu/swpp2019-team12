import React from 'react';
import { shallow, mount } from 'enzyme';
import Overview from './Overview';
import { NoteCard } from './OverviewCard';
import axios from 'axios';

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

describe('<Overview />', () => {
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
            <Overview
                history={mockHistory}
                notes={mockNotes}
                agendas={mockAgendas}
                todos={mockTodos}
            />
        );
        instance = component.instance();
    });
    afterEach(() => {
        jest.clearAllMocks();
        window.location = location;
    });

    it('should render without error', () => {
        let wrapper = component.find('.Overview-container');
        expect(wrapper.length).toBe(1);
    });

    it('empty', () => {
        let wrapper_empty;
        let wrapper;

        wrapper_empty = component.find('.Overview-cards__empty');
        wrapper = component.find('.Overview-cards');
        expect(wrapper_empty.length).toBe(0);
        expect(wrapper.length).toBe(1);

        component = shallow(
            <Overview
                history={mockHistory}
                notes={[]}
                agendas={mockAgendas}
                todos={mockTodos}
            />
        );

        wrapper_empty = component.find('.Overview-cards__empty');
        wrapper = component.find('.Overview-cards');
        expect(wrapper_empty.length).toBe(1);
        expect(wrapper.length).toBe(0);
    });
    it('non-empty', () => {
        let wrapper_empty;
        let wrapper;

        wrapper_empty = component.find('.Overview-cards__empty');
        wrapper = component.find('.Overview-cards');
        expect(wrapper_empty.length).toBe(0);
        expect(wrapper.length).toBe(1);

        component.setState({
            agendaInNote: mockAgendas,
            todoInNote: mockTodos
        });
        component.update();

        wrapper = component.find('.Overview-agenda-cards');
        expect(wrapper.length).toBe(1);
        wrapper = component.find('AgendaCard');
        expect(wrapper.length).toBe(1);
        wrapper = component.find('.Overview-todo-cards');
        expect(wrapper.length).toBe(1);
        wrapper = component.find('TodoCard');
        expect(wrapper.length).toBe(1);

        component.setState({
            agendaInNote: [],
            todoInNote: []
        });
        component.update();

        let wrapper_header;
        let wrapper_content;
        wrapper_header = component.find('Overview-cards__empty-header');
        wrapper_content = component.find('Overview-cards__empty-content');
        expect(wrapper_header.length).toBe(0);
        expect(wrapper_content.length).toBe(0);
    });

    it('handleNoteClick', async () => {
        const noteCard = shallow(
            <NoteCard
                note={mockNotes[0]}
                key={0}
                handleNoteClick={instance.handleNoteClick}
                clicked={-1}
                history={mockHistory}
            />
        );
        let wrapper = noteCard.find('.noteCard-content-container');
        expect(wrapper.length).toBe(1);

        await wrapper.simulate('click');

        expect(instance.state).toEqual({
            agendaInNote: mockAgendas,
            clicked: 1,
            todoInNote: []
        });

        component.setState({
            clicked: 1
        });
        component.update();
        await wrapper.simulate('click');

        expect(instance.state).toEqual({
            agendaInNote: [],
            clicked: -1,
            todoInNote: []
        });
    });
});
