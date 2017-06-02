import * as React from 'react';
import { ActionDispatcher, Task } from './module';
import {
  AppBar, MenuItem,
  Card, CardHeader, CardText, CardActions,
  Checkbox
  } from 'material-ui';
import { styleOn } from './css';
import { Link, Route } from 'react-router-dom';


export default class Todo extends React.Component<Task,{}> {
  x:number;

  render() {
    const styles = styleOn(screen.width);

    return (
        <Card
          onTouchStart={ e => { this.x=e.changedTouches[0].pageX }}
          onTouchMove={ e => {
            if( this.x - e.changedTouches[0].pageX > 70 ){
              window.open('http://ncode.syosetu.com/n9735cv/','_blank');
            }
          }}
        >
          <CardText style={styles.timeline}>
            {this.props.name.split("\n")
              .map( m => (<p>{m}</p>) )}
          </CardText>
          <CardActions style={styles.timeline}>
            <Checkbox label="+1" />
          </CardActions>
        </Card>
    );
  }

  componentDidMount() {
    document.onkeydown = e => {
      if( e.key=='Enter' && e.ctrlKey ){
        this.addTask();
      }
    }
  }

}
