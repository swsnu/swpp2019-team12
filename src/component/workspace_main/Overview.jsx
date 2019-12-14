import React, { Component } from 'react';

import { Label, SubLabel } from './Label';
import { NoteCard, TodoCard } from './OverviewCard';
import { map } from 'lodash';

class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            agendas: [],
            todos: [],

            noteLength: 0,
            agendaLength: 0,
            todoLength: 0
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            nextProps.notes !== prevState.notes ||
            nextProps.agendas !== prevState.agendas ||
            nextProps.todos !== prevState.todos
        ) {
            return { ...nextProps, noteLength: nextProps.notes.length };
        } else {
            noteLength = nextProps.notes.length;
            agendaLength = nextProps.agendas.length;
            todoLength = nextProps.todos.length;

            return {
                ...nextProps,
                noteLength,
                agendaLength,
                todoLength
            };
        }
    }
    handleNoteClick = () => {};

    render() {
        const {
            notes,
            agendas,
            todos,
            noteLength,
            agendaLength,
            todoLength
        } = this.state;
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
                            <div>{noteLength}</div>
                        </div>
                    </div>
                    <div className="Overview-section-agenda">
                        <div className="Overview-section-agenda-bg">
                            <div className="Overview-section-agenda__label">
                                안건
                            </div>
                            <div>{agendaLength}</div>
                        </div>
                    </div>
                    <div className="Overview-section-todo">
                        <div className="Overview-section-todo-bg">
                            <div className="Overview-section-todo__label">
                                할일
                            </div>
                            <div>{todoLength}</div>
                        </div>
                    </div>
                </div>

                {noteLength ? (
                    <div className="Overview-cards">
                        <div className="Overview-note-cards">
                            {map(notes, (note, i) => (
                                <NoteCard note={note} key={i} />
                            ))}
                        </div>

                        <div
                            className={`Overview-agenda-cards ${
                                agendaLength ? '' : '--empty'
                            }`}>
                            {agendaLength ? (
                                <div></div>
                            ) : (
                                <>
                                    <div className="Overview-cards__empty-header">
                                        회의록을 선택해보세요 :)
                                    </div>
                                    <div className="Overview-cards__empty-content">
                                        선택한 회의에서 논의되었던
                                        <br />
                                        안건들을 간략하게 보여드립니다
                                    </div>
                                </>
                            )}
                        </div>

                        <div
                            className={`Overview-todo-cards ${
                                todoLength ? '' : '--empty'
                            }`}>
                            {todoLength ? (
                                <div></div>
                            ) : (
                                <>
                                    <div className="Overview-cards__empty-header">
                                        생성된 할 일 목록이 없습니다 :(
                                    </div>
                                    <div className="Overview-cards__empty-content">
                                        회의록에서 할 일 블록을 만들어보세요
                                        <br />할 일들을 간략하게 보여드립니다
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="Overview-cards__empty">
                        <div className="Overview-cards__empty-header">
                            {'아직 진행된 회의가 없습니다 :('}
                        </div>
                        <div className="Overview-cards__empty-content">
                            어서빨리 회의를 진행하셨으면 좋겠네요ㅠㅠ
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Overview;
