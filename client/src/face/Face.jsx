// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import Image from 'react-image-resizer';

import { history } from '../Index';
import { CounterState, ActionDispatcher } from '../module';
import { TootEditor } from './TootEditor';
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
    console.log('window width: ',window.innerWidth);
    console.log('screen width: ',screen.width,screen.height);
    console.log('client width: ',document.documentElement.clientWidth);
    this.styles = styleOn(screen.width);
    if( this.props.match.path=='/entry/:alias' ){
      this.props.actions.entry(this.props.match.params.alias)
    }
  }

  toot() {
    const editor = (ReactDOM.findDOMNode(this.refs.editor));
    console.log(editor)
    if( editor.value=='' ) return;
    this.props.actions.setState({ isLoading: true })
    history.push('/echo/'+editor.value)
    note.value = '';
  }

  componentWillUpdate(){
    this.props.actions.entry(this.props.match.params.id)
  }

  render() {
    console.log('^^^',this.props)

    const styles = styleOn(screen.width);
    const sw =
      window.location.href=='tamakoo.com'?
        <button onClick={e=>{
          locations.href='tamakoo.com'
        }}>prod</button>
      :
        <button onClick={e=>{
          locations.href='dev.tamakoo.com'
        }}>dev</button>
          
//    const textForm = 
//      <div
//        style={{
//          fontSize: '16px',
//          height: '40px',
//          width: '85%',
//          paddingLeft: '0',
//          position: 'relative',
//          background: 'none',
//          display: 'block',
//          marginTop: '0em',
//          margin: '0px',
//          borderStyle: 'none',
//          backgroundColor:'#fff',
//        }}
//        ref="editor"
//      >
//      <Editor
//        editorState={this.state.editorState}
//        onChange={this.onChange.bind(this)}
//      />
//      </div>

    console.log(this)
    return (
      <div style={this.styles.toot}>
        <TootEditor actions={this.props.actions} match={this.props.match} value={this.props.value} />
        <Tool actions={this.props.actions} match={this.props.match} value={this.props.value} />
      </div>
    )
  }
//        <img draggable='false' style={this.styles.button}
//          alt='🗨' src='https://twemoji.maxcdn.com/2/72x72/1f5e8.png'
//          onClick={e=>this.toot()}
//        />

  componentDidMount() {
    window.addEventListener('keypress', e => {
      if( e.keyCode==13 && e.shiftKey ){
        this.toot();
      }
    })

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
