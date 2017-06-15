// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import type {CounterState, ActionDispatcher} from "../module"
import TodoList from './TodoList';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {Link, Route} from 'react-router-dom';
import { styleOn } from './css';
import AddButtonSVG from '../../assets/svg/add-button-inside-black-circle.svg';
import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react'

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
        <div style={this.styles.timeline}>
          <TodoList value={this.props.value} actions={this.props.actions} />
        </div>
        <div style={this.styles.bar}>
          <Link to='/' onClick={e=>{
            this.props.actions.initState()
          }}>
            <img style={this.styles.newTab} src={AddButtonSVG} />
          </Link>
        </div>
      </div>
    )
  }

  componentDidMount() {
  }
}
