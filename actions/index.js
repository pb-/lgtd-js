import md5 from 'blueimp-md5'

export const SOCKET_OBJECT = 'SOCKET_OBJECT'
export const SOCKET_RECV_STATE = 'SOCKET_RECV_STATE'
export const AUTH_TOKEN = 'AUTH_TOKEN'
export const START_DRAG_ITEM = 'START_DRAG_ITEM'
export const END_DRAG_ITEM = 'END_DRAG_ITEM'
export const AUTHENTICATED = 'AUTHENTICATED'


function socketRecvState(state) {
  return {
    type: SOCKET_RECV_STATE,
    state,
  }
}


function socketObj(socket) {
  return {
    type: SOCKET_OBJECT,
    socket
  }
}


function authenticated() {
  return {
    type: AUTHENTICATED,
  }
}


function authToken(token) {
  return {
    type: AUTH_TOKEN,
    token,
  }
}


function socketRequestState(tag) {
  return JSON.stringify({msg: 'request_state', tag})
}


function socketPushCommands(commands) {
  return JSON.stringify({msg: 'push_commands', cmds: commands})
}


function socketSendAuthResponse(token, nonce) {
  return JSON.stringify({msg: 'auth_response', mac: md5(nonce, token)})
}


function cmdSetTitle(itemId, title) {
  return 't ' + itemId + ' ' + title
}


function cmdSetTag(itemId, tag) {
  return 'T ' + itemId + ' ' + tag
}


function cmdDeleteItem(itemId) {
  return 'd ' + itemId
}


function cmdUnsetTag(itemId) {
  return 'D ' + itemId
}


function cmdDeleteTag(tag) {
  return 'r ' + tag
}


function socketReady(socket) {
  return (dispatch, getState) => {
    dispatch(socketObj(socket))
  }
}


function socketRecv(socket, data) {
  return (dispatch, getState) => {
    switch (data.msg) {
      case 'auth_challenge':
        return socket.send(socketSendAuthResponse(getState().ui.authToken, data.nonce))
      case 'state':
        return dispatch(socketRecvState(data.state))
      case 'bad_credentials':
        localStorage.removeItem('authToken')
        return socket.close()
      case 'authenticated':
        localStorage.setItem('authToken', getState().ui.authToken)
        dispatch(authenticated())  // intentional fall through
      case 'new_state':
        return socket.send(socketRequestState(getState().ui.activeTag))
    }
  }
}


function connectSocket() {
  return dispatch => {
    let socket = new WebSocket('ws://127.0.0.1:9001/gtd')
    socket.onopen = () => {
      dispatch(socketReady(socket))
    }
    socket.onmessage = (event) => {
      dispatch(socketRecv(socket, JSON.parse(event.data)))
    }
  }
}


export function authenticate(token) {
  return dispatch => {
    dispatch(authToken(token))
    dispatch(connectSocket())
  }
}


export function changeTag(tag) {
  return (dispatch, getState) => {
    getState().socket.send(socketRequestState(tag))
  }
}


export function commandSetTitle(itemId, title, tag = undefined) {
  return (dispatch, getState) => {
    let cmds = [cmdSetTitle(itemId, title)]

    if (tag !== undefined) {
      cmds.push(cmdSetTag(itemId, tag))
    }

    getState().socket.send(socketPushCommands(cmds))
  }
}


export function commandDeleteItem(itemId) {
  return (dispatch, getState) => {
    getState().socket.send(socketPushCommands([cmdDeleteItem(itemId)]))
  }
}


export function commandSetTag(itemId, tag) {
  return (dispatch, getState) => {
    getState().socket.send(socketPushCommands([cmdSetTag(itemId, tag)]))
  }
}


export function commandUnsetTag(itemId) {
  return (dispatch, getState) => {
    getState().socket.send(socketPushCommands([cmdUnsetTag(itemId)]))
  }
}


export function commandDeleteTag(tag) {
  return (dispatch, getState) => {
    getState().socket.send(socketPushCommands([cmdDeleteTag(tag)]))
  }
}


export function startDragItem() {
  return {
    type: START_DRAG_ITEM
  }
}


export function endDragItem() {
  return {
    type: END_DRAG_ITEM
  }
}
