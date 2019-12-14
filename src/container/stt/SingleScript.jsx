import React from 'react';

const SingleScript = props => {
    return (
        <div>
            <input
                className="SingleScript-input"
                value={props.script}
                onClick={e => {
                    const pTag = e.target;
                    pTag.select();
                    document.execCommand('copy');
                    message.info('Copied the text: ' + pTag.value);
                }}></input>
        </div>
    );
};

export default SingleScript;
