import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'

export default class TagList extends Component {
  renderCount(n) {
    if (n > 0) {
      return ` (${n})`
    }
  }

  renderTag(tag) {
    const { name, count } = tag
    return (
      <li key={name}>
        <a href="#" onClick={e => this.props.onSwitchTag(e, name)}>
          {name}{this.renderCount(count)}
        </a>
      </li>
    )
  }

  render() {
    return (
      <ul>
        {this.props.tags.map(tag => this.renderTag(tag))}
      </ul>
    )
  }
}

TagList.propTypes = {
  tags: PropTypes.array.isRequired,
  onSwitchTag: PropTypes.func.isRequired,
}

