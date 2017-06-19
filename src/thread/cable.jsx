import * as React from 'react';
import Todo from './Todo';
import { ActionDispatcher, Task } from '../module';

export default class Cable extends React.Component<Props,{}> {
  render() {
    const style = {
      backgroundColor: '#CCD6DD',
      WebkitFlexGrow: '1',
      MsFlexPositive: '1',
      flexGrow: '1',
      WebkitFlexShrink: '1',
      MsFlexNegative: '1',
      flexShrink: '1',
      minHeight: '0',
      width: '0.214rem',
      margin: '0.33rem 0 0',
    }
    return (
      <div style={style}>
      </div>
    );
  }
}
