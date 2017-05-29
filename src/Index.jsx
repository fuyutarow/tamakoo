// @flow
import "./polyfill"
import React from 'react'
import ReactDOM from 'react-dom'
import Face from './counter/Container'
import Thread from './counter/Thread'
import {Provider} from "react-redux"
import store from "./Store"
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const wallpaper = {
  backgroundColor: 'rgb(255, 64, 129)',
}

ReactDOM.render(
<Provider store={store}>
  <MuiThemeProvider>
      <Face />
  </MuiThemeProvider>
</Provider>
  , document.getElementById('app')
)
