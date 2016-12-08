import React from 'react';
import { hashHistory } from 'react-router';
import DI from '../../di';
import { Menu, Dropdown, Icon, Modal, message } from 'antd';
import AccountSetting from '../account-setting/account-setting';
import GoogleMaterialIcon from '../../components/google-material-icon/google-material-icon';
import TaskCenter from '../../components/task-center/task-center';

import styles from './account-info.styl';

export default class AccountInfo extends React.Component {

  state = {
    account: [],
    visible: false,
    intervalId: null
  };

  componentWillMount() {
    const { visible } = this.state;

    DI.get('auth').getAccount().then((account) => {
      this.setState({
        account
      });
    });

    const twoFactorAuthenticationConfig = DI.get('config')
      .get('core.auth.twoFactorAuthentication');

    if (twoFactorAuthenticationConfig.forceUse) {
      const intervalId = setInterval(() => {
        if (!visible) {
          DI.get('auth')
            .getKeyVerified()
            .then((verified) => {
              if (verified === 'N') {
                this.setState({ visible: true });
              }
            });
        }
      }, twoFactorAuthenticationConfig.checkDelay);
      this.setState({ intervalId });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
    this.setState({ intervalId: null });
  }

  onCancel() {
    this.setState({
      visible: false
    });
  }

  onShow() {
    this.setState({
      visible: true
    });
  }

  onSyncPermission() {
    DI.get('authHttp').getResource().then((resource) => {
      DI.get('auth').setPermission(resource)
        .then(()=>{
        message.success('同步权限成功');
      })
        .catch(()=>{
        message.error('同步权限失败');
      })
    });
  }

  logout() {
    const doClearAndDispatch = () => {
      DI.get('auth').clear().then(() => {
        hashHistory.push('/login');
      });
    };
    DI.get('authHttp')
      .doLogout()
      .then(doClearAndDispatch)
      .catch(doClearAndDispatch);
  }

  render() {
    const { account, visible } = this.state;
    const MenuItem = Menu.Item;
    const menu = (
      <Menu className={styles.menu} >
        <MenuItem>
          <TaskCenter />
        </MenuItem>
        <Menu.Divider />
        <MenuItem>
          <a onClick={::this.onSyncPermission} >
            <GoogleMaterialIcon type="sync" /> 同步权限
          </a>
        </MenuItem>
        <Menu.Divider />
        <MenuItem>
          <a onClick={::this.onShow} >
            <GoogleMaterialIcon type="settings" /> 个人设置
          </a>
        </MenuItem>
        <Menu.Divider />
        <MenuItem>
          <a onClick={::this.logout} >
            <GoogleMaterialIcon type="power_settings_new" /> 注销
          </a>
        </MenuItem>
      </Menu>
    );
    return (
      <div className={styles.container} >
        <Dropdown overlay={menu} >
          <a className="ant-dropdown-link" >
            {account.real_name} <Icon type="down" />
          </a>
        </Dropdown>
        <Modal
          className={styles.setting}
          title="设置"
          style={{ top: 20 }}
          width="95%"
          visible={visible}
          onCancel={::this.onCancel}
          footer=""
        >
          <AccountSetting />
        </Modal>
      </div>
    );
  }
}
