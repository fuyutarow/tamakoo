import * as React from 'react';
import Todo from './Todo';
import { Honey5State, ActionDispatcher, Task } from './module';

interface Tasks{
  tasks: Task[];
}

export default class TodoList extends React.Component<Tasks,{}> {
  render() {
    const tasks : any[] = this.props.tasks
      .map( a =>
          <Todo
            id={a.id}
            name={a.name}
          /> )
    return (
      <div>
        {tasks}
      </div>
    );
  }
}
