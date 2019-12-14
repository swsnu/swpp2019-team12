import React, { Component } from 'react';
import axios from 'axios';
import { Tag as AntTag } from 'antd';
import { height } from 'dom-helpers';

export default class Tag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tagId: this.props.tagId,
            title: '',
            color: ''
        };
    }

    componentDidMount() {
        axios.get(`/api/tag/${this.props.tagId}/`).then(res => {
            this.setState({
                title: res.data['tag_title'],
                color: res.data['tag_color']
            });
        });
    }

    render() {
        return <AntTag color="magenta">{this.state.title}</AntTag>;
    }
}
