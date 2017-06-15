// @flow

export type Task = {
  card_id: number;
  text: string;
  url: string;
}

const ADD_TASK = 'counter/add_task';
const INSERT_TASK = 'counter/insert_task';
const TOOT = 'counter/toot';
const FETCH_REQUEST_START = 'counter/fetch_request_start'
const FETCH_REQUEST_FINISH = 'counter/fetch_request_finish'
const ONLY_CARD = 'counter/only_card';
const CLEAR_CARDS = 'counter/clear_cards';
const CALL = 'counter/call';
const ANSWER_USER = 'counter/answer_user';
const INIT_STATE = 'counter/init_state'

export interface CounterState {
  tasks: Task[];
  phase: string;
  userInfo: any;
}

export type ActionTypes =
    IncrementAction
  | DecrementAction
  | FetchRequestStartAction
  | FetchRequestFinishAction

const initialState:CounterState = {
  tasks: [],
  phase: 'ground',
  userInfo: {user_id:null, user_name:null, nuser_bio:null},
};

export default function reducer (
  state: CounterState = initialState,
  action: ActionTypes
): CounterState {
  switch (action.type) {

    case INIT_STATE:
      return Object.assign({}, state, initialState );

    case FETCH_REQUEST_START: {
      return Object.assign({}, state, { phase:'loading' })
    }

    case FETCH_REQUEST_FINISH: {
      return Object.assign({}, state, { phase:'ground' })
    }

    case TOOT:
      const nextTasks = action.text.split('\n')
        .slice(0,self.length-1)
        .map( a => { return {
          user_id:a.split(',')[0],
          user_name:a.split(',')[1],
          card_id:a.split(',')[3],
          text:a.split(',')[4],
          url:a.split(',')[5],
          mode:a.split(',')[6]} });
      return Object.assign({}, state, {
        tasks:state.tasks.concat(nextTasks)
      });

    case ADD_TASK:// css -> css-in-js
      let lis = action.text.split("-");
      let out = lis[0]
      lis.slice(1)
        .map( a => { out+=a[0].toUpperCase()+a.slice(1) })
      out = out
        .replace(/: /g, ":").replace(/:/g, ": '")
        .replace(/ ;/g, ";").replace(/;/g, "',")
      return Object.assign({}, state, {
        tasks: state.tasks.concat( [{
          card_id: -1,
          text:out,
          url:'Noen',
          mode:'toot'}] )
      });

    case INSERT_TASK:
      console.log('insert')
      let insertedTasks = state.tasks;
      insertedTasks.splice(action.order+1,0, {
        card_id: -1,
        text: action.text,
        url: 'Noen',
        mode:'toot'
      })
      return Object.assign({}, state, { tasks: insertedTasks });

    case CALL:
      return Object.assign({}, state, {
        tasks: [{
          user_id: action.card.user_id,
          user_name: action.card.user_name,
          card_id: action.card.card_id,
          text: action.card.text,
          url: action.card.url,
          mode: 'called'
        }]
      });

    case ANSWER_USER:
      const info = {
        user_id: action.text.split(',')[0],
        user_name: action.text.split(',')[1],
        user_bio: action.text.split(',')[2],
      }
      return Object.assign({}, state, { userInfo: info });

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

  initState(){
    this.dispatch({ type:INIT_STATE })
  }

  async toot( text: string ): Promise<void> {
    this.dispatch({ type:INIT_STATE })
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

  async anchor( card_id:number, order:number, text:string ): Promise<void> {
    this.dispatch({ type:INSERT_TASK, order:order, text:text })
    this.dispatch({ type:FETCH_REQUEST_START });

    const url = '/api/anchor/'+encodeURI(card_id+','+text)
    try {
      const response:Response = await fetch(url, {
        method: 'GET',
        headers: this.myHeaders,
      })
      if (response.status === 200) { //2xx

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

  async askUser( user_id:number ): Promise<void> {
    this.dispatch({ type:FETCH_REQUEST_START });

    const url = '/api/askUser/'+user_id;
    try {
      const response:Response = await fetch(url, {
        method: 'GET',
        headers: this.myHeaders,
      })
      if (response.status === 200) { //2xx
        const json: {amount:number} = await response.json();
        this.dispatch({ type:ANSWER_USER, text:json.text });
      } else {
        throw new Error(`illegal status code: ${response.status}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.dispatch({ type:FETCH_REQUEST_FINISH });
    }
  }

  async hisToot( user_id:number ): Promise<void> {
    this.dispatch({ type:FETCH_REQUEST_START });

    const url = '/api/hisToot/'+user_id;
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
