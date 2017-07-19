import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ActionDispatcher, Task } from '../module';
import { history } from '../Index';
import {
  AppBar, MenuItem,
  Card, CardHeader, CardText, CardActions,
  Checkbox
  } from 'material-ui';
import { styleOn } from './css';
import { Link, Route } from 'react-router-dom';

export default class Todo extends React.Component<Props, void> {
  x:number;
  linkDisabled;
  isTap;

  anchor() {
    const voice = (ReactDOM.findDOMNode(this.refs.voice)).value;
    if( voice=='' ) return;
    this.props.actions.anchor(this.props.value.signinAcc.alias, this.props.card.note.id, this.props.order, voice);
    (ReactDOM.findDOMNode(this.refs.voice)).value = '';
  }

  callCard(){
    this.props.actions.callCard(this.props.card.note.id);
    history.push('/card/'+this.props.card.note.id) 
  }

  componentWillMount(){
    this.linkDisabled = false;
    this.isTap = false;
    location.hash = '';
  }

  render() {
    const styles = styleOn(screen.width);

    const userLeft =
      this.props.card.mode=='winded'|| this.props.card.mode=='drawn' || this.props.card.mode=='block'?
        <Link style={{
          gridColumn: '1/2',  
          listStyle: 'none',
          margin: '5px 5px 5px 10px',
          width: '6vw',
          height: '6vw',
          borderRadius: '3vw',
          backgroundColor: '#'+Math.floor(Math.random()*parseInt('ffffff',16)).toString(16),
        }} to={'/account/'+this.props.card.account.alias}>
          <div onClick={e=>{
          }}/>
        </Link>
      :null

    const hrefer = (text:string) => {
      if(text.match(/(http:\/\/[\x21-\x7e]+)/gi) || text.match(/(https:\/\/[\x21-\x7e]+)/gi)){ 
        text
          .replace(/(http:\/\/[\x21-\x7e]+)/gi, '$1')
          .replace(/(https:\/\/[\x21-\x7e]+)/gi,'$1')
        return <a href={text}>{text}</a> 
      }
      return text
      }   

    const textln = this.props.card.note.text.split('\n').filter( a => a!='')
      .map( m => (<p style={{
        padding: '5px',
        margin: '0px',
        wordWrap: 'break-word',
      }}>{hrefer(m)}</p>) )

    let imgdiv = null;
    try{
     imgdiv = this.props.card.note.imgs.length?
        this.props.card.note.imgs.map( m => (
          <img src={m} style={{
            gridColumn: '1/4',  
            margin: '2px 0 2px 0',
            width: '100%',
            height: 'auto',
            borderRadius: '10px',
          }}/>
         ))
     :null
    }catch(err){}
 
    const cardFooter = 
       <div styles={{ fontSize:'8px' }}>
          {
            !this.props.card.note.depth1? null:
            <div styles={{ padding:'0 10 0 10' }}>{ this.props.card.note.depth1 }</div>
          }
          {
            this.props.card.note.url=='None'? null:
            <a href={this.props.card.note.url}>[Link]</a>
          }
       </div>

    const cardCenter =
      this.props.card.mode=='tooted' || this.props.card.mode=='block'?
        <div style={{
          gridColumn: '2/3',
          listStyle: 'none',
          padding: '0 0 0 10px',
        }}> 
          { textln }
          { cardFooter }
        </div>

      :this.props.card.mode=='called' ?
        <div style={{
          gridColumn: '2/3',
          listStyle: 'none',
          padding: '0 0 0 10px',
        }}> 
          <Link to={'/account/'+this.props.card.account.alias}>
            <h3 onClick={e=>{
            }}>{this.props.card.account.handle}@{this.props.card.account.alias}</h3>
          </Link>
          { textln }
          { cardFooter }
        </div>
      
      :this.props.card.mode=='winded' || this.props.card.mode=='drawn' ?
        <div style={{
          gridColumn: '2/3',
          listStyle: 'none',
          padding: '0 0 0 10px',
        }} onClick={e=>this.callCard()}>
          { textln }
          { cardFooter }
        </div>

      :null

    let copyRight = <p style={styles.linkOff}></p>;
    try{
      const copyRight = this.props.card.note.url=='None'?
        <p style={{
          gridColumn: '3/4',
          backgroundColor: '#fff',
          listStyle: 'none',
        }}></p>
      :
        <p style={{
          gridColumn: '3/4',
          backgroundColor: '#fff',
          listStyle: 'none',
        }}></p>;
    }catch(err){}
       
   const cardStyle =
    this.props.card.mode=='tooted' || this.props.card.mode=='block' || this.props.card.mode=='called' ?
      styles.nowToot
    :this.props.card.mode=='winded' || this.props.card.mode=='drawn' ?
      styles.card
    :null;

    return (
      <div style={{
        margin: '10px 0 10px 0',
        padding: '10px 0 10px 0',
        color: 'rgba(0, 0, 0, 0.87)',
        backgroundColor: 'white',
        transition: 'all 450ms cubicBezier(0.23, 1, 0.32, 1) 0ms',
        boxSizing: 'borderBox',
        fontFamily: 'Roboto, sansSerif',
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
        borderRadius: '2px',
        zIndex: '1',
        display: 'grid',
        gridTemplateColumns: '8% 90% 2%',
      }} ref='card'>
        { userLeft }
        { cardCenter }
        { copyRight }
        { imgdiv }
      </div>
    );
  }

    componentDidMount() {
      const card = this.refs.card;
      if( this.props.card.mode=='toot' || this.props.card.mode=='called' ){
        card.id='flash'
      }
      if( this.linkDisabled ){
        setTimeout(() => {this.linkDisabled = false }, 500);
      }
    }

    componentDidUpdate() {
      location.hash='flash';
    }
}
