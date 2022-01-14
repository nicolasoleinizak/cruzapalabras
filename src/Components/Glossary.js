import React from 'react'

class Glossary extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="container p-1">
                <h3>{this.props.glossaryType}</h3>
                <div className="glossary-container">
                {
                    this.props.glossary.map(item => {
                        return(
                            <div className="glossary-row">
                                <span className="glossary-cell">{item.number}</span>
                                <span className="glossary-cell">{item.word}</span>
                            </div>
                        )
                    })
                }
                </div>
            </div>
        )
    }
}

export default Glossary