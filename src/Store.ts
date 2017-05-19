import { createStore, combineReducers, applyMiddleware } from 'redux';
import honey5 from './honey5/module';
import { createLogger } from 'redux-logger';

const logger = createLogger();
export default createStore(
  combineReducers({
    honey5: honey5
  }),
  applyMiddleware(logger)
);
