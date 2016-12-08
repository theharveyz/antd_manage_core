import React from 'react';
import { Modal, Icon, Transfer, Button, message } from 'antd';
import _ from 'lodash';
import GoogleMaterialIcon from '../google-material-icon/google-material-icon';
import Table from '../table/table';
import DI from '../../di';
import { datetimeFormat, humanizeByColorName } from '../../utils/common';

export default class MyTask extends React.Component {

  state = {
    visible: false
  }

  componentDidMount() {
    DI.get('myTask').setTaskComponent(this);
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        if (this.state.visible) {
          this.refs.table.fetchData(false);
        }
      }, 5000);
    }
  }

  onShow() {
    this.setState({
      visible: true
    });
  }

  onCancel() {
    //clearInterval(intervalId);
    this.setState({
      visible: false
    });
  }

  onDownload(id) {
    DI.get('excelHttp')
      .get(id)
      .then((url) => {
        window.open(url);
      })
      .catch(() => {
        message.error('下载失败!');
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
      title: '类型',
      dataIndex: 'type',
      show: true,
      render: (value) => (
        humanizeByColorName('TASK_TYPES', value)
      )
    },
    {
      title: '标题',
      dataIndex: 'title',
      show: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      show: true,
      render: (value) => (
        humanizeByColorName('TASK_STATUS', value)
      )
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      show: true,
      render: datetimeFormat
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
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
      httpService: DI.get('myTaskHttp'),
      tableColumnManage: true,
      conditionSearch: false,
      pageSizeChanger: true
    };

    return (
      <Modal
        title="任务列表"
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
    );
  }
}