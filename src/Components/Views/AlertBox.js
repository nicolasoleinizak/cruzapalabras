import React from 'react'

class AlertBox extends React.Component{
    constructor(props){
        super(props)
    }

    render () {
        return (
            <div className="alert-box container">
                <div className="alert-box-message">{this.props.message}</div>
            </div>
        )
    }
}

export default AlertBox