// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import type {CounterState, ActionDispatcher} from "./module"
import TodoList from './TodoList';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {Link, Route} from 'react-router-dom';

interface Props {
  value: CounterState;
  actions: ActionDispatcher;
};

const styles = {
  bar: {
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: 'rgb(0, 188, 212)',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    boxSizing: 'border-box',
    fontFamily: 'Roboto, sans-serif',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
    borderRadius: '0px',
    position: 'fixed',
    zIndex: '9999',
    width: '100%',
    height: '100px',
    display: 'flex',
    paddingLeft: '24px',
    paddingRight: '24px',
    bottom: 0,
  },
  timeline: {
    height: '60%',
  },
  post: {
    height: '30%',
  },
  button: {
    fontSize: '1.4em',
    fontWeight: 'bold',
    padding: '10px 30px',
    borderStyle: 'none',
    backgroundColor:'#248',
    color: '#fff',
  },
  textarea: {
    fontSize: '1.8em',
    width: '100%',
    height: '30%',
  },
  newTab: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: 'none',
    margin: '0 auto',
  },
}

export class Face extends React.Component<void, Props, void> {
  toot() {
    const task = (ReactDOM.findDOMNode(this.refs.task)).value;
    if( task=="" ) return;
    this.props.actions.toot(task);
    (ReactDOM.findDOMNode(this.refs.task)).value = "";
  }

  render() {
    console.log(this.props.value)
    return (
      <div>
        <div style={styles.timeline}>
          {(this.props.value.loadingCount === 0) ? null : <p>loading</p>}
          <TodoList tasks={this.props.value.tasks} />
        </div>
        <div style={styles.post}>
          <textarea style={styles.textarea}type='text' ref='task' />
          <Link to='/thread'>
            <button style={styles.button} onClick={()=>this.toot()} >
              echo
            </button>
          </Link>
        </div>
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
