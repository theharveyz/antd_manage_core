import React from 'react';
import GoogleMaterialIcon from '../../components/google-material-icon/google-material-icon';
import { Menu } from 'antd';
import SettingService from '../../services/setting';
import _ from 'lodash';
import TwoFactorAuthentication from '../two-factor-authentication/two-factor-authentication';
import styles from './account-setting.styl';

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

export default class AccountSetting extends React.Component {

  state = {
    component: null
  };

  componentWillMount() {
    SettingService.addGroup({
      text: '账户',
      icon: 'account_box'
    });
    SettingService.add({
      text: '二步验证',
      group: '账户',
      component: <TwoFactorAuthentication />
    });
    SettingService.addOpenKeys('账户');
    SettingService.addSelectedKeys('账户-二步验证');
    this.onSelect({
      key: '账户-二步验证'
    });
  }

  onSelect(e) {
    const groupAndText = e.key.split('-');

    const component = _.find(
      SettingService.getGroup(
        groupAndText[0]).settings,
      { text: groupAndText[1] }
    ).component;
    this.setState({
      component
    });
  }

  render() {
    const { component } = this.state;
    return (
      <div className={styles.container} >
        <Menu
          style={{ width: 240 }}
          mode="inline"
          openKeys={SettingService.getOpenKeys()}
          selectedKeys={SettingService.getSelectedKeys()}
          onSelect={::this.onSelect}
        >
          {_.map(SettingService.getAll(), (group, key) => (
            <SubMenu
              key={key}
              title={<span><GoogleMaterialIcon type={group.icon} /> {key}</span>}
            >
              {_.map(group.settings, (options) => (
                <MenuItem key={`${options.group}-${options.text}`} >{options.text}</MenuItem>
              ))}
            </SubMenu>
          ))}
        </Menu>
        <div className={styles.component} >
          {component}
        </div>
      </div>
    );
  }
}
