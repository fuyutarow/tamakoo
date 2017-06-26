import * as React from 'react';
import Todo from './Todo';

const styles = (windowWidth) => { return {
  timeline: {
    backgroundColor: '#fffff9',
    height: '60%',
    fontSize: '16px',
    padding: '0px',
  },
}}

export default class TodoList extends React.Component<Props,{}> {
  componentWillMount(){
    this.styles = styles(screen.width);
  }

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
      <div style={this.styles.timeline}>
        {tasks}
      </div>
    );
  }
}
