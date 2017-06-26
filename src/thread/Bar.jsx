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
    height: '7vh',
    //justifyContent: 'center',
    //alignItems: 'center',
    bottom: '0',
    overflow: 'hidden',
    left: '0',
    display: 'grid',
    gridTemplateColumns: '100px 100px 100px',
    gridGap: '10vw',
  },
  login: {
    backgroundColor: '#ddd',
    width: '30vw',
    height: '5vh',
    left: '5vw',
    borderRadius: '5px',
    margin: '1vh 1vh 1vh 3vw',
    //padding: '1vh 0 1vh 0',
    fontSize: '16px',
    display: 'table',
  },
  loginVertical: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
  loginHorizonal: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  newTab: {
    margin: '1vh 1vh 1vh -2.5vh',
    position: 'fixed',
    width: '5vh',
    height: '5vh',
    left: '50vw',

  },
  newTabBtn: {
    width: '100%',
    height: '100%',
  },
}}

export default class Bar extends React.Component<Props,{}> {
  componentWillMount(){
    this.styles = styles(screen.width);
  }

  render() {
    const loginBtn =
      <div style={this.styles.login}>
        <div style={this.styles.loginVertical}>
          <div style={this.styles.loginHorizonal}>
            {this.props.value.signinAcc.alias}
          </div>
        </div>
      </div>

    const newTabBtn =
      <div  style={this.styles.newTab}>
        <Link to='/' onClick={e=>{
            this.props.actions.initState()
        }}>
          <img style={this.styles.newTabBtn} src={AddButtonSVG} />
        </Link>
      </div>

    return (
      <div style={this.styles.bar}>
        {loginBtn}
        {newTabBtn}
      </div>
    );
  }
}
