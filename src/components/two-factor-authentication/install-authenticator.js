import React from 'react';
import DI from '../../di';
import { Popover, Button } from 'antd';
import QRCode from 'qrcode.react';
import styles from './install-authenticator.styl';
import AuthHttp from '../../services/auth-http';

const markets = {
  ios: {
    downloadUrl: 'https://itunes.apple.com/cn/app/google-authenticator/id388497605?mt=8',
    shopName: 'App Store',
    appName: 'Google Authenticator'
  },
  android: {
    downloadUrl: 'http://www.wandoujia.com/apps/com.google.android.apps.authenticator2',
    shopName: '安卓市场',
    appName: 'Google Authenticator'
  }
};

class InstallAuthenticator extends React.Component {

  static propTypes = {
    mobileSystem: React.PropTypes.string,
    onPrev: React.PropTypes.func,
    onNext: React.PropTypes.func
  };

  state = {
    mode: 'qr',
    secret: {
      key: '',
      url: ''
    }
  };

  componentWillMount() {
    if (!this.state.secret.url) {
      DI.get('authHttp').generateKey().then((secret) => {
        this.setState({ secret });
      });
    }
  }

  onChangeMode() {
    this.setState({
      mode: this.state.mode === 'qr' ? 'key' : 'qr'
    });
  }

  render() {
    const { mobileSystem, onNext, onPrev } = this.props;
    const { mode, secret } = this.state;
    const market = markets[mobileSystem];

    const QRModeStyle = {};
    const keyModeStyle = {};

    let modeValue = secret.key;
    if (mode === 'qr') {
      if (secret.url) {
        modeValue = (<QRCode value={secret.url} />);
      } else {
        modeValue = (<div>正在加载二维码...</div>);
      }
      keyModeStyle.display = 'none';
    } else {
      QRModeStyle.display = 'none';
    }
    return (
      <div className={styles.container}>
        <h2>安装验证器</h2>
        <ul>
          <li>
            从
            <Popover
              overlayClassName={styles['download-qr']}
              placement="bottom"
              title="扫二维码下载"
              content={<QRCode value={market.downloadUrl}/>}
              trigger="hover"
            >
              <a href={market.downloadUrl} target="_blank"> {market.shopName} </a>
            </Popover>
            安装“ {market.appName} ”应用。
          </li>
          <li style={QRModeStyle}>
            在应用中扫描下方二维码。
          </li>
          <li style={keyModeStyle}>
            在应用中输入下方提供的密钥。
          </li>
        </ul>
        <div className={styles.qr} style={QRModeStyle}>
          {modeValue}
          <a onClick={::this.onChangeMode}>无法扫描二维码?</a>
        </div>
        <div className={styles.key} style={keyModeStyle}>
          <div>
            {modeValue}
          </div>
          <a onClick={::this.onChangeMode}>输入不方便?</a>
        </div>
        <div>
          <Button onClick={onPrev}>上一步</Button>
          <Button className={styles.next} onClick={onNext}>下一步</Button>
        </div>
      </div>
    );
  }
}

export default InstallAuthenticator;
