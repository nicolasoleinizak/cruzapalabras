import React from 'react';
import InitialMenu from './Views/InitialMenu.js'
import ModeView from './Views/ModeView.js'


class Main extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      view: 'initialMenu',
      mode: 'create'
    }
    this.handleMode = this.handleMode.bind(this)
  }

  handleMode () {
    this.setState({
      view: 'modeView',
    })
  }

  render(){
    switch(this.state.view){
      case 'initialMenu':
        return <InitialMenu onModeChange={this.handleMode}/>
      case 'modeView':
        return <ModeView mode={this.state.mode} />
      default:
      return <InitialMenu onModeChange={this.handleMode}/>
    }
  }
}

export default Main
