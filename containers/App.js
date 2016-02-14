import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { socketRecv, socketReady, changeTag, commandSetTitle, commandDeleteItem, commandSetTag, commandUnsetTag, startDragItem, endDragItem, requestAddTag, endAddTag } from '../actions'
import { generateItemId } from '../util'
import ItemList from '../components/ItemList'
import TagList from '../components/TagList'

class App extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { dispatch } = this.props

    let socket = new WebSocket('ws://127.0.0.1:9001/gtd')
    socket.onopen = () => {
      dispatch(socketReady(socket))
    }
    socket.onmessage = (event) => {
      dispatch(socketRecv(socket, JSON.parse(event.data)))
    }

    this.focusAddStuff()
    window.addEventListener('keydown', (e) => this.focusAddStuff())
  }

  focusAddStuff() {
    ReactDOM.findDOMNode(this.refs.add).focus();
  }

  handleTagSwitch(e, tag) {
    e.preventDefault()

    const { dispatch } = this.props
    dispatch(changeTag(tag))
    this.focusAddStuff()
  }

  handleAddStuff(e) {
    const { dispatch, ui } = this.props
    e.stopPropagation()

    if (e.keyCode === 13) {
      if (e.target.value.length > 0) {
        let tag
        if (ui.activeTag !== 'inbox' && ui.activeTag !== 'tickler') {
          tag = ui.activeTag
        }
        dispatch(commandSetTitle(generateItemId(), e.target.value, tag))
        e.target.value = ''
      }
      return false
    } else {
      return true
    }
  }

  handleDeleteItem(e, item_id) {
    const { dispatch } = this.props

    e.preventDefault()
    dispatch(commandDeleteItem(item_id))
    this.focusAddStuff()
  }

  handleChangeTitle(itemId, title) {
    if (title.length > 0) {
      this.props.dispatch(commandSetTitle(itemId, title))
    }
  }

  handleStartDragItem(itemId) {
    this.props.dispatch(startDragItem())
  }

  handleEndDragItem(successful) {
    this.props.dispatch(endDragItem())
    if (!successful) {
      this.focusAddStuff()
    }
  }

  handleSetTag(itemId, tag) {
    if (tag !== this.props.ui.activeTag && tag !== 'tickler') {
      if (tag === 'inbox') {
        this.props.dispatch(commandUnsetTag(itemId))
      } else if (tag !== null && tag.length > 0) {
        this.props.dispatch(commandSetTag(itemId, tag))
      }
    }
    this.focusAddStuff()
  }

  handleCancelAdd() {
    this.focusAddStuff()
  }

  render() {
    const { tags, items } = this.props
    return (
      <div>
        <div id="menu">
          <p id="thead">lgtd-jsclient</p>
          <TagList
              tags={tags}
              activeTag={this.props.ui.activeTag}
              draggingItem={this.props.ui.draggingItem}
              onSwitchTag={this.handleTagSwitch.bind(this)}
              onSetTag={this.handleSetTag.bind(this)}
              onCancelAdd={this.handleCancelAdd.bind(this)} />
        </div>
        <div id="content">
          <input
              id="add"
              placeholder="Add stuff&hellip;"
              ref="add"
              type="text"
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
}

App.propTypes = {
  tags: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
}

function mapStateToProps(state, props) {
  const { socket, tags, items, ui } = state

  return {
    ui,
    socket,
    tags,
    items
  }
}

export default connect(mapStateToProps)(App)
