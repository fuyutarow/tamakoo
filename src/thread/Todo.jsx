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
    console.log(this.props)

    const styles = styleOn(screen.width);
    const linkStyle = this.props.task.url=='None'?
      styles.linkOff : styles.linkOn;
    const cardStyle = this.props.task.mode=='toot' || this.props.task.mode=='called' ?
      styles.nowToot : styles.card;
    const cardCenter =
      this.props.task.mode=='toot' || this.props.task.mode=='normal' ?
        <p style={styles.text}>
          {this.props.task.text.split('\n')
          .map( m => (<p style={styles.ln}>{m}</p>) )}
        </p>
      :this.props.task.mode=='called' ?
        <p style={styles.text}>
          {this.props.task.text.split('\n')
            .map( m => (<p style={styles.ln}>{m}</p>) )}
          <p>
            <textarea style={styles.textarea} type='text' ref='task'
              placeholder="toot to open tamaKoo"/>
            <button style={styles.button} onClick={()=>this.toot()}>echo</button>
          </p>
        </p>
      :null

    return (
      <div
        style={cardStyle}
        ref='card'
        onTouchStart = { e => {
          if( this.props.value.phase=='loading' ) return;
          this.x=e.changedTouches[0].pageX
          this.isTap = true;
        }}
        onTouchMove = { e => {
          if( this.props.value.phase=='loading' ) return;
          this.isTap = false;
          if( !this.linkDisabled && this.x - e.changedTouches[0].pageX > 80 ){
            if( this.props.task.url=='None') return;
            window.open(this.props.task.url,'_blank');
          }
        }}
        onTouchEnd = { e => {
          if( this.props.value.phase=='loading' ) return;
          if(this.linkDisabeld){
            e.preventDefault()
          }else{
            this.linkDisabled = true;
            setTimeout(() => { this.linkDisabled = false }, 500);
          }
          if(this.isTap){
            this.isTap = false;
            this.props.actions.callCard(this.props.task);
          }
        }}
      >
        {cardCenter}
        <p style={linkStyle}></p>
      </div>
    );
  }

    componentDidMount() {
      const card = this.refs.card;
      if( this.props.task.mode=='toot' || this.props.task.mode=='called' ){
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
