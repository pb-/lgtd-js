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
    if (prevState.addItemId === null && this.state.addItemId !== null) {
      ReactDOM.findDOMNode(this.refs.addtag).focus();
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

    if (e.keyCode === 13 || e.keyCode === 27 || e.keyCode === 32) {
      e.preventDefault()

      if (e.keyCode === 13) {
        this.setState({addItemId: null})
        this.props.onSetTag(this.state.addItemId, e.target.value)
      } else if (e.keyCode === 27) {
        this.onCancelAdd()
      }

      return false
    }

    return true
  }

  onCancelAdd(e) {
    this.setState({addItemId: null})
    this.props.onCancelAdd()
  }

  onDeleteTag(e, tag) {
    e.stopPropagation()
    this.props.onDeleteTag(tag)
  }

  renderDeleteLink(tag) {
    if (tag.count === 0) {
      return <a className="remove" onClick={e => this.onDeleteTag(e, tag.name)}>❌</a>
    }
  }

  renderCount(n) {
    if (n > 0) {
      return <span className="count">&ensp;{n}</span>
    }
  }

  renderTag(tag) {
    const { name, count } = tag
    return (
      <li key={name} className={name === this.props.activeTag ? 'active' : ''}
          onClick={e => this.props.onSwitchTag(e, name)}
          onDragOver={e => e.preventDefault()}
          onDrop={e => this.onDropItem(e, name)} >
        {name}{this.renderCount(count)}
        {this.renderDeleteLink(tag)}
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
           onBlur={this.onCancelAdd.bind(this)}
           onKeyDown={this.onKeyDown.bind(this)} />
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
  onCancelAdd: PropTypes.func.isRequired,
  onDeleteTag: PropTypes.func.isRequired,
}

