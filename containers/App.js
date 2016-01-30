import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
// import { selectReddit, fetchPostsIfNeeded, invalidateReddit, openDatabase } from '../actions'
import { socketRecv, socketReady } from '../actions'
import ItemList from '../components/ItemList'
import TagList from '../components/TagList'

class App extends Component {
  constructor(props) {
    super(props)
    //this.handleChange = this.handleChange.bind(this)
    this.handleSyncClick = this.handleSyncClick.bind(this)
  }

  componentDidMount() {
    //const { dispatch, selectedReddit } = this.props
    //dispatch(fetchPostsIfNeeded(selectedReddit))
    //dispatch(openDatabase())
    const { dispatch } = this.props
    //dispatch(requestSync(1))

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

  handleSyncClick(e) {
    e.preventDefault()

    const { dispatch } = this.props
    dispatch(requestSync(1))
  }

  render() {
    const { tags, items } = this.props
    return (
      <div>
        <TagList tags={tags} />
        <ItemList items={items} />
      </div>
    )
  }
}

App.propTypes = {
  tags: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
}

function mapStateToProps(state, props) {
  const { tags, items } = state

  return {
    tags,
    items
  }
}

export default connect(mapStateToProps)(App)
