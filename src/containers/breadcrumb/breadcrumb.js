import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Antd from 'antd';
import _ from 'lodash';
import { getBreadcrumbs, getDefaultBreadcrumb } from '../../actions/breadcrumb';
import { reducer } from '../../decorators';
import breadcrumbReduces from '../../reducers/breadcrumb';

import styles from './breadcrumb.styl';

const AntdBreadcrumb = Antd.Breadcrumb;

@reducer('breadcrumb', breadcrumbReduces)
@connect((state) => ({ breadcrumb: state.get('breadcrumb') }))
export default class Breadcrumb extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object,
    history: React.PropTypes.object
  };

  static propTypes = {
    dispatch: React.PropTypes.func,
    breadcrumb: React.PropTypes.object
  };

  componentDidMount() {
    this.unsubscribed = this.context.router.listen(::this.locationHasChanged);
  }

  componentWillUnmount() {
    this.unsubscribed();
  }

  locationHasChanged(toRoute) {
    const { dispatch } = this.props;
    const pathname = toRoute.pathname;
    if (pathname === '/') {
      dispatch(getDefaultBreadcrumb());
    } else {
      dispatch(getBreadcrumbs(toRoute.pathname));
    }
  }

  render() {
    const { breadcrumb } = this.props;
    const breadcrumbs = breadcrumb.get('breadcrumbs');

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
