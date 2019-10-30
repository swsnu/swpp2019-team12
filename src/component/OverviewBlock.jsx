import React from 'react'

const OverviewBlock = (props) => {

    const handleElemClick = () => {
        console.log("Clicked");
    }

    const elems = props.elems.map((elem) => {
        return (<li onClick={handleElemClick}
                    key={elem.id}>{elem.title}</li>)
    })
    return (
        <div className="OverviewBlock">
            <h3>{props.title}</h3>
            <ul>{elems}</ul>
        </div>
    )
}

export default OverviewBlock
