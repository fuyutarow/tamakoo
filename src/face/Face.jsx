// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import Image from 'react-image-resizer';
import { history } from '../Index';

import { CounterState, ActionDispatcher } from '../module';
import Bar from './Bar';
import Tool from '../Tool';
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
  componentWillMount(){
    this.styles = styleOn(screen.width);
    //this.props.actions.entry(this.props.match.params.id)
  }

  toot() {
    const note = (ReactDOM.findDOMNode(this.refs.note));
    if( note.value=='' ) return;
    this.props.actions.toot(note.value);
    history.push('/thread')
    note.value = '';
  }

  componentWillUpdate(){
    console.log('^^^',this.props.value)

  }


  render() {

    console.log('window width: ',window.innerWidth);
    console.log('screen width: ',screen.width,screen.height);
    console.log('client width: ',document.documentElement.clientWidth);

    const styles = styleOn(screen.width);

    console.log('^^^',this.props)

    return (
      <div style={this.styles.toot}>
        <input style={this.styles.textarea} type='text' ref='note'
          placeholder='toot to open tamaKoo'/>
        <img draggable='false' style={this.styles.button}
          alt='🗨' src='https://twemoji.maxcdn.com/2/72x72/1f5e8.png'
          onClick={e=>this.toot()}
        />
	      <Tool
          match={this.props.match}
          value={this.props.value}
          actions={this.props.actions}
        />
      </div>
    )
  }

  componentDidMount() {
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
