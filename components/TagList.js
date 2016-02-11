import React, { PropTypes, Component } from 'react'
import ReactDOM from 'react-dom'

export default class TagList extends Component {
  constructor(props) {
    super(props)
    this.onDropItem = this.onDropItem.bind(this)
    this.state = {
      addItemId: null
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.addItemId === null && this.state.addItemId !== null ) {
      ReactDOM.findDOMNode(this.refs.addtag).focus();
    }
  }

  renderCount(n) {
    if (n > 0) {
      return <span className="count">&ensp;{n}</span>
    }
  }

  onDropItem(e, tag) {
    e.preventDefault()
    this.props.onSetTag(e.dataTransfer.getData('itemId'), tag)
  }

  onAddItem(e) {
    e.preventDefault()
    this.setState({addItemId: e.dataTransfer.getData('itemId')})
  }

  onKeyDown(e) {
    e.stopPropagation()

    if (e.keyCode === 13) {
      this.setState({addItemId: null})
      this.props.onSetTag(this.state.addItemId, e.target.value)
      e.preventDefault()
      return false
    } else if (e.keyCode === 32) {
      e.preventDefault()
      return false
    } else {
      return true
    }
  }

  renderTag(tag) {
    const { name, count } = tag
    return (
      <li key={name} className={name === this.props.activeTag ? 'active' : ''}
          onClick={e => this.props.onSwitchTag(e, name)}
          onDragOver={e => e.preventDefault()}
          onDrop={e => this.onDropItem(e, name)} >
        <a>{name}{this.renderCount(count)}</a>
      </li>
    )
  }

  renderAddTagText() {
    return (
      <li className="add"
          onDragOver={e => e.preventDefault()}
          onDrop={e => this.onAddItem(e)} >
        Add new tag…
      </li>
    )
  }

  renderAddTagInput() {
    return (
      <li className="add">
        <input
           type="text"
           ref="addtag"
           placeholder="Tag name"
           onBlur={(e) => this.props.onSetTag(null, null)}
           onKeyDown={(e) => this.onKeyDown(e)} />
      </li>
    )
  }

  renderAddTag(draggingItem, showInput) {
    if (showInput) {
      return this.renderAddTagInput()
    } else if (draggingItem) {
      return this.renderAddTagText()
    }
  }

  render() {
    return (
      <ul id="tags">
        {this.props.tags.map(tag => this.renderTag(tag))}
        {this.renderAddTag(this.props.draggingItem, this.state.addItemId !== null)}
      </ul>
    )
  }
}

TagList.propTypes = {
  activeTag: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  draggingItem: PropTypes.bool.isRequired,
  onSwitchTag: PropTypes.func.isRequired,
  onSetTag: PropTypes.func.isRequired,
}

