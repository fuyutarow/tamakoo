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
  styles;

  componentWillMount(){
    location.hash = '';
    this.isTap = false;
    this.linkDisabled = false;
    this.styles = styleOn(screen.width);
  }

  render() {
    const linkStyle = this.props.task.url=='None'?
      this.styles.linkOff : this.styles.linkOn;
    const cardStyle = this.props.task.nowToot || this.props.task.nowToot=='true'?
      this.styles.nowToot : this.styles.card;
    return (
      <div
        style={cardStyle}
        ref='card'
        onTouchStart = { e => {
          if( !this.props.value.touchAble ) return;
          this.x=e.changedTouches[0].pageX
          this.isTap = true;
        }}
        onTouchMove = { e => {
          if( !this.props.value.touchAble ) return;
          this.isTap = false;
          if( !this.linkDisabled && this.x - e.changedTouches[0].pageX > 80 ){
            if( this.props.task.url=='None') return;
            window.open(this.props.task.url,'_blank');
          }
        }}
        onTouchEnd = { e => {
          if( !this.props.value.touchAble ) return;
          if(this.linkDisabeld){
            e.preventDefault()
          }else{
            this.linkDisabled = true;
            setTimeout(() => { this.linkDisabled = false }, 500);
          }
          if(this.isTap){
            this.isTap = false;
            this.catchCard();
          }
        }}
      >
        <p style={this.styles.text}>
            {this.props.task.text.split('\n')
              .map( m => (<p style={this.styles.ln}>{m}</p>) )}
        </p>
        <p style={linkStyle} />
      </div>
    );
  }



    catchCard(){
      const card = this.refs.card;
      card.style = this.styles.nowToot;
      this.props.actions.catchCard(this.props.task.card_id);
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


}
