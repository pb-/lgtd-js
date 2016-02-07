import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'

import { SOCKET_RECV, SOCKET_OBJECT, START_DRAG_ITEM, END_DRAG_ITEM } from '../actions'


function ui(state = {
  activeTag: 'inbox',
  dragItemId: null,
}, action) {
  switch (action.type) {
    case START_DRAG_ITEM:
      return Object.assign({}, state, {
        dragItemId: action.itemId
      })
    case END_DRAG_ITEM:
      return Object.assign({}, state, {
        dragItemId: null
      })
    case SOCKET_RECV:
      return Object.assign({}, state, {
        activeTag: action.state.tags[action.state.active_tag].name
      })
    default:
      return state
  }
}


function socket(state = null, action) {
  if (action.type == SOCKET_OBJECT) {
    return action.socket
  } else {
    return state
  }
}


function tags(state = [
    {name: 'inbox', count: 3},
    {name: 'todo', count: 0},
  ], action) {
  if (action.type == SOCKET_RECV) {
    return action.state.tags
  } else {
    return state
  }
}


function items(state = [], action) {
  if (action.type == SOCKET_RECV) {
    return action.state.items
  } else {
    return state
  }
}


const rootReducer = combineReducers({
  ui,
  socket,
  tags,
  items,
  routing: routeReducer,
})

export default rootReducer
