import React from 'react';
import DI from '../../di';
import { hashHistory } from 'react-router';
import {
  Form,
  Input,
  Button,
  message
} from 'antd';
import _ from 'lodash';
import styles from './login.styl';
const FormItem = Form.Item;

@Form.create()
export default class Login extends React.Component {

  static defaultProps = {
    modal: false,
    onLoginSuccess: _.noop
  };

  static propTypes = {
    form: React.PropTypes.object,
    location: React.PropTypes.object,
    modal: React.PropTypes.bool,
    onLoginSuccess: React.PropTypes.func
  };

  state = {
    loading: false,
    inputCodeMode: false
  };

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    const { form, location, modal, onLoginSuccess } = this.props;
    const authService = DI.get('auth');
    const authHttpService = DI.get('authHttp');
    form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        authHttpService
          .doLogin(values.mobile, values.password, values.code)
          .then((response) => {
            // 二次验证
            if (!response) {
              message.success('请输入验证码');
              return this.setState({
                inputCodeMode: true,
                loading: false
              });
            }
            return Promise.all([
              authService.setToken(response.token),
              authService.setAccount(response.account),
              authService.setPermission(response.resourceMap)
            ]).then(() => {
              form.resetFields(['password']);
              this.setState({ loading: false });
              if (modal) {
                onLoginSuccess();
              } else {
                let nextPathname = '/';
                if (location.state && location.state.nextPathname) {
                  nextPathname = location.state.nextPathname;
                }
                hashHistory.push(nextPathname);
              }
            });
          })
          .catch((err) => {
            if (err.code === 677950000908112100) {
              form.resetFields(['password']);
            }
            if (err.code === 677950000687992600) {
              form.resetFields(['code']);
            }
            message.error(err.message);
            this.setState({ loading: false });
          });
      } else {
        this.setState({ loading: false });
      }
    });
  }

  render() {
    const { form, modal } = this.props;
    const getFieldDecorator = form.getFieldDecorator;
    const { loading, inputCodeMode } = this.state;
    const logoUrl = DI.get('config').get('manage.logo');
    const inputNumberStyle = { width: '105px' };
    let codeComponent;

    if (inputCodeMode) {
      codeComponent = (
        <FormItem
          wrapperCol={{ span: 24 }}
          className={styles.code}
        >
          {getFieldDecorator('code', {
            rules: [
              {
                required: true,
                message: '验证码必须填写'
              }
            ]
          })(
            <Input
              autoComplete="off"
              style={inputNumberStyle}
              placeholder="验证码"
              maxLength="6"
            />
          )}
        </FormItem>
      );
    }
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    let modalTips;
    if (modal) {
      modalTips = (
        <p className={styles.modal} >
          登录超时,请重新登录!
        </p>
      );
    }

    return (
      <div className={styles.container} >
        <div className={styles.logo} >
          <img role="presentation" width="150" src={logoUrl} />
        </div>
        <Form layout={'horizontal'} onSubmit={::this.handleSubmit} >
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
                disabled={inputCodeMode}
              />
            )}
          </FormItem>
          <FormItem
            label="密码："
            {...formItemLayout}
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
                disabled={inputCodeMode}
                type="password"
                placeholder="请输入密码"
              />
            )}
          </FormItem>
          {codeComponent}
          <FormItem className={styles.button} style={{ marginTop: 24 }} >
            <Button type="primary" htmlType="submit" loading={loading} >
              {inputCodeMode ? '验证' : '登陆'}
            </Button>
          </FormItem>
        </Form>
        {modalTips}
      </div>
    );
  }
}
