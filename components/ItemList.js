import React, { PropTypes, Component } from 'react'

export default class ItemList extends Component {
  constructor(props) {
    super(props)
    this.state = {editItemId: null}
    this.onStartEdit = this.onStartEdit.bind(this)
    this.onEditKeyDown = this.onEditKeyDown.bind(this)
    this.onCancelEdit = this.onCancelEdit.bind(this)
    this.onFocus = this.onFocus.bind(this)
  }

  onStartEdit(e, itemId) {
    this.setState({editItemId: itemId})
  }

  onEditKeyDown(e) {
    if (e.keyCode === 13) {
      this.props.onChangeTitle(this.state.editItemId, e.target.value)
      this.onCancelEdit()
      return false
    } else {
      return true
    }
  }

  onCancelEdit(e) {
    this.setState({editItemId: null})
  }

  onFocus(e) {
    const el = e.target
    el.selectionStart = el.selectionEnd = el.value.length
  }

  renderItem(item) {
    if (item.id === this.state.editItemId) {
      return (
        <li key={item.id}>
          <input autoFocus
                 id="editItem"
                 type="text"
                 defaultValue={item.title}
                 onKeyDown={this.onEditKeyDown}
                 onBlur={this.onCancelEdit}
                 onFocus={this.onFocus} />
        </li>
      )
    } else {
      return (
        <li key={item.id}>
          <span onClick={e => this.onStartEdit(e, item.id)}>{item.title}</span>
          <a className="btn" onClick={e => this.props.onDelete(e, item.id)}>
            remove
          </a>
        </li>
      )
    }
  }

  render() {
    return (
      <ul id="items">
        {this.props.items.map(item => this.renderItem(item))}
      </ul>
    )
  }
}

ItemList.propTypes = {
  items: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onChangeTitle: PropTypes.func.isRequired
}
