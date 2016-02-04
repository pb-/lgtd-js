import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'

export default class TagList extends Component {
  renderCount(n) {
    if (n > 0) {
      return <span className="count">&ensp;{n}</span>
    }
  }

  renderTag(tag) {
    const { name, count } = tag
    return (
      <li key={name} className={name === this.props.activeTag ? 'active' : ''}
          onClick={e => this.props.onSwitchTag(e, name)}>
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
}

