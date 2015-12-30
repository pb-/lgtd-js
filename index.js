import 'babel-core/polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createHistory } from 'history'
import { Router, Route } from 'react-router'
import { syncReduxAndRouter } from 'redux-simple-router'
import App from './containers/App'
import configureStore from './store/configureStore'

const store = configureStore()
const history = createHistory()

syncReduxAndRouter(history, store)

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="tag/:name" component={App} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
