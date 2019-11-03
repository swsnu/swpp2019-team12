import React from 'react'

const Text = (props) => {
    const {
        content
    } = props;

    return (
        <div className="full-size-block-container Text">
            <div className="full-size-block-title">
                <div className="full-size-block-title__text">Text</div>
            </div>
            <div className="full-size-block-content">
                <div className="full-size-blokc-content__text">{content}</div>
            </div>
        </div>
    )
}

export default Text