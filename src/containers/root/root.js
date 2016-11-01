import React from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { configureHistory, configureStore } from './../../utils/configure';
import _ from 'lodash';
import DI from '../../di';
import Layout from '../layout/layout';
import Login from '../login/login';
import NotFound from '../not-found/not-found';

if (process.env.NODE_ENV === 'development' && module && module.hot) {
  module.hot.accept();
}

const store = configureStore();
const history = configureHistory(store);

class Root extends React.Component {

  static notFoundRouteConfig = {
    path: '*',
    name: 'notFound',
    component: NotFound
  };

  static loginRouteConfig = {
    path: '/login',
    name: 'login',
    component: Login
  };

  static routesConfig = {
    path: '/',
    component: Layout,
    name: 'layout',
    childRoutes: [],
    indexRoute: {}
  };

  state = {
    routesConfig: []
  };

  componentWillMount() {
    DI.get('navigation')
      .getChildRoutesAndIndexRoute()
      .then((childRoutesAndIndexRoute) => {
        this.setState({
          routesConfig: [
            _.merge(Root.routesConfig, childRoutesAndIndexRoute),
            Root.loginRouteConfig,
            Root.notFoundRouteConfig
          ]
        });
      });
  }

  render() {
    const { routesConfig } = this.state;

    if (routesConfig.length) {
      return (
        <Provider store={store} >
          <Router history={history} routes={routesConfig} />
        </Provider>
      );
    }
    return <p>loading</p>;
  }
}

export default Root;

