import React, { Component } from 'react';

export default class Tag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tagTitle: 'tag'
        };
    }

    componentDidMount() {
        this.setState({
            tagTitle: this.props.tagTitle
        });
    }

    render() {
        return (
            <div>
                <h3>this.state.tagTitle</h3>
            </div>
        );
    }
}
