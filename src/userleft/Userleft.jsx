// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { styleOn } from './css';

import { CounterState, ActionDispatcher } from "../module"
import TodoList from './TodoList';
import Bar from './Bar';


interface Props {
  value: CounterState;
  actions: ActionDispatcher;
};

export class Userleft extends React.Component<void, Props, void> {

  componentWillMount(){
    this.styles = styleOn(screen.width);
    this.props.actions.hisToot(this.props.match.params.id)
    console.log(this.props.match.params.id);
    console.log(this.props);
  }

  render() {
    return (
      <div style={this.styles.wall}>
        <div id='crown'>
          <h2>{this.props.value.userInfo.user_name}</h2>
          <p>{this.props.value.userInfo.user_bio}</p>
        </div>
        <hr/>
        <TodoList value={this.props.value} actions={this.props.actions} />
        <Bar value={this.props.value} actions={this.props.actions} />
      </div>
    )
  }

  componentDidUpdate() {
    location.hash='crown';
  }
}
