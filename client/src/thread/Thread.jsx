// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import type {CounterState, ActionDispatcher} from "../module"
import TodoList from './TodoList';
import Tool from '../Tool';

import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Link, Route } from 'react-router-dom';
import { styleOn } from './css';

interface Props {
  value: CounterState;
  actions: ActionDispatcher;
};

export class Thread extends React.Component<void, Props, void> {
  componentWillMount(){
    this.styles = styleOn(screen.width);
    if( this.props.match.path=='/echo/:text' ){
      this.props.actions.setState({ isLoading: true })
      this.props.actions.toot(
        this.props.value.signinAcc.alias, this.props.match.params.text)
    }
    if( this.props.match.path=='/card/:id' ){
      this.props.actions.setState({ isLoading: true })
      this.props.actions.callCard(this.props.match.params.id);
    }
  }
   
  render() {
    console.log(this.props.value)
    return (
      <div ref='ttt' style={this.styles.wall}>
        <TodoList actions={this.props.actions} match={this.props.match} value={this.props.value} /> 
        <Tool actions={this.props.actions} match={this.props.match} value={this.props.value} />
      </div>
    )
  }
}
