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
    const cards = this.props.value.cards
      .map( (a,idx) =>
        <div>
          <Todo
            card={a}
            order={idx}
            actions={this.props.actions}
            match={this.props.match}
            value={this.props.value}
          />
          {a.mode=='tooted'||a.mode=='block'||a.mode=='called'? null: <hr/>}
        </div>
        )
    return (
      <div style={this.styles.timeline}>
        { cards }
      </div>
    );
  }
}
