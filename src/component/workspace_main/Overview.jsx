import React, { Component } from 'react';

import { Label, SubLabel } from './Label';
import { NoteCard, TodoCard, AgendaCard } from './OverviewCard';
import { map } from 'lodash';

class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agendaInNote: [],
            todoInNote: [],
            clicked: -1
        };
    }

    /*
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
    */

    handleNoteClick = note => {
        const { agendas, todos } = this.props;
        const id = note.id;

        const agendaInNote = agendas.filter(agenda => agenda.note === id);
        const todoInNote = todos.filter(todo => todo.note === id);

        this.setState({
            agendaInNote: this.state.clicked !== -1 ? [] : agendaInNote,
            todoInNote: this.state.clicked !== -1 ? [] : todoInNote,
            clicked: this.state.clicked !== -1 ? -1 : id
        });
    };

    render() {
        const { notes, agendas, todos, history } = this.props;
        const { agendaInNote, todoInNote, clicked } = this.state;
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
                            <div>{notes.length}</div>
                        </div>
                    </div>
                    <div className="Overview-section-agenda">
                        <div className="Overview-section-agenda-bg">
                            <div className="Overview-section-agenda__label">
                                안건
                            </div>
                            <div>{agendaInNote.length}</div>
                        </div>
                    </div>
                    <div className="Overview-section-todo">
                        <div className="Overview-section-todo-bg">
                            <div className="Overview-section-todo__label">
                                할일
                            </div>
                            <div>{todoInNote.length}</div>
                        </div>
                    </div>
                </div>

                {notes.length ? (
                    <div className="Overview-cards">
                        <div className="Overview-note-cards">
                            {map(notes, (note, i) => (
                                <NoteCard
                                    note={note}
                                    key={i}
                                    handleNoteClick={this.handleNoteClick}
                                    clicked={clicked}
                                    history={history}
                                />
                            ))}
                        </div>

                        <div
                            className={`Overview-agenda-cards ${
                                agendaInNote.length ? '' : '--empty'
                            }`}>
                            {agendaInNote.length ? (
                                map(agendaInNote, (agenda, i) => (
                                    <AgendaCard
                                        agenda={agenda}
                                        key={i}
                                        clicked={clicked}
                                        history={history}
                                    />
                                ))
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
                                todoInNote.length ? '' : '--empty'
                            }`}>
                            {todoInNote.length ? (
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
