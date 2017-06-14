// @flow

export type Task = {
  card_id: number;
  text: string;
  url: string;
}

const ADD_TASK = 'counter/addTask';
const TOOT = 'counter/toot';
const MOVE_PAGE = 'counter/movePave';
const FETCH_REQUEST_START = 'counter/fetch_request_start'
const FETCH_REQUEST_FINISH = 'counter/fetch_request_finish'
const ONLY_CARD = 'counter/only_card';
const CLEAR_CARDS = 'counter/clear_cards';
const CALL = 'counter/call';

export interface CounterState {
  num: number;
  tasks: Task[];
  text: string;
  title: string;
  page: number;
  phase: string
}

export type ActionTypes =
    IncrementAction
  | DecrementAction
  | FetchRequestStartAction
  | FetchRequestFinishAction

const initialState:CounterState = {
  num: 0,
  tasks: [],
  text: "over",
  title: 'welcom',
  page: 0,
  phase: 'ground',
};

export default function reducer (
  state: CounterState = initialState,
  action: ActionTypes
): CounterState {
  switch (action.type) {
    case FETCH_REQUEST_START: {
      return Object.assign({}, state, { phase:'loading' })
    }

    case FETCH_REQUEST_FINISH: {
      return Object.assign({}, state, { phase:'ground' })
    }

    case ADD_TASK:// css -> css-in-js
      let lis = action.text.split("-");
      let out = lis[0]
      lis.slice(1)
        .map( a => { out+=a[0].toUpperCase()+a.slice(1) })
      out = out
        .replace(/: /g, ":").replace(/:/g, ": '")
        .replace(/ ;/g, ";").replace(/;/g, "',")
      return Object.assign({}, state, { tasks:[{id:state.tasks.length, text:out, url:'Noen', mode:'toot'}] });

    case TOOT:
      const nextTasks = state.tasks;
      action.text.split('\n')
        .slice(0,self.length-1)
        .map( a => {
          nextTasks.push({card_id:a.split(',')[3], text:a.split(',')[4], url:a.split(',')[5], mode:a.split(',')[6]}) });
      return Object.assign({}, state, { tasks:nextTasks });

    case CALL:
      console.log('>>>>>',action.card)
      return Object.assign({}, state, {
        tasks: [{
          card_id: action.card.card_id,
          text: action.card.text,
          url: action.card.url,
          mode: 'called'
        }]
      });


    case MOVE_PAGE:
      return Object.assign({}, state, { tasks: [] });

    case CLEAR_CARDS:
      return Object.assign({}, state, { tasks: [] });

    case ONLY_CARD:
      let calledCard = state.tasks[action.order]
      calledCard['mode'] = 'called'
      return Object.assign({}, state, { tasks:[calledCard] });

    default:
      return state
  }
}


export class ActionDispatcher {
  dispatch: Dispatch<ReduxAction>

  myHeaders: Object

  constructor(dispatch: Dispatch<ReduxAction>) {
    this.dispatch = dispatch
    this.myHeaders = {
      "Content-Type": "application/json",
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }

  movePage(){
    this.dispatch({ type:MOVE_PAGE })
  }

  async toot( text: string ): Promise<void> {
    this.dispatch({ type:ADD_TASK, text:text })
    this.dispatch({ type:FETCH_REQUEST_START });

    const url = '/api/toot/'+encodeURI(text)
    try {
      const response:Response = await fetch(url, {
        method: 'GET',
        headers: this.myHeaders,
      })
      if (response.status === 200) { //2xx
        const json: {amount:number} = await response.json();
        this.dispatch({ type:TOOT, text:json.text });
      } else {
        throw new Error(`illegal status code: ${response.status}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.dispatch({ type:FETCH_REQUEST_FINISH });
    }
  }

  async callCard( card:any ): Promise<void> {
    console.log('+++++',card)
    this.dispatch({ type:CALL, card:card });
    this.dispatch({ type:FETCH_REQUEST_START });

    const url = '/api/callCard/'+card.card_id;
    try {
      const response:Response = await fetch(url, {
        method: 'GET',
        headers: this.myHeaders,
      })
      if (response.status === 200) { //2xx
        this.dispatch({ type:CLEAR_CARDS })
        const json: {amount:number} = await response.json();
        this.dispatch({ type:TOOT, text:json.text });
      } else {
        throw new Error(`illegal status code: ${response.status}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.dispatch({ type:FETCH_REQUEST_FINISH });
    }
  }
}
