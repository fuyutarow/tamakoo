// @flow
import counter from './face/module'
import type {CounterActions, CounterState} from './face/module'
import { createStore, combineReducers } from 'redux'

export default createStore(
  combineReducers({
    counter
  }),
)
