import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'

export default class TagList extends Component {
  renderCount(n) {
    if (n > 0) {
      return ` (${n})`
    }
  }

  renderTag(tag) {
    const { name, itemCount } = tag
    return (
      <li key={name}>
        <Link to={`/tag/${name}`}>{name}{this.renderCount(itemCount)}</Link>
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
  tags: PropTypes.array.isRequired
}

