// @flow
import "./polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Switch } from 'react-router';

import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory();

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import store from "./Store";
import Face from './face/Container';
import Thread from './thread/Container';
import Userleft from './userleft/Container';

ReactDOM.render(
<Provider store={store}>
  <MuiThemeProvider>
    <Router history={history}>
    <Switch>
      <Route exact path='/' component={Face} />
      <Route exact path='/thread' component={Thread} />
      <Route exact path='/user/:id' component={Userleft} />
      <Route path="*" component={Face}/>
    </Switch>
    </Router>
  </MuiThemeProvider>
</Provider>
  , document.getElementById('app')
)
