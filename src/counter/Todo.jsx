import * as React from 'react';
import { ActionDispatcher, Task } from './module';
import {
  AppBar, MenuItem,
  Card, CardHeader, CardText, CardActions,
  Checkbox
  } from 'material-ui';


const styles = {
  block: {
    maxWidth: 250,
  },
  text: {
    fontSize: '1.8em',

  },
  checkbox: {
    marginBottom: 16,
  },
};

export default class Todo extends React.Component<Task,{}> {
  render() {
    return (
        <p><Card>
          <CardHeader title={this.props.id}>
            okok
          </CardHeader>
          <CardText style={styles.text}>{
            this.props.name.split("\n")
              .map( m => (<p>{m}</p>) )
          }
          </CardText>
          <CardActions>
          <Checkbox
            label="Simple"
            style={styles.checkbox}
          />
          </CardActions>
        </Card></p>
    );
  }
}
