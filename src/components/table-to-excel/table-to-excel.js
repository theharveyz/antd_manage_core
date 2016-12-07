import React from 'react';
import { Modal, Icon, Transfer, Button, message } from 'antd';
import styles from './table-to-excel.styl';
import _ from 'lodash';

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
    targetKeys: []
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
        columns
      },
      this.props.queryString
    ).then(() => {
      message.success('导出excel任务创建成功，可在任务中心中查看进度!');
      this.setState({
        exporting: false
      }, () => {
        this.onCancel();
      });
    }).catch(() => {
      message.success('导出excel任务创建失败');
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
          title={`导出 ${this.props.dataCount} 条数据为excel文件`}
          visible={this.state.visible}
          onCancel={::this.onCancel}
          onOk={::this.onOk}
          width="620"
          footer=""
        >
          <Transfer
            dataSource={dataSource}
            titles={['可选字段', '已选字段']}
            targetKeys={this.state.targetKeys}
            render={item => item.title}
            showSearch
            onChange={::this.onChange}
            listStyle={{
              width: 270,
              height: 400
            }}
          />
          <Button
            className={styles.export}
            type="primary"
            onClick={::this.onOk}
            disabled={!this.state.targetKeys.length}
            loading={this.state.exporting}
          >
            {this.state.exporting ? '提交中' : '添加导出任务'}
          </Button>
        </Modal>
      </div>
    );
  }
}
