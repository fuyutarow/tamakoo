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
    gridTemplateRows: '40px 40px 40px 40px',
    gridTemplateColumns: 'calc(100%/6) calc(100%/6) calc(100%/6) calc(100%/6) calc(100%/6) calc(100%/6)',
    gridGap: '10px',
  },
  btn: {
    gridArea:'4/1/5/7',
    color: '#fff',
    backgroundColor: 'rgb(0, 188, 212)',
    borderStyle: 'none',
    WebkitBorderRadius: '10px',
    fontSize: '20px',
  }
}}

export class SignupUser extends React.Component<Props, void> {
  componentWillMount(){
    this.styles = styles(screen.width);
  }

  signup(){
    const given = this.refs.given.value;
    const family = this.refs.family.value;
    const year = this.refs.year.value;
    const month = this.refs.month.value;
    const day = this.refs.day.value;
    const gender = this.refs.gender.value;

    if(!!(given&&family&&year&&month&&day&&gender)){
      const user = {
        mailaddr: this.props.match.params.id,
        givenname: given,
        familyname: family,
        birthday: year+month+day,
        gender: gender,
      }
      this.props.actions.signup(user);
      location.href='/signup/sended';
    }

    if(!given){
      this.refs.given.style['borderStyle'] = 'all';
      this.refs.given.style['borderWidth'] = '1px';
      this.refs.given.style['borderColor'] = 'rgb(248, 6, 6)';
      this.refs.given.style['backgroundColor'] = 'rgb(255, 178, 220)';
    }
    if(!family){
      this.refs.family.style['borderStyle'] = 'all';
      this.refs.family.style['borderWidth'] = '1px';
      this.refs.family.style['borderColor'] = 'rgb(248, 6, 6)';
      this.refs.family.style['backgroundColor'] = 'rgb(255, 178, 220)';
    }
    if(!year){
      this.refs.year.style['borderStyle'] = 'all';
      this.refs.year.style['borderWidth'] = '1px';
      this.refs.year.style['borderColor'] = 'rgb(248, 6, 6)';
      this.refs.year.style['backgroundColor'] = 'rgb(255, 178, 220)';
    }
    if(!month){
      this.refs.month.style['borderStyle'] = 'all';
      this.refs.month.style['borderWidth'] = '1px';
      this.refs.month.style['borderColor'] = 'rgb(248, 6, 6)';
      this.refs.month.style['backgroundColor'] = 'rgb(255, 178, 220)';
    }
    if(!day){
      this.refs.day.style['borderStyle'] = 'all';
      this.refs.day.style['borderWidth'] = '1px';
      this.refs.day.style['borderColor'] = 'rgb(248, 6, 6)';
      this.refs.day.style['backgroundColor'] = 'rgb(255, 178, 220)';
    }
    if(!gender){
      this.refs.gender.style['borderStyle'] = 'all';
      this.refs.gender.style['borderWidth'] = '1px';
      this.refs.gender.style['borderColor'] = 'rgb(248, 6, 6)';
      this.refs.gender.style['backgroundColor'] = 'rgb(255, 178, 220)';
    }

    if(given){
      this.refs.given.style['background'] = 'none';
      this.refs.given.style['borderColor'] = '#A9A9A9';
    }
    if(family){
      this.refs.family.style['background'] = 'none';
      this.refs.family.style['borderColor'] = '#A9A9A9';
    }
    if(year){
      this.refs.year.style['background'] = 'none';
      this.refs.year.style['borderColor'] = '#A9A9A9';
    }
    if(month){
      this.refs.month.style['background'] = 'none';
      this.refs.month.style['borderColor'] = '#A9A9A9';
    }
    if(day){
      this.refs.day.style['background'] = 'none';
      this.refs.day.style['borderColor'] = '#A9A9A9';
    }
    if(gender){
      this.refs.gender.style['background'] = 'none';
      this.refs.gender.style['borderColor'] = '#A9A9A9';
    }

  }

  render() {
    return (
      <div style={this.styles.signup}>
        <input style={{gridArea:'1/1/2/4'}} type='text' placeholder='Given name' ref='given' spellcheck='false'/>
        <input style={{gridArea:'1/4/2/7'}} type='text' placeholder='Family name' ref='family' spellcheck='false'/>
        <input style={{gridArea:'2/1/3/3'}} type='number' min='1990' max='2100' maxlength='4' placeholder='Year' ref='year' />
        <select style={{gridArea:'2/3/3/5'}} placeholder='Month' ref='month' >
          <option value='' disabled='disabled' selected>Month</option>
          <option value='01'>January</option>
          <option value='02'>February</option>
          <option value='03'>March</option>
          <option value='04'>April</option>
          <option value='05'>May</option>
          <option value='06'>June</option>
          <option value='07'>July</option>
          <option value='08'>August</option>
          <option value='09'>September</option>
          <option value='10'>October</option>
          <option value='11'>November</option>
          <option value='12'>December</option>
        </select>
        <input style={{gridArea:'2/5/3/7'}} type='number' min='1' max='31' maxlength='2' placeholder='Day' ref='day' />
        <select style={{gridArea:'3/1/4/7'}} name='Gender' ref='gender'>
          <option value='' disabled='disabled' selected>Gender</option>
          <option value='FEMALE'>Female</option>
          <option value='MALE'>Male</option>
          <option value='OTHER'>Other</option>
        </select>
        <button style={this.styles.btn} placeholder='Signup' onClick={e=>this.signup()}>Sign up</button>
        <Tool value={this.props.value} actions={this.props.actions} />
      </div>

    )
  }
}
