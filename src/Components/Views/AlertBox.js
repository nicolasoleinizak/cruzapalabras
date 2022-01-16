import React from 'react'

class AlertBox extends React.Component{
    render () {
        return (
            <div className="alert-box container not-printable">
                <div className="alert-box-message">{this.props.message}</div>
            </div>
        )
    }
}

export default AlertBox