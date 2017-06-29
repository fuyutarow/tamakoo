// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { styleOn } from './css';

import { CounterState, ActionDispatcher } from "../module"
import TodoList from './TodoList';
import Bar from './Bar';
import Tool from '../Tool';


interface Props {
  value: CounterState;
  actions: ActionDispatcher;
};

export class Userleft extends React.Component<void, Props, void> {

  componentWillMount(){
    this.styles = styleOn(screen.width);
    this.props.actions.askAcc(this.props.match.params.id)
    console.log(this.props.match.params.id);
    console.log(this.props);
  }

  render() {
    console.log(this.props.value)
    return (
      <div style={this.styles.wall}>
        <div id='crown'>
          <h2>{this.props.value.whoisAcc.handle}</h2>
          <div>{'@'+this.props.value.whoisAcc.alias}</div>
          <p>{this.props.value.whoisAcc.bio}</p>
        </div>
        <hr/>
        <TodoList value={this.props.value} actions={this.props.actions} />
        <Tool actions={this.props.actions} match={this.props.match} value={this.props.value} />
      </div>
    )
  }

  componentDidUpdate() {
    location.hash='crown';
  }
}
