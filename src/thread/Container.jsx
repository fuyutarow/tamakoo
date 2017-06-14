// @flow
import { Thread } from './Thread';
import {connect} from "react-redux";
import {ActionDispatcher} from "./module";
import type {Dispatch} from "redux";

export default connect(
  (store: any) => ({value: store.counter}),
  (dispatch: Dispatch<any>) => ({actions: new ActionDispatcher(dispatch)})
)(Thread);
