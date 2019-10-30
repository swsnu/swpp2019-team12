import React from 'react'
import axios from 'axios'

const Logout = (props) => {

    const handleClick = (e) => {
        e.preventDefault()
        axios.get('/api/signout/')
            .then(res => {  console.log(props)
                            props.history.push('/signin')})
            .catch(err => console.log("로그인 안된 상태"))
    }

    return (
        <div>
            <button
                id="logout-button"
                onClick={handleClick}
            >
                Signout
            </button>
        </div>
    )
}

export default Logout