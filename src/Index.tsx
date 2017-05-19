import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import store from './Store';
import Honey5 from './honey5/Root';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

ReactDOM.render(
  <Provider store={ store }>
    <Honey5 />
  </Provider>
  , document.getElementById('app')
);
