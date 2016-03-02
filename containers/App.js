import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { authenticate, changeTag, commandSetTitle, commandDeleteTag, commandDeleteItem, commandSetTag, commandUnsetTag, startDragItem, endDragItem, requestAddTag, endAddTag } from '../actions'
import { generateItemId } from '../util'
import ItemList from '../components/ItemList'
import TagList from '../components/TagList'

class App extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { dispatch } = this.props

    const token = localStorage.getItem('authToken')
    if (token !== null) {
      dispatch(authenticate(token))
    }
    window.addEventListener('keydown', (e) => this.focusAddStuff())
  }

  focusAddStuff() {
    const node = ReactDOM.findDOMNode(this.refs.add)
    if (node !== null) {
      node.focus()
    }
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

  handleSubmitToken(e) {
    if (e.keyCode === 13) {
      e.preventDefault()
      e.stopPropagation()
      this.props.dispatch(authenticate(e.target.value))
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
    if (!successful) {
      this.props.dispatch(endDragItem())
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
    this.props.dispatch(endDragItem())
    this.focusAddStuff()
  }

  handleDeleteTag(tag) {
    this.props.dispatch(commandDeleteTag(tag))
    this.focusAddStuff()
  }

  handleCancelProcessing() {
    this.props.dispatch(endDragItem())
    this.focusAddStuff()
  }

  renderApp() {
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
              onCancel={this.handleCancelProcessing.bind(this)}
              onDeleteTag={this.handleDeleteTag.bind(this)} />
        </div>
        <div id="content">
          <input
              autoFocus
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

  render() {
    if (this.props.ui.authenticated) {
      return this.renderApp()
    } else {
      return (
        <input
            type="text"
            placeholder="Token"
            onKeyDown={this.handleSubmitToken.bind(this)} />
      )
    }
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
