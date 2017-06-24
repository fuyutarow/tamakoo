import React from 'react';
import { Link } from 'react-router-dom';
import AddButtonSVG from '../assets/svg/add-button-inside-black-circle.svg';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';


const styles = (windowWidth) => { return {
  bar: {
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: 'rgb(0, 188, 212)',
    boxSizing: 'border-box',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
    backgroundColor: 'rgb(232, 232, 232)',
    width: '100vw',
    //height: '56px',
    //display: 'flex',
    display: 'grid',
    gridGap: '10vw',
    //justifyContent: 'spaceBetween',
    borderRadius: '0px',
    //zIndex: '999',
    position: 'fixed',
    left: '0',
    bottom: '0',
  },
  login: {
    backgroundColor: '#ddd',
    width: '30vw',
    //height: '56px',
    position: 'fixed',
    left: '0',
    //bottom: '0',
    borderRadius: '5px',
    margin: '0 1vh 0 3vw',
    //padding: '1vh 0 1vh 0',
    fontSize: '16px',
    display: 'table',
  },
  newTab: {
    margin: '-24px 0 0 -24px',
    position: 'fixed',
    width: '48px',
    height: '48px',
    left: '50vw',
    bottom: '0',
  },
  newTabBtn: {
    width: '100%',
    height: '100%',
  },
}}

export default class Tool extends React.Component<Props,{}> {
  componentWillMount(){
    this.styles = styles(screen.width);
  }

  handleChange (event, index, value) {

  }

  render() {
    const accountList = this.props.value.hasAccounts
      .map( account =>
        <Link to={ '/entry/'+account.id }>
          <MenuItem value={account.id} primaryText={account.alias} />
        </Link>
        )

    const newTabBtn =
      <div  style={this.styles.newTab}>
        <Link to='/' onClick={e=>{
            this.props.actions.initState()
        }}>
          <img style={this.styles.newTabBtn} src={AddButtonSVG} />
        </Link>
      </div>

    return (
      <Toolbar style={this.styles.bar}>
        <ToolbarGroup style={this.styles.login} firstChild={true}>
          <DropDownMenu value={this.props.value.loginAccount.id} onChange={(event, index, value) => {
            this.props.actions.login(value);
          }}>
            <MenuItem primaryText='preference' />
            <Link to='/mailentry/entry'><MenuItem primaryText='add account' /></Link>
            <hr/>
            { accountList }
          </DropDownMenu>
          { newTabBtn }
        </ToolbarGroup>

      </Toolbar>
    );
  }
}
