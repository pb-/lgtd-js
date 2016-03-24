import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers'

let middleware = [
  thunkMiddleware
]

if (process.env.NODE_ENV !== 'production') {
  middleware = [...middleware,
    require('redux-logger')()
  ]
}

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore)

export default function configureStore (initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
