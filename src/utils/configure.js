import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import { hashHistory } from 'react-router';
import {
  createStore,
  compose,
  applyMiddleware
} from 'redux';
import { combineReducers } from 'redux-immutable';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
//import createLogger from 'redux-logger';
import Immutable from 'immutable';
import { SUCCESS, LOADING, ERROR } from '../constants/redux_common';
import immutableHistoryReducers from '../reducers/immutableHistory';

import DI from '../di';

export const configureStore = () => {
  const reducerManager = DI.get('reducerManager');
  const initialState = new Immutable.Map();
  const composes = [];
  const middlewares = [
    thunk,
    promiseMiddleware({
      promiseTypeSuffixes: [LOADING, SUCCESS, ERROR]
    }),
    routerMiddleware(hashHistory)
  ];
  if (process.env.NODE_ENV === 'development') {
   //middlewares.push(createLogger());
    composes.push(window.devToolsExtension ? window.devToolsExtension() : f => f);
    reducerManager.registerReducers({ routing: immutableHistoryReducers });
  }

  composes.unshift(applyMiddleware(...middlewares));
  const finalCreateStore = compose(...composes)(createStore);

  const store = finalCreateStore(
    combineReducers(reducerManager.getReducers()), initialState);

  reducerManager.listener((reducers) => {
    store.replaceReducer(combineReducers(reducers));
  });

  return store;
};

export const configureHistory = (store) => {
  if (process.env.NODE_ENV === 'development') {
    return syncHistoryWithStore(hashHistory, store, {
      selectLocationState: (state) => (state.get('routing').toObject())
    });
  }
  return hashHistory;
};

