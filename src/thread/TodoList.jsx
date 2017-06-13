import * as React from 'react';
import Todo from './Todo';
import { ActionDispatcher, Task } from './module';

export default class TodoList extends React.Component<Props,{}> {
  render() {
    const tasks = this.props.value.tasks
      .map( (a,idx) =>
          <Todo
            task={a}
            order={idx}
            value={this.props.value}
            actions={this.props.actions}
          /> )
    return (
      <p>
        {tasks}
      </p>
    );
  }
}
