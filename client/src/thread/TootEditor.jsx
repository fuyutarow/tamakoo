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
      },
      button: {
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

  anchor() {
    const noteText = this.state.editorState.getCurrentContent().getPlainText();
    if( ! noteText ) return;
    this.props.actions.setState({ isLoading: true })
    this.props.actions.anchor(this.props.value.signinAcc.alias, this.props.card.note.id, this.props.order, noteText);
  }

  render() {
    console.log('>>>>>>>>>>', this)

   const textForm = 
      <div
        style={{
          gridArea: '1/1/2/3',
          fontSize: '16px',
          //width: '60vw',
          padding: 10,
          background: 'white',
          //display: 'block',
          //marginTop: '0em',
          //margin: '0px',
          borderStyle: 'none',
          boxShadow: '0px 0px 10px 0px #5bc0de inset',
        }}
        ref="editor"
      >
      <Editor
        editorState={this.state.editorState}
        onChange={this.onChange.bind(this)}
//        placeholder='toot to open tamakoo'
      />
      </div>

    const tootBtn = 
      <img draggable='false' style={{
        gridRow: '2/3',
        gridColumn: '2/3',
        width: '40px',
        height: '40px',
        background: 'none',
        padding: '0',
        margin: '3px 0px 0px 0px',
        //position: 'absolute',
        //right: '0',
        //top: '0',
      }}
        alt='🗨' src='https://twemoji.maxcdn.com/2/72x72/1f5e8.png'
        onClick={e=>this.anchor()}
      />

    return (
      <div style={{
        gridColumn: '1/4',  
        margin: '10px 2vw 0 2vw',
        color: 'rgba(0, 0, 0, 0.87)',
        display: 'grid',
        gridTemplateColumns: '1fr 40px',
        background: 'none',
      }}>
        { textForm }
        { tootBtn }
      </div>
    )
  }

  componentDidMount() {
    window.addEventListener('keypress', e => {
      if( e.keyCode==13 && e.shiftKey ){
        this.anchor();
      }
    })
  }
}
