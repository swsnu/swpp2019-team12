import React, { Component } from 'react';
import { map } from 'lodash';
import moment from 'moment';
import { ReactComponent as RedirectIcon } from '../../assets/icons/redirect_icon.svg';
import { ReactComponent as BulletIcon } from '../../assets/icons/bullet_icon.svg';
import { ReactComponent as CheckIcon } from '../../assets/icons/check_icon.svg';
import axios from 'axios';

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

export class AgendaCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };
    }
    componentDidMount() {
        const { agenda, clicked, history } = this.props;

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
                }`}>
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
    /*
    assignees: [1]
content: "첫번쨰 투두입니당"
due_date: "2019-12-16"
id: 75
is_done: false
is_parent_note: true
layer_x: 0
layer_y: 0
note: 24
parent_agenda: null
workspace: null

0: {id: 58, content: "어젠다 안건 -1", layer_x: 0, layer_y: 0, is_parent_note: true, …}
0:
children_blocks: "[{"block_type":"Agenda","id":58,"content":" 어젠다 안건 -1 ","layer_x":0,"layer_y":0},{"block_type":"Agenda","id":59,"content":" 데모 비디오 제작 문제","layer_x":0,"layer_y":0},{"block_type":"Agenda","id":60,"content":" Test 용 안건","layer_x":0,"layer_y":0},{"block_type":"Text","id":33,"content":"새로 생성된 텍스트 블록","layer_x":0,"layer_y":0,"documentId":"1n8q2n63637"},{"block_type":"Text","id":34,"content":"새로 생성된 텍스트 블록","layer_x":0,"layer_y":0,"documentId":"32e7517i32d"},{"block_type":"Agenda","id":68,"content":" 텍스트 블록 없는 안건","layer_x":0,"layer_y":0},{"todos":[{"id":75,"block_type":"TodoContainer","content":"첫번쨰 투두입니당","layer_x":0,"layer_y":0,"assignees":[1],"due_date":"2019-12-16","note":"24","is_parent_note":true,"is_done":false,"parent_agenda":null,"worspace":null,"assignees_info":[{"id":1,"nickname":"CHAEMIN"}]},{"id":76,"block_type":"TodoContainer","content":"두번째 투두입니다아아","layer_x":0,"layer_y":0,"assignees":[2],"due_date":"2019-12-27","note":"24","is_parent_note":true,"is_done":false,"parent_agenda":null,"worspace":null,"assignees_info":[{"id":2,"nickname":"YEJI"}]},{"id":77,"block_type":"TodoContainer","content":"할 일을 채워주세요","layer_x":0,"layer_y":0,"assignees":[4],"due_date":"2019-12-13","note":"24","is_parent_note":true,"is_done":true,"parent_agenda":null,"worspace":null,"assignees_info":[{"id":4,"nickname":"TAEYOUNG"}]},{"id":78,"block_type":"TodoContainer","content":"으어어어어 비디오를 만들자","layer_x":0,"layer_y":0,"assignees":[3],"due_date":"2019-12-21","note":"24","is_parent_note":true,"is_done":false,"parent_agenda":null,"worspace":null,"assignees_info":[{"id":3,"nickname":"SANGYEON"}]}],"block_type":"TodoContainer"}]"
created_at: "2019-12-14T12:30:46.213000Z"
id: 24
last_modified_at: "2019-12-14T12:30:46.213000Z"
location: "회의 장소asfdasdf"
ml_speech_text: null
participants: (4) [1, 2, 3, 4]
tags: []
title: "NTOE1"
workspace: 1
__proto__: Object
    */

    const renderTitle = () => {
        const { notes, agendas, todos } = props;
        const { is_parent_note } = todos[0];

        let text;
        if (is_parent_note) {
            text = notes.filter(note => note.id === todos[0].note)[0].title;
            return `회의록 - ${text}`;
        } else {
            text = agendas.filter(
                agenda => agenda.id === todos[0].parent_agenda
            )[0].content;
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
                        onClick={() => history.push(`/note/${todos.note}`)}
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
