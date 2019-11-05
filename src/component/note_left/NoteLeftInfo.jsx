import React, { Component } from 'react'
import moment from 'moment';
import DateTime from 'react-datetime'
import { Label } from './Label';
import ParticipantInfo from './ParticipantInfo';

class NoteLeftInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            note_title: this.props.note_title,
            meeting_date: this.props.meeting_date,
            isTitleClicked: false,
            isDateClicked: false,
            moment: moment('2019-12-31 00:00:59'),
        }
    }

    handleChangeTitle = (e) => {
        this.setState({ note_title: e.target.value })
    }

    handleConvertTag_Title = () => {
        this.setState({ isTitleClicked: !this.state.isTitleClicked })
    }

    handleChangeDatetime = (moment) => {
        this.setState({
            moment
        });
    }

    handleConvertTag_Datetime = () => {
        this.setState({ isDateClicked: !this.state.isDateClicked })
    }


    render() {
        // Click하는 순간 바로 Cursor가 활성화 되게끔 만들어야 한다.

        /*
            Title, Date의 경우 해당 부분을 클릭할 시에 수정할 수 있게 바뀌고 OnBlur됐을 때는,
            수정한 사항을 바탕으로 다시 state를 변화시켜 변경 사항을 저장할 수 있도록 해야 한다.
            이를 구현하기 위해 각 태그에 클릭 이벤트를 걸어놓고 이를 바탕으로 태그 간 변환을 한다.
            
            ## 다른 방식?
            <div> <--> <input> tag를 바꾸는 방식 말고,
            그냥 계속 input tag를 유지하되 그냥 input의 css를 바꿔서 클릭하기 전에는 그냥 일반
            Text처럼 보이게만들고 클릭하면 약간만 변화를 줘서 수정 중이라는 걸 보여주는게 더 나을 듯.
        */
        // let titleElement = null;
        // if (!this.state.isTitleClicked) {
        //     titleElement = <div onClick={this.handleConvertTag_Title}>{this.state.note_title}</div>
        // }
        // else {
        //     titleElement = (
        //                     <input
        //                         className="form-control title"
        //                         type="text"
        //                         value={this.state.note_title}
        //                         onBlur={this.handleConvertTag_Title}
        //                         onChange={(e) => this.handleChangeTitle(e)}
        //                     />
        //     )
        // }

        // let dateTimeElement = null;
        // if (!this.state.isDateClicked) {
        //     dateTimeElement = 
        //                     <div onClick={this.handleConvertTag_Datetime}>
        //                         {this.state.moment.format('MM/DD/YYYY h:mm a')}
        //                     </div>
        // }
        // else {
        //     dateTimeElement = <DateTime 
        //                             onBlur={this.handleConvertTag_Datetime}
        //                             onChange={this.handleChangeDatetime}
        //                         />
        // }

        return (
            <div className="NoteLeftInfo">
                <div className="NoteLeftInfo-title__container">
                    <Label title="Note Title"/>
                    <div className="NoteLeftInfo__currentNote">
                        <input
                            className="form-control title"
                            type="text"
                            value={this.state.note_title}
                            // onBlur가 되면 Update API call
                            onBlur={this.handleConvertTag_Title}
                            onChange={(e) => this.handleChangeTitle(e)}

                        />
                    </div>
                </div>
                <div className="NoteLeftInfo-date__container">
                    <Label title="Date" />
                    <DateTime
                        value={this.state.moment} 
                        onBlur={this.handleConvertTag_Datetime}
                        onChange={this.handleChangeDatetime}
                    />
                </div>
                <ParticipantInfo 
                    participants={this.props.participants}
                />       
            </div>
        )
    }
}

export default NoteLeftInfo