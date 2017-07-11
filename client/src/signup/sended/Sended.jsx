// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { history } from '../../Index';

import { CounterState, ActionDispatcher } from "../../module";
import Tool from '../../Tool';

interface Props {
  value: CounterState;
  actions: ActionDispatcher;
};

const styles = (windowWidth) => { return {
  toot: {
    color: 'rgba(0, 0, 0, 0.87)',
    //position: 'absolute',
    position: 'fixed',
    left: '50vw',
    width: '234px',
    background: 'none',
    textAlign: 'center',
    margin: '30vh auto 0% -141px',
  },
  form: {
    width: '100%',
    fontSize: '28px',
    display: 'grid',
    gridTemplateRows: '40px 40px 40px 40px 40px',
    gridTemplateColumns: 'calc(100%/6) calc(100%/6) calc(100%/6) calc(100%/6) calc(100%/6) calc(100%/6)',
    gridGap: '10px',
  },
  button: {
    gridArea:'3/1/4/7',
    color: '#fff',
    backgroundColor: 'rgb(0, 188, 212)',
    borderStyle: 'none',
    WebkitBorderRadius: '10px',
    fontSize: '20px',
  },

}}

export class Sended extends React.Component<Props, void> {
  componentWillMount(){
    this.styles = styles(screen.width);
  }

  signin(){
    history.push('/entry/'+this.props.value.user4signup.alias)
  }


  render() {
    const form = 
      this.props.value.user4signup?
       <div style={this.styles.form}>
         <div style={{gridArea:'1/1/2/7'}}>Thanks sign up.</div>
         <input style={{gridArea:'2/1/3/3'}} type='text'
           placeholder={this.props.value.user4signup.handle} ref='handle' />
         <dev style={{gridArea:'2/3/3/4'}}>@</dev>
         <input style={{gridArea:'2/4/3/7'}} type='text'
           placeholder={this.props.value.user4signup.alias} ref='alias' />
         <button style={this.styles.button} onClick={e=>this.signin()}>Sign in</button>
         <Tool value={this.props.value} actions={this.props.actions} />
        </div>
      :
        <div style={this.styles.form}>
          please wait.
        </div>

    return (
      <div style={this.styles.toot}>
        { form }
      </div>

    )
  }
}
