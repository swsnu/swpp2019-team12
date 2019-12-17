import React from 'react';
import { shallow } from 'enzyme';
import Workspace from './Workspace';
import axios from 'axios';

import WorkspaceInfo from '../../component/workspace_leftbar/WorkspaceInfo';
import CreateNote from '../../component/workspace_leftbar/CreateNote';

import CreateNoteModal from '../note/CreateModal';
import CreateWorkspaceModal from './CreateModal';

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

describe('<Workspace/>', () => {
    let component;
    let instance;
    let mockHistory = { push: jest.fn(), location: { pathname: 'test' } };

    beforeEach(() => {
        component = shallow(<Workspace history={mockHistory} />);
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

        component.setState({
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
        component.update();

        instance = component.instance();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without error', () => {
        let wrapper = component.find('.workspace');
        expect(wrapper.length).toBe(1);
    });

    it('session test - logged out', () => {
        instance.componentDidMount();
        expect(mockHistory.push).toHaveBeenCalledTimes(1);
    });
    it('session test - logged in', () => {
        sessionStorage.setItem('LoggedInUserNickname', 'test');
        instance.componentDidMount();
        expect(mockHistory.push).toHaveBeenCalledTimes(0);
        sessionStorage.clear();
    });

    it('after component did mount', async () => {
        await instance.componentDidMount();

        const expected = {
            workspaces: mockWorkspaces,
            workspace: mockWorkspace,
            admins: mockAdmins,
            members: mockMembers,
            agendas: mockAgendas,
            notes: mockNotes,
            todos: mockTodos,
            showCreateNoteModal: false,
            showCreateWorkspaceModal: false
        };
        expect(instance.state).toEqual(expected);
    });

    it('should render without error when showCreateNoteModal true', () => {
        component.setState({ showCreateNoteModal: true });

        let wrapper_true = component.find('.overlay');
        expect(wrapper_true.length).toBe(1);

        component.setState({ showCreateNoteModal: false });

        let wrapper_false = component.find('.overlay');
        expect(wrapper_false.length).toBe(0);
    });

    it('should render without error when showCreateWorkspaceModal true', () => {
        component.setState({ showCreateWorkspaceModal: true });

        let wrapper_true = component.find('.overlay');
        expect(wrapper_true.length).toBe(1);

        component.setState({ showCreateWorkspaceModal: false });

        let wrapper_false = component.find('.overlay');
        expect(wrapper_false.length).toBe(0);
    });

    it('handleShowCreateWorkspaceModal', async () => {
        instance.componentDidMount();

        const { workspace, workspaces } = instance.state;
        const handleShowCreateWorkspaceModal =
            instance.handleShowCreateWorkspaceModal;

        const _wrapper = shallow(
            <WorkspaceInfo
                history={mockHistory}
                workspace={workspace}
                workspaces={workspaces}
                handleShowCreateWorkspaceModal={handleShowCreateWorkspaceModal}
            />
        );

        _wrapper
            .find('.workspaceInfo__workspaceCreateButton > button')
            .simulate('click');

        expect(instance.state.showCreateWorkspaceModal).toEqual(true);
    });

    it('handleShowCreateNoteModal', async () => {
        instance.componentDidMount();

        const handleShowCreateNoteModal = instance.handleShowCreateNoteModal;

        const _wrapper = shallow(
            <CreateNote handleShowCreateNoteModal={handleShowCreateNoteModal} />
        );

        _wrapper
            .find('.createNote__createNoteButton > button')
            .simulate('click');

        expect(instance.state.showCreateNoteModal).toEqual(true);
    });

    it('handleCancelCreateWorkspaceModal', async () => {
        instance.componentDidMount();
        instance.setState({ showCreateWorkspaceModal: true });
        component.update();

        component.find('.overlay').simulate('click');

        expect(instance.state.showCreateWorkspaceModal).toEqual(false);
    });

    it('handleCloseCreateNoteModal', async () => {
        instance.componentDidMount();
        instance.setState({ showCreateNoteModal: true });
        component.update();

        component.find('.overlay').simulate('click');

        expect(instance.state.showCreateWorkspaceModal).toEqual(false);
    });
});
