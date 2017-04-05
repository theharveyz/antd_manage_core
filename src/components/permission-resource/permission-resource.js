import React from 'react';
import DI from '../../di';
import { Button, Badge, Popover, Tag } from 'antd';
import _ from 'lodash';
import Permission from '../permission/permission';
import Table from '../table/table';

export default class PermissionResource extends React.Component {
  onSyncResources() {
    DI.get('permissionHttp').syncResources().then(() => {
      this.refs.table.fetchData();
    });
  }

  columns = [
    {
      title: '编号',
      dataIndex: 'id',
      show: true,
      draggable: false
    },
    {
      title: '方法',
      dataIndex: 'method',
      show: true
    },
    {
      title: '路径',
      dataIndex: 'path',
      show: true
    },
    {
      title: '描述',
      dataIndex: 'description',
      show: true
    },
    {
      title: '使用角色',
      show: true,
      render: (value, record) => {
        const content = (
          <div>
            {_.map(record.permission_roles, (role) => (
              <Tag key={role.id} >
                {role.name}
              </Tag>
            ))}
          </div>
        );
        return (
          <Popover placement="bottom" content={content} trigger="hover" >
            <span>
              <Badge count={record.permission_roles.length} />
            </span>
          </Popover>
        );
      }
    }
  ];

  render() {
    const name = 'Resource';
    const tableConfigs = {
      tableColumnManageConfigs: {
        columns: this.columns,
        name,
        title: (
          <Permission
            needPermission={['put@/v1/permission/syncResources']}
          >
            <Button type="primary" onClick={::this.onSyncResources} >同步资源</Button>
          </Permission>
        )
      },
      httpService: DI.get('permissionHttp'),
      tableColumnManage: true,
      fetchDataMethodName: 'getAllResources',
      pageSize: 100
    };

    return (
      <Table
        ref="table"
        {...tableConfigs}
      />
    );
  }
}
