import React from 'react';
import Auth from '../../services/auth';
import AuthHttp from '../../services/auth-http';
import { Card, Popover, Popconfirm, message, Alert } from 'antd';
import Authenticator from './authenticator';
import ConfigService from '../../services/config';
import styles from './two-factor-authentication.styl';

const configService = new ConfigService();
class TwoFactorAuthentication extends React.Component {

  state = {
    verified: 'N',
    forceUse: configService.get('core.auth.twoFactorAuthentication.forceUse')
  };

  componentWillMount() {
    this.authService = new Auth();
    this.authHttpService = new AuthHttp();
    this.authService.getKeyVerified().then((verified) => {
      this.setState({
        verified
      });
    });
  }

  onRemoveValidator() {
    this.authHttpService.resetKey().then(() => {
      this.authService.setKeyVerified('N');
      this.setState({
        verified: 'N'
      });
    }).catch(() => {
      message.error('移除身份验证器失败!');
    });
  }

  onVerifySuccess() {
    this.setState({
      verified: 'Y'
    });
  }

  render() {
    const { verified, forceUse } = this.state;

    let forceUseAlert;

    if (forceUse && verified === 'N') {
      forceUseAlert = (
        <Alert
          className={styles.alert}
          message="安全警告"
          description="必须开启二步验证才能正常使用管理后台"
          type="warning"
          showIcon
        />
      );
    }
    const setValidatorExtra = (
      <Popover
        bottom="bottom"
        content={<Authenticator onVerifySuccess={::this.onVerifySuccess} />}
        trigger="click"
        overlayClassName={styles['set-validator-extra']}
      >
        <a>设置</a>
      </Popover>
    );

    const removeValidatorExtra = (
      <Popconfirm
        bottom="bottom"
        title="确定要移除身份验证器吗?"
        trigger="click"
        onConfirm={::this.onRemoveValidator}
      >
        <a>移除</a>
      </Popconfirm>
    );

    const components = [];

    if (verified === 'Y') {
      components.push((
        <Card
          title="“身份验证器” 应用 （默认）"
          extra={removeValidatorExtra}
          className={styles.validator}
          key="remove-validator"
        >
          <p>
            已在 移动设备 上配置了身份验证器
          </p>
        </Card>
      ));
    } else {
      components.push((
        <Card
          title="“身份验证器” 应用"
          extra={setValidatorExtra}
          className={styles.validator}
          key="set-validator"
        >
          <p>
            借助身份验证器应用，您可以免费获取验证码，即使手机未连接到网络也无妨。
            该应用适用于 Android 和 iPhone 设备
          </p>
        </Card>
      ));
    }

    return (
      <div className={styles.container} >
        <div>
          {forceUseAlert}
          {components}
        </div>
      </div>
    );
  }
}

export default TwoFactorAuthentication;
