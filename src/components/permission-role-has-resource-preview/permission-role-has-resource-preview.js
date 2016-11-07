import React from 'react';
import { Modal, Transfer, message, Spin, Badge } from 'antd';
import _ from 'lodash';
import DI from '../../di';

export default class PermissionRoleHasResourcePreview extends React.Component {
  static propTypes = {
    roleId: React.PropTypes.number,
    roleHasResource: React.PropTypes.array,
    handleClose: React.PropTypes.func
  };

  componentWillMount() {
    this.setState({ visible: false, roleHasResource: [], allResource: [] });
  }

  onOpen() {
    const allResource = [];
    const roleHasResource = [];
    const options = { queryString: 'limit=10000' };
    this.setState({ loading: true });
    DI.get('permissionHttp').getAllResources(options).then((data) => {
      _.map(data.results, (p) => {
        const permission = { key: p.id, name: p.description };
        allResource.push(permission);
      });
      _.map(this.props.roleHasResource, (p) => {
        roleHasResource.push(p.id);
      });
      this.setState({ roleHasResource, allResource, loading: false, visible: true });
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
    const id = this.props.roleId;
    const putData = {
      resources_ids: targetKeys
    };
    this.setState({ loading: true });
    DI.get('permissionHttp').updateResourcesByRoleId(id, putData).then(() => {
      this.setState({ roleHasResource: targetKeys, loading: false });
      message.success('编辑成功');
    })
    .catch(() => {
      this.setState({ loading: false });
      message.error('编辑失败');
    });
  }

  render() {
    let roleHasResourceCount = '增加资源';
    if (this.props.roleHasResource.length > 0) {
      roleHasResourceCount = <Badge count={this.props.roleHasResource.length} />;
    }
    return (
      <span>
        <a onClick={() => ::this.onOpen()} >
          {roleHasResourceCount}
        </a>
        <Modal
          title="编辑角色"
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
              dataSource={this.state.allResource}
              showSearch
              filterOption={this.filterOption}
              targetKeys={this.state.roleHasResource}
              onChange={::this.handleChange}
              render={item => item.name}
              titles={['可选资源', '已有资源']}
              notFoundContent=" "
            />
          </Spin>
        </Modal>
      </span>
    );
  }

}
