import React from 'react';
import { Link } from 'react-router';
import Antd from 'antd';
import _ from 'lodash';
import DI from '../../di';
import styles from './breadcrumb.styl';

const AntdBreadcrumb = Antd.Breadcrumb;

export default class Breadcrumb extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object,
    history: React.PropTypes.object
  };

  static propTypes = {
    dispatch: React.PropTypes.func,
    breadcrumb: React.PropTypes.object
  };

  state = {
    breadcrumbs: []
  };

  componentDidMount() {
    this.unsubscribed = this.context.router.listen(::this.locationHasChanged);
  }

  componentWillUnmount() {
    this.unsubscribed();
  }

  locationHasChanged(toRoute) {
    const pathname = toRoute.pathname;
    if (pathname === '/') {
      DI.get('navigation').getDefault().then((breadcrumbs) => {
        this.setState({
          breadcrumbs: [breadcrumbs]
        });
      });
    } else {
      DI.get('navigation').getBreadcrumbs(toRoute.pathname).then((breadcrumbs) => {
        this.setState({
          breadcrumbs
        });
      });
    }
  }

  render() {
    const { breadcrumbs } = this.state;

    const maxBreadcrumbIndex = breadcrumbs.length - 1;
    const breadcrumbItems = _.map(breadcrumbs, (config, index) => {
      let content = config.name;

      if (config.component && index !== maxBreadcrumbIndex) {
        content = <Link to={config.path} >{config.name}</Link>;
      }

      return (
        <AntdBreadcrumb.Item key={config.path} >
          {content}
        </AntdBreadcrumb.Item>
      );
    });

    return (
      <div className={styles.container} >
        <AntdBreadcrumb separator=">" >
          {breadcrumbItems}
        </AntdBreadcrumb>
      </div>
    );
  }
}
