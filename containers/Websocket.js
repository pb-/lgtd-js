import { Component, PropTypes } from 'react'

class Websocket extends Component {
  constructor (props) {
    super(props)
    this.state = new window.WebSocket(props.url)
  }

  componentDidMount () {
    this.state.onmessage = (e) => {
      this.props.onJSON(JSON.parse(e.data))
    }
  }

  componentWillUnmount () {
    this.state.close()
  }

  sendJSON (o) {
    this.state.send(JSON.stringify(o))
  }

  render () {
    return null
  }
}

Websocket.propTypes = {
  url: PropTypes.string.isRequired,
  onJSON: PropTypes.func.isRequired
}

export default Websocket
