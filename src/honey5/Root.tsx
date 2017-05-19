import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Honey5 } from './Honey5';
import { ActionDispatcher } from './module';

export default connect(
  (store: any) => ({ state: store.honey5 }),
  (dispatch: Dispatch<any>) => ({actions: new ActionDispatcher(dispatch)})
)(Honey5);
