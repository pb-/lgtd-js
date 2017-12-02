import md5 from 'blueimp-md5'

export const SOCKET_RECV_STATE = 'SOCKET_RECV_STATE'
export const AUTH_TOKEN = 'AUTH_TOKEN'
export const START_DRAG_ITEM = 'START_DRAG_ITEM'
export const END_DRAG_ITEM = 'END_DRAG_ITEM'
export const AUTHENTICATED = 'AUTHENTICATED'

function socketRecvState (state) {
  return {
    type: SOCKET_RECV_STATE,
    state
  }
}

function authenticated () {
  return {
    type: AUTHENTICATED
  }
}

export function authToken (token) {
  return {
    type: AUTH_TOKEN,
    token
  }
}

function socketRequestState (tag) {
  return {msg: 'request_state', tag}
}

function socketPushCommands (commands) {
  return {msg: 'push_commands', cmds: commands}
}

function socketSendAuthResponse (token, nonce) {
  return {msg: 'auth_response', mac: md5(nonce, token)}
}

function cmdSetTitle (itemId, title) {
  return 't ' + itemId + ' ' + title
}

function cmdSetTag (itemId, tag) {
  return 'T ' + itemId + ' ' + tag
}

function cmdDeleteItem (itemId) {
  return 'd ' + itemId
}

function cmdUnsetTag (itemId) {
  return 'D ' + itemId
}

function cmdDeleteTag (tag) {
  return 'r ' + tag
}

export function socketRecv (socket, data) {
  return (dispatch, getState) => {
    switch (data.msg) {
      case 'auth_challenge':
        return socket.sendJSON(socketSendAuthResponse(getState().ui.authToken, data.nonce))
      case 'state':
        return dispatch(socketRecvState(data.state))
      case 'bad_credentials':
        window.localStorage.removeItem('authToken')
        return dispatch(authToken(null))
      case 'authenticated':
        window.localStorage.setItem('authToken', getState().ui.authToken)
        dispatch(authenticated())  // intentional fall through
      case 'new_state':
        return socket.sendJSON(socketRequestState(getState().ui.activeTag))
    }
  }
}

export function changeTag (socket, tag) {
  socket.sendJSON(socketRequestState(tag))
}

export function commandSetTitle (socket, itemId, title, tag = undefined) {
  let cmds = [cmdSetTitle(itemId, title)]

  if (tag !== undefined) {
    cmds.push(cmdSetTag(itemId, tag))
  }

  socket.sendJSON(socketPushCommands(cmds))
}

export function commandDeleteItem (socket, itemId) {
  socket.sendJSON(socketPushCommands([cmdDeleteItem(itemId)]))
}

export function commandSetTag (socket, itemId, tag) {
  socket.sendJSON(socketPushCommands([cmdSetTag(itemId, tag)]))
}

export function commandUnsetTag (socket, itemId) {
  socket.sendJSON(socketPushCommands([cmdUnsetTag(itemId)]))
}

export function commandDeleteTag (socket, tag) {
  socket.sendJSON(socketPushCommands([cmdDeleteTag(tag)]))
}

export function startDragItem () {
  return {
    type: START_DRAG_ITEM
  }
}

export function endDragItem () {
  return {
    type: END_DRAG_ITEM
  }
}
