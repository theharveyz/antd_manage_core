import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import { Menu } from 'antd';
import styles from './navigation.styl';
import DI from '../../di';

class Navigation extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object
  };

  state = {
    current: [],
    configs: [],
    openKeys: []
  };

  componentDidMount() {
    this.getNavigation();

    DI.get('auth').listenPermissionChange(() => {
      this.getNavigation();
    });

    this.unsubscribed = this.context.router.listen(::this.locationHasChanged);
  }

  componentWillUnmount() {
    this.unsubscribed();
  }

  onOpen = (e) => {
    this.setState({
      openKeys: e.openKeys
    });
  };

  onClose = (e) => {
    this.onOpen(e);
  };

  onOpenChange = (openKeys) => {
    this.setState({
      openKeys
    });
  };

  getNavigation() {
    DI.get('navigation')
      .getConfigs()
      .then((configs) => this.setState({ configs }));
  }

  locationHasChanged(toRoute) {
    const path = toRoute.pathname;
    if (path === '/') {
      DI.get('navigation')
        .getDefault()
        .then((config) => {
          this.setState({
            current: [config.path]
          });
        });
    } else {
      DI.get('navigation')
        .getPaths(path)
        .then((paths) => {
          DI.get('navigation')
            .calcCurrentPath(paths, path)
            .then((currentPath) => {
              this.setState({
                current: [currentPath],
                openKeys: paths
              });
            });
        });
    }
  }

  /**
   * SubMenu的Parent Element必须是Menu,否者报错,这里不能自定义递归Component
   *
   * @param config
   * @returns {XML}
   */
  parseConfig(config) {
    let name = config.name;
    const hasNoPermission = config.hasNoPermission;
    const childConfigs = config.child;
    const path = config.path;
    if (childConfigs && !DI.get('navigation').needIgnoreChild(config)) {
      const childNavigation = [];

      _.each(childConfigs, (childConfig) => {
        childNavigation.push(this.parseConfig(childConfig));
      });

      return <Menu.SubMenu key={path} title={name} >{childNavigation}</Menu.SubMenu>;
    }

    if (hasNoPermission) {
      name = (
        <span>{name}</span>
      );
    }

    return (
      <Menu.Item key={path} >
        <Link to={path} >{name}</Link>
      </Menu.Item>
    );
  }

  parseConfigs(configs) {
    return _.map(configs, (config) => this.parseConfig(config));
  }

  render() {
    const { configs, current, openKeys } = this.state;
    const navigation = this.parseConfigs(configs);
    return (
      <aside className={styles.container} >
        <Menu
          onClick={this.handleClick}
          openKeys={openKeys}
          onOpenChange={this.onOpenChange}
          selectedKeys={current}
          mode="inline"
        >
          {navigation}
        </Menu>
      </aside>
    );
  }
}


export default Navigation;
