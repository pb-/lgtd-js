import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import { authToken, socketRecv, changeTag, commandSetTitle, commandDeleteTag, commandDeleteItem, commandSetTag, commandUnsetTag, startDragItem, endDragItem } from '../actions'
import { generateItemId } from '../util'
import ItemList from '../components/ItemList'
import TagList from '../components/TagList'
import Websocket from './Websocket'

class App extends Component {
  componentDidMount () {
    const { dispatch } = this.props

    const token = window.localStorage.getItem('authToken')
    if (token !== null) {
      dispatch(authToken(token))
    }
    window.addEventListener('keydown', (e) => this.focusAddStuff())
  }

  focusAddStuff () {
    const node = ReactDOM.findDOMNode(this.refs.add)
    if (node !== null) {
      node.focus()
    }
  }

  handleTagSwitch (e, tag) {
    e.preventDefault()
    changeTag(this.socket, tag)
    this.focusAddStuff()
  }

  handleAddStuff (e) {
    const { ui } = this.props
    e.stopPropagation()

    if (e.keyCode === 13) {
      if (e.target.value.length > 0) {
        let tag
        if (ui.activeTag !== 'inbox' && ui.activeTag !== 'tickler') {
          tag = ui.activeTag
        }
        commandSetTitle(this.socket, generateItemId(), e.target.value, tag)
        e.target.value = ''
      }
      return false
    } else {
      return true
    }
  }

  handleSubmitToken (e) {
    if (e.keyCode === 13) {
      e.preventDefault()
      e.stopPropagation()
      this.props.dispatch(authToken(e.target.value))
    }
  }

  handleDeleteItem (e, itemId) {
    e.preventDefault()
    commandDeleteItem(this.socket, itemId)
    this.focusAddStuff()
  }

  handleChangeTitle (itemId, title) {
    if (title.length > 0) {
      commandSetTitle(this.socket, itemId, title)
    }
  }

  handleStartDragItem (itemId) {
    this.props.dispatch(startDragItem())
  }

  handleEndDragItem (successful) {
    if (!successful) {
      this.props.dispatch(endDragItem())
      this.focusAddStuff()
    }
  }

  handleSetTag (itemId, tag) {
    if (tag !== this.props.ui.activeTag && tag !== 'tickler') {
      if (tag === 'inbox') {
        commandUnsetTag(this.socket, itemId)
      } else if (tag !== null && tag.length > 0) {
        commandSetTag(this.socket, itemId, tag)
      }
    }
    this.props.dispatch(endDragItem())
    this.focusAddStuff()
  }

  handleDeleteTag (tag) {
    commandDeleteTag(this.socket, tag)
    this.focusAddStuff()
  }

  handleCancelProcessing () {
    this.props.dispatch(endDragItem())
    this.focusAddStuff()
  }

  handleReceive (message) {
    this.props.dispatch(socketRecv(this.socket, message))
  }

  renderApp () {
    const { tags, items } = this.props
    return (
      <div id='app'>
        <div id='menu'>
          <p id='thead'>lgtd-jsclient</p>
          <TagList
            tags={tags}
            activeTag={this.props.ui.activeTag}
            draggingItem={this.props.ui.draggingItem}
            onSwitchTag={this.handleTagSwitch.bind(this)}
            onSetTag={this.handleSetTag.bind(this)}
            onCancel={this.handleCancelProcessing.bind(this)}
            onDeleteTag={this.handleDeleteTag.bind(this)} />
        </div>
        <div id='content'>
          <input
            autoFocus
            id='add'
            placeholder='Add stuff&hellip;'
            ref='add'
            type='text'
            onKeyDown={this.handleAddStuff.bind(this)} />
          <ItemList items={items}
            onDelete={this.handleDeleteItem.bind(this)}
            onChangeTitle={this.handleChangeTitle.bind(this)}
            onStartDrag={this.handleStartDragItem.bind(this)}
            onEndDrag={this.handleEndDragItem.bind(this)} />
        </div>
      </div>
    )
  }

  render () {
    if (this.props.ui.authToken) {
      return (
        <div>
          <Websocket
            url='ws://127.0.0.1:9001/gtd'
            onJSON={this.handleReceive.bind(this)}
            ref={s => { this.socket = s }} />
          {this.props.ui.authenticated ? this.renderApp() : ''}
        </div>
      )
    } else {
      return (
        <input
          type='text'
          placeholder='Token'
          onKeyDown={this.handleSubmitToken.bind(this)} />
      )
    }
  }
}

App.propTypes = {
  tags: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired
}

function mapStateToProps (state, props) {
  const { socket, tags, items, ui } = state

  return {
    ui,
    socket,
    tags,
    items
  }
}

export default connect(mapStateToProps)(App)
