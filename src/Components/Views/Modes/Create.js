import React, { useEffect } from 'react'
import { MatrixSchema } from '../../../MatrixSchema.js'
import AlertBox from '../AlertBox.js'
import CrosswordsBoard from '../../CrosswordsBoard.js'
import Glossary from '../../Glossary.js'

class Create extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      words: [''],
      isMatrixCreated: false,
      matrixSchema: {
        matrix: [],
        horizontal: [],
        vertical: [],
        words_left: []
      },
      alert: ''
    }
    this.addWord = this.addWord.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.getMatrix = this.getMatrix.bind(this)
  }

  handleInputChange(e, key){
    let newWords = this.state.words.slice(0,)
    newWords[key] = e.target.value
    this.setState({
        words: newWords
      }
    )
  }
  addWord(){
    this.setState((state) => {
      return {
        words: [...state.words, '']
      }
    }, this.focusLastInput)
  }
  deleteWord(index){
    let newWords = this.state.words.slice(0,index).concat(this.state.words.slice(index+1,))
    this.setState({
      words: newWords
    })
  }
  handleInputKeyDown(e, index){
    if( e.keyCode === 13 &&
        index === this.state.words.length -1 &&
        this.state.words[this.state.words.length-1] !== ''
      ){
        this.addWord()
      }
  }
  focusLastInput(){
    if(this.state.words.length > 0){
      let index = this.state.words.length - 1
      this['input'+index].focus()
    }
  }

  getMatrix(){
    if(this.state.words.length <= 1){
      this.setState({
        alert: "No hay suficientes palabras para generar el tablero. Ingrese al menos dos"
      })
    }
    else{
      let matrix = new MatrixSchema(this.state.words)
      this.setState({
        isMatrixCreated: true,
        matrixSchema: matrix.getCW()
      })
    }
  }

  getGridStyle(){
    let width = this.state.matrixSchema.matrix.length || 0
    console.log(width)
    return {
      gridTemplateColumns: `repeat(${width}, 1fr)`
    }
  } 

  render(){
    return (
      <div className="container p-3">
        <h2>Crear nuevo juego</h2>
        <h3>Palabras:</h3>
        <div className="words-list">
          { this.state.words.map( (word, key) => {
            let index = key
              return (
                <div key={key} className="input-group mb-1" >
                  <input type="text" className="form-control" value={word} id={"wordInput"+key} onChange={(event) => { this.handleInputChange(event, index)}} onKeyDown={(event) => this.handleInputKeyDown(event, index)} ref={input => {this['input'+key] = input}}/>
                  <button className="btn btn-secondary ml-1" onClick={ () => {this.deleteWord(index)} }>x</button>
                </div>
              )
          })}
        </div>
        <button className="btn btn-secondary" onClick={this.addWord}>+</button>
        <button className="btn btn-primary btn-md mt-3 btn-block" onClick={this.getMatrix}>Generar</button>
        <AlertBox message={this.state.alert} />
          { this.state.isMatrixCreated &&
          <div class="board-and-glossary container pt-3">
            <CrosswordsBoard matrix={this.state.matrixSchema.matrix}/>
            <div id="glossary">
              <Glossary glossary={this.state.matrixSchema.horizontal} glossaryType="Horizontales" />
              <Glossary glossary={this.state.matrixSchema.vertical} glossaryType="Verticales" />
            </div>
          </div>
          }
      </div>
    )
  }
}

export default Create
