import * as React from 'react';
import Todo from './Todo';
import { TootEditor } from './TootEditor';

const styles = (windowWidth) => { return {
  timeline: {
    backgroundColor: 'rgb(0,0,0,0)',
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
          <Todo
            card={a}
            order={idx}
            actions={this.props.actions}
            match={this.props.match}
            value={this.props.value}
          />
        )
//    cards.splice(1,0, 
//      <TootEditor actions={this.props.actions} match={this.props.match} value={this.props.value} />
//    )
//    console.log(cards) 
    return (
      <div style={this.styles.timeline}>
        { cards }
      </div>
    );
  }
}
