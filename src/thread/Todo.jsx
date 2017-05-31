import * as React from 'react';
import { ActionDispatcher, Task } from './module';
import {
  AppBar, MenuItem,
  Card, CardHeader, CardText, CardActions,
  Checkbox
  } from 'material-ui';
import { styleOn } from './css';


export default class Todo extends React.Component<Task,{}> {
  render() {
    const styles = styleOn(screen.width);

    return (
        <p><Card>
          <CardText style={styles.timeline}>
           <p>{this.props.id}</p>
           {
            this.props.name.split("\n")
              .map( m => (<p>{m}</p>) )
          }
          </CardText>
          <CardActions style={styles.timeline}>
            <Checkbox label="+1" />
          </CardActions>
        </Card></p>
    );
  }
}
