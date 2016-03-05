import { combineReducers } from 'redux'
import { AUTH_TOKEN, AUTHENTICATED, SOCKET_RECV_STATE, SOCKET_OBJECT, START_DRAG_ITEM, END_DRAG_ITEM } from '../actions'

function ui (state = {
  activeTag: 'inbox',
  draggingItem: false,
  authenticated: false,
  authToken: null
}, action) {
  switch (action.type) {
    case START_DRAG_ITEM:
      return Object.assign({}, state, {
        draggingItem: true
      })
    case END_DRAG_ITEM:
      return Object.assign({}, state, {
        draggingItem: false
      })
    case SOCKET_RECV_STATE:
      return Object.assign({}, state, {
        activeTag: action.state.tags[action.state.active_tag].name
      })
    case AUTH_TOKEN:
      return Object.assign({}, state, {
        authToken: action.token
      })
    case AUTHENTICATED:
      return Object.assign({}, state, {
        authenticated: true,
        authToken: '<removed>'  // no need to keep it in memory any longer
      })
    default:
      return state
  }
}

function socket (state = null, action) {
  if (action.type === SOCKET_OBJECT) {
    return action.socket
  } else {
    return state
  }
}

function tags (state = [
    {name: 'inbox', count: 0}
], action) {
  if (action.type === SOCKET_RECV_STATE) {
    return action.state.tags
  } else {
    return state
  }
}

function items (state = [], action) {
  if (action.type === SOCKET_RECV_STATE) {
    return action.state.items
  } else {
    return state
  }
}

const rootReducer = combineReducers({
  ui,
  socket,
  tags,
  items
})

export default rootReducer
