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
    const note = (ReactDOM.findDOMNode(this.refs.note)).value;
    if( note=='' ) return;
    console.log('anchor',note)
    this.props.actions.anchor(this.props.value.signinAcc.alias, this.props.task.card.id, this.props.order, note);
    //history.push('/thread');
    (ReactDOM.findDOMNode(this.refs.note)).value = '';
  }

  callCard(){
    this.props.actions.callCard(this.props.task.card.id);
    history.push('/card/'+this.props.task.card.id) 
  }

  componentWillMount(){
    this.linkDisabled = false;
    this.isTap = false;
    location.hash = '';
  }

  render() {
    const styles = styleOn(screen.width);

    const userLeft =
      this.props.task.mode=='winded'|| this.props.task.mode=='drawn'?
        <Link style={styles.userleft} to={'/account/'+this.props.task.account.alias}>
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

    const textln = this.props.task.card.text.split('\n')
      .map( m => (<p style={styles.ln}>{hrefer(m)}</p>) )

    let imgln = null;
    try{
      imgln = this.props.task.card.imgs.length?
      this.props.task.card.imgs.map( m => (
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
      this.props.task.mode=='tooted'?
        <p style={styles.cardcenter}> 
          { textln }
          { imgln }
          { responseForm }
        </p>

      :this.props.task.mode=='winded' || this.props.task.mode=='block' || this.props.task.mode=='drawn'?
        <p style={styles.cardcenter} onClick={e=>this.callCard()}>
          { textln }
          { imgln }
        </p>

      :this.props.task.mode=='called' ?
        <p style={styles.cardcenter}>
          <Link to={'/account/'+this.props.task.account.alias}>
            <h3 onClick={e=>{
            }}>{this.props.task.account.name}</h3>
          </Link>
          { textln }
          { imgln }
          { responseForm }
        </p>

      :null

    const copyRight = this.props.task.card.url=='None'?
       <p style={styles.linkOff}></p>
       :
       <p style={styles.linkOn}></p>


   const cardStyle =
    this.props.task.mode=='tooted' || this.props.task.mode=='block' || this.props.task.mode=='called' ?
      styles.nowToot
    :this.props.task.mode=='winded' || this.props.task.mode=='drawn' ?
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
      if( this.props.task.mode=='toot' || this.props.task.mode=='called' ){
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
