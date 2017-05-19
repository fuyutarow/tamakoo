import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Honey5State, ActionDispatcher } from './module';
import * as Immutable from 'immutable';
import Queenbee from './honey5-ai';
const Bee = new Queenbee;
import TodoList from './TodoList';
import NavBar from './NavBar';

const TPI = 2*Math.PI;
const INTERVAL = 30;
const R = INTERVAL/(Math.cos(TPI/12)*2);
const W = 19;
const H = 19;

// coordinate transformation
const p2honeyXY = ( p:number ) => { return { x:p%W, y:Math.floor(p/W) }};
const hoenyXY2mouseXY = ( x:number, y:number ) => {
  return { x: y%2==0? (x+1)*INTERVAL : (x+1.5)*INTERVAL , y: (y+1)*R*3/2 }}
const p2mouseXY = ( p:number ) => {
  const mouseXY = hoenyXY2mouseXY( p2honeyXY(p).x, p2honeyXY(p).y )
  return { x: mouseXY.x ,y: mouseXY.y}}
const L2 = (x:number,y:number) => Math.sqrt( x*x + y*y );

interface Props {
  state: Honey5State;
  actions: ActionDispatcher;
}

export class Honey5 extends React.Component<Props, {}> {
  gameState: string;

  componentWillMount(){
    this.gameState = "play";
    this.props.actions.red( 9+9*W );
  }

  shouldComponentUpdate(){
    return  (this.gameState == "play")? true : false;
  }

  addTask(){
    const task = (ReactDOM.findDOMNode(this.refs.task) as HTMLInputElement).value;
    this.props.actions.addTask(task);
    (ReactDOM.findDOMNode(this.refs.task) as HTMLInputElement).value = "";
  }

  render() {
    return (
      <div>
      <NavBar
        onToggle={() => this.props.actions.open()}
        open={this.props.state.open}
      />
      <TodoList tasks={this.props.state.tasks} />
        <p>
          <input type='text' ref='task' />
          <button onClick={()=>this.addTask()} >add</button>
        </p>

        <p><button onClick={ () => this.props.actions.undo() }>UNDO</button></p>
        <canvas ref="myCanvas"/>
      </div>

    );
  }

  componentDidMount() {
    const canvas = this.refs.myCanvas as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

    canvas.width = (W+1)*INTERVAL;
    canvas.height = (W+1)*INTERVAL;
    ctx.fillStyle = '#ffff33';

    const Hex = (x:number, y:number, r:number) => {
      ctx.beginPath();
      ctx.moveTo( x + r*Math.cos(TPI/4), y + r*Math.sin(TPI/4) );
      Immutable.Range(1,6).toArray().map( (i) => {
        ctx.lineTo( x + r*Math.cos(i*TPI/6 + TPI/4), y + r*Math.sin(i*TPI/6 + TPI/4) )});
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    const honeyCombCoordinates = Immutable.Range(0,W*H).toArray()
      .map( n => p2mouseXY(n) )

    honeyCombCoordinates
      .map( a => Hex(a.x,a.y,R) )

// for click
    canvas.onmousedown = e => {
      const L2 = (x:number,y:number) => Math.sqrt( x*x + y*y );
      const mouse2honey = ( mouseX:number, mouseY:number) => {
        const p =
          (honeyCombCoordinates
            .map( (a,idx) => Math.floor( L2( a.x-mouseX, a.y-mouseY )*1000 )*1000 +idx )
            .reduce( (a,b) => Math.min(a, b) )
          )%1000
        return p;
      }
      const honeyP = mouse2honey( e.offsetX, e.offsetY );
      if( this.props.state.step%2 == 1 && this.props.state.cells[honeyP] == 0 ){
          this.props.actions.blue( honeyP );
      }
    }
  }

  componentDidUpdate() {
    const canvas = this.refs.myCanvas as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

    const Hex = (x:number, y:number, r:number) => {
      ctx.beginPath();
      ctx.moveTo( x + r*Math.cos(TPI/4), y + r*Math.sin(TPI/4) );
      Immutable.Range(1,6).toArray().map( i => {
        ctx.lineTo( x + r*Math.cos(i*TPI/6 + TPI/4), y + r*Math.sin(i*TPI/6 + TPI/4) )});
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

// for click
    const honeyComb = Immutable.Range(0,W*H).toArray()
      .map( p => {
        switch( this.props.state.cells[p] ){
          case 0: ctx.fillStyle = '#ffff22';break;
          case 1: ctx.fillStyle = '#ff2222';break;
          case -1: ctx.fillStyle = '#2222ff';break;
          default: ctx.fillStyle = '#ffffff';
        };
        Hex( p2mouseXY(p).x, p2mouseXY(p).y , R ) });

// for AI
    if( this.props.state.step%2 == 0 ){
      Bee.readCells( this.props.state.cells );
      const p = Bee.greedy();
      const lastRecord = this.props.state.record[this.props.state.record.length-1];
      setTimeout( () => this.props.actions.red( p ) , 1000);
    }

// for termial
    const nextXY = ( x:number, y:number, op:string ) => {
      switch( op ){
        case "upperleft":  return y%2? [x,y-1]   : [x-1,y-1];
        case "upperright": return y%2? [x+1,y-1] : [x,y-1];
        case "left":       return y%2? [x-1,y]   : [x-1,y];
        case "right":      return y%2? [x+1,y]   : [x+1,y];
        case "lowerleft":  return y%2? [x,y+1]   : [x-1,y+1];
        case "lowerright": return y%2? [x+1,y+1] : [x,y+1];
        default:           return [x,y];
    }}

    let opNtimes:any = ( p:number, op:string , n:number) => {
      if( n<0 ) return 0;
      const nextX = nextXY( p2honeyXY(p).x, p2honeyXY(p).y, op )[0];
      const nextY = nextXY( p2honeyXY(p).x, p2honeyXY(p).y, op )[1];
      const nextP = nextX + nextY*W;
      if( nextX<0 || nextX>19 || nextY<0|| nextY>19 ) return 0;
      return opNtimes(nextP,op,n-1) + this.props.state.cells[nextP];
    }

    const p = this.props.state.record[this.props.state.record.length-1];
    const scores = Immutable.Range(0,4).toArray()
      .map( n =>
          [ opNtimes(p,"upperleft",n)  + this.props.state.cells[p] + opNtimes(p,"lowerright",4-n),
            opNtimes(p,"upperright",n) + this.props.state.cells[p] + opNtimes(p,"lowerleft",4-n),
            opNtimes(p,"left",n)       + this.props.state.cells[p] + opNtimes(p,"right",4-n),     ])
      .reduce( (a,b) => a.concat(b) )
      .filter( a => !( isNaN((a))) );
    const redScore = scores.reduce( (a,b) => Math.max(a,b));
    const blueScore = scores.reduce( (a,b) => Math.min(a,b));
    ctx.fillStyle = "#000000";
    ctx.font = "80pt Arial";
    ctx.textAlign = "center";

    const WIDTH = (W+1)*INTERVAL;
    const HEIGHT = (H+1)*INTERVAL;
    if( redScore == 5 ){
      this.gameState = "GameOver";
      ctx.fillText("Red win!", WIDTH/2, HEIGHT/2);
      console.log(this.gameState);
    }
    if( blueScore == -5 ){
      this.gameState = "GameOver";
      ctx.fillText("Blue win", WIDTH/2, HEIGHT/2);
    }

  }

}
