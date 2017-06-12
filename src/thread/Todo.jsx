import * as React from 'react';
import { ActionDispatcher, Task } from './module';
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

  componentWillMount(){
    this.linkDisabled = false;
    this.isTap = false;
    location.hash = '';
  }

  render() {
    const styles = styleOn(screen.width);
    const linkStyle = this.props.task.url=='None'?
      styles.linkOff : styles.linkOn;
    const cardStyle = this.props.task.nowToot || this.props.task.nowToot=='true'?
      styles.nowToot : styles.card;

    return (
      <div
        style={cardStyle}
        ref='card'
        onTouchStart = { e => {
          this.x=e.changedTouches[0].pageX
          this.isTap = true;
        }}
        onTouchMove = { e => {
          this.isTap = false;
          if( !this.linkDisabled && this.x - e.changedTouches[0].pageX > 80 ){
            if( this.props.task.url=='None') return;
            window.open(this.props.task.url,'_blank');
          }
        }}
        onTouchEnd = { e => {
          if(this.linkDisabeld){
            e.preventDefault()
          }else{
            this.linkDisabled = true;
            setTimeout(() => { this.linkDisabled = false }, 500);
          }
          if(this.isTap){
            this.isTap = false;
            this.props.actions.catchCard(this.props.task.card_id);
          }
        }}
      >
        <p style={styles.text}>
            {this.props.task.text.split('\n')
              .map( m => (<p style={styles.ln}>{m}</p>) )}
        </p>
        <p style={linkStyle}
          onTouchStart = { e => {
            this.isTap = true;
          }}
          onTouchMove = { e => {
            this.isTap = false;
          }}
          onTouchEnd = { e => {
            if(this.isTap){
              this.isTap = false;
              this.props.actions.catchCard(this.props.task.card_id);
            }
          }}
        >
        </p>
      </div>
    );

  }

    componentDidMount() {
      const card = this.refs.card;
      if( this.props.task.nowToot || this.props.task.nowToot=='true' ){
        card.id='nowToot'
      }
      if( this.linkDisabled ){
        setTimeout(() => {this.linkDisabled = false }, 500);
      }
    }

    componentDidUpdate() {
      location.hash='nowToot';
    }

}
