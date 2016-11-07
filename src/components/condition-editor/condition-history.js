import React from 'react';
import { Modal, Table, Popover } from 'antd';
import styles from './condition-history.styl';
import _ from 'lodash';
import { datetimeFormat } from '../../utils/common';
import ConditionPreview from './blocks/condition-preview';
import { arrayToStateConditions } from './conditions-utils';
import DI from '../../di';

export default class ConditionHistory extends React.Component {

  static defaultProps = {
    fieldConfigs: {},
    actionConfigs: {},
    shortcutConfigs: {},
    onUse: _.noop,
    advanced: true,
    historyOfflineMaxSize: DI.get('config').get(
      'core.conditionEditor.historyOfflineMaxSize'
    )
  };

  static propTypes = {
    name: React.PropTypes.string,
    fieldConfigs: React.PropTypes.object,
    actionConfigs: React.PropTypes.object,
    shortcutConfigs: React.PropTypes.any,
    onUse: React.PropTypes.func,
    advanced: React.PropTypes.bool,
    historyOfflineMaxSize: React.PropTypes.number,
    store: React.PropTypes.object
  };

  state = {
    historyConditions: [],
    visible: false
  };

  componentWillMount() {
    const { name } = this.props;
    this.store.get(name).then((historyConditions) => {
      if (historyConditions) {
        this.setState({
          historyConditions
        });
      }
    });
  }

  onShow() {
    this.setState({
      visible: true
    });
  }

  onCancel() {
    this.setState({
      visible: false
    });
  }

  onUseProxy(e) {
    const index = e.target.getAttribute('data-index');
    const { historyConditions } = this.state;
    const { onUse } = this.props;
    onUse({ value: historyConditions[index] });
    this.onCancel();
  }

  onDelete(e) {
    const index = e.target.getAttribute('data-index');
    const { historyConditions } = this.state;
    const { name } = this.props;
    historyConditions.splice(index, 1);
    this.store.add(name, historyConditions).then(() => {
      this.setState({
        historyConditions
      });
    });
  }

  store = DI.get('offlineStorageFactory')('bmqb_condition_editor_history_store');

  addConditions(conditions, type) {
    const { name, historyOfflineMaxSize } = this.props;

    this.store.get(name).then((offlineConditions) => {
      let historyConditions = offlineConditions;

      if (!historyConditions) {
        historyConditions = [];
      }

      historyConditions.splice(
        historyOfflineMaxSize - 2,
        historyConditions.length - 1
      );
      historyConditions.unshift({
        date: new Date,
        type,
        conditions
      });

      this.store.add(name, historyConditions).then(() => {
        this.setState({
          historyConditions
        });
      });
    });
  }

  render() {
    const { visible } = this.state;
    const { advanced } = this.props;
    let historyConditions = this.state.historyConditions;

    if (!historyConditions) {
      historyConditions = [];
    }

    if (!advanced && historyConditions.length) {
      historyConditions = _.filter(historyConditions, (historyCondition) => {
        if (historyCondition.type === 'ConditionEditor') {
          return false;
        }
        return true;
      });
    }

    const columns = [
      {
        title: '类型',
        dataIndex: 'type',
        render: (text) => {
          if (text === 'ConditionEditor') {
            return (<span className={styles.advanced} >高级搜索</span>);
          }
          return '搜索';
        }
      }, {
        title: '时间',
        dataIndex: 'date',
        key: 'date',
        render: datetimeFormat
      },
      {
        title: '预览',
        key: 'preview',
        render: (text, record) => {
          const conditions = arrayToStateConditions(record.conditions, this);
          const content = (
            <ConditionPreview conditions={conditions} />
          );
          return (
            <Popover placement="bottom" content={content} >
              <a>预览</a>
            </Popover>
          );
        }
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record, index) => (
          <div>
            <a data-index={index} onClick={::this.onUseProxy} >使用</a>
            <span className="ant-divider" ></span>
            <a data-index={index} onClick={::this.onDelete} >删除</a>
          </div>
        )
      }
    ];

    const pagination = {
      total: historyConditions.length
    };

    return (
      <div className={styles.container} >
        <a onClick={::this.onShow} >搜索历史</a>
        <Modal
          className={styles.modal}
          title="搜索历史"
          visible={visible}
          onCancel={::this.onCancel}
          onOk={::this.onCancel}
        >
          <Table
            dataSource={historyConditions}
            columns={columns}
            pagination={pagination}
            rowKey={record => `${record.type}_${+record.date}`}
            bordered
          />
        </Modal>
      </div>
    );
  }
}
