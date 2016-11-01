import React from 'react';
import { DI } from 'core';
import styles from './permission.styl';

export default class Permission extends React.Component {
  static propTypes = {
    needPermission: React.PropTypes.array,
    children: React.PropTypes.node.isRequired
  }

  state = { showChildren: false }

  componentWillMount() {
    DI.get('permission')
      .checkPermissionPromise(this.props.needPermission)
      .then((data) => {
        this.setState({ showChildren: data });
      });
  }

  render() {
    let children = null;
    if (DI.get('config').get('permission.debug')) {
      children = (
        <div className={styles.debug}>
          <p className={styles.info}>
            {JSON.stringify(this.props.needPermission)}
          </p>
          {this.props.children}
        </div>
      );
    }
    if (this.state.showChildren) {
      children = this.props.children;
    }
    return (
      <permission>{children}</permission>
    );
  }
}

