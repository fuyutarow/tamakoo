// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import type {CounterState, ActionDispatcher} from "../module"
import TodoList from './TodoList';
import Cable from './cable';
import Bar from './Bar';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {Link, Route} from 'react-router-dom';
import { styleOn } from './css';

interface Props {
  value: CounterState;
  actions: ActionDispatcher;
};

export class Thread extends React.Component<void, Props, void> {
  componentWillMount(){
    this.styles = styleOn(screen.width);
  }

  render() {
    return (
      <div ref='ttt' style={this.styles.wall}>
        <TodoList value={this.props.value} actions={this.props.actions} />
        <Bar value={this.props.value} actions={this.props.actions} />
      </div>
    )
  }
}
