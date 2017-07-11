// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { history } from '../../Index';
import { browserHistory } from 'react-router';

import { CounterState, ActionDispatcher } from "../../module";
import Tool from '../../Tool';
interface Props {
  value: CounterState;
  actions: ActionDispatcher;
};

const styles = (windowWidth) => { return {
  signin: {
    color: 'rgba(0, 0, 0, 0.87)',
    //position: 'absolute',
    position: 'fixed',
    left: '50vw',
    width: '234px',
    background: 'none',
    textAlign: 'center',
    margin: '30vh auto 0% -117px',
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
    WebkitBorderRadius: '20px',
    fontSize: '20px',
  },
}}

export class Signin extends React.Component<Props, void> {
  componentWillMount(){
    this.styles = styles(screen.width);
  }

  send(){
    const mailaddr = this.refs.mailaddr.value;
    this.props.actions.send(mailaddr)
    history.push('/mailentry/sended')
  }

  addAcc(){
    const handle = this.refs.handle.value;
    this.props.actions.addAcc(this.props.value.loginUser.id,handle);
    history.push('/mailentry/sended');
  }


  render() {
    const mailForm =
      <div style={this.styles.signin}>
       <input style={{gridArea:'1/1/2/2'}} type='text' placeholder='your Email address' ref='mailaddr' />
       <button style={this.styles.button} onClick={e=>this.send()}>Send</button>
      </div>

    const handleForm =
      <div style={this.styles.signin}>
       <input style={{gridArea:'1/1/2/2'}} type='text' placeholder='handle name' ref='handle' />
       <button style={this.styles.button} onClick={e=>this.addAcc()}>Add account</button>
      </div>

    const form =
      this.props.value.isLoggedin? handleForm : mailForm

    return (
      <div>
        { form }
        <Tool value={this.props.value} actions={this.props.actions} />
      </div>


    )
  }
}
