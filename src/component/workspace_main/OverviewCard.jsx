import React from 'react';
import { map } from 'lodash';
import { ReactComponent as BulletIcon } from '../../assets/icons/bullet_icon.svg';
import { ReactComponent as CheckIcon } from '../../assets/icons/check_icon.svg';

export const AgendaCard = props => {
    const { type, agendas, todos } = props;

    return (
        <div className="agendaCard-container">
            <div className="agendaCard-title">
                <div className="agendaCard-title__text">
                    {type === 'curr' ? '진행중인 안건' : '완료된 안건'}
                </div>
            </div>
            <div className="agendaCard-subtitle">
                <div className="agendaCard-subtitle__agenda">Agenda</div>
                <div className="agendaCard-subtitle__todo">Relative Todos</div>
            </div>

            <div className="agendaCard-content-container">
                {map(agendas, (agenda, i) => {
                    const relativeTodos = todos.filter(
                        t => t.parent_agenda === agenda.id
                    );
                    console.log('relative Todos :', relativeTodos);
                    return (
                        <div key={i} className="agendaCard-content-element">
                            <div className="agendaCard-content-element__agenda">
                                {type === 'curr' ? (
                                    <BulletIcon className="agendaCard-content-element__agenda-icon default" />
                                ) : (
                                    <CheckIcon className="agendaCard-content-element__agenda-icon" />
                                )}
                                <div className="agendaCard-content-element__agenda-text">
                                    {agenda.content}
                                </div>
                            </div>
                            <div className="agendaCard-content-element__todos">
                                {map(relativeTodos, (todo, j) => (
                                    <div
                                        key={j}
                                        className="agendaCard-content-element__todo">
                                        {`#${todo.id}`}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const TodoCard = props => {
    const { todos } = props;

    return (
        <div className="todoCard-container">
            <div className="todoCard-title">
                <div className="todoCard-title__text">내 할일</div>
            </div>
            <div className="todoCard-subtitle">
                <div className="todoCard-subtitle__todo">Todos</div>
            </div>

            <div className="todoCard-content-container">
                {map(todos, (todo, i) => (
                    <div key={i} className="todoCard-content-element">
                        <div className="todoCard-content-element__todo">
                            {todo.is_done ? (
                                <div className="todoCard-content-element__checkbox-icon done" />
                            ) : (
                                <div className="todoCard-content-element__checkbox-icon" />
                            )}

                            {todo.is_done ? (
                                <div className="todoCard-content-element__todo-text done">
                                    <span>{`#${todo.id}`}</span>
                                    {`${todo.content}`}
                                </div>
                            ) : (
                                <div className="todoCard-content-element__todo-text">
                                    <span>{`#${todo.id}`}</span>
                                    {`${todo.content}`}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const StatisticsCard = props => {
    const { type, currAgendas, doneAgendas, todos, doneTodos } = props;

    return (
        <div className="statisticsCard-container">
            <div className="statisticsCard-container__upper">
                {type === 'agenda' ? (
                    <>
                        <span>전체</span>
                        <span className="highlight">
                            {`${currAgendas.length + doneAgendas.length}`}
                        </span>
                        <span>개의</span>
                        <span className="bold">안건</span>
                        <span>중</span>
                    </>
                ) : (
                    <>
                        <span>전체</span>
                        <span className="highlight">{`${todos.length}`}</span>
                        <span>개의</span>
                        <span className="bold">Todo</span>
                        <span>중</span>
                    </>
                )}
            </div>
            <div className="statisticsCard-container__lower">
                {type === 'agenda' ? (
                    <>
                        <span>현재까지</span>
                        <span className="highlight">{`${doneAgendas.length}`}</span>
                        <span>개</span>
                        <span className="bold">완료</span>
                    </>
                ) : (
                    <>
                        <span>현재까지</span>
                        <span className="highlight">{`${doneTodos.length}`}</span>
                        <span>개</span>
                        <span className="bold">완료</span>
                    </>
                )}
            </div>
        </div>
    );
};
