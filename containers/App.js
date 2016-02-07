import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { socketRecv, socketReady, changeTag, commandSetTitle, commandDeleteItem, commandSetTag, commandUnsetTag, startDragItem, endDragItem } from '../actions'
import { pushPath } from 'redux-simple-router'
import { generateItemId } from '../util'
import ItemList from '../components/ItemList'
import TagList from '../components/TagList'

class App extends Component {
  constructor(props) {
    super(props)
    this.handleTagSwitch = this.handleTagSwitch.bind(this)
    this.handleAddStuff = this.handleAddStuff.bind(this)
    this.handleDeleteItem = this.handleDeleteItem.bind(this)
    this.handleChangeTitle = this.handleChangeTitle.bind(this)
    this.handleStartDragItem = this.handleStartDragItem.bind(this)
    this.handleEndDragItem = this.handleEndDragItem.bind(this)
    this.handleDropItem = this.handleDropItem.bind(this)
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
  }

  focusAddStuff() {
    ReactDOM.findDOMNode(this.refs.add).focus();
  }

  handleTagSwitch(e, tag) {
    e.preventDefault()

    const { dispatch } = this.props
    dispatch(pushPath(`/tag/${tag}`))
    dispatch(changeTag(tag))
    this.focusAddStuff()
  }

  handleAddStuff(e) {
    const { dispatch, ui } = this.props

    if (e.keyCode === 13) {
      let tag
      if (ui.activeTag !== 'inbox' && ui.activeTag !== 'tickler') {
        tag = ui.activeTag
      }
      dispatch(commandSetTitle(generateItemId(), e.target.value, tag))
      e.target.value = ''
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
    const { dispatch } = this.props

    dispatch(commandSetTitle(itemId, title))
  }

  handleStartDragItem(itemId) {
    this.props.dispatch(startDragItem(itemId))
  }

  handleEndDragItem() {
    this.props.dispatch(endDragItem())
    this.focusAddStuff()
  }

  handleDropItem(tag) {
    if (tag !== this.props.ui.activeTag && tag !== 'tickler') {
      if (tag === 'inbox') {
        this.props.dispatch(commandUnsetTag(this.props.ui.dragItemId))
      } else {
        this.props.dispatch(commandSetTag(this.props.ui.dragItemId, tag))
      }
    }
  }

  render() {
    const { tags, items } = this.props
    return (
      <div>
        <div id="menu">
          <p id="thead">lgtd-jsclient</p>
          <TagList
              tags={tags}
              onSwitchTag={this.handleTagSwitch}
              onDropItem={this.handleDropItem}
              activeTag={this.props.ui.activeTag} />
        </div>
        <div id="content">
          <input id="add" placeholder="Add stuff&hellip;" ref="add" type="text" onKeyDown={this.handleAddStuff} />
          <ItemList items={items}
                    onDelete={this.handleDeleteItem}
                    onChangeTitle={this.handleChangeTitle}
                    onStartDrag={this.handleStartDragItem}
                    onEndDrag={this.handleEndDragItem} />
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
