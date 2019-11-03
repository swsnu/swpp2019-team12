import React, { Component } from 'react';

const CreateModalLabel = () => {
    return (
        <div className="createModal-label">
            <div className="createModal-label__sublabel">Basic Information</div>
            <div className="createModal-label__label">Create Workspace</div>
        </div>
    );
};

class CreateModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div onClick={e => e.stopPropagation()}>
                <CreateModalLabel />
            </div>
        );
    }
}

export default CreateModal;
