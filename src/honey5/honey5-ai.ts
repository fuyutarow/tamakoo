import * as Immutable from 'immutable';

const TPI = 2*Math.PI;
const INTERVAL = 30;
const R = INTERVAL/(Math.cos(TPI/12)*2);
const W = 19;
const H = 19;

const p2honeyXY = ( p:number ) => { return { x:p%W, y:Math.floor(p/W) }};
const hoenyXY2mouseXY = ( x:number, y:number ) => {
  return { x: y%2==0? (x+1)*INTERVAL : (x+1.5)*INTERVAL , y: (y+1)*R*3/2 }}
const p2mouseXY = ( p:number ) => {
  const mouseXY = hoenyXY2mouseXY( p2honeyXY(p).x, p2honeyXY(p).y )
  return { x: mouseXY.x ,y: mouseXY.y}}
const L2 = (x:number,y:number) => Math.sqrt( x*x + y*y );

export default class Queenbee {
  cells: number[];
  valueMap: number[];

  readCells( cells: number[] ){
    this.cells = cells;
  }

  rand(){
    const index4yellowCells = this.cells
      .map( (value,idx) => { return { p:idx ,v:value } })
      .filter( a => a.v == 0 )
      .map( a => a.p );
    return index4yellowCells[Math.floor(Math.random()*index4yellowCells.length)];
  }

  neighbor(){
    const index4yellowCells = this.cells
      .map( (value,idx) => { return { p:idx ,v:value } })
      .filter( a => a.v == 0 )
      .map( a => a.p );

    const index4redCells = this.cells
      .map( (value,idx) => { return { p:idx ,v:value } })
      .filter( a => a.v == 1 )
      .map( a => a.p );

    const neighborhoods = index4yellowCells
      .map( a => {
        const d = index4redCells
          .map( b => L2( p2mouseXY(a).x - p2mouseXY(b).x, p2mouseXY(a).y - p2mouseXY(b).y ) )
          .reduce( (s,t) => Math.min(s,t) )
        return { id: a, d: d } })
      .filter( a => a.d < 2*R )
      .map( a => a.id );
    return neighborhoods[Math.floor(Math.random()*neighborhoods.length)];
  }

  greedy(){
    const index4yellowCells = this.cells
      .map( (value,idx) => { return { p:idx ,v:value } })
      .filter( a => a.v == 0 )
      .map( a => a.p );

    const index4redCells = this.cells
      .map( (value,idx) => { return { p:idx ,v:value } })
      .filter( a => a.v == 1 )
      .map( a => a.p );

    const neighborhoods = index4yellowCells
      .map( a => {
        const d = index4redCells
          .map( b => L2( p2mouseXY(a).x - p2mouseXY(b).x, p2mouseXY(a).y - p2mouseXY(b).y ) )
          .reduce( (s,t) => Math.min(s,t) )
        return { id: a, d: d } })
      .filter( a => a.d < 2*R )
      .map( a => a.id );

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
      return opNtimes(nextP,op,n-1) + this.cells[nextP];
    }

    const redScore = ( p: number ) => Immutable.Range(0,4).toArray()
      .map( n =>
        [ opNtimes(p,"upperleft",n) + this.cells[p] + opNtimes(p,"lowerright",4-n),
          opNtimes(p,"upperright",n) + this.cells[p] + opNtimes(p,"lowerleft",4-n),
          opNtimes(p,"left",n)       + this.cells[p] + opNtimes(p,"right",4-n),     ])
      .reduce( (a,b) => a.concat(b) )
      .filter( a => !isNaN(Number(a)) )
      .reduce( (a,b) => Math.max(a,b) );

    const maxRedScore = neighborhoods
      .map( p => redScore( p ) )
      .reduce( (a,b) => Math.max(a,b) )

    const index4highScore = neighborhoods
      .map( ( value,idx ) => { return { idx:idx, v:redScore( value ) } })
      .filter( p => ( p.v==maxRedScore ))
      .map( p => p.idx );

    const k = index4highScore[Math.floor(Math.random()*index4highScore.length)];
    return neighborhoods[k];

    }


}
