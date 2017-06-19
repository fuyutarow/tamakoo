import * as React from 'react';
import { Link } from 'react-router-dom';
import AddButtonSVG from '../../assets/svg/add-button-inside-black-circle.svg';

const styles = (windowWidth) => { return {
  bar: {
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: 'rgb(0, 188, 212)',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    boxSizing: 'border-box',
    fontFamily: 'Roboto, sans-serif',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
    borderRadius: '0px',
    position: 'fixed',
    zIndex: '9999',
    width: '100vw',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    overflow: 'hidden',
  },
  newTab: {
    width: '30px',
    height: '30px',
  },
}}

export default class Bar extends React.Component<Props,{}> {
  componentWillMount(){
    this.styles = styles(screen.width);
  }

  render() {
    return (
      <div style={this.styles.bar}>
        <Link to='/' onClick={e=>{
          this.props.actions.initState()
        }}>
          <img style={this.styles.newTab} src={AddButtonSVG} />
        </Link>
      </div>
    );
  }
}
