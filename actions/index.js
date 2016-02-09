export const SOCKET_OBJECT = 'SOCKET_OBJECT'
export const SOCKET_RECV = 'SOCKET_RECV'
export const START_DRAG_ITEM = 'START_DRAG_ITEM'
export const END_DRAG_ITEM = 'END_DRAG_ITEM'
export const REQUEST_ADD_TAG = 'REQUEST_ADD_TAG'
export const END_ADD_TAG = 'END_ADD_TAG'


function socketRecvState(state) {
  return {
    type: SOCKET_RECV,
    state,
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


export function socketReady(socket) {
  return (dispatch, getState) => {
    dispatch(socketObj(socket))
    socket.send(socketRequestState(getState().ui.activeTag))
  }
}


export function socketRecv(socket, data) {
  return (dispatch, getState) => {
    switch (data.msg) {
      case 'state':
        return dispatch(socketRecvState(data.state))
      case 'new_state':
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


export function startDragItem(itemId) {
  return {
    type: START_DRAG_ITEM,
    itemId
  }
}


export function endDragItem() {
  return {
    type: END_DRAG_ITEM
  }
}


export function requestAddTag(itemId) {
  return {
    type: REQUEST_ADD_TAG,
    itemId: itemId
  }
}


export function endAddTag() {
  return {
    type: END_ADD_TAG
  }
}
