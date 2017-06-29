// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { history } from '../Index';
import { browserHistory } from 'react-router';

import { CounterState, ActionDispatcher } from "../module";
import Tool from '../Tool';
interface Props {
  value: CounterState;
  actions: ActionDispatcher;
};

const styles = (windowWidth) => { return {
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
    gridTemplateRows: '40px 40px 40px 40px 40px',
    gridTemplateColumns: 'calc(100%/6) calc(100%/6) calc(100%/6) calc(100%/6) calc(100%/6) calc(100%/6)',
    gridGap: '10px',
  },
  btn: {
    gridArea:'5/1/6/7',
    color: '#fff',
    backgroundColor: 'rgb(0, 188, 212)',
    borderStyle: 'none',
    WebkitBorderRadius: '10px',
    fontSize: '20px',
  }
}}

export class Preference extends React.Component<Props, void> {
  componentWillMount(){
    this.styles = styles(screen.width);
    console.log("REFS", this.props.value)
  }

  render() {
    const birthYear = this.props.value.loginUser.birthday.slice(0,4);
    const birthMonth = this.props.value.loginUser.birthday.slice(4,6);
    const birthDay = this.props.value.loginUser.birthday.slice(6,8);

    return (
      <div style={this.styles.signup}>
        <input style={{gridArea:'1/1/2/4'}} type='text' placeholder={this.props.value.loginUser.givenname} ref='given' spellcheck='false'/>
        <input style={{gridArea:'1/4/2/7'}} type='text' placeholder={this.props.value.loginUser.familyname} ref='family' spellcheck='false'/>
        <input style={{gridArea:'2/1/3/3'}} type='number' min='1990' max='2100' maxlength='4' placeholder={birthYear} ref='year' />
        <input style={{gridArea:'2/3/3/4'}} type='number' min='1' max='31' maxlength='2' placeholder={birthMonth} ref='day' />
        <input style={{gridArea:'2/4/3/7'}} type='number' min='1' max='31' maxlength='2' placeholder={birthDay} ref='day' />
        <input style={{gridArea:'3/1/4/7'}} type='text' placeholder={this.props.value.signinAcc.gender} ref='gender' />
        <input style={{gridArea:'4/1/5/3'}} type='text' placeholder={this.props.value.signinAcc.handle} ref='handle' />
        <dev style={{gridArea:'4/3/5/4'}}>@</dev>
        <input style={{gridArea:'4/4/5/7'}} type='text' placeholder={this.props.value.signinAcc.alias} ref='alias' />
        <button style={this.styles.btn} onClick={e=>this.signup()}>Change</button>
        <Tool value={this.props.value} actions={this.props.actions} />
      </div>

    )
  }
}
