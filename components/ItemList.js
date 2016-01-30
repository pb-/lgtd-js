import React, { PropTypes, Component } from 'react'

export default class ItemList extends Component {
  render() {
    return (
      <ul>
        {this.props.items.map(item =>
          <li key={item.id}>{item.title}</li>
        )}
      </ul>
    )
  }
}

ItemList.propTypes = {
  items: PropTypes.array.isRequired
}
