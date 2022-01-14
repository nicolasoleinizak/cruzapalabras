import React from 'react'
import { connect } from 'react-redux';
import { changeMode } from '../../Store/actions.js'

class InitialMenu extends React.Component{
  constructor(props){
    super(props)
  }

  handleMode (mode) {
    this.props.onModeChange()
    this.props.changeMode(mode)
  }

  render () {
    return(
      <main>
        <div id="initial-menu-container" className="fluid-container d-flex flex-column align-items-center">
          <div id="logo">
            <img src="./img/Logo.png" className="img-fluid"/>
          </div>
          <div className="container d-flex flex-column">
            <button className="btn btn-secondary btn-md m-1" onClick={() => {this.handleMode('play')}}>Jugar</button>
            <button className="btn btn-secondary btn-md m-1" onClick={() => {this.handleMode('create')}}>Crear</button>
            <div className="fluid-container d-flex flex-row m-1">
              <input type="text" className="form-control form-control-lg m-1" placeholder="Ingresa un código de juego" />
              <button className="btn btn-secondary btn-md m-1" onClick={() => {this.handleMode('search')}}><i className="fa-solid fa-magnifying-glass" /></button>
            </div>
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
