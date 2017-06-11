// @flow

export type Task = {
  id: number;
  text: string;
  url: string;
}

const ADD_TASK = 'counter/addTask';
const TOOT = 'counter/toot';
const MOVE_PAGE = 'counter/movePave';
const FETCH_REQUEST_START = 'counter/fetch_request_start'
const FETCH_REQUEST_FINISH = 'counter/fetch_request_finish'

export interface CounterState {
  num: number;
  loadingCount: number;
  tasks: Task[];
  text: string;
  isLoading: boolean;
  title: string;
  page: number;
}

export type ActionTypes =
    IncrementAction
  | DecrementAction
  | FetchRequestStartAction
  | FetchRequestFinishAction

const initialState:CounterState = {
  num: 0,
  loadingCount: 0,
  tasks: [{id:0,text:'',url:'None'}],
  text: "over",
  isLoading: false,
  title: 'welcom',
  page: 0
};

export default function reducer (
  state: CounterState = initialState,
  action: ActionTypes
): CounterState {
  switch (action.type) {
    case FETCH_REQUEST_START: {
      return Object.assign({}, state, {loadingCount: state.loadingCount + 1})
    }

    case FETCH_REQUEST_FINISH: {
      return Object.assign({}, state, {loadingCount: state.loadingCount - 1})
    }

    case ADD_TASK:// css -> css-in-js
      const newTasks = state.tasks;
      let lis = action.text.split("-");
      let out = lis[0]
      lis.slice(1)
        .map( a => { out+=a[0].toUpperCase()+a.slice(1) })
      out = out
        .replace(/: /g, ":").replace(/:/g, ": '")
        .replace(/ ;/g, ";").replace(/;/g, "',")
      newTasks.push({id:state.tasks.length, text:out});
      return Object.assign({}, state, { tasks:newTasks });

    case TOOT:
      const nextTasks = state.tasks;
      action.text.split('\n\n')
        .slice(0,self.length-1)
        .map( a => {
          nextTasks.push({id:a.split(',')[3], text:a.split(',')[4], url:a.split(',')[5]}) });
      return Object.assign({}, state, { tasks:nextTasks });

    case MOVE_PAGE:
      return Object.assign({}, state, { tasks: [] });

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
    //this.dispatch({ type:ADD_TASK, text:text })
    this.dispatch({ type: FETCH_REQUEST_START, isLoading: true });

    const url = '/api/toot/'+encodeURI(text)
    try {
      const response: Response = await fetch(url, {
        method: 'GET',
        headers: this.myHeaders,
      })
      if (response.status === 200) { //2xx
        const json: {amount: number} = await response.json();
        this.dispatch({ type: TOOT, text: json.text });
      } else {
        throw new Error(`illegal status code: ${response.status}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.dispatch({ type: FETCH_REQUEST_FINISH, isLoading: false });
    }
  }

}
