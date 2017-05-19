import * as React from 'react';
import { Honey5State, ActionDispatcher, Task } from './module';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  AppBar, MenuItem,
  Card, CardHeader, CardText, CardActions,
  Checkbox
  } from 'material-ui';

export default class Todo extends React.Component<Task,{}> {
  render() {
    const styles = {
      block: {
        maxWidth: 250,
      },
      checkbox: {
        marginBottom: 16,
      },
    };
    return (
      <MuiThemeProvider>
        <p><Card>
          <CardHeader
            title={this.props.id}
          >okok
          </CardHeader>
          <CardText>
            <a>{this.props.name}</a>
          </CardText>
          <CardActions>
          <Checkbox
            label="Simple"
            style={styles.checkbox}
          />
          </CardActions>
        </Card></p>

      </MuiThemeProvider>
    );
  }
}
