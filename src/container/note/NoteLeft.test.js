import React from 'react';
import { shallow } from 'enzyme';
import NoteLeft from './NoteLeft';
import axios from 'axios';

jest.mock('../../component/note_left/NoteLeftInfo', () =>
    jest.fn(props => mockComponent(props, 'spyNoteLeftInfo'))
);

jest.mock('../../component/note_left/NoteLeftBlock', () =>
    jest.fn(props => mockComponent(props, 'spyNoteLeftBlock'))
);
const mockHandleAddTag = jest.fn();
const mockWorkspaceId = 1;
const mockWorkspaceTags = [1, 2];
const mockNoteTags = [1];
const mockHandleDeleteBlock = jest.fn();
const mockNoteTitle = 'TEST_TITLE';
const mockMeetingDate = '2019/12/16';
const mockParticipants = [1, 2, 3];
const mockNoteId = 1;
const mockMoment = null;
const mockLocation = '서울대';
const mockBlocks = [];
const mockHandleClickBlock = jest.fn();
const mockHandleChangeTitle = jest.fn();
const mockHandleChangeDatetime = jest.fn();
const mockHandleChangeLocation = jest.fn();
const mockHandleAddAgendaBlock = jest.fn();
const mockHandleAddTextBlock = jest.fn();
const mockHandleAddTodoBlock = jest.fn();
const mockHandleAddImageBlock = jest.fn();
const mockHandleAddCalendarBlock = jest.fn();
const mockHandleAddParticipants = jest.fn();
const mockHandleAddTextSocketSend = jest.fn();
const mockOnDragEnd = jest.fn();
const mokcHandleDeleteTodo = jest.fn();
const mockSocketRef = { current: null };

const props = {
    handleAddTag: mockHandleAddTag,
    workspaceId: mockWorkspaceId,
    workspaceTags: mockWorkspaceTags,
    noteTags: mockNoteTags,
    handleDeleteBlock: mockHandleDeleteBlock,
    note_title: mockNoteTitle,
    meeting_date: mockMeetingDate,
    participants: mockParticipants,
    noteId: mockNoteId,
    moment: mockMoment,
    location: mockLocation,
    blocks: mockBlocks,
    handleClickBlock: mockHandleClickBlock,
    handleChangeTitle: mockHandleChangeTitle,
    handleChangeDatetime: mockHandleChangeDatetime,
    handleChangeLocation: mockHandleChangeLocation,
    handleAddAgendaBlock: mockHandleAddAgendaBlock,
    handleAddTextBlock: mockHandleAddTextBlock,
    handleAddTodoBlock: mockHandleAddTodoBlock,
    handleAddImageBlock: mockHandleAddImageBlock,
    handleAddCalendarBlock: mockHandleAddCalendarBlock,
    handleAddParticipant: mockHandleAddParticipants,
    handleAddTextSocketSend: mockHandleAddTextSocketSend,
    onDragEnd: mockOnDragEnd,
    handleDeleteTodo: mokcHandleDeleteTodo,
    socketRef: mockSocketRef
};

describe('<NoteLeft />', () => {
    it('should render without error', () => {
        const component = shallow(<NoteLeft {...props} />);
        let wrapper = component.find('.Note-left');
        expect(wrapper.length).toBe(1);
    });
});
