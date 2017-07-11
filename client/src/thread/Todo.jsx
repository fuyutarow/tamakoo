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
    this.props.actions.anchor(this.props.value.signinAcc.alias, this.props.card.note.id, this.props.order, form);
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
      this.props.card.mode=='winded'|| this.props.card.mode=='drawn'?
        <Link style={styles.userleft} to={'/account/'+this.props.card.account.alias}>
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

    const textln = this.props.card.note.text.split('\n')
      .map( m => (<p style={styles.ln}>{hrefer(m)}</p>) )

    let imgln = null;
    try{
      imgln = this.props.card.note.imgs.length?
      this.props.card.note.imgs.map( m => (
        <p>
          <img src={m} style={{width:'100%',height:'auto'}}/>
        </p>))
      :null 
    }catch(err){}
       
    const responseForm =
      <div style={styles.toot}>
        <input style={styles.textarea} type='text' ref='note'
          placeholder='>> response'/>
        <img draggable='false' style={styles.button}
          alt='🗨' src='https://twemoji.maxcdn.com/2/72x72/1f5e8.png'
          onClick={e=>this.anchor()}
        />
      </div>

    const cardCenter =
      this.props.card.mode=='tooted'?
        <p style={styles.cardcenter}> 
          { this.props.card.note.id }
          { textln }
          { imgln }
          { responseForm }
        </p>

      :this.props.card.mode=='winded' || this.props.card.mode=='block' || this.props.card.mode=='drawn'?
        <p style={styles.cardcenter} onClick={e=>this.callCard()}>
          { this.props.card.note.id }
          { textln }
          { imgln }
        </p>

      :this.props.card.mode=='called' ?
        <p style={styles.cardcenter}>
          <Link to={'/account/'+this.props.card.account.alias}>
            <h3 onClick={e=>{
            }}>{this.props.card.account.name}</h3>
          </Link>
          { this.props.card.note.id }
          { textln }
          { imgln }
          { responseForm }
        </p>

      :null

    const copyRight = this.props.card.note.url=='None'?
       <p style={styles.linkOff}></p>
       :
       <p style={styles.linkOn}></p>


   const cardStyle =
    this.props.card.mode=='tooted' || this.props.card.mode=='block' || this.props.card.mode=='called' ?
      styles.nowToot
    :this.props.card.mode=='winded' || this.props.card.mode=='drawn' ?
      styles.card
    :null;

    return (
      <div style={cardStyle} ref='card'>
        {userLeft}
        {cardCenter}
        {copyRight}
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
