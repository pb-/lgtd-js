import fetch from 'isomorphic-fetch'

export const REQUEST_SYNC = 'REQUEST_SYNC'
export const SYNC = 'REQUEST_SYNC'
/*export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_REDDIT = 'SELECT_REDDIT'
export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT'
export const RECEIVE_DATABASE = 'RECEIVE_DATABASE'
*/

function syncRequest(nextSync, timeoutHandle) {
  return {
    type: REQUEST_SYNC,
    nextSync,
    timeoutHandle
  }
}

function sync(getState) {
  return {
    type: SYNC,
    revs: getState().revs,
  }
}

/*

export function selectReddit(reddit) {
  return {
    type: SELECT_REDDIT,
    reddit
  }
}

export function invalidateReddit(reddit) {
  return {
    type: INVALIDATE_REDDIT,
    reddit
  }
}

function requestPosts(reddit) {
  return {
    type: REQUEST_POSTS,
    reddit
  }
}

function receivePosts(reddit, json) {
  return {
    type: RECEIVE_POSTS,
    reddit: reddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

function receiveDatabase(db) {
  return {
    type: RECEIVE_DATABASE,
    db: db
  }
}

function fetchPosts(reddit) {
  return dispatch => {
    dispatch(requestPosts(reddit))
    return fetch(`http://www.reddit.com/r/${reddit}.json`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(reddit, json)))
  }
}

export function openDatabase() {
  return dispatch => {
    let request = indexedDB.open('DB')
    request.onerror = e => {
      alert('no db :-(')
    }
    request.onsuccess = e => {
      dispatch(receiveDatabase(e.target.result))
    }
  }
}

function shouldFetchPosts(state, reddit) {
  const posts = state.postsByReddit[reddit]
  if (!posts) {
    return true
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate
}

export function fetchPostsIfNeeded(reddit) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), reddit)) {
      return dispatch(fetchPosts(reddit))
    }
  }
}
*/

export function requestSync(timeout) {
  return (dispatch, getState) => {
    const nextSync = Date.now() + timeout * 1000
    const state = getState()

    if (!state.syncing) {
      if (state.timeout !== undefined) {
        clearTimeout(state.timeout)
      }
      dispatch(syncRequest(nextSync, setTimeout((dispatch, getState) => {
        dispatch(sync(getState))
      }, timeout * 1000, dispatch, getState)))
    } else {
      dispatch(syncRequest(nextSync))
    }
  }
}
