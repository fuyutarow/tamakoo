import * as React from 'react';
import { ActionDispatcher, Task } from './module';
import {
  AppBar, MenuItem,
  Card, CardHeader, CardText, CardActions,
  Checkbox
  } from 'material-ui';
import { styleOn } from './css';
import { Link, Route } from 'react-router-dom';
import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react';
//<VelocityComponent ref="velocity" key={'bounce'} animation={'transition.bounceIn'}>

export default class Todo extends React.Component<Props, void> {
  x:number;

  componentWillMount(){
    location.hash = '';
    this.isTap = false;
    this.linkDisabled = false;
    this.styles = styleOn(screen.width);
  }

  componentWillUpdate(){
    this.isToot = (this.props.task.mode=='toot')
    this.isCalled = (this.props.task.mode=='called')
  }

  render() {
    const linkStyle = this.props.task.url=='None'?
      this.styles.linkOff : this.styles.linkOn;
    const cardStyle = (this.isToot || this.isCalled)?
      this.styles.nowToot : this.styles.card;

    const anchorPart = !this.isCalled? null :
      <p>
        <textarea style={this.styles.textarea} type='text' ref='note'
          placeholder=">>"/>
        <button style={this.styles.button} ref="echobtn" onClick={e=>this.anchor()}>
          echo
        </button>
      </p>
    return (
      <div style={cardStyle} ref='card'
        onTouchStart={e=>{
          if( !this.props.value.touchAble ) return;
          if( this.isCalled ) return;
          this.x=e.changedTouches[0].pageX
          this.isTap = true;
        }}
        onTouchMove={e=>{
          if( !this.props.value.touchAble ) return;
          if( this.isCalled ) return;
          this.isTap = false;
          if( !this.linkDisabled && this.x - e.changedTouches[0].pageX > 80 ){
            if( this.props.task.url=='None') return;
            window.open(this.props.task.url,'_blank');
          }
        }}
        onTouchEnd={e=>{
          if( !this.props.value.touchAble ) return;
          if( this.isCalled ) return;
          if(this.linkDisabeld){
            e.preventDefault()
          }else{
            this.linkDisabled = true;
            setTimeout(() => { this.linkDisabled = false }, 500);
          }
          if(this.isTap){
            this.isTap = false;
            this.callCard();
          }
        }}
      >
        <p style={this.styles.text}>
          {this.props.task.text.split('\n')
            .map( m => (<p style={this.styles.ln}>{m}</p>) )}
          { anchorPart }
        </p>
        <p style={linkStyle} />
      </div>
    );
  }

    callCard(){
      const card = this.refs.card;
      card.style = this.styles.nowToot;
      this.props.actions.callCard(this.props.task.card_id, this.props.order);
    }

    componentDidMount() {
      if( this.linkDisabled ){
        setTimeout(() => {this.linkDisabled = false }, 500);
      }

      const card = this.refs.card;
      if( this.isCalled ){
        card.id='nowToot'
      }
    }

}
