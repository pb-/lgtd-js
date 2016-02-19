import React, { PropTypes, Component } from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'


function monthDays(firstDay) {
  let days = []

  for (let d = firstDay.clone(); d.month() == firstDay.month(); d.add(1, 'days')) {
    days.push(d.clone())
  }

  return days
}


function weekChunks(days) {
  let weeks = []
  const first = days[0].weekday()
  const last = days[days.length - 1].weekday()

  // pad to full weeks
  let padded = Array.concat(
    Array(first).fill(null), days, Array(6 - last).fill(null))

  // chunk into sizes of 7
  while (padded.length > 0) {
    weeks.push(padded.splice(0, 7))
  }

  return weeks
}


export default class TagList extends Component {
  constructor(props) {
    super(props)
    this.onDropItem = this.onDropItem.bind(this)
    this.state = {
      addItemId: null,
      scheduleItemId: null,
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

  onDropItemTickler(e) {
    e.preventDefault()
    this.setState({
      scheduleItemId: e.dataTransfer.getData('itemId'),
      selectedMonth: moment()
    })
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
    this.props.onCancel()
  }

  onCancelSchedule(e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({scheduleItemId: null})
    this.props.onCancel()
  }

  onDeleteTag(e, tag) {
    e.stopPropagation()
    this.props.onDeleteTag(tag)
  }

  onChangeMonth(e, change) {
    e.preventDefault()
    e.stopPropagation()

    this.setState({
      selectedMonth: this.state.selectedMonth.clone().add(change, 'months')
    })
  }

  onSchedule(e, day) {
    e.preventDefault()
    e.stopPropagation()

    const tag = '$' + day.format('YYYY-MM-DD')
    this.props.onSetTag(this.state.scheduleItemId, tag)
    this.setState({scheduleItemId: null})
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

  renderTicklerCalendar() {
    const month = this.state.selectedMonth.startOf('month')
    const weeks = weekChunks(monthDays(month))

    return (
      <table>
        <thead>
          <tr>
            <th colSpan="5" className="month">{month.format('MMMM YYYY')}</th>
            <th onClick={e => this.onChangeMonth(e, -1)}>◂</th>
            <th onClick={e => this.onChangeMonth(e, +1)}>▸</th>
          </tr>
          <tr>
            {moment.weekdaysMin().map(day => <th key={day}>{day}</th>)}
          </tr>
        </thead>
        <tfoot>
          <tr>
            <td onClick={this.onCancelSchedule.bind(this)} colSpan="7">Cancel</td>
          </tr>
        </tfoot>
        <tbody>
          {weeks.map((week, i) =>
            <tr key={i}>
              {week.map((day, j) =>
                <td key={j} onClick={e => this.onSchedule(e, day)}>
                  {day === null ? '' : day.date()}
                </td>)}
            </tr>)}
        </tbody>
      </table>
    )
  }

  renderTag(tag) {
    const { name, count } = tag
    return (
      <li key={name} className={name === this.props.activeTag ? 'active' : ''}
          onClick={e => this.props.onSwitchTag(e, name)}
          onDragOver={e => e.preventDefault()}
          onDrop={e => name ==='tickler' ? this.onDropItemTickler(e) : this.onDropItem(e, name)} >
        {name}{this.renderCount(count)}
        {this.renderDeleteLink(tag)}
        {name === 'tickler' &&
          this.state.scheduleItemId !== null ? this.renderTicklerCalendar() : ''}
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
  onCancel: PropTypes.func.isRequired,
  onDeleteTag: PropTypes.func.isRequired,
}

