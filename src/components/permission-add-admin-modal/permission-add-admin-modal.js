import React from 'react';
import DI from '../../di';
import { Icon, Modal, Form, Input, Button, message } from 'antd';
import _ from 'lodash';
const FormItem = Form.Item;

@Form.create()
export default class PermissionAddAdminModal extends React.Component {
  static propTypes = {
    form: React.PropTypes.object,
    originData: React.PropTypes.object
  };

  componentWillMount() {
    this.setState({ visible: false, buttonDisable: true });
  }

  onSetAdmin() {
    const accountID = this.state.account.account_id;
    this.setState({ submitting: true });
    DI.get('permissionHttp').setAdmin(accountID).then(() => {
      this.setState({ submitting: false, visible: false });
      this.props.originData.refs.table.fetchData();
      message.success('添加成功');
    })
    .catch(() => {
      this.setState({ submitting: false });
      message.error('添加失败');
    });
  }

  checkMobileExists(rule, value, callback) {
    clearTimeout(this.timeoutId);
    if (!value) {
      callback();
    } else {
      this.timeoutId = setTimeout(() => {
        DI.get('accountHttp').getFromMobile(value)
        .then((account) => {
          this.setState({ account, buttonDisable: false });
          callback();
        })
        .catch(() => {
          callback([new Error('没有这个用户')]);
          this.setState({ account: {}, buttonDisable: true });
        });
      }, 600);
    }
  }

  render() {
    const labelCol = { span: 4 };
    const wrapperCol = { span: 16 };
    const layout = {
      labelCol,
      wrapperCol
    };
    const { getFieldDecorator } = this.props.form;

    let accountInfo = null;
    if (!_.isEmpty(this.state.account)) {
      const account = this.state.account;
      accountInfo = (
        <FormItem
          {...layout}
          label="用户信息"
        >
          <div>用户ID {account.account_id} / 姓名 {account.real_name}</div>
        </FormItem>
      );
    }
    return (
      <div>
        <a onClick={() => this.setState({ visible: true })} ><Icon type="plus" /></a>
        <Modal
          title="添加管理员"
          width="50%"
          visible={this.state.visible}
          onCancel={() => this.setState({ visible: false })}
          footer=""
        >
          <FormItem
            {...layout}
            label="手机号"
            hasFeedback
            required
          >
            {getFieldDecorator('mobile', {
              rules: [
                {
                  required: true,
                  message: '请填写手机号'
                },
                { validator: ::this.checkMobileExists }
              ]
            })(<Input />)}
          </FormItem>
          {accountInfo}
          <FormItem
            wrapperCol={{ span: 16, offset: 4 }}
          >
            <Button
              type="primary"
              disabled={this.state.buttonDisable}
              onClick={::this.onSetAdmin}
              loading={this.state.submitting}
            >
              添加
            </Button>
          </FormItem>
        </Modal>
      </div>
    );
  }
}
