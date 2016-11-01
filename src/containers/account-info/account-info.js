import React from 'react';
import { connect } from 'react-redux';
import { Menu, Dropdown, Icon, Modal } from 'antd';
import Setting from '../setting/setting';
import GoogleMaterialIcon from '../../components/google-material-icon/google-material-icon';
import reducer from '../../decorators/reducer';
import accountInfoReducers from '../../reducers/account-info';
import {
  getAccount,
  showAccountInfo,
  closeAccountInfo,
  intervalCheckTwoFactorAuthentication,
  clearIntervalCheckTwoFactorAuthentication,
  logout
} from '../../actions/account-info';

import styles from './account-info.styl';

@reducer('accountInfo', accountInfoReducers)
@connect((state) => ({ accountInfo: state.get('accountInfo') }))
export default class AccountInfo extends React.Component {

  static propTypes = {
    dispatch: React.PropTypes.func,
    accountInfo: React.PropTypes.object
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getAccount());
    dispatch(intervalCheckTwoFactorAuthentication());
  }

  componentWillUnmount() {
    this.props.dispatch(clearIntervalCheckTwoFactorAuthentication());
  }

  onCancel() {
    this.props.dispatch(closeAccountInfo());
  }

  onShow() {
    this.props.dispatch(showAccountInfo());
  }

  logout() {
    this.props.dispatch(logout());
  }

  render() {
    const { accountInfo } = this.props;
    const account = accountInfo.get('account');
    const visible = accountInfo.get('visible');
    const MenuItem = Menu.Item;
    const menu = (
      <Menu className={styles.menu} >
        <MenuItem>
          <a onClick={::this.onShow} ><GoogleMaterialIcon type="settings" /> 设置</a>
        </MenuItem>
        <Menu.Divider />
        <MenuItem>
          <a onClick={::this.logout} ><GoogleMaterialIcon type="power_settings_new" /> 注销</a>
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
          <Setting />
        </Modal>
      </div>
    );
  }
}
