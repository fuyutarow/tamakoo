// @flow
import "./polyfill"
import React from 'react'
import ReactDOM from 'react-dom'
import Counter from './counter/Container'
import {Provider} from "react-redux"
import store from "./Store"
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

ReactDOM.render(
  <Provider store={store}>
    <Counter content="hello world"/>
  </Provider>
  , document.getElementById('app')
)
