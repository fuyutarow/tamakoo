// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import type {CounterState, ActionDispatcher} from "../module"
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {Link, Route} from 'react-router-dom';
import { styleOn } from './css';
interface Props {
  value: CounterState;
  actions: ActionDispatcher;
};

if( ('webkitSpeechRecognition' in window) ){
  const speech = new webkitSpeechRecognition();
  speech.lang = 'ja';
  speech.continuous = true;
}

export class Face extends React.Component<void, Props, void> {
  toot() {
    const note = (ReactDOM.findDOMNode(this.refs.note)).value;
    if( note=="" ) return;
    this.props.actions.toot(note);
    (ReactDOM.findDOMNode(this.refs.note)).value = "";
  }

  render() {
    console.log("window width: ",window.innerWidth)
    console.log("screen width: ",screen.width)
    console.log("client width: ",document.documentElement.clientWidth)

    const styles = styleOn(screen.width);

    return (
      <div style={styles.wall}>
        <textarea style={styles.textarea} type='text' ref='note'
          placeholder="toot to open tamaKoo"/>
        <Link to='/thread'>
          <button style={styles.button} ref="echobtn" onClick={e=>this.toot()}>
            echo
          </button>
        </Link>
      </div>
    )
  }

  componentDidMount() {
    document.onkeydown = e => {
    if( e.key=='Enter' && e.ctrlKey ){
      this.toot();
    }
    if( e.key=='t'  && e.shiftKey){
      console.log(echobtn.style);
    }
    }

    if( ('webkitSpeechRecognition' in window) ){

      speech.start();
      speech.onresult = e => {
        for( let i = e.resultIndex; i < e.results.length; ++i ){
          console.log(e.results[i][0].transcript)
          this.refs.note.value = e.results[i][0].transcript;
        }
      }

      const echobtn = this.refs.echobtn;
      echobtn.addEventListener('click', () => {
        const synthes = new SpeechSynthesisUtterance();
        //synthes.voiceURI = 1;
        synthes.volume = 1;// 0 - 1
        synthes.rate = 1;// 0 - 10
        synthes.pitch = 2;// 0 - 2
        synthes.text = this.refs.note.value;
        synthes.lang = 'ja-JP';
        speechSynthesis.speak( synthes );
      }, false);
    }
  }
}
