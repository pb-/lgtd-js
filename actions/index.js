import fetch from 'isomorphic-fetch'

export const SET_SYNC = 'SET_SYNC'
export const SYNC_START = 'SYNC_START'
export const SYNC_END = 'SYNC_END'
/*export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_REDDIT = 'SELECT_REDDIT'
export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT'
export const RECEIVE_DATABASE = 'RECEIVE_DATABASE'
*/

function setSync(nextSync, timeoutHandle) {
  return {
    type: SET_SYNC,
    nextSync,
    timeoutHandle
  }
}

function syncStart() {
  return {
    type: SYNC_START
  }
}

function syncEnd() {
  return {
    type: SYNC_END
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

function getDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('DB', 2)
    request.onsuccess = e => {
      resolve(e.target.result)
    }
    request.onupgradeneeded = e => {
      const db = e.target.result
      db.createObjectStore('commands', {keyPath: 'key'})
      resolve(db)
    }
  })
}

function extractTime(iv) {
  // FIXME
  return parseInt(iv)
}

function unpackCommand(command) {
  const [appID, revision, iv, mac, cmd] = command
  return {
    key: [appID, revision],
    time: extractTime(iv),
    iv, mac, cmd
  }
}

function packCommand(command) {
  return [command.key[0], command.key[1], command.iv, command.mac, command.cmd]
}

function saveCommand(db, cmd) {
  return new Promise((resolve, reject) => {
    const request = db.transaction(['commands'], 'readwrite')
      .objectStore('commands')
      .add(cmd)
    request.onsuccess = e => {
       resolve(cmd)
    }
    request.onerror = e => {
      /* key exists, doesn't matter */
      console.log(e.target.error.message)
      resolve(cmd)
    }
  })
}

function loadCommand(db, key) {
  return new Promise((resolve, reject) => {
    const request = db.transaction(['commands'])
      .objectStore('commands')
      .get(key)
    request.onsuccess = e => {
      resolve(e.target.result)
    }
  })
}

function executeCommands(dispatch, cmds) {
  cmds.sort((a, b) => a.time - b.time)
  for (const cmd of cmds) {
    console.log(cmd)
    //dispatch(actionFromCommand(cmd))
  }
}

function missingRemoteRevs(local, remote) {
  let revs = []
  for (appID in local) {
    localRev = local[appID]
    remoteRev = remote[appID] || 0

    for (let r = remoteRev + 1; r <= localRev; r++) {
      revs.push([appID, r])
    }
  }

  return revs
}

/* compare local revs against remote revs and push revs that the remote is missing */
function processRevs(localRevs, remoteRevs) {
  const revs = missingRemoteRevs(localRevs, remoteRevs)

  if (revs.length === 0) {
    return false  /* no need to fire an empty request */
  }

  return getDatabase()
    .then(db => Promise.all(revs.map(key => packCommand(loadCommand(db, key)))))
    .then(commands => fetch('http://www.mocky.io/v2/56846f70270000903101dab9', {
      method: 'POST',
      body: commands
    }))
    .then(response => true)
}

function processRemoteCommands(dispatch, commands) {
  return getDatabase()
    .then(db => Promise.all(commands.map(command => saveCommand(db, unpackCommand(command)))))
    .then(commands => executeCommands(dispatch, commands))
}

function sync(localRevs) {
  return dispatch => {
    dispatch(syncStart())
    return fetch('/pull', {
        method: 'POST',
        headers: new Headers({'X-GTD-Token': '0'}),
        body: JSON.stringify({revs: localRevs})
      })
      .then(response => response.json())
      .then(json => Promise.all([
        processRevs(localRevs, json.revs),
        processRemoteCommands(dispatch, json.cmds)]))
      .then(() => dispatch(syncEnd()))
      .catch(() => console.log('pull problem'))
      /* check if we need to do another sync */
  }
}

export function requestSync(timeoutSeconds) {
  return (dispatch, getState) => {
    const nextSync = Date.now() + timeoutSeconds * 1000
    const state = getState()

    if (!state.syncing) {
      if (state.timeout !== undefined) {
        clearTimeout(state.timeout)
      }
      return dispatch(setSync(nextSync, setTimeout((dispatch, getState) => {
        return dispatch(sync(getState().revs))
      }, timeoutSeconds * 1000, dispatch, getState)))
    } else {
      /* only save next sync time; don't schedule because there is a sync in progress */
      return dispatch(setSync(nextSync))
    }
  }
}
