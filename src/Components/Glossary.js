import React from 'react'

class Glossary extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            glossary: []
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(e, index){
        let modifiedEntry = {
            ...this.state.glossary[index],
            definition: e.target.value
        }
        this.setState(prevState => {
            return{
                glossary: prevState.glossary.slice(0, index).concat(modifiedEntry).concat(prevState.glossary.slice(index+1))
            }
        })
    }

    initialize(){
        this.setState({
            glossary: this.props.glossary
        })
    }

    componentDidMount(){
        this.initialize()
    }

    render(){
        return(
            <div className="container p-1">
                <h3>{this.props.wordsDirection}</h3>
                <div className="glossary-container">
                {
                    this.state.glossary.map((item, index) => {
                        return(
                            <div className={this.props.areGlossaryWordsVisible? 'glossary-full-row':'glossary-row'} key={"entry-"+index}>
                                <span className="glossary-cell" style={{gridArea: 'number'}}>{item.number}</span>
                                {this.props.areGlossaryWordsVisible && <span className="glossary-cell" style={{gridArea: 'word'}}>{item.word}</span>}
                                <input type="text" className="form-control glossary-cell"  style={{gridArea: 'definition'}}placeholder="Definición..." onChange={(event) => this.handleInputChange(event, index)} value={item.definition}/>
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