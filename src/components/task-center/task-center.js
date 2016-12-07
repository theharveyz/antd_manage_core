import React from 'react';
import { Modal, Icon, Transfer, Button, message } from 'antd';
import _ from 'lodash';
import GoogleMaterialIcon from '../google-material-icon/google-material-icon';
import Table from '../table/table';
import DI from '../../di';
import { datetimeFormat } from '../../utils/common';

export default class TaskCenter extends React.Component {

  state = {
    visible: false
  };

  onShow() {
    this.setState({
      visible: true
    });
  }

  onCancel() {
    this.setState({
      visible: false,
      targetKeys: []
    });
  }

  onDownload(id) {
    DI.get('upExcelHttp')
      .get(id)
      .then((url) => {
        window.open(url);
      })
      .catch(() => {

      });
  }

  columns = [
    {
      title: '编号',
      dataIndex: 'id',
      sorter: true,
      show: true,
      draggable: false
    },
    {
      title: '类型',
      dataIndex: 'type',
      sorter: true,
      show: true
    },
    {
      title: '标题',
      dataIndex: 'title',
      sorter: true,
      show: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      sorter: true,
      show: true
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      sorter: true,
      show: true
      render: datetimeFormat
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      sorter: true,
      show: true,
      render: datetimeFormat
    },
    {
      title: '操作',
      sorter: false,
      show: true,
      render: (record) => {
        if (record.status === 'completed') {
          return (
            <a onClick={() => this.onDownload(record.mq_id)} >
              下载
            </a>
          )
        }
        return null;
      }
    }
  ];

  render() {
    const name = 'TableCenter';
    const tableConfigs = {
      tableColumnManageConfigs: {
        columns: this.columns,
        name
      },
      httpService: DI.get('upTaskHttp'),
      tableColumnManage: true,
      conditionSearch: false,
      pageSizeChanger: true
    };

    return (
      <a onClick={::this.onShow} >
        <GoogleMaterialIcon type="appstore" /> 任务中心
        <Modal
          title="任务中心"
          visible={this.state.visible}
          onCancel={::this.onCancel}
          width="80%"
          footer=""
        >
          <Table
            ref="table"
            {...tableConfigs}
          />
        </Modal>
      </a>
    );
  }
}
