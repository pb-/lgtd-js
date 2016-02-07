import React, { PropTypes, Component } from 'react'

export default class TagList extends Component {
  constructor(props) {
    super(props)
    this.onDropItem = this.onDropItem.bind(this)
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

  render() {
    return (
      <ul id="tags">
        {this.props.tags.map(tag => this.renderTag(tag))}
      </ul>
    )
  }
}

TagList.propTypes = {
  activeTag: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  onSwitchTag: PropTypes.func.isRequired,
  onDropItem: PropTypes.func.isRequired,
}

