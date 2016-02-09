import { combineReducers } from 'redux'
import { SOCKET_RECV, SOCKET_OBJECT, START_DRAG_ITEM, END_DRAG_ITEM, REQUEST_ADD_TAG, END_ADD_TAG } from '../actions'


function ui(state = {
  activeTag: 'inbox',
  dragItemId: null,
  addTagItemId: null,
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
    case REQUEST_ADD_TAG:
      return Object.assign({}, state, {
        addTagItemId: action.itemId
      })
    case END_ADD_TAG:
      return Object.assign({}, state, {
        addTagItemId: null
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
})

export default rootReducer
