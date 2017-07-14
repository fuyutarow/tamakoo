// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import Image from 'react-image-resizer';
import { EditorState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import createMathjaxPlugin from 'draft-js-mathjax-plugin'
 
const mathjaxPlugin = createMathjaxPlugin(/* optional configuration object */)
 
const plugins = [
  mathjaxPlugin,
]

import { history } from '../Index';
import { CounterState, ActionDispatcher } from '../module';
import Tool from '../Tool';
import { styleOn } from './css';
interface Props {
  value: CounterState;
  actions: ActionDispatcher;
};

const styles = {
      toot: {
        color: 'rgba(0, 0, 0, 0.87)',
        position: 'relative',
        display: 'block',
        background: 'none',
        //textAlign: 'center',
        margin: '30vh 10% 0% 10%',
      },
      button: {
        width: '40px',
        height: '40px',
        fontSize: '16px',
        fontWeight: 'bold',
        background: 'none',
        //backgroundColor:'#ffdb58',
        color: '#fff',
        display: 'flex',
        borderRadius: '0',
        padding: '0',
        margin: '3px 0px 0px 0px',
        position: 'absolute',
        right: '0',
        top: '0',
        },

}

export class TootEditor extends React.Component<void, Props, void> {
  componentWillMount() {
    //super(props)
    this.styles = styles;
    this.state = {
      editorState: EditorState.createEmpty(),
    }
  }

  onChange(editorState) {
    this.setState({editorState})
  }

  toot() {
    const noteText = this.state.editorState.getCurrentContent().getPlainText();
    if( ! noteText ) return;
    this.props.actions.setState({ isLoading: true })
    history.push('/echo/'+noteText)
  }

  render() {
    console.log('>>>>>>>>>>', this)

   const textForm = 
      <div
        style={{
          fontSize: '16px',
          height: '40px',
          width: '85%',
          paddingLeft: '0',
          position: 'relative',
          background: 'none',
          display: 'block',
          marginTop: '0em',
          margin: '0px',
          borderStyle: 'none',
          backgroundColor:'#fff',
        }}
        ref="editor"
      >
      <Editor
        editorState={this.state.editorState}
        onChange={this.onChange.bind(this)}
      />
      </div>

    return (
      <div style={this.styles.toot}>
        { textForm }
        <img draggable='false' style={this.styles.button}
          alt='🗨' src='https://twemoji.maxcdn.com/2/72x72/1f5e8.png'
          onClick={e=>this.toot()}
        />
      </div>
    )
  }

  componentDidMount() {
    window.addEventListener('keypress', e => {
      if( e.keyCode==13 && e.shiftKey ){
        this.toot();
      }
    })
  }
}
