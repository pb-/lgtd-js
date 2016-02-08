import React, { PropTypes, Component } from 'react'
import ReactDOM from 'react-dom'

export default class TagList extends Component {
  constructor(props) {
    super(props)
    this.onDropItem = this.onDropItem.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.showAddTagInput && this.props.showAddTagInput) {
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
    this.props.onDropItem(tag)
  }

  onRequestAdd(e) {
    e.preventDefault()
    this.props.onRequestAdd()
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
          onDrop={e => this.onRequestAdd(e)} >
        Add new tag…
      </li>
    )
  }

  renderAddTagInput() {
    return (
      <li className="add">
        <input ref="addtag" placeholder="Tag name" type="text" />
      </li>
    )
  }

  renderAddTag(showText, showInput) {
    if (showInput) {
      return this.renderAddTagInput()
    } else if (showText) {
      return this.renderAddTagText()
    }
  }

  render() {
    return (
      <ul id="tags">
        {this.props.tags.map(tag => this.renderTag(tag))}
        {this.renderAddTag(this.props.showAddTag, this.props.showAddTagInput)}
      </ul>
    )
  }
}

TagList.propTypes = {
  activeTag: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  showAddTag: PropTypes.bool.isRequired,
  showAddTagInput: PropTypes.bool.isRequired,
  onSwitchTag: PropTypes.func.isRequired,
  onDropItem: PropTypes.func.isRequired,
  onRequestAdd: PropTypes.func.isRequired,
}

