import React from 'react';
import { Link } from 'react-router-dom';
import AddButtonSVG from '../assets/svg/add-button-inside-black-circle.svg';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import { history } from './Index';

const styles = (windowWidth) => { return {
  bar: {
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: 'rgb(0, 188, 212)',
    boxSizing: 'border-box',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
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
    width: '20vw',
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
    try{
      this.props.actions.entry(this.props.match.params.id)
    } catch (err) {
    } finally {
    }
  //  console.log(this.props)
  //  if(this.props.match.path!='/'){
  //  }
  }

  render() {
    console.log(this.props.value)
    const accountList = this.props.value.loginUser.hasAcc
      .map( account =>
        <MenuItem value={account.id} primaryText={account.alias}
          containerElement={<Link to={'/entry/'+account.id}/>}/>
        )

    const newTabBtn =
      <div style={this.styles.newTab}>
        <Link to='/' onClick={e=>{
            this.props.actions.initState()
        }}>
          <img style={this.styles.newTabBtn} src={AddButtonSVG} />
        </Link>
      </div>

    return (
      <Toolbar style={this.styles.bar}>
        <ToolbarGroup style={this.styles.login} containerStyle={{padding:'0'}} firstChild={true}>
          <DropDownMenu containerStyle={{width:'20vw'}} value={this.props.value.signinAcc.id} onChange={(event, index, value) => {
            this.props.actions.login(value);
          }}>
            <MenuItem primaryText='preference' />
            <MenuItem primaryText='add account' containerElement={<Link to='/mailentry/signin'/>}/>
            <hr/>
            { accountList }
          </DropDownMenu>
          { newTabBtn }
        </ToolbarGroup>

      </Toolbar>
    );
  }
}
