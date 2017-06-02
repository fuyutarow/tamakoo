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

interface Props {
  value: CounterState;
  actions: ActionDispatcher;
};

export class Thread extends React.Component<void, Props, void> {
  render() {
    console.log("window width", window.innerWidth)
    console.log("screen width", screen.width)
    console.log("client width", document.documentElement.clientWidth)

    const styles = styleOn(screen.width);

    return (
      <div style={styles.wall}>
        <div style={styles.timeline}>
          {(this.props.value.loadingCount === 0) ? null : <p>loading</p>}
          <TodoList tasks={this.props.value.tasks} />
        </div>
        <div style={styles.bar}>
          <Link to='/'>
          <img style={styles.newTab} src={AddButtonSVG} />
          </Link>
        </div>
      </div>
    )
  }

  componentDidMount() {
    console.log(">>>",window.innerWidth)

    document.onkeydown = e => {
      if( e.key=='Enter' && e.ctrlKey ){
        this.addTask();
      }
    }
  }
}
