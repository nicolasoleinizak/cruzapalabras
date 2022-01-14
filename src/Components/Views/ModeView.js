import React from 'react';
import { connect } from 'react-redux'

import MainMenu from './MainMenu.js'
import Play from './Modes/Play.js'
import Create from './Modes/Create.js'
import Search from './Modes/Search.js'

class ModeView extends React.Component {
  constructor(props){
    super(props)
  }

  render () {
    let section = () => {
      switch (this.props.appMode.appMode){
        case 'play':
          return <Play />
        case 'create':
          return <Create />
        case 'search':
          return <Search />
      }
    }
    return (
      <main>
        <MainMenu/>
        {section()}
      </main>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    appMode: state
  }
}

export default connect(mapStateToProps)(ModeView)
