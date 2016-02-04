import React, { PropTypes, Component } from 'react'

export default class ItemList extends Component {
  render() {
    return (
      <ul id="items">
        {this.props.items.map(item =>
          <li key={item.id}>
            {item.title}
            <a className="btn" onClick={e => this.props.onDelete(e, item.id)}>
              remove
            </a>
          </li>
        )}
      </ul>
    )
  }
}

ItemList.propTypes = {
  items: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired
}
