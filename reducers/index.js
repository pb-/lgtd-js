import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'

import { SET_SYNC, SYNC_START, SYNC_END} from '../actions'
/*
import {
  SELECT_REDDIT, INVALIDATE_REDDIT,
  REQUEST_POSTS, RECEIVE_POSTS, RECEIVE_DATABASE
} from '../actions'

function selectedReddit(state = 'reactjs', action) {
  switch (action.type) {
    case SELECT_REDDIT:
      return action.reddit
    default:
      return state
  }
}

function posts(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    case INVALIDATE_REDDIT:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function postsByReddit(state = { }, action) {
  switch (action.type) {
    case INVALIDATE_REDDIT:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        [action.reddit]: posts(state[action.reddit], action)
      })
    default:
      return state
  }
}

function db(state = null, action) {
  switch (action.type) {
    case RECEIVE_DATABASE:
      return action.db
    default:
      return state
  }
}
*/

function ui(state = {
  selectedTag: 'inbox'
}, action) {
  return state
}

function tagOrder(state = ['inbox', 'todo', 'empty'], action) {
  return state
}

function items(state = [
  {id: '000', title: 'first item', tag: ''},
  {id: '001', title: 'second item', tag: ''},
  {id: '002', title: 'third item', tag: 'todo'},
], action) {
  return state
}

function sync(state = {
  timeout: undefined,
  nextSync: undefined,
  syncing: false
}, action) {
  switch (action.type) {
    case SET_SYNC:
      return Object.assign({}, state, {
        timeout: action.timeoutHandle,
        nextSync: action.nextSync
      })
    case SYNC_START:
      return Object.assign({}, state, {
        timeout: undefined,
        nextSync: undefined,
        syncing: true
      })
    case SYNC_END:
      return Object.assign({}, state, {
        syncing: false
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  ui,
  tagOrder,
  items,
  sync,
  routing: routeReducer
})

export default rootReducer
