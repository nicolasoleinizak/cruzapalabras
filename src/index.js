import React from 'react';
import ReactDOM from 'react-dom';
import {Helmet} from 'react-helmet'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux'
import {createStore} from 'redux'
import { connect } from 'react-redux'
import { changeMode } from './Store/actions.js'
import reducer from './Store/reducer.js'

let store = createStore(reducer)

const mapStateToProps = (state) => {
  return {appMode: state}
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeMode: (mode) => {
      dispatch(changeMode(mode))
    }
  }
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App)

ReactDOM.render(
  <React.StrictMode>
    <Helmet>
      <link href="/assets/css/custom_bootstrap.css" rel="stylesheet" media="all"/>
      <link href="/assets/css/styles.css" rel="stylesheet" media="all"/>
      <link href="/assets/fontawesome/css/all.css" rel="stylesheet" />
      <link href="/MatrixSchema.js"/>
      <link href="/assets/css/print.css" rel="stylesheet" type="text/css" media="print" />
      <title>CruzaPalabras</title>
    </Helmet>
    <Provider store={store}>
      <AppContainer />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
