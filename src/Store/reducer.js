import { combineReducers } from 'redux'
import { CHANGE_MODE } from './actions.js'

function appMode(state = "none", action) {
  switch (action.type) {
    case CHANGE_MODE:
      return action.mode
    default:
      return state
  }
}

const reducer = combineReducers({
  appMode
})

export default reducer
