import React from 'react';
import DI from '../../di';
import { Modal, Form, Input, Button, message } from 'antd';
const FormItem = Form.Item;

@Form.create()
export default class PermissionAddEditRoleModal extends React.Component {
  static propTypes = {
    form: React.PropTypes.object,
    originData: React.PropTypes.object,
    visible: React.PropTypes.bool,
    roleId: React.PropTypes.number,
    handleClose: React.PropTypes.func
  }

  componentWillMount() {
    this.setState({ submitting: false, roleData: {} });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible === true && nextProps.roleId) {
      DI.get('permissionHttp').getRoleById(nextProps.roleId).then((data) => {
        this.setState({ roleData: data });
      });
    } else {
      this.setState({ roleData: {} });
    }
  }

  onClose() {
    this.props.handleClose();
    this.props.form.resetFields();
    this.setState({ roleData: {} });
  }

  onSetRole() {
    const { form } = this.props;
    form.validateFields((errors, value) => {
      if (!errors) {
        const postData = value;
        const roleId = this.props.roleId;
        let method = 'setRole';
        if (roleId) {
          method = 'updateRole';
        }
        this.setState({ submitting: true });
        DI.get('permissionHttp')[method](postData, roleId).then(() => {
          this.setState({ submitting: false });
          this.onClose();
          this.props.originData.refs.table.fetchData();
          if (this.props.roleId) {
            message.success('更新成功');
          } else {
            message.success('添加成功');
          }
        })
          .catch(() => {
            this.setState({ submitting: false });
            message.error('添加失败');
          });
      }
    });
  }

  render() {
    const labelCol = { span: 4 };
    const wrapperCol = { span: 16 };
    const layout = {
      labelCol,
      wrapperCol
    };
    const { getFieldDecorator } = this.props.form;

    let processType = '添加';
    if (this.props.roleId) {
      processType = '更新';
    }
    return (
      <div>
        <Modal
          title={processType}
          width="50%"
          visible={this.props.visible}
          onCancel={() => this.onClose()}
          footer=""
        >
          <FormItem
            {...layout}
            label="角色名称"
            required
          >
            {getFieldDecorator('name', {
              initialValue: this.state.roleData.name || '',
              rules: [
                {
                  required: true,
                  message: '请填写角色名'
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem
            {...layout}
            label="角色描述"
          >
            {getFieldDecorator('description', {
              initialValue: this.state.roleData.description || ''
            })(<Input type="textarea" />)}
          </FormItem>
          <FormItem
            wrapperCol={{ span: 16, offset: 4 }}
          >
            <Button
              type="primary"
              onClick={::this.onSetRole}
              loading={this.state.submitting}
            >
              {processType}
            </Button>
          </FormItem>
        </Modal>
      </div>
    );
  }
}
