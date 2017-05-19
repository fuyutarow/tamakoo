import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './Store';
import Honey5 from './honey5/Root';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
ReactDOM.render(React.createElement(Provider, { store: store },
    React.createElement(Honey5, null)), document.getElementById('app'));
//# sourceMappingURL=Index.js.map