// @flow
const INCREMENT_NAME = 'counter/increment'
type INCREMENT_TYPE = typeof INCREMENT_NAME
const DECREMENT_NAME = 'counter/decrement'
type DECREMENT_TYPE = typeof DECREMENT_NAME
const FETCH_REQUEST_START_NAME = 'counter/fetch_request_start'
type FETCH_REQUEST_START_TYPE = typeof FETCH_REQUEST_START_NAME
const FETCH_REQUEST_FINISH_NAME = 'counter/fetch_request_finish'
type FETCH_REQUEST_FINISH_TYPE = typeof FETCH_REQUEST_FINISH_NAME

export type Task = {
  id: number;
  name: string;
}

interface IncrementAction {
  type: INCREMENT_TYPE;
  plusAmount: number;
}
export const incrementAmount = (amount: number): IncrementAction => ({
  type: INCREMENT_NAME,
  plusAmount: amount
})

interface DecrementAction {
  type: DECREMENT_TYPE;
  minusAmount: number;
}

export const decrementAmount = (amount: number): DecrementAction => ({
  type: DECREMENT_NAME,
  minusAmount: amount
})

interface FetchRequestStartAction {
  type: FETCH_REQUEST_START_TYPE;
}


interface FetchRequestFinishAction {
  type: FETCH_REQUEST_FINISH_TYPE;
}

const ADD_TASK = 'counter/addTask';
const TOOT = 'counter/toot';

export interface CounterState {
  num: number;
  loadingCount: number;
  tasks: Task[];
  text: string;
  isLoading: boolean;
}

export type ActionTypes =
    IncrementAction
  | DecrementAction
  | FetchRequestStartAction
  | FetchRequestFinishAction

const initialState:CounterState = {
  num: 0,
  loadingCount: 0,
  tasks: [{id:0,name:"test"}],
  text: "over",
  isLoading: false,
};

export default function reducer (
  state: CounterState = initialState,
  action: ActionTypes
): CounterState {
  switch (action.type) {
    case INCREMENT_NAME:
      return Object.assign({}, state, {num: state.num + action.plusAmount})
    case DECREMENT_NAME:
      return Object.assign({}, state, {num: state.num - action.minusAmount})
    case FETCH_REQUEST_START_NAME: {
      return Object.assign({}, state, {loadingCount: state.loadingCount + 1})
    }
    case FETCH_REQUEST_FINISH_NAME: {
      return Object.assign({}, state, {loadingCount: state.loadingCount - 1})
    }
    case ADD_TASK:
      const newTasks = state.tasks;
      let lis = action.text.split("-");
      let out = lis[0]
      lis.slice(1)
        .map( a => { out+=a[0].toUpperCase()+a.slice(1) })
      out = out
        .replace(/: /g, ":").replace(/:/g, ": '")
        .replace(/ ;/g, ";").replace(/;/g, "',")
      newTasks.push({id:state.tasks.length, name:out});
      return Object.assign({}, state, { tasks:newTasks });

    case TOOT:
      const nextTasks = state.tasks;
      action.text.split('\n')
        .slice(0,self.length-1)
        .map( (a,idx) => { nextTasks.push({ id:idx, name:a }) });
      return Object.assign({}, state, { tasks:nextTasks.slice(1) });

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

  increment(amount: number) {
    this.dispatch(incrementAmount(amount));
  }

  decrement(amount: number) {
    this.dispatch(decrementAmount(amount));
  }

  async toot( text: string ): Promise<void> {
    this.dispatch({ type: FETCH_REQUEST_START_NAME, isLoading: true });

    const url = '/api/count?text='+encodeURI(text)
    try {
      const response: Response = await fetch(url, {
        method: 'GET',
        headers: this.myHeaders,
      })
      if (response.status === 200) { //2xx
        const json: {amount: number} = await response.json();
        this.dispatch({ type: TOOT, text: json.text });
        //json.text.split('\n')
        //  .map( a => { this.dispatch({ type:ADD_TASK, text:a }) });
      } else {
        throw new Error(`illegal status code: ${response.status}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.dispatch({ type: FETCH_REQUEST_FINISH_NAME, isLoading: false });
    }
  }

  async addTask( text: string ): Promise<void> {
    this.dispatch({ type: FETCH_REQUEST_START_NAME, isLoading: true });

    const url = '/api/count?text='+encodeURI(text)
    try {
      const response: Response = await fetch(url, {
        method: 'GET',
        headers: this.myHeaders,
      })
      if (response.status === 200) { //2xx
        const json: {amount: number} = await response.json();
        this.dispatch({ type:ADD_TASK, text:json.text });
      } else {
        throw new Error(`illegal status code: ${response.status}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.dispatch({ type: FETCH_REQUEST_FINISH_NAME, isLoading: false });
    }
  }

  async asyncAdd(): Promise<void> {
    this.dispatch({ type: FETCH_REQUEST_START_NAME, isLoading: true });
    try {
      const response: Response = await fetch('/api/count', {
        method: 'GET',
        headers: this.myHeaders,
      })
      if (response.status === 200) { //2xx
        const json: {amount: number} = await response.json();
        this.dispatch({ type:ADD_TASK, text:json.text });
      } else {
        throw new Error(`illegal status code: ${response.status}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.dispatch({ type: FETCH_REQUEST_FINISH_NAME, isLoading: false });
    }
  }

  async asyncIncrement(): Promise<void> {
    this.dispatch({ type: FETCH_REQUEST_START_NAME, isLoading: true });

    try {
      const response: Response = await fetch('localhost:58946/api/counter', {
        method: 'GET',
        headers: this.myHeaders
      })
      if (response.status === 200) { //2xx
        const json: {amount: number} = await response.json()
        this.dispatch(incrementAmount(json.amount))
      } else {
        throw new Error(`illegal status code: ${response.status}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.dispatch({ type: FETCH_REQUEST_FINISH_NAME, isLoading: false });
    }
  }
}
