import React from 'react';
import Auth from '../../services/auth';
import AuthHttp from '../../services/auth-http';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import {
  Form,
  Input,
  Button,
  message
} from 'antd';
import _ from 'lodash';
import styles from './login.styl';
const FormItem = Form.Item;

class Login extends React.Component {

  static defaultProps = {
    modal: false,
    onLoginSuccess: _.noop
  };

  static propTypes = {
    form: React.PropTypes.object,
    location: React.PropTypes.object,
    dispatch: React.PropTypes.func,
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
    const { form, location, dispatch, modal, onLoginSuccess } = this.props;
    const authService = new Auth();
    const authHttpService = new AuthHttp();
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
                dispatch(replace(nextPathname));
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
    const getFieldProps = form.getFieldProps;
    const { loading, inputCodeMode } = this.state;
    const mobileProps = getFieldProps('mobile', {
      rules: [
        {
          required: true,
          message: '手机号必须填写'
        }
      ]
    });
    const passwordProps = getFieldProps('password', {
      rules: [
        {
          required: true,
          message: '密码必须填写'
        }
      ]
    });
    const inputNumberStyle = { width: '105px' };
    let codeComponent;

    if (inputCodeMode) {
      const codeProps = getFieldProps('code', {
        rules: [
          {
            required: true,
            message: '验证码必须填写'
          }
        ]
      });
      codeComponent = (
        <FormItem
          wrapperCol={{ span: 24 }}
          className={styles.code}
        >
          <Input
            autoComplete="off"
            style={inputNumberStyle}
            placeholder="验证码"
            maxLength="6"
            {...codeProps}
          />
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
          <img role="presentation" width="150" src="https://www.bmqb.com/images/logo.cc03.png" />
        </div>
        <Form horizontal onSubmit={::this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="手机号："
          >
            <Input
              type="text"
              placeholder="请输入手机号"
              disabled={inputCodeMode}
              {...mobileProps}
            />
          </FormItem>
          <FormItem
            label="密码："
            {...formItemLayout}
          >
            <Input
              disabled={inputCodeMode}
              type="password"
              placeholder="请输入密码"
              {...passwordProps}
            />
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

export default connect()(Form.create()(Login));
