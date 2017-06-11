import * as React from 'react';
import Todo from './Todo';
import { ActionDispatcher, Task } from './module';

export default class TodoList extends React.Component<Props,{}> {
  render() {
    this.props.value.tasks
      .map( a => { console.log(a) })
    const tasks = this.props.value.tasks
      .map( a =>
          <Todo
            task={a}
            actions={this.props.actions}
          /> )
    return (
      <p>
        {tasks}
      </p>
    );
  }
}
