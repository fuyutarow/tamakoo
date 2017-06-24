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
<<<<<<< HEAD
import MailEntry from './mailEntry/entry/Root';
=======
import Signin from './mailEntry/signin/Root';
>>>>>>> e647f9ed2d2ae876f12d9e65500e9b1b4912f028
import Signup from './mailEntry/signup/Root';

import { Router, Switch } from 'react-router';
import store from "./Store";
import {Provider} from "react-redux";
import createBrowserHistory from 'history/createBrowserHistory';
import {Link, Route,Redirect} from 'react-router-dom';

const history = createBrowserHistory();

ReactDOM.render(
<MuiThemeProvider>
<Provider store={store}>
    <Router history={history}>
    <Switch>
      <Route exact path='/' component={Face} />
      <Route exact path='/entry/:id' component={Face} />
      <Route exact path='/thread' component={Thread} />
      <Route exact path='/user/:id' component={Userleft} />
      <Route exact path='/mailentry/sended' component={MailSended} />
<<<<<<< HEAD
      <Route exact path='/mailentry/entry' component={MailEntry} />
=======
      <Route exact path='/mailentry/signin' component={Signin} />
>>>>>>> e647f9ed2d2ae876f12d9e65500e9b1b4912f028
      <Route exact path='/signup' component={Signup} />
      <Redirect from="*" to="/" />
    </Switch>
    </Router>
</Provider>
</MuiThemeProvider>
, document.getElementById('app')
);
