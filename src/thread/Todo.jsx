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
    const cardStyle = this.props.task.mode=='toot' || this.props.task.mode=='called' ?
      styles.nowToot : styles.card;

    const userLeft =
      <Link to={'/user/'+this.props.task.user_id} style={styles.userleft}
        onClick={e=>{
          this.props.actions.askUser(this.props.task.user_id)
      }}>
      </Link>

    const cardCenter =
      this.props.task.mode=='toot' || this.props.task.mode=='normal' ?
        <p style={styles.cardcenter} onClick={e=>{
          this.props.actions.callCard(this.props.task);
        }}>
          {this.props.task.text.split('\n')
          .map( m => (<p style={styles.ln}>{m}</p>) )}
        </p>

      :this.props.task.mode=='called' ?
        <p style={styles.cardcenter}>
          <Link to={'/user/'+this.props.task.user_id}>
            <h3 onClick={e=>{
              this.props.actions.askUser(this.props.task.user_id)
            }}>{this.props.task.user_name}</h3>
          </Link>
          {this.props.task.text.split('\n')
            .map( m => (<p style={styles.ln}>{m}</p>) )}
          <p>
            <textarea style={styles.textarea} type='text' ref='note'
              placeholder=">>"/>
            <button style={styles.button} onClick={e=>this.anchor()}>echo</button>
          </p>
        </p>

      :null

    const copyRight = this.props.task.url=='None'?
       <p style={styles.linkOff}></p>
       :
       <p style={styles.linkOn}></p>

    return (
      <div
        style={cardStyle}
        ref='card'
      >
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
