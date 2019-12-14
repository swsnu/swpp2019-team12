import React from 'react';

import { Label, SubLabel } from './Label';
import { NoteCard, TodoCard } from './OverviewCard';
import { map } from 'lodash';

const Overview = props => {
    const { notes, agendas, todos } = props;

    const numberOfNotes = notes.length;
    const numberOfAgendas = agendas.length;
    const numberOfTodos = todos.length;

    return (
        <div className="Overview-container">
            <SubLabel title="Meeting Overview" />
            <Label title="회의 진행 상황" />

            <div className="Overview-section-divider">
                <div className="Overview-section-note">
                    <div className="Overview-section-note-bg">
                        <div className="Overview-section-note__label">
                            회의록
                        </div>
                        <div>{numberOfNotes}</div>
                    </div>
                </div>
                <div className="Overview-section-agenda">
                    <div className="Overview-section-agenda-bg">
                        <div className="Overview-section-agenda__label">
                            안건
                        </div>
                        <div>{numberOfAgendas}</div>
                    </div>
                </div>
                <div className="Overview-section-todo">
                    <div className="Overview-section-todo-bg">
                        <div className="Overview-section-todo__label">할일</div>
                        <div>{numberOfTodos}</div>
                    </div>
                </div>
            </div>

            <div className="Overview-cards">
                {notes.length ? (
                    <div className="Overview-note-cards">
                        {map(notes, (note, i) => (
                            <NoteCard note={note} key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="Overview-note-cards"></div>
                )}
                {/* <TodoCard todos={todos} /> */}
            </div>
        </div>
    );
};

export default Overview;
