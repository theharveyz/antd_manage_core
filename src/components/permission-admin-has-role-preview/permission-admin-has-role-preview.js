import React from 'react';
import { Modal, Transfer, message, Spin } from 'antd';
import _ from 'lodash';
import DI from '../../di';

export default class PermissionAdminHasRolePreview extends React.Component {
  static propTypes = {
    adminId: React.PropTypes.number,
    adminHasRole: React.PropTypes.array,
    handleClose: React.PropTypes.func
  };

  componentWillMount() {
    this.setState({ visible: false, adminHasRole: [], allRole: [] });
  }

  onOpen() {
    const allRole = [];
    const adminHasRole = [];
    const options = { queryString: 'limit=10000' };
    this.setState({ loading: true });
    DI.get('permissionHttp').getAllRoles(options).then((data) => {
      _.map(data.results, (p) => {
        const permission = { key: p.id, name: p.name };
        allRole.push(permission);
      });
      _.map(this.props.adminHasRole, (p) => {
        adminHasRole.push(p.id);
      });
      this.setState({ adminHasRole, allRole, loading: false, visible: true });
    });
  }

  onClose() {
    this.setState({ visible: false });
    this.props.handleClose();
  }

  filterOption(inputValue, option) {
    return option.name.indexOf(inputValue) > -1;
  }

  handleChange(targetKeys) {
    const id = this.props.adminId;
    const putData = {
      role_ids: targetKeys
    };
    this.setState({ loading: true });
    DI.get('permissionHttp').updateRoleByAccountId(id, putData).then(() => {
      this.setState({ adminHasRole: targetKeys, loading: false });
      message.success('编辑成功');
    })
      .catch(() => {
        this.setState({ loading: false });
        message.error('编辑失败');
      });
  }

  render() {
    return (
      <span>
        <a onClick={() => ::this.onOpen()} >
          管理角色
        </a>
        <Modal
          title="管理角色"
          width="50%"
          visible={this.state.visible}
          onCancel={() => this.onClose()}
          footer=""
        >
          <Spin spinning={this.state.loading} >
            <Transfer
              listStyle={{
                width: '46%',
                height: '500px'
              }}
              dataSource={this.state.allRole}
              showSearch
              filterOption={this.filterOption}
              targetKeys={this.state.adminHasRole}
              onChange={::this.handleChange}
              render={item => item.name}
              titles={['可选角色', '已有角色']}
              notFoundContent=" "
            />
          </Spin>
        </Modal>
      </span>
    );
  }

}
