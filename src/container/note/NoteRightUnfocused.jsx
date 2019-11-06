import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import MeetingNoteOverview from '../../component/workspace_main/MeetingNoteOverview';
import NoteLeftBlock from '../../component/note_left/NoteLeftBlock';
import NoteLeftInfo from '../../component/note_left/NoteLeftInfo';

export default class NoteRightUnfocused extends Component {
    constructor(props) {
        super(props);
        this.state = {
            other_notes: [],
            workspace_id: this.props.workspace_id,
            clicked_note: -1,
            note_id: this.props.note_id,
            title: '',
            created_at: '',
            last_modified_at: '',
            ml_speech_text: '',
            participants: [],
            moment: null,
            blocks: []
        };
    }

    componentDidMount() {
        // 현재 노트의 형제 노트들을 모두 가져와서 state에 저장
        axios.get(`/api/siblingnotes/${this.props.note_id}`).then(res => {
            this.setState({
                other_notes: res.data.filter(r => r.id != this.props.note_id)
            });
        });
    }

    handleClick = n_id => {
        this.setState({
            clicked_note: n_id,
            title: '',
            created_at: '',
            last_modified_at: '',
            ml_speech_text: '',
            participants: [],
            moment: null,
            blocks: []
        });
        axios
            .get(`/api/note/${n_id}/agendas/`)
            .then(res => {
                console.log(res);
                res['data'].forEach(blk => {
                    this.setState({
                        blocks: this.state.blocks.concat({
                            block_type: 'agenda',
                            id: blk['id'],
                            content: blk['content'],
                            layer_x: blk['layer_x'],
                            layer_y: blk['layer_y']
                        })
                    });
                });
            })
            .catch(err => console.log('No agendas'));

        axios
            .get(`/api/note/${n_id}/textblocks/`)
            .then(res => {
                console.log(res);
                res['data'].forEach(blk => {
                    this.setState({
                        blocks: this.state.blocks.concat({
                            block_type: 'textblock',
                            id: blk['id'],
                            content: blk['content'],
                            layer_x: blk['layer_x'],
                            layer_y: blk['layer_y']
                        })
                    });
                });
            })
            .catch(err => console.log('No Texts'));

        axios.get(`/api/note/${n_id}/`).then(res => {
            this.setState({
                ...this.state,
                note_id: res['data']['id'],
                title: res['data']['title'],
                created_at: res['data']['created_at'],
                last_modified_at: res['data']['last_modified_at'],
                ml_speech_text: res['data']['ml_speech_text'],
                participants: res['data']['participants'],
                moment: moment(res['data']['created_at'])
            });
        });
    };

    render() {
        return (
            <div className="Note-right-unfocused">
                <div className="Note-right-page-unfocused__title">
                    Note Right Unfocused
                </div>
                <div className="Note-right-page-clickable-area">
                    <MeetingNoteOverview
                        className="Meeting-note-overview"
                        history={this.props.history}
                        notes={this.state.other_notes}
                        handleClick={this.handleClick}
                        is_NoteRight
                    />
                </div>
                <div className="Note-Info-Area">
                    <NoteLeftInfo
                        note_title={this.state.title}
                        meeting_date={this.state.meeting_date}
                        participants={this.state.participants}
                        moment={this.state.moment}
                        isRightUnfocused={true}
                    />
                    <NoteLeftBlock
                        className="Note-block-area"
                        note_id={this.state.note_id}
                        blocks={this.state.blocks}
                        isLeft={false}
                    />
                </div>
            </div>
        );
    }
}
