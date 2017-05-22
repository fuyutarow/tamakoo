// @flow
import "./polyfill"
import React from 'react'
import ReactDOM from 'react-dom'
import Counter from './counter/Container'
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
    <Counter content="hello world" style={wallpaper}/>
        </MuiThemeProvider>
  </Provider>
  , document.getElementById('app')
)
