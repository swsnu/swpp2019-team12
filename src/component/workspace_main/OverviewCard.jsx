import React, { Component } from 'react';
import { map } from 'lodash';
import moment from 'moment';
import { ReactComponent as RedirectIcon } from '../../assets/icons/redirect_icon.svg';
import axios from 'axios';

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
            }
            noteCard-conatiner-${note.id}`}>
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
                        인원
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

export class AgendaCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };
    }
    componentDidMount() {
        const { agenda } = this.props;

        axios.get(`/api/agenda/${agenda.id}/textblocks/`).then(res => {
            const text = res.data[0].content.replace(/<[^>]*>/gm, '');
            this.setState({ text });
        });
    }

    renderBlocks = () => {
        const { agenda } = this.props;
        const blocks = [
            { label: 'text', value: agenda.has_text_block },
            { label: 'image', value: agenda.has_image_block },
            { label: 'calendar', value: agenda.has_calendar_block },
            { label: 'todo', value: agenda.has_todo_block }
        ];

        return map(blocks, (block, i) => (
            <div
                className={`agendaCard-content-blocks__element ${
                    block.value ? '--has' : ''
                }`}
                key={i}>
                {block.label.toUpperCase()}
            </div>
        ));
    };

    render() {
        const { agenda, clicked, history } = this.props;
        const { text } = this.state;
        return (
            <div
                className={`agendaCard-container ${
                    clicked === agenda.note ? '--clicked' : ''
                }
                agendaCard-container-${agenda.id}
                `}>
                <div className="agendaCard-title-container">
                    <div className="agendaCard-title-index">
                        <div>{`#${agenda.id}`}</div>
                    </div>
                    <div className="agendaCard-title-text">
                        <div>{agenda.content}</div>
                    </div>
                    <div className="agendaCard-title-redirect">
                        <RedirectIcon
                            onClick={() => history.push(`/note/${agenda.note}`)}
                        />
                    </div>
                </div>
                <div className="agendaCard-content-container">
                    <div
                        className={`agendaCard-content-text ${
                            text ? '' : '--not'
                        }`}>
                        {text ? text : '생성된 텍스트 블록이 없습니다 :('}
                    </div>
                    <div className="agendaCard-content-blocks">
                        {this.renderBlocks()}
                    </div>
                </div>
                <div className="agendaCard-content-label">
                    {map(dummyLabels, (label, i) => (
                        <div
                            className="agendaCard-content-label-element"
                            key={i}
                            style={{ backgroundColor: label.color }}>
                            {label.text}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export const TodoCard = props => {
    const { notes, agendas, todos, clicked, history } = props;
    console.log(todos, notes, agendas);

    const renderTitle = () => {
        // const { notes, agendas, todos } = props;
        const { is_parent_note } = todos[0];

        let text;
        if (is_parent_note) {
            text = notes.filter(note => note.id === todos[0].note)[0].title;
            return `회의록 - ${text}`;
        } else {
            text = agendas.filter(
                agenda => agenda.id === todos[0].parent_agenda
            );
            text = text.length && text[0].content;
            return `안건 - ${text}`;
        }
    };
    const renderDue = due => moment(due).format('MMM DD');

    return (
        <div className={`todoCard-container ${clicked ? '--clicked' : ''}`}>
            <div className="todoCard-title-container">
                <div className="todoCard-title-index">
                    <div>{`${renderTitle()}`}</div>
                </div>
                <div className="todoCard-title-redirect">
                    <RedirectIcon
                        onClick={() => history.push(`/note/${todos[0].note}`)}
                    />
                </div>
            </div>
            <div className="todoCard-label-container">
                <div className="todoCard-label-todos">Todos</div>
                <div className="todoCard-label-due">Due Date</div>
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
                        <div
                            className={`todoCard-content-element__due ${
                                moment(todo.due_date).diff(moment(), 'days') < 0
                                    ? '--late'
                                    : ''
                            } 
                                ${todo.is_done ? '--done' : ''}
                            `}>
                            {renderDue(todo.due_date)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
