import React from 'react';
import { Modal, Icon, Transfer, Button, message, Input, notification } from 'antd';
import styles from './table-to-excel.styl';
import _ from 'lodash';
import DI from '../../di';

export default class TableToExcel extends React.Component {

  static propTypes = {
    columns: React.PropTypes.array.isRequired,
    httpService: React.PropTypes.object.isRequired,
    dataCount: React.PropTypes.number,
    total: React.PropTypes.number,
    limit: React.PropTypes.number,
    queryString: React.PropTypes.string,
    exportExcelMethodName: React.PropTypes.string,
    handleExportExcelOptions: React.PropTypes.func
  };

  state = {
    visible: false,
    exporting: false,
    taskVisible: false,
    targetKeys: [],
    title: ''
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

  onChange(value) {
    this.setState({
      targetKeys: value
    });
  }

  onTitleChange(e) {
    this.setState({
      title: e.target.value
    });
  }

  onTaskShow() {
    DI.get('myTask').show();
  }

  onTaskCancel() {
    this.setState({
      taskVisible: false
    });
  }

  onOk() {
    const columns = [];
    _.each(this.props.columns, (column) => {
      if (this.state.targetKeys.indexOf(column.dataIndex) !== -1) {
        columns.push({
          title: column.title,
          dataIndex: column.dataIndex
        });
      }
    });
    this.setState({
      exporting: true
    });
    this.props.httpService[this.props.exportExcelMethodName](
      this.props.handleExportExcelOptions({
        title: this.state.title,
        columns
      }),
      this.props.queryString
    ).then(() => {
      notification.success({
        message: '任务提醒',
        description: (
          <div>
            任务 "{this.state.title}" 创建成功，可在 <a onClick={::this.onTaskShow} >我的任务中</a> 查看进度
          </div>
        )
      })
      this.setState({
        exporting: false
      }, () => {
        this.onCancel();
      });
    }).catch((e) => {
      message.error('导出excel任务创建失败');
      this.setState({
        exporting: false
      });
    });
  }

  render() {
    const dataSource = [];

    _.each(this.props.columns, (column) => {
      if (column.dataIndex) {
        dataSource.push({
          title: column.title,
          key: column.dataIndex
        });
      }
    });

    let transferComponent = (
      <div>
        <Transfer
          dataSource={dataSource}
          titles={['可转换字段', '已选字段']}
          targetKeys={this.state.targetKeys}
          render={item => item.title}
          showSearch
          onChange={::this.onChange}
          listStyle={{
            width: 270,
            height: 400
          }}
        />
        <div className={styles.title} >
          <Input
            addonBefore="任务名称:"
            defaultValue={this.state.title}
            onChange={::this.onTitleChange}
          />
        </div>
        <Button
          className={styles.export}
          type="primary"
          onClick={::this.onOk}
          disabled={!this.state.targetKeys.length || !this.state.title}
          loading={this.state.exporting}
        >
          {this.state.exporting ? '提交中' : '添加任务'}
        </Button>
      </div>
    );

    if (this.props.total === 0) {
      transferComponent = (
        <div className={styles.error} >
          暂无数据导出
        </div>
      )
    }

    if (this.props.total > this.props.limit) {
      transferComponent = (
        <div className={styles.error} >
          导出的数据超出最大限制 {this.props.limit} 条
        </div>
      )
    }

    return (
      <div className={styles.container} >
        <a className={styles['export-icon']} onClick={::this.onShow} >
          <Icon type="export" />
        </a>
        <Modal
          title={`共 ${this.props.dataCount} 条数据可导出`}
          visible={this.state.visible}
          onCancel={::this.onCancel}
          onOk={::this.onOk}
          width={620}
          footer=""
        >
          {transferComponent}
        </Modal>
      </div>
    );
  }
}
