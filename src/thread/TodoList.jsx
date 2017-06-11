import * as React from 'react';
import Todo from './Todo';
import { ActionDispatcher, Task } from './module';

interface Tasks{
  tasks: Task[];
}

export default class TodoList extends React.Component<Tasks,{}> {
  constructor(props){
    super();
    this.tasks = props;
  }

  render() {
    const tasks : any[] = this.tasks.tasks
      .map( a =>
          <Todo
            id={a.id}
            text={a.text}
            url={a.url}
          /> )
    return (
      <p>
        {tasks}
      </p>
    );
  }
}
