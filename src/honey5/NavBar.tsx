import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AppBar, MenuItem, Drawer } from 'material-ui';
import ActionFlightTakeoff from 'material-ui/svg-icons/action/flight-takeoff';
import {red500, yellow500, blue500} from 'material-ui/styles/colors';

export default class NavBar extends React.Component<any,{}> {
  render() {
    const iconStyles = {
      marginRight: 24,
    };
    return (
      <MuiThemeProvider>
        <div>
          <Drawer
            docked={false}
            width={200}
            open={this.props.open}
            onRequestChange={() => this.props.onToggle()}
          >
            <MenuItem>React</MenuItem>
            <MenuItem>Redux</MenuItem>
            <MenuItem>React Router</MenuItem>
            <MenuItem>Material UI</MenuItem>
            <MenuItem>Electron</MenuItem>
          </Drawer>
          <AppBar
            title="React Study"
            onLeftIconButtonTouchTap={ () => this.props.onToggle()}
            iconElementRight={
              <a target="_blank" href="http://localhost:8080/dist/">
                  <ActionFlightTakeoff style={iconStyles} color={red500} />
              </a>}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}
