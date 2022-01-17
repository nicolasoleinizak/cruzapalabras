import React from 'react'
import { connect } from 'react-redux';
import { changeMode } from '../../Store/actions.js'

class InitialMenu extends React.Component{

  handleMode (mode) {
    this.props.onModeChange()
    this.props.changeMode(mode)
  }

  render () {
    return(
      <main>
        <div id="initial-menu-container" className="fluid-container d-flex flex-column align-items-center">
          <div id="logo">
            <img src="./img/Logo.png" alt="cruzapalabras (logo)" className="img-fluid"/>
          </div>
          <div className="container d-flex flex-column">
            {/*<button className="btn btn-secondary btn-md m-1" onClick={() => {this.handleMode('play')}}>Jugar</button>*/}
            <button className="btn btn-secondary btn-md m-1" onClick={() => {this.handleMode('create')}}>Crear nuevo tablero</button>
            {/*<div className="fluid-container d-flex flex-row m-1">
              <input type="text" className="form-control form-control-lg m-1" placeholder="Ingresa un código de juego" />
              <button className="btn btn-secondary btn-md m-1" onClick={() => {this.handleMode('search')}}><i className="fa-solid fa-magnifying-glass" /></button>
            </div>*/}
          </div>
          <div id="welcome-message" className="container p-5">
            <h2>¿Qué es Cruzapalabras?</h2>
            <p>Cruzapalabras es una aplicación web donde podrás crear tu propio juego de palabras cruzadas. Luego podrás imprimirlo para compartilo con otros, usar en tus clases, jugar con tu familia, o lo que se te ocurra.</p>
            <p>Es muy fácil de usar. Solo debes presionar en el botón "Crear nuevo tablero" y seguir los pasos.</p>
            <p>¡Esperamos que lo disfrutes!</p>
          </div>
        </div>
      </main>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    appMode: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeMode: (mode) => {
      dispatch(changeMode(mode))
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(InitialMenu)
