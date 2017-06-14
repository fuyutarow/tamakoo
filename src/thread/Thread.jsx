// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import type {CounterState, ActionDispatcher} from "./module"
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
  trst:string;

  componentWillMount(){
    this.styles = styleOn(screen.width);
    this.test = 'lolo';
    this.wall = this.styles.wall;
  }

  render() {
    const wall =
      this.props.value.phase=='ground'? this.styles.wall : this.styles.wall2

    return (
      <div ref='ttt' style={wall}>
        <div style={this.styles.timeline}>
          <TodoList value={this.props.value} actions={this.props.actions} />
        </div>
        <div style={this.styles.bar}>
          <Link to='/' onClick={e=>{
            this.props.actions.movePage()
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
