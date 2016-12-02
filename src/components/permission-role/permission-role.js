import React from 'react';
import DI from '../../di';
import _ from 'lodash';
import { Icon, Badge, Popover, Tag, Popconfirm } from 'antd';
import PermissionAddEditRoleModal from
  '../permission-add-edit-role-modal/permission-add-edit-role-modal';

import PermissionRoleHasResourcePreview
  from '../permission-role-has-resource-preview/permission-role-has-resource-preview';

import Permission from '../permission/permission';
import Table from '../table/table';

export default class PermissionRole extends React.Component {
  state = { addEditRoleVisible: false };

  onRoleHasResourcePreviewClose() {
    this.refs.table.fetchData();
  }

  onAddEditRoleModalClose() {
    this.setState({ addEditRoleVisible: false });
  }

  onEditRole(id) {
    this.setState({ addEditRoleVisible: true, addEditRoleId: id });
  }

  onAddRole() {
    this.setState({ addEditRoleVisible: true, addEditRoleId: null });
  }

  columns = [
    {
      title: '编号',
      dataIndex: 'id',
      show: true,
      draggable: false
    },
    {
      title: '名字',
      dataIndex: 'name',
      show: true
    },
    {
      title: '描述',
      dataIndex: 'description',
      show: true
    },
    {
      title: '使用资源',
      show: true,
      render: (record) =>
        <Permission
          needPermission={['put@/v1/permission/role/:id/resources']}
        >
          <PermissionRoleHasResourcePreview
            roleId={record.id}
            roleHasResource={record.permission_resources}
            handleClose={::this.onRoleHasResourcePreviewClose}
          />
        </Permission>
    },
    {
      title: '使用用户',
      show: true,
      render: (value, record) => {
        const content = (
          <div>
            {_.map(record.accounts, (account) => (
              <Tag key={account.account_id} >
                {account.real_name}
              </Tag>
            ))}
          </div>
        );
        return (
          <Popover placement="bottom" content={content} trigger="hover" >
            <span>
              <Badge count={record.accounts.length} />
            </span>
          </Popover>
        );
      }
    },
    {
      title: '操作',
      show: true,
      render: (value) => (
        <div className="table-operation">
          <Permission
            needPermission={['put@/v1/permission/role/:id']}
          >
            <a onClick={() => this.onEditRole(value.id)} >编辑</a>
          </Permission>
          <Permission
            needPermission={['delete@/v1/permission/role/:id']}
          >
            <Popconfirm
              title={`确定要删除ID为:${value.id}的数据吗?`}
              okText="是"
              cancelText="否"
              onConfirm={() => this.refs.table.onDelete({ value: value.id })}
            >
              <a href="#" >删除</a>
            </Popconfirm>
          </Permission>
        </div>
      )
    }
  ];

  render() {
    const name = 'Role';
    const tableConfigs = {
      tableColumnManageConfigs: {
        columns: this.columns,
        name,
        title: (
          <Permission
            needPermission={['post@/v1/permission/role']}
          >
            <a onClick={() => this.onAddRole()} ><Icon type="plus" /></a>
          </Permission>
        )
      },
      httpService: DI.get('permissionHttp'),
      tableColumnManage: true,
      fetchDataMethodName: 'getAllRoles',
      deleteMethodName: 'deleteRole'
    };

    return (
      <div>
        <Table
          ref="table"
          {...tableConfigs}
        />
        <PermissionAddEditRoleModal
          visible={this.state.addEditRoleVisible}
          roleId={this.state.addEditRoleId}
          originData={this}
          handleClose={::this.onAddEditRoleModalClose}
        />
      </div>
    );
  }
}
