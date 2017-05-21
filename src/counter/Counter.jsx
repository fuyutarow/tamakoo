// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import type {CounterState, ActionDispatcher} from "./module"
import TodoList from './TodoList';

interface Props {
  value: CounterState;
  actions: ActionDispatcher;
};

export class Counter extends React.Component<void, Props, void> {
  addTask() {
    const task = (ReactDOM.findDOMNode(this.refs.task)).value;
    if( task=="" ) return;
    this.props.actions.addTask(task);
    (ReactDOM.findDOMNode(this.refs.task)).value = "";
  }

  render() {
    return (
      <div>
        {(this.props.value.loadingCount === 0) ? null : <p>loading</p>}
        <p>{`score: ${this.props.value.num}`}</p>
        <button onClick={() => this.props.actions.increment(3)}>Increment 3</button>
        <button onClick={() => this.props.actions.decrement(2)}>Decrement 2</button>
        <button onClick={() => this.props.actions.asyncIncrement()}>async Increment 100</button>
        <TodoList tasks={this.props.value.tasks} />
        <p>
          <input type='text' ref='task' />
          <button onClick={()=>this.addTask()} >add</button>
          <button onClick={() => this.props.actions.asyncAdd()}>async add task</button>
        </p>
      </div>
    )
  }

  componentDidMount() {
    document.onkeydown = e => {
      if( e.key=='Enter' && e.ctrlKey ){
        this.addTask();
      }
    }
  }
}
