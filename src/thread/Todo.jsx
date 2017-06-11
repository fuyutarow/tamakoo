import * as React from 'react';
import { ActionDispatcher, Task } from './module';
import {
  AppBar, MenuItem,
  Card, CardHeader, CardText, CardActions,
  Checkbox
  } from 'material-ui';
import { styleOn } from './css';
import { Link, Route } from 'react-router-dom';


export default class Todo extends React.Component<Task,{}> {
  x:number;
  linkDisabled;

  componentWillMount(){
    this.linkDisabled = false;
  }

  render() {
    const styles = styleOn(screen.width);
    const linkStyle = this.props.url=='None'?
      styles.linkOff : styles.linkOn;
    return (

        <div
          style={styles.card}
          ref='card'
          onTouchStart = { e => {
            this.x=e.changedTouches[0].pageX
            console.log(this.x)
          }}
          onTouchMove = { e => {
            if( !this.linkDisabled && this.x - e.changedTouches[0].pageX > 80 ){
              if( this.props.url=='None') return;
              window.open(this.props.url,'_blank');
            }
          }}
          onTouchEnd = { e => {
            if(this.linkDisabeld){
              e.preventDefault()
            }else{
              this.linkDisabled = true;
              setTimeout(() => {this.linkDisabled = false }, 500);
            }
          }}
        >
        <p style={styles.text}>
            {this.props.text.split('\n')
              .map( m => (<p style={styles.ln}>{m}</p>) )}
        </p>
        <p style={linkStyle}></p>
        </div>
    );
  }


  componentDidMount() {
    const card = this.refs.card;

    if( this.linkDisabled ){
      setTimeout(() => {this.linkDisabled = false }, 500);
    }
  }

}
