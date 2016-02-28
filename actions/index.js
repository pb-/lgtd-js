import md5 from 'blueimp-md5'

export const SOCKET_OBJECT = 'SOCKET_OBJECT'
export const SOCKET_RECV_STATE = 'SOCKET_RECV_STATE'
export const SOCKET_RECV_AUTH_CHALLENGE = 'SOCKET_RECV_AUTH_CHALLENGE'
export const START_DRAG_ITEM = 'START_DRAG_ITEM'
export const END_DRAG_ITEM = 'END_DRAG_ITEM'


function socketRecvState(state) {
  return {
    type: SOCKET_RECV_STATE,
    state,
  }
}


function socketRecvAuthChallenge(nonce) {
  return {
    type: SOCKET_RECV_AUTH_CHALLENGE,
    nonce,
  }
}


function socketObj(socket) {
  return {
    type: SOCKET_OBJECT,
    socket
  }
}


function socketRequestState(tag) {
  return JSON.stringify({msg: 'request_state', tag})
}


function socketPushCommands(commands) {
  return JSON.stringify({msg: 'push_commands', cmds: commands})
}


function socketSendAuthResponse(key, nonce) {
  return JSON.stringify({msg: 'auth_response', mac: md5(key, nonce)})
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


export function socketReady(socket) {
  return (dispatch, getState) => {
    dispatch(socketObj(socket))
    // socket.send(socketRequestState(getState().ui.activeTag))
  }
}


export function socketRecv(socket, data) {
  return (dispatch, getState) => {
    switch (data.msg) {
      case 'auth_challenge':
        return dispatch(socketRecvAuthChallenge(data.nonce))
      case 'state':
        return dispatch(socketRecvState(data.state))
      case 'new_state':
      case 'authenticated':
        return socket.send(socketRequestState(getState().ui.activeTag))
    }
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


export function authenticate(key, nonce) {
  return (dispatch, getState) => {
    getState().socket.send(socketSendAuthResponse(key, nonce))
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
