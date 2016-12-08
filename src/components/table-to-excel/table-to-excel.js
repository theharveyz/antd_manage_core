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
    queryString: React.PropTypes.string
  };

  state = {
    visible: false,
    exporting: false,
    taskVisible: false,
    targetKeys: [],
    title: '将表格数据转换为excel文件'
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

  onBlur(e) {
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
    this.props.httpService.addTableToExcelTask(
      {
        title: this.state.title,
        columns
      },
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

    return (
      <div className={styles.container} >
        <a className={styles['export-icon']} onClick={::this.onShow} >
          <Icon type="export" />
        </a>
        <Modal
          title={`导出 ${this.props.dataCount} 条数据转换为excel文件`}
          visible={this.state.visible}
          onCancel={::this.onCancel}
          onOk={::this.onOk}
          width={620}
          footer=""
        >
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
              addonBefore="任务标题:"
              defaultValue={this.state.title}
              onBlur={::this.onBlur}
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
        </Modal>
      </div>
    );
  }
}
