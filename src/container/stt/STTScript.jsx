import React, { Component } from 'react';
import SingleScript from './SingleScript';

export default class STTScript extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scripts: [],
            lastScript: ''
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            nextProps.scripts != prevState.scripts ||
            nextProps.lastScript != prevState.lastScript
        ) {
            return {
                scripts: nextProps.scripts,
                lastScript: nextProps.lastScript
            };
        }
        return null;
    }

    renderScripts = () => {
        return this.state.scripts.map((script, i) => (
            <div key={i} className="stt-script-element">
                <SingleScript script={script} />
            </div>
        ));
    };

    renderLastScript = () => {
        return (
            <div className="stt-script-last-element">
                <SingleScript script={this.state.lastScript} />
            </div>
        );
    };

    render() {
        console.log(this.state.scripts);
        return (
            <div className="stt-script-container">
                <div>{this.renderLastScript()}</div>
                <div>{this.renderScripts()}</div>
            </div>
        );
    }
}
