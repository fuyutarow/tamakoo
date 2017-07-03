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
const ANSWER_ACC = 'counter/ANSWER_ACC';
const INIT_STATE = 'counter/init_state';
const LOGIN = 'counter/login';
const LOGOUT = 'counter/logout';
const ENTRY = 'counter/entry';
const SET_PHASE = 'counter/set_phase';
const SET_STATE = 'counter/set_state';
export interface CounterState {
  isLoggedin : boolean;
  tasks: Task[];
  phase: string;
  whoisAcc: any;
  signinAcc: any;
  loginUser: any;
  mailaddr: string;
  user4signup: any;
}

export const initialState:CounterState = {
  isLoggedin: false,
  tasks: [],
  phase: 'ground',
  whoisAcc: {
    id:null,
    alias:null,
    handle:null,
    bio:null,
    color:null,
    since:null,
  },
  signinAcc: {
    id:1,
    alias:'tamako',
    handle:'たまこ',
    bio:'welcome tamakoo',
    color:'#'+Math.floor(Math.random()*parseInt('ffffff',16)).toString(16),
    since:'20170619T234108+0900'
  },
  loginUser: {
    hasAcc: [
        {id:1, alias:'tamako'},
    ],
  },
  user4signup: null,
  mailaddr: null,
};

export default function reducer (
  state: CounterState = initialState,
  action: ActionTypes
): CounterState {
  switch (action.type) {

    case INIT_STATE:
      console.log('iniit',Object.assign({}, initialState, {
        isLoggedin:state.isLoggedin,
        signinAcc: state.signinAcc,
        loginUser: state.loginUser,
      }))
      return Object.assign({}, initialState, {
        isLoggedin:state.isLoggedin,
        signinAcc: state.signinAcc,
        loginUser: state.loginUser,
      });

    case FETCH_REQUEST_START: {
      return Object.assign({}, state, { phase:'loading' })
    }

    case FETCH_REQUEST_FINISH: {
      return Object.assign({}, state, { phase:'ground' })
    }

    case LOGIN: {
      return Object.assign({}, state, { isLoggedin: true })
    }

    case LOGOUT: {
      return Object.assign({}, state, { isLoggedin: false })
    }

    case TOOT:
      const nextTasks = action.cards
        .map( a => { return {
          account:a.account,
          toot:a.toot,
          card:a.card,
          mode:a.mode
        }});
      return Object.assign({}, state, {
        tasks:state.tasks.concat(nextTasks)
      });

    case ADD_TASK:// css -> css-in-js
      const css2js = (css) => {
        let lis = css.split("-");
        let out = lis[0]
        lis.slice(1)
          .map( a => { out+=a[0].toUpperCase()+a.slice(1) })
        out = out
          .replace(/: /g, ":").replace(/:/g, ": '")
          .replace(/ ;/g, ";").replace(/;/g, "',\n");
        return out
      }
      return Object.assign({}, state, {
        tasks: state.tasks.concat( [{
          card: {
            id: -1,
            text:css2js(action.text),
            url:'None',
          },
          mode:'tooted',
        }])
      });

    case INSERT_TASK:
      let insertedTasks = state.tasks
        .map( a => {
          if(a['mode']=='tooted'){
            a['mode'] = 'block';
          }
          return a;
        })
      insertedTasks.splice(action.order+1,0, {
        account: {
          id: action.account_id,
        },
        card: {
          id: -1,
          text: action.toot_text,
          url: 'Noen',
        },
        mode:'tooted',
      })
      console.log('...',insertedTasks)
      return Object.assign({}, state, { tasks: insertedTasks });

    case CALL:
      return Object.assign({}, state, {
        tasks: [{
          account:action.task.account,
          toot:action.task.toot,
          card:action.task.card,
          mode:'called',
        }]
      });

    case ANSWER_ACC:
      return Object.assign({}, state, { whoisAcc: action.account });

    case CLEAR_CARDS:
      return Object.assign({}, state, { tasks: [] });

    case ONLY_CARD:
      let calledCard = state.tasks[action.order]
      calledCard['mode'] = 'called'
      return Object.assign({}, state, { tasks:[calledCard] });

    case LOGIN:
      console.log("@@",action.account)
      return Object.assign({}, state, { signinAcc:action.account });

    case SET_PHASE:
      console.log('!@#$$%^', action.phase)
      return Object.assign({}, state, { phase:action.phase });

    case SET_STATE:
      console.log(action.state)
      return Object.assign({}, state, action.state );

    case ENTRY:
      console.log('>>',action)
      return Object.assign({}, state, {
        signinAcc: action.signinAcc,
        loginUser: action.loginUser,
      })

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

  async addAcc( user_id:number, handle:string ): Promise<void> {
    this.dispatch({ type:FETCH_REQUEST_START });
    const url = '/api/addAcc/'+encodeURI(JSON.stringify({
      user_id: user_id,
      handle: handle,
    }))

    try {
      const response:Response = await fetch(url, {
        method: 'POST',
        headers: this.myHeaders,
      })
      if (response.status === 200) { //2xx
        const json: {amount:number} = await response.json();
        this.dispatch({ type:SET_STATE, STATE:{ loginUser:json.user }})
      } else {
        throw new Error(`illegal status code: ${response.status}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.dispatch({ type:FETCH_REQUEST_FINISH });
    }
  }

  async anchor( account_id:number, card_id:number, order:number, toot_text:string ): Promise<void> {
    this.dispatch({ type:INSERT_TASK, order:order, account_id:account_id, toot_text:toot_text })
    this.dispatch({ type:FETCH_REQUEST_START });

    const url = '/api/anchor/'+encodeURI(JSON.stringify({
      account_id: account_id,
      card_id: card_id,
      toot_text: toot_text,
    }))
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

  async askAcc( account_id:number ): Promise<void> {
    this.dispatch({ type:FETCH_REQUEST_START });
    const url = '/api/account/'+encodeURI(JSON.stringify({
      account_id: account_id,
      amount: 100,
    }));
    console.log('hear')
    try {
      const response:Response = await fetch(url, {
        method: 'GET',
        headers: this.myHeaders,
      })
      if (response.status === 200) { //2xx
        const json: {amount:number} = await response.json();
        this.dispatch({ type:ANSWER_ACC, account:json.account });
        this.dispatch({ type:TOOT, cards:json.cards });
      } else {
        throw new Error(`illegal status code: ${response.status}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.dispatch({ type:FETCH_REQUEST_FINISH });
    }
  }

  async callCard( task:any ): Promise<void> {
    console.log('#########',task)
    this.dispatch({ type:CALL, task:task });
    console.log('over')
    this.dispatch({ type:FETCH_REQUEST_START });

    const url = '/api/callCard/'+encodeURI(JSON.stringify({
      card_id: task.card.id,
      amount: 100,
    }))
    try {
      const response:Response = await fetch(url, {
        method: 'GET',
        headers: this.myHeaders,
      })
      if (response.status === 200) { //2xx
        this.dispatch({ type:CLEAR_CARDS })
        const json: {amount:number} = await response.json();
        console.log('!!!!!!!!!!!!!!',json)
        this.dispatch({ type:TOOT, cards:json.cards });
      } else {
        throw new Error(`illegal status code: ${response.status}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.dispatch({ type:FETCH_REQUEST_FINISH });
    }
  }

  async entry( account_id:number ): Promise<void> {
    const date = new Date()
    console.log('--------------'+date+'------------')
    this.dispatch({ type:FETCH_REQUEST_START });

    const url = '/api/entry/'+encodeURI(JSON.stringify({
      account_id: account_id,
    }))
    try {
      console.log(url)
      const response:Response = await fetch(url, {
        method: 'GET',
        headers: this.myHeaders,
      })
      if (response.status === 200) { //2xx
        const d = new Date()
        const json: {amount:number} = await response.json();
        console.log('recieve!!!!!',json)
        this.dispatch({ type:LOGIN })
        this.dispatch({ type:ENTRY,
          signinAcc:json.user.hasAcc
            .filter( a => a['id']==account_id )[0],
          loginUser:json.user
        })
        console.log('++++++'+d+'+++++++++++')
      } else {
        throw new Error(`illegal status code: ${response.status}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.dispatch({ type:FETCH_REQUEST_FINISH });
    }
  }

  async login( account_id:number ): Promise<void> {
    this.dispatch({ type:FETCH_REQUEST_START });

    const url = '/api/askAccount/'+account_id;
    try {
      const response:Response = await fetch(url, {
        method: 'GET',
        headers: this.myHeaders,
      })
      if (response.status === 200) { //2xx
        const json: {amount:number} = await response.json();
        this.dispatch({ type:LOGIN, account:json.account });
      } else {
        throw new Error(`illegal status code: ${response.status}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.dispatch({ type:FETCH_REQUEST_FINISH });
    }
  }

  async send( mailaddr:sring ): Promise<void> {
    this.dispatch({ type:FETCH_REQUEST_START });
    const url = '/api/login/'+encodeURI(mailaddr)
    try {
      const response:Response = await fetch(url, {
        method: 'GET',
        headers: this.myHeaders,
      })
      if (response.status === 200) { //2xx
        const json: {amount:number} = await response.json();
        this.dispatch({ type:SET_STATE, state:{ mailaddr:json.mailaddr }})
      } else {
        throw new Error(`illegal status code: ${response.status}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.dispatch({ type:FETCH_REQUEST_FINISH });
    }
  }

  async signup( user:any ): Promise<void> {
    this.dispatch({ type:FETCH_REQUEST_START });
    const url = '/api/signup/'+encodeURI(JSON.stringify(user))
    try {
      const response:Response = await fetch(url, {
        method: 'GET',
        headers: this.myHeaders,
      })
      if (response.status === 200) { //2xx
        const json: {amount:number} = await response.json();
        console.log(json)
        this.dispatch({ type:SET_STATE, state:{ user4signup: json.user }})
      } else {
        throw new Error(`illegal status code: ${response.status}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.dispatch({ type:FETCH_REQUEST_FINISH });
    }
  }

  async toot( account_id:number, text:string ): Promise<void> {
    this.dispatch({ type:INIT_STATE })
    this.dispatch({ type:ADD_TASK, text:text })
    this.dispatch({ type:FETCH_REQUEST_START });
    const url = '/api/echo/'+encodeURI(JSON.stringify({
      account_id: account_id,
      toot_text: text,
      amount: 30,
    }))
    try {
      const response:Response = await fetch(url, {
        method: 'GET',
        headers: this.myHeaders,
      })
      console.log()
      if (response.status === 200) { //2xx
        const json: {amount:number} = await response.json();
        this.dispatch({ type:TOOT, cards:json.cards });
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
