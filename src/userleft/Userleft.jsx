// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import type {CounterState, ActionDispatcher} from "../module"
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {Link, Route} from 'react-router-dom';
import { styleOn } from './css';
import AddButtonSVG from '../../assets/svg/add-button-inside-black-circle.svg';
import TodoList from './TodoList';

interface Props {
  value: CounterState;
  actions: ActionDispatcher;
};

export class Userleft extends React.Component<void, Props, void> {

  componentWillMount(){
    this.styles = styleOn(screen.width);
    this.props.actions.hisToot(this.props.match.params.id)
    console.log(this.props.match.params.id);
    console.log(this.props);
  }

  render() {
    return (
      <div style={this.styles.wall}>
        <div id='crown'>
          <h2>{this.props.value.userInfo.user_name}</h2>
          <p>{this.props.value.userInfo.user_bio}</p>
        </div>
        <hr/>
        <div style={this.styles.timeline}>
          <TodoList value={this.props.value} actions={this.props.actions} />
        </div>
        <div style={this.styles.bar}>
          <Link to='/' onClick={e=>{
            this.props.actions.movePage()
          }}>
            <img style={this.styles.newTab} src={AddButtonSVG} />
          </Link>
        </div>
      </div>
    )
  }

  componentDidUpdate() {
    location.hash='crown';
  }
}
