import React from 'react';
import { map } from 'lodash';
import { Label, SubLabel } from './Label';

import { ReactComponent as NoteIcon } from '../../assets/icons/note_icon.svg';

const MeetingNoteOverview = props => {
    const { notes, history } = props;
    return (
        <div className="meetingNoteOverview-container">
            <SubLabel title="Meeting Note Overview" />
            <Label title="회의 진행 상황 " />

            <div className="meetingNoteOverview-content">
                {map(notes, (note, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            history.push(`/note/${note.id}/`);
                            window.location.reload();
                        }}
                        className="meetingNoteOverview-content__element">
                        <NoteIcon className="meetingNoteOverview-content__img" />
                        <div className="meetingNoteOverview-content__date">
                            {note.created_at
                                .split('T')[0]
                                .substring(2)
                                .replace(/-/g, '.')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MeetingNoteOverview;
