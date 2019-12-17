import React from 'react';
import { shallow, mount } from 'enzyme';
import Workspace from './Workspace';
import CreateModal from './CreateModal';
import axios from 'axios';

import WorkspaceInfo from '../../component/workspace_leftbar/WorkspaceInfo';
import CreateNote from '../../component/workspace_leftbar/CreateNote';

const mockAdmins = [{ id: 1, nickname: 'test', user: 1 }];
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
        note: 28,
        parent_agenda: null,
        tags: []
    }
];
const mockMembers = [{ id: 1, nickname: 'test', user: 1 }];
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
const mockWorkspace = {
    admins: [1],
    id: 1,
    members: [1],
    name: 'test'
};
const mockWorkspaces = [
    {
        admins: [1],
        id: 1,
        members: [1],
        name: 'test'
    }
];

describe('<CreateModal />', () => {
    let component;
    let instance;

    let workspaceComponent;
    let workspaceInstance;

    let mockHistory = { push: jest.fn(), location: { pathname: 'test' } };
    let mockEvent = { stopPropagation: jest.fn() };

    beforeEach(() => {
        axios.get = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: {
                        workspaces: mockWorkspaces,
                        workspace: mockWorkspace,
                        admins: mockAdmins,
                        members: mockMembers,
                        agendas: mockAgendas,
                        notes: mockNotes,
                        todos: mockTodos
                    }
                };
                resolve(result);
            });
        });

        workspaceComponent = shallow(<Workspace history={mockHistory} />);
        workspaceComponent.setState({
            workspaces: [],
            workspace: {},
            admins: [],
            members: [],
            agendas: [],
            notes: [],
            todos: [],

            showCreateNoteModal: false,
            showCreateWorkspaceModal: false
        });
        workspaceComponent.update();
        workspaceInstance = workspaceComponent.instance();

        axios.get = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: {
                        addedMember: [{ id: 1, username: 'test' }],
                        addedAdmin: [{ id: 1, username: 'test' }]
                    }
                };
                resolve(result);
            });
        });
        component = shallow(
            <CreateModal
                history={mockHistory}
                workspaceId={mockWorkspace.id}
                handleCloseCreateNoteModal={
                    workspaceInstance.handleCloseCreateWorkspaceModal
                }
            />
        );
        instance = component.instance();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without error', () => {
        let wrapper = component.find('.createModal');
        expect(wrapper.length).toBe(1);
    });
    it('createModal click stopPropagation', () => {
        let wrapper = component.find('.createModal');

        wrapper.simulate('click', mockEvent);
        expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
    });

    /*
    it('render label', () => {
        component = shallow(<CreateModal history={mockHistory} />);

        let labelWrapper = component.find('.createModal-label');
        expect(labelWrapper.length).toBe(1);
    });
    */
});
