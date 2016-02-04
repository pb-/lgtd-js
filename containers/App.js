import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
// import { selectReddit, fetchPostsIfNeeded, invalidateReddit, openDatabase } from '../actions'
import { socketRecv, socketReady, changeTag, commandSetTitle, commandDeleteItem } from '../actions'
import { pushPath } from 'redux-simple-router'
import { generateItemId } from '../util'
import ItemList from '../components/ItemList'
import TagList from '../components/TagList'

class App extends Component {
  constructor(props) {
    super(props)
    //this.handleChange = this.handleChange.bind(this)
    this.handleSyncClick = this.handleSyncClick.bind(this)
    this.handleTagSwitch = this.handleTagSwitch.bind(this)
    this.handleAddStuff = this.handleAddStuff.bind(this)
    this.handleDeleteItem = this.handleDeleteItem.bind(this)
  }

  componentDidMount() {
    //const { dispatch, selectedReddit } = this.props
    //dispatch(fetchPostsIfNeeded(selectedReddit))
    //dispatch(openDatabase())
    const { dispatch } = this.props
    //dispatch(requestSync(1))

    this.focusAddStuff()

    let socket = new WebSocket('ws://127.0.0.1:9001/gtd')
    socket.onopen = () => {
      dispatch(socketReady(socket))
    }
    socket.onmessage = (event) => {
      dispatch(socketRecv(socket, JSON.parse(event.data)))
    }
  }

  componentWillReceiveProps(nextProps) {
    //if (nextProps.selectedReddit !== this.props.selectedReddit) {
    //  const { dispatch, selectedReddit } = nextProps
    //  dispatch(fetchPostsIfNeeded(selectedReddit))
    //}
  }

  handleChange(nextReddit) {
    //this.props.dispatch(selectReddit(nextReddit))
  }

  handleRefreshClick(e) {
    /*e.preventDefault()

    const { dispatch, selectedReddit } = this.props
    dispatch(invalidateReddit(selectedReddit))
    dispatch(fetchPostsIfNeeded(selectedReddit))
    */
  }

  focusAddStuff() {
    ReactDOM.findDOMNode(this.refs.add).focus();
  }

  handleSyncClick(e) {
    e.preventDefault()

    const { dispatch } = this.props
    dispatch(requestSync(1))
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

    if (e.keyCode == 13) {
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

  render() {
    const { tags, items } = this.props
    return (
      <div>
        <div id="menu">
          <p id="thead">lgtd-jsclient</p>
          <TagList tags={tags} onSwitchTag={this.handleTagSwitch} activeTag={this.props.ui.activeTag} />
        </div>
        <div id="content">
          <input id="add" placeholder="Add stuff&hellip;" ref="add" type="text" onKeyDown={this.handleAddStuff} />
          <ItemList items={items} onDelete={this.handleDeleteItem} />
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
