// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import type {CounterState, ActionDispatcher} from "./module"
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {Link, Route} from 'react-router-dom';
import { styleOn } from './css';
interface Props {
  value: CounterState;
  actions: ActionDispatcher;
};

export class Face extends React.Component<void, Props, void> {
  toot() {
    const task = (ReactDOM.findDOMNode(this.refs.task)).value;
    if( task=="" ) return;
    this.props.actions.toot(task);
    (ReactDOM.findDOMNode(this.refs.task)).value = "";
  }

  render() {
    const styles = styleOn(screen.width);
    return (
      <div style={styles.wall}>
        <textarea style={styles.textarea} type='text' ref='task'
         placeholder="toot to open tamaKoo"/>
        <Link to='/thread'>
          <button style={styles.button} onClick={()=>this.toot()} >
            echo
          </button>
        </Link>
      </div>
    )
  }

  componentDidMount() {
    document.onkeydown = e => {
      if( e.key=='Enter' && e.ctrlKey ){
        this.toot();
      }
    }
  }
}
