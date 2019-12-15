import React from 'react';
import { shallow } from 'enzyme';
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
const stubSocketRef = { current: null };
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
                handleDeleteBLock={stubHandleDeleteBlock}
                socketRef={stubSocketRef}
                participants={stubParticipants}
            />
        );
    });

    it('should render without error', () => {
        const component = shallow(agenda);
        let wrapper = component.find('#Agenda-Con');
        expect(wrapper.length).toBe(1);
    });
});
