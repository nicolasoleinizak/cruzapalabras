import React from 'react'
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
      alert: '',
      isSolutionDisplayed: true
    }
    this.addWord = this.addWord.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.getMatrix = this.getMatrix.bind(this)
    this.print = this.print.bind(this)
    this.horizontalGlossary = React.createRef()
    this.verticalGlossary = React.createRef()
    this.displaySolution = this.displaySolution.bind(this)
    this.hideSolution = this.hideSolution.bind(this)
  }

  handleInputChange(e, key){
    if(/^[a-zA-Z]+$/.test(e.target.value)){
      let newWords = this.state.words.slice(0,)
      newWords[key] = e.target.value
      this.setState({
          words: newWords
        }
      )
    }
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
        alert: "No hay suficientes palabras para generar el tablero. Ingrese al menos dos."
      })
    }
    else{
      let matrix = new MatrixSchema(this.state.words)
      let matrixSchema = matrix.getCW()
      this.setState({
        isMatrixCreated: true,
        matrixSchema: {
          ...matrixSchema,
          vertical: matrixSchema.vertical.map( entry => {
            return {
              ...entry,
              definition: ''
            }
          }),
          horizontal: matrixSchema.horizontal.map( entry => {
            return {
              ...entry,
              definition: ''
            }
          }),
        }
      }, () => {
        this.horizontalGlossary.current.initialize()
        this.verticalGlossary.current.initialize()
      })
    }
  }

  getGridStyle(){
    let width = this.state.matrixSchema.matrix.length
    console.log(width)
    return {
      gridTemplateColumns: `repeat(${width}, 1fr)`
    }
  }

  displaySolution(){
    this.setState({
      isSolutionDisplayed: true
    })
  }

  hideSolution(){
    this.setState({
      isSolutionDisplayed: false
    })
  }

  print(){
    window.print()
  }

  render(){
    return (
      <div className="container p-3">
        { !this.state.isPrintingViewEnabled &&
        <div id="creator-form">
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
        </div>
        }
        { this.state.isMatrixCreated &&
        <div>
          <div className="board-and-glossary container pt-3" id="game-container">
            <CrosswordsBoard matrix={this.state.matrixSchema.matrix} contentVisible={this.state.isSolutionDisplayed}/>
            <div id="glossary">
              <Glossary glossary={this.state.matrixSchema.horizontal} wordsDirection="Horizontales" areGlossaryWordsVisible={this.state.isSolutionDisplayed} ref={this.horizontalGlossary}/>
              <Glossary glossary={this.state.matrixSchema.vertical} wordsDirection="Verticales" areGlossaryWordsVisible={this.state.isSolutionDisplayed} ref={this.verticalGlossary}/>
            </div>
          </div>
            { 
              this.state.matrixSchema.words_left.length > 0 &&
              <AlertBox message={
                "No se pudo colocar las siguientes palabras: " +
                this.state.matrixSchema.words_left.join(', ') + ". " +
                "Intente generar nuevamente. Si el problema persiste, elimine las palabras que generan inconvenientes."
              }/>
            }
            <button className="btn btn-primary btn-md m-3 not-printable" onClick={this.displaySolution} enabled={!this.state.isSolutionDisplayed}>Mostrar resoluci??n</button><button className="btn btn-primary btn-md m-3 not-printable" onClick={this.hideSolution} enabled={this.state.isSolutionDisplayed}>Ocultar resoluci??n</button>
            <button className="btn btn-primary btn-md mt-3 btn-block not-printable" onClick={this.print}>Imprimir <i className="fa-solid fa-print"/></button>
          </div>
        }
        <div id="instructions" className="container pt-5 not printable">
          <h2>??C??mo crear mi propio tablero?</h2>
          <p>??Solo sigue estos simples pasos!</p>
          <ol>
            <li><strong>Ingresa las palabras</strong> que quieras, una por una. Ten cuidado de no dejar espacios vac??os. Solo se pueden usar letras. Recomendamos evitar el uso de acentos, porque ser?? m??s dif??cil generar un tablero</li>
            <li>Presiona el bot??n <strong>"Generar"</strong>. Nuestro algoritmo intentar?? ubicar todas las palabras. Si no puede ubicar toas, te avisar?? cu??les no se pudo introducir. Podr??s intentar generarlo nuevamente, o quitar las palabras que no se pueden ubicar. ??A veces simplemente no se puede!</li>
            <li>Ahora que has generado el tableto, aparecer?? una lista de las palabras con direcci??n vertical u horizontal. <strong>Deber??s llenar el significado para cada una.</strong></li>
            <li>Con el glosario completo, es hora de imprimir tu juego: para imprimirlo vac??o (listo para jugar) <strong>presiona primero en "Ocultar resoluci??n".</strong></li>
            <li>Por ??ltimo, <strong>presiona en "Imprimir"</strong> y se abrir?? el cuadro de di??logo de impresi??n.</li>
          </ol>
          <p>??Eso es todo! Dentro de poco, habilitaremos una nueva y genial funci??n para que puedas enviar tu propio juego a quien quieras, de forma digital</p>
          <p>Adem??s, podr??s jugar t?? y quien quieras sin salir del sitio web. Genial, ??no? Solo hace falta un poquito de paciencia, estamos trabajando en ello.</p>
        </div>
      </div>
    )
  }
}

export default Create
