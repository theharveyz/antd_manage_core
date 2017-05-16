import React from 'react';
import { Router, hashHistory } from 'react-router';
import _ from 'lodash';
import DI from '../../di';
import Layout from '../layout/layout';
import Login from '../login/login';
import NotFound from '../not-found/not-found';
import moment from 'moment';
import Raven from 'raven-js';


import 'moment-range';

if (process.env.NODE_ENV === 'development' && module && module.hot) {
  module.hot.accept();
}

class Root extends React.Component {

  static propTypes = {
    navigationConfig: React.PropTypes.array.isRequired,
    configs: React.PropTypes.object.isRequired
  };

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
    this.init();
  }

  init() {
    moment.locale('zh-CN');
    const sentryUrl = _.get(DI.get('config'), 'configs.sentry.url');
    Raven.config(sentryUrl).install();
    const { configs, navigationConfig } = this.props;
    DI.get('config').setConfigs(configs);
    DI.get('navigation')
      .setNavigationConfig(navigationConfig)
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
        <Router history={hashHistory} routes={routesConfig} />
      );
    }
    return <p>loading</p>;
  }
}

export default Root;

