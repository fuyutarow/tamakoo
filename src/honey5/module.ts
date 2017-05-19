import * as ObjectAssign from 'object-assign';
import * as Immutable from 'immutable';

const W = 19;
const H = 19;

export interface Task {
  id: number;
  name: string;
}

export interface Honey5State {
  cells: number[];
  step: number;
  record: number[];
  tasks: Task[];
  open: boolean;
}

interface Honey5Action {
  type: string;
  amount?: number;
  position?: number;
  id?: number;
  name?: string;
}

export class ActionTypes {
  static INCREMENT = 'honey5/increment';
  static RED = 'honey5/red';
  static BLUE = 'honey5/blue';
  static UNDO = 'honey5/undo';
  static ADD_TASK = 'honey5/addTask';
  static OPEN = 'honey5/open';
}

const INITIAL_STATE =  {
  position: 0,
  cells: Immutable.Range(0,W*H).toArray().map( () => 0 ),
  step: 0,
  record: [0],
  tasks: [{id:0,name:"test"}],
  open: false,
};

export default function reducer(
  state: Honey5State = INITIAL_STATE,
  action: Honey5Action
): Honey5State {
  switch (action.type) {

    case ActionTypes.RED:
      const redCells = state.cells
        .map( ( value,idx ) =>
          ( idx%W == action.position%W && Math.floor(idx/W) == Math.floor(action.position/W) )? 1: value );
      //const redRecord= Immutable.List.of(...state.record).push(action.position);
      let redRecord = state.record;
      redRecord.push(action.position);
      return ObjectAssign({}, state, { cells: redCells, step: state.step + 1, record: redRecord});

    case ActionTypes.BLUE:
      const blueCells = state.cells
        .map( ( value,idx ) =>
          ( idx%W == action.position%W && Math.floor(idx/W) == Math.floor(action.position/W) )? -1: value );
      let blueRecord = state.record;
      blueRecord.push(action.position);
      return ObjectAssign({}, state, { cells: blueCells, step: state.step + 1, record: blueRecord });

    case ActionTypes.UNDO:
      if (state.step<=0){
        return ObjectAssign({}, state, { step: 0 });
      }
      let undoRecord = state.record;
      const lastRecord = undoRecord.pop();
      const boobyRecord = undoRecord.pop();
      const undoCells = state.cells
      .map( ( value,idx ) =>
        ( idx%W == lastRecord%W && Math.floor(idx/W) == Math.floor(lastRecord/W) )? 0: value )
      .map( ( value,idx ) =>
        ( idx%W == boobyRecord%W && Math.floor(idx/W) == Math.floor(boobyRecord/W) )? 0: value );
      return ObjectAssign({}, state, { cells: undoCells, step: state.step - 2 , record: undoRecord });

    case ActionTypes.ADD_TASK:
      const newTasks = state.tasks;
      newTasks.push({id:state.tasks.length, name:action.name});
      return ObjectAssign({}, state, { tasks:newTasks });

    case ActionTypes.OPEN:
      return ObjectAssign({}, state, { open: !state.open });

    default:
      return state;
  }
}

export class ActionDispatcher {
  dispatch: (action: any) => any;
  constructor(dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }
  red( position: number ){
    this.dispatch({ type: ActionTypes.RED, position: position });
  }
  blue( position: number ){
    this.dispatch({ type: ActionTypes.BLUE, position: position });
  }
  undo(){
    this.dispatch({ type: ActionTypes.UNDO });
  }
  addTask( name:string ){
    this.dispatch({ type: ActionTypes.ADD_TASK, name: name });
  }
  open(){
    this.dispatch({ type: ActionTypes.OPEN });
  }
}
