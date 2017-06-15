// @flow
import counter from './module'
import type {CounterActions, CounterState} from './module'
import { createStore, combineReducers } from 'redux'

export default createStore(
  combineReducers({
    counter
  }),
)
