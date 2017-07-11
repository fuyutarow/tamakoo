// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { history } from '../../Index';
import { browserHistory } from 'react-router';

import _ from 'underscore';
import { CounterState, ActionDispatcher } from "../../module";
import Tool from '../../Tool';
interface Props {
  value: CounterState;
  actions: ActionDispatcher;
};

const zeropad = (a:string) => ((''+a).length < 2)? '0'+a : a;

export class SignupUser extends React.Component<Props, void> {

  signup(){
    const given = this.refs.given.value;
    const family = this.refs.family.value;
    const year = this.refs.year.value;
    const month = this.refs.month.value;
    const day = this.refs.day.value.length;
    const gender = this.refs.gender.value;
    const handle = this.refs.handle.value;

    if(!!(given&&family&&year&&month&&day&&gender) ){
      const user = {
        mailaddr: this.props.match.params.id,
        givenname: given,
        familyname: family,
        birthday: year+month+day,
        gender: gender,
        hasAcc: [
          { handle:handle }
        ]
      }
      console.log(user)
      this.props.actions.signup(user);
      history.push('/thanks-signup')
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
    if(!handle){
      this.refs.handle.style['borderStyle'] = 'all';
      this.refs.handle.style['borderWidth'] = '1px';
      this.refs.handle.style['borderColor'] = 'rgb(248, 6, 6)';
      this.refs.handle.style['backgroundColor'] = 'rgb(255, 178, 220)';
    }

    if(given){
      this.refs.given.style['background'] = '#fff';
      this.refs.given.style['borderColor'] = '#A9A9A9';
    }
    if(family){
      this.refs.family.style['background'] = '#fff';
      this.refs.family.style['borderColor'] = '#A9A9A9';
    }
    if(year){
      this.refs.year.style['background'] = '#fff';
      this.refs.year.style['borderColor'] = '#A9A9A9';
    }
    if(month){
      this.refs.month.style['background'] = '#fff';
      this.refs.month.style['borderColor'] = '#A9A9A9';
    }
    if(day){
      this.refs.day.style['background'] = '#fff';
      this.refs.day.style['borderColor'] = '#A9A9A9';
    }
    if(gender){
      this.refs.gender.style['background'] = '#fff';
      this.refs.gender.style['borderColor'] = '#A9A9A9';
    }
    if(handle){
      this.refs.handle.style['background'] = '#fff';
      this.refs.handle.style['borderColor'] = '#A9A9A9';
    }

  }

  render() {
    const mailaddr = 
        <div style={{
          gridColumn: '1/13',
          backgroundColor: '#dddddd',
        }}>{ this.props.match.params.id }</div>

    const birthYear =
        <select style={{gridColumn:'1/4'}} ref='year' required>
          <option value='' disabled='disabled' selected>Year</option>
          {_.range(100).map( a => <option value={a}>{a+1917}</option> )}
        </select>

    const birthMonth =
        <select style={{gridColumn:'5/8'}} ref='month' required>
          <option value='' disabled='disabled' selected>Month</option>
          {_.range(12).map( a => <option value={zeropad(a+1)}>{zeropad(a+1)}</option> )}
        </select>

    const birthDay =
        <select style={{gridColumn:'9/12'}} ref='day' required>
          <option value='' disabled='disabled' selected>Day</option>
          {_.range(31).map( a => <option value={zeropad(a+1)}>{zeropad(a+1)}</option> )}
        </select>
    

    const gender = 
        <select style={{
            gridColumn:'1/13',
        }} name='Gender' ref='gender'>
          <option value='' disabled='disabled' selected>Gender</option>
          <option value='FEMALE'>Female</option>
          <option value='MALE'>Male</option>
          <option value='OTHER'>Other</option>
        </select>

    const handle =
        <input style={{
            gridColumn:'1/13',
        }} type='text' placeholder='handle name' ref='handle' spellcheck='false'/>

    const btn =
        <button style={{
          gridColumn:'1/13',
          color: '#fff',
          backgroundColor: 'rgb(0, 188, 212)',
          borderStyle: 'none',
          WebkitBorderRadius: '10px',
          fontSize: '20px',
        }} placeholder='Signup' onClick={e=>this.signup()}>Sign up</button>
         
    //<input style={} type='text' placeholder='handle name' ref='handle' />
    const res = 
      <div style={{
        color: 'rgba(0, 0, 0, 0.87)',
        //position: 'absolute',
        position: 'fixed',
        left: '50vw',
        //width: '234px',
        width: '300px',
        background: 'none',
        textAlign: 'center',
        margin: '10vh auto 0% -150px',
        fontSize: '14px',
        display: 'grid',
        //gridAutoRows: '40px',
        gridTemplateRows: '20px 40px 20px 40px 20px 40px 20px 40px 20px 40px 20px 40px',
        gridRowGap: '5px',
        //gridTemplateColumns: 'calc(100%/6) calc(100%/6) calc(100%/6) calc(100%/6) calc(100%/6) calc(100%/6)',
        gridTemplateColumns:  _.range(12).map(a=> 300/12+'px').join(' '),
        //gridTemplateColumns:  _.range(60).map(a=> '60fr').join(' '),
        //gridGap: '10px',
      }}>
        <legend style={{gridColumn:'1/13'}}>メールアドレス</legend>
        { mailaddr } 
        <legend style={{gridColumn:'1/13'}}>名前</legend>
        <input style={{gridColumn:'1/7'}} type='text' placeholder='上の名前' ref='given' spellcheck='false'/>
        <input style={{gridColumn:'7/13'}} type='text' placeholder='下の名前' ref='family' spellcheck='false'/>
        <legend style={{gridColumn:'1/13'}}>誕生日</legend>
        { birthYear }年
        { birthMonth }月
        { birthDay }日
        <legend style={{gridColumn:'1/13'}}>性別</legend>
        { gender }
        <legend style={{gridColumn:'1/13'}}>表示される名前</legend>
        { handle }
        <legend style={{gridColumn:'1/13'}}></legend>
        { btn }
        <Tool value={this.props.value} actions={this.props.actions} />
      </div>

    return res
  }
}
