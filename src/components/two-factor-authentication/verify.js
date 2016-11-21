import React from 'react';
import styles from './verify.styl';
import { Button, Input, message } from 'antd';
import DI from '../../di';

class Verify extends React.Component {

  static propTypes = {
    onPrev: React.PropTypes.func,
    onVerifySuccess: React.PropTypes.func
  };

  state = {
    verifyLoading: false
  };

  componentDidMount() {
    this.refs.code.refs.input.focus();
  }

  onVerify() {
    const { onVerifySuccess } = this.props;
    this.setState({
      verifyLoading: true
    });
    DI.get('authHttp')
      .verifyKey(this.refs.code.refs.input.value)
      .then(() => {
        DI.get('auth').setKeyVerified('Y');
        message.success('验证成功,身份验证器激活');
        this.setState({
          verifyLoading: false
        }, () => {
          onVerifySuccess();
        });
      })
      .catch(() => {
        message.error('验证失败,请重新输入6位验证码');
        this.refs.code.refs.input.value = '';
        this.setState({
          verifyLoading: false
        });
      });
  }

  render() {
    const { onPrev } = this.props;
    const { verifyLoading } = this.state;
    const inputNumberStyle = { width: '105px' };

    return (
      <div className={styles.container} >
        <h2>验证</h2>

        <p>请输入您在该应用中看到的 6 位数验证码。</p>
        <div className={styles.code} >
          <Input
            autoComplete="off"
            style={inputNumberStyle}
            maxLength="6"
            ref="code"
          />
        </div>
        <div>
          <Button onClick={onPrev} >上一步</Button>
          <Button
            loading={verifyLoading}
            className={styles.next}
            onClick={::this.onVerify}
          >
            验证
          </Button>
        </div>
      </div>
    );
  }

}

export default Verify;
