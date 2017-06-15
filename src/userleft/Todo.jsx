import * as React from 'react';
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
      <Link to={'/user/'+this.props.task.user_id} style={styles.userleft}>
        <p onClick={e=>{
          this.props.actions.askUser(this.props.task.user_id)
        }}></p>
      </Link>

    const cardCenter =
      this.props.task.mode=='toot' || this.props.task.mode=='normal' ?
        <p style={styles.cardcenter} onClick={e=>{
          this.props.actions.callCard(this.props.task);
        }}>
          <Link to='/thread' style={{textDecoration:'none',color:'black'}}><p>
            {this.props.task.text.split('\n')
            .map( m => (<p style={styles.ln}>{m}</p>) )}
          </p></Link>
        </p>

      :this.props.task.mode=='called' ?
        <p style={styles.cardcenter} onClick={e=>{
          this.props.actions.callCard(this.props.task);
        }}>
          <Link to={'/user/'+this.props.task.user_id}>
            <button onClick={e=>{
              this.props.actions.askUser(this.props.task.user_id)
            }}>{this.props.task.user_name}</button>
          </Link>
          <Link to='/thread' style={{textDecoration:'none',color:'black'}}><p>
            {this.props.task.text.split('\n')
            .map( m => (<p style={styles.ln}>{m}</p>) )}
          </p></Link>
          <p>
            <textarea style={styles.textarea} type='text' ref='task'
              placeholder="toot to open tamaKoo"/>
            <button style={styles.button} onClick={()=>this.toot()}>echo</button>
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

    }
}
