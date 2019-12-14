import React from 'react';
import { map } from 'lodash';
import moment from 'moment';
import { ReactComponent as RedirectIcon } from '../../assets/icons/redirect_icon.svg';
import { ReactComponent as BulletIcon } from '../../assets/icons/bullet_icon.svg';
import { ReactComponent as CheckIcon } from '../../assets/icons/check_icon.svg';

/*
0:
created_at: "2019-11-01T05:21:58Z"
id: 5
last_modified_at: "2019-11-02T05:21:58Z"
location: "서울대학교 301동 S-Lab"
ml_speech_text: ""
participants: (4) [1, 2, 3, 4]
tags: []
title: "Sprint#3 Bakclog 회의록"
workspace: 1
__proto__: Object
1: {id: 6, title: "Demo 작전회의", location: "서울대학교 서울대 공동연구소", created_at: "2019-11-05T00:00:00Z", last_modified_at: "2019-11-05T05:24:16Z", …}
2: {id: 8, title: "NOTE", location: "302-4XX", created_at: "2019-11-06T08:39:59.870000Z", last_modified_at: "2019-11-06T08:39:59.870000Z", …}
3: {id: 10, title: "Test3!@@", location: "ADDDasdfasf", created_at: "2019-12-08T17:22:51.266000Z", last_modified_at: "2019-12-04T17:22:51.266000Z", …}
4: {id: 15, title: "asdf", location: "", created_at: "20
*/
const dummyLabels = [
    { color: '#4A90E2', text: 'SWPP' },
    { color: '#FFCA00', text: 'Demo' }
];
export const NoteCard = props => {
    const { note, handleNoteClick, clicked, history } = props;
    const date = moment(note.created_at).format('YYYY-MM-DD HH:MM');

    return (
        <div
            className={`noteCard-container ${
                clicked === note.id ? '--clicked' : ''
            }`}>
            <div className="noteCard-title-container">
                <div className="noteCard-title-index">
                    <div>{`#${note.id}`}</div>
                </div>
                <div
                    className="noteCard-title-text"
                    onClick={() => handleNoteClick(note)}>
                    <div>{note.title}</div>
                </div>
                <div className="noteCard-title-redirect">
                    <RedirectIcon
                        onClick={() => history.push(`/note/${note.id}`)}
                    />
                </div>
            </div>
            <div
                className="noteCard-content-container"
                onClick={() => handleNoteClick(note)}>
                <div className="noteCard-content-date">
                    <div className="noteCard-content-date__label">날짜</div>
                    <div className="noteCard-content-date__data">{date}</div>
                </div>
                <div className="noteCard-content-location">
                    <div className="noteCard-content-location__label">장소</div>
                    <div className="noteCard-content-location__data">
                        {note.location || '설정된 장소가 없습니다'}
                    </div>
                </div>
                <div className="noteCard-content-participant">
                    <div className="noteCard-content-participant__label">
                        참여 인원
                    </div>
                    <div className="noteCard-content-participant__data">
                        {note.participants.length}
                    </div>
                </div>
            </div>
            <div className="noteCard-content-label">
                {map(dummyLabels, (label, i) => (
                    <div
                        className="noteCard-content-label-element"
                        key={i}
                        style={{ backgroundColor: label.color }}>
                        {label.text}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const AgendaCard = props => {
    const { agenda } = props;

    return (
        <div className="agendaCard-container">
            <div className="noteCard-title-container">
                <div className="noteCard-title-index">
                    <div>{agenda.id}</div>
                </div>
                <div className="noteCard-title-text">
                    <div>{agenda.title}</div>
                </div>
                <div className="noteCard-title-redirect">
                    <RedirectIcon />
                </div>
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
