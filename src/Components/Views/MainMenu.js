import React from 'react';
import { connect } from 'react-redux'
import { changeMode } from '../../Store/actions.js'

class MainMenu extends React.Component {

  handleMode (mode) {
    this.props.changeMode(mode)
  }

  render () {
    return(
      <div  className="fluid-container d-flex flex-column align-items-center">
        <div id="logo">
          <img src="./img/Logo.png" alt="cruzapalabras (logo)" className="img-fluid"/>
        </div>
        {/* THIS MENU IS DISABLED UNTIL THE IMPLEMENTATION OF THE ONLINE PLAYING
        <div id="menu-container" className="container d-flex flex-row">
          <button className="btn btn-secondary btn-sm m-1" onClick={() => {this.handleMode('play')}}>Jugar</button>
          <button className="btn btn-secondary btn-sm m-1" onClick={() => {this.handleMode('create')}}>Crear</button>
          <button className="btn btn-secondary btn-sm m-1" onClick={() => {this.handleMode('search')}}><i className="fa-solid fa-magnifying-glass" /></button>
        </div>
      */}
      </div>
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

export default connect(mapStateToProps,mapDispatchToProps)(MainMenu)
