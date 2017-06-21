import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ActionDispatcher, Task } from '../module';
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
    if( note=="" ) return;
    this.props.actions.anchor(this.props.task.card_id, this.props.order, note);
    (ReactDOM.findDOMNode(this.refs.note)).value = "";
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
        <div style={styles.userleft}>
          <Link to={'/user/'+this.props.task.user_id} style={styles.userleft}
            onClick={e=>{
              this.props.actions.askUser(this.props.task.user_id)
          }}>
          </Link>
        </div>
      :null

    const textln = this.props.task.text.split('\n')
      .map( m => (<p style={styles.ln}>{m}</p>) )

    const responseForm =
      <div style={styles.toot}>
        <input style={styles.textarea} type='text' ref='note'
          placeholder=">> response"/>
        <Link to='/thread' style={styles.button} ref="echobtn" onClick={e=>this.anchor()}>
          <img draggable="false" style={styles.emoji} alt="🗨" src="https://twemoji.maxcdn.com/2/72x72/1f5e8.png"/>
        </Link>
      </div>

    const cardCenter =
      this.props.task.mode=='tooted'?
        <p style={styles.cardcenter}>
          { textln }
          { responseForm }
        </p>

      :this.props.task.mode=='winded' || this.props.task.mode=='block'?
          <p style={styles.cardcenter}>
            ^
            { textln }
          </p>

      :this.props.task.mode=='drawn' ?
        <p style={styles.cardcenter} onClick={e=>{
          this.props.actions.callCard(this.props.task);
        }}>
          { textln }
        </p>

      :this.props.task.mode=='called' ?
        <p style={styles.cardcenter}>
          <Link to={'/user/'+this.props.task.user_id}>
            <h3 onClick={e=>{
              this.props.actions.askUser(this.props.task.user_id)
            }}>{this.props.task.user_name}</h3>
          </Link>
          { textln }
          { responseForm }
        </p>

      :null

    const copyRight = this.props.task.url=='None'?
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
