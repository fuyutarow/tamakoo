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
  textarea: {
    fontSize: '16px',
    height: '40px',
    width: '85%',
    paddingLeft: '0',
    position: 'relative',
    background: 'none',
    display: 'block',
    marginTop: '0em',
    margin: '0px',
    borderStyle: 'none',
  },
  button: {
    width: '40px',
    height: '30px',
    display: 'flex',
    borderRadius: '0',
    margin: '5px 0 5px 0',
    position: 'absolute',
    right: '0',
    top: '0',
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '4px 1px 4px 2px',
    borderStyle: 'none',
    backgroundColor:'#248',
    color: '#fff',
  },
}}

export class Sended extends React.Component<Props, void> {
  componentWillMount(){
    this.styles = styles(screen.width);
  }

  send(){
    const mailaddr = this.refs.note.value;
    this.props.actions.entry(mailaddr)
  }

  render() {
    console.log('$$%',this.props.mailaddr)
    return (
      <div style={this.styles.toot}>
        tamakoo.com send email to {this.props.mailaddr}.
        <Tool value={this.props.value} actions={this.props.actions} />
      </div>

    )
  }
}
