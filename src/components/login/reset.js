import React from 'react';
import DI from '../../di';
import { hashHistory } from 'react-router';
import {
  Form,
  Input,
  Button,
  message
} from 'antd';
import styles from './login.styl';
const FormItem = Form.Item;

@Form.create()
export default class Reset extends React.Component {

  static propTypes = {
    form: React.PropTypes.object,
    showLogin: React.PropTypes.func
  };

  state = {
    loading: false,
    sending: false,
    smsText: '发送',
    disabled: true,
    mobile: null
  };

  onCountDown() {
    const text = '发送';
    this.interval = setInterval(() => {
      if (this.state.smsText === text) {
        this.setState({ smsText: 60, sending: true, disabled: false });
        return;
      }
      if (this.state.smsText === 0) {
        this.setState({ smsText: text, sending: false });
        clearInterval(this.interval);
        return;
      }
      this.setState({ smsText: this.state.smsText - 1 });
    }, 1000);
  }

  onSend() {
    const { mobile } = this.state;
    if (!mobile || mobile.length < 11) {
      message.error('请输入正确的手机号');
      return;
    }
    this.setState({ sending: true });
    DI.get('authHttp').sendResetSms(mobile)
      .then(() => {
        message.success('验证码发送成功');
        this.onCountDown();
      })
      .catch((err) => {
        message.error(err.message);
        this.setState({ sending: false });
      })
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form, showLogin } = this.props;
    form.validateFields((errors, values) => {
      if (!errors) {
        this.setState({ loading: true });
        DI.get('authHttp').doReset(values)
          .then(() => {
            message.success('重置密码成功');
            this.setState({ loading: false });
            showLogin();
          })
          .catch((err) => {
            message.error(err.message);
            this.setState({ loading: false });
          })
      }
    });
  }

  render() {
    const { form } = this.props;
    const { loading, sending, smsText, disabled } = this.state;
    const getFieldDecorator = form.getFieldDecorator;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };


    return (
      <div className={styles.reset}>
        <Form layout={'horizontal'} onSubmit={::this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="手机号："
          >
            {getFieldDecorator('mobile', {
              rules: [
                {
                  required: true,
                  message: '手机号必须填写'
                }
              ]
            })(
              <Input
                type="text"
                placeholder="请输入手机号"
                onChange={(e) => this.setState({ mobile: e.target.value })}
              />
            )}
          </FormItem>
          <div className={styles.sms}>
            <FormItem
              label="验证码："
              {...formItemLayout}
            >
              {getFieldDecorator('ticket', {
                rules: [
                  {
                    required: true,
                    message: '验证码必须填写'
                  }
                ]
              })(
                <Input
                  className={styles.inputSMS}
                  type="password"
                  placeholder="请输入验证码"
                />
              )}
            </FormItem>
            <Button
              className={styles.button}
              type="primary"
              onClick={::this.onSend}
              loading={sending}
            >
              {smsText}
            </Button>
          </div>
          <FormItem
            {...formItemLayout}
            label="密码："
          >
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '密码必须填写'
                }
              ]
            })(
              <Input
                type="text"
                placeholder="请输入密码"
              />
            )}
          </FormItem>
          <FormItem className={styles.button} style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" loading={loading} disabled={disabled}>
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
