// @flow
import { Counter } from './Counter';
import {connect} from "react-redux";
import {ActionDispatcher} from "./module";
import type {Dispatch} from "redux";

export default connect(
  (store: any) => ({value: store.counter}),
  (dispatch: Dispatch<any>) => ({actions: new ActionDispatcher(dispatch)})
)(Counter);
