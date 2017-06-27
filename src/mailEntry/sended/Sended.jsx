// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import { CounterState, ActionDispatcher } from "../../module";
import Tool from '../../Tool';

interface Props {
  value: CounterState;
  actions: ActionDispatcher;
};

const styles = (windowWidth) => { return {
  toot: {
    color: 'rgba(0, 0, 0, 0.87)',
    position: 'relative',
    display: 'block',
    background: 'none',
    textAlign: 'center',
    margin: '30vh 10% 0% 10%',
  },
  signup: {
    color: 'rgba(0, 0, 0, 0.87)',
    //position: 'absolute',
    position: 'fixed',
    left: '50vw',
    width: '234px',
    background: 'none',
    textAlign: 'center',
    margin: '30vh auto 0% -141px',
    fontSize: '28px',
    display: 'grid',
    gridTemplateRows: '40px 40px',
    gridTemplateColumns: '100%',
    gridGap: '10px',
  },
  button: {
    gridArea:'2/1/3/2',
    color: '#fff',
    backgroundColor: 'rgb(0, 188, 212)',
    borderStyle: 'none',
    WebkitBorderRadius: '10px',
    fontSize: '20px',
  }
}}

export class Sended extends React.Component<Props, void> {
  componentWillMount(){
    this.styles = styles(screen.width);
  }

  render() {
    const mailSended =
      this.props.value.mailaddr?
        <div>
          tamakoo.com send email to {this.props.value.mailaddr}.
        </div>
      :
        <div>
          please wait.
        </div>

    const handleSended =
        <div>
          added account.
        </div>

    const sended =
      this.props.value.isLoggedin? handleSended : mailSended

    return (
      <div style={this.styles.toot}>
        { sended }
        <Tool value={this.props.value} actions={this.props.actions} />
      </div>

    )
  }
}
