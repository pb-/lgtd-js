import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
// import { selectReddit, fetchPostsIfNeeded, invalidateReddit, openDatabase } from '../actions'
import { requestSync } from '../actions'
import ItemList from '../components/ItemList'
import TagList from '../components/TagList'

class App extends Component {
  constructor(props) {
    super(props)
    //this.handleChange = this.handleChange.bind(this)
    //this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
    //const { dispatch, selectedReddit } = this.props
    //dispatch(fetchPostsIfNeeded(selectedReddit))
    //dispatch(openDatabase())
    const { dispatch } = this.props
    dispatch(requestSync(1))
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

  render() {
    const { items, tags, sync } = this.props
    return (
      <div>
        {sync.syncing ? 'syncing...' : 'idle'}
        <TagList tags={tags} />
        <ItemList items={items} />
      </div>
    )
  }
}

App.propTypes = {
//  selectedReddit: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  //isFetching: PropTypes.bool.isRequired,
  //lastUpdated: PropTypes.number,
  //dispatch: PropTypes.func.isRequired
}

function actualTag(tag) {
  switch (tag) {
    case '':
      return 'inbox'
    default:
      return tag
  }
}

function filterItems(tag, items) {
  return items.filter(item => actualTag(item.tag) === tag)
}

function computeTagList(tagOrder, items) {
  const grouped = _.groupBy(items, item => actualTag(item.tag))
  return tagOrder.map(name => ({
    name: name,
    itemCount: name in grouped ? grouped[name].length : 0
  }))
}

function mapStateToProps(state, props) {
  const { ui, tagOrder, items, sync } = state
  const selectedTag = props.params.name || 'inbox'

  return {
    ui: {...ui, selectedTag},
    tags: computeTagList(tagOrder, items),
    items: filterItems(selectedTag, items),
    sync
  }
}

export default connect(mapStateToProps)(App)
