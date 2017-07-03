// @flow
import "./polyfill";
import React from 'react';
import ReactDOM from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Face from './face/Root';
import Thread from './thread/Root';
import Userleft from './userleft/Root';
import MailSended from './mailEntry/sended/Root';
import Signin from './mailEntry/signin/Root';
import Signup from './signup/signupUser/Root';
import SignupSended from './signup/sended/Root';
import Preference from './preference/Root';

import { Router, Switch } from 'react-router';
import store from "./Store";
import {Provider} from "react-redux";
import { createBrowserHistory } from 'history';
import {Link, Route,Redirect} from 'react-router-dom';

export const history = createBrowserHistory();

ReactDOM.render(
<MuiThemeProvider>
<Provider store={store}>
    <Router history={history}>
    <Switch>
      <Route exact path='/' component={Face} />
      <Route exact path='/entry/:id' component={Face} />
      <Route exact path='/thread' component={Thread} />
      <Route exact path='/echo/:text' component={Thread} />
      <Route exact path='/account/:id' component={Userleft} />
      <Route exact path='/mailentry/sended' component={MailSended} />
      <Route exact path='/mailentry/signin' component={Signin} />
      <Route exact path='/signup/:id' component={Signup} />
      <Route exact path='/thanks-signup' component={SignupSended} />
      <Route exact path='/preference/index' component={Preference} />
      <Redirect from="*" to="/" />
    </Switch>
    </Router>
</Provider>
</MuiThemeProvider>
, document.getElementById('app')
);
