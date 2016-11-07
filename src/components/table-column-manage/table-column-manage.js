import React from 'react';
import { Button, Modal, Switch, Icon } from 'antd';
import _ from 'lodash';
import OfflineStorge from '../../services/offline-storge';
import Sortable from 'sortablejs';
import styles from './table-column-manage.styl';

class TableColumnManage extends React.Component {

  static propTypes = {
    columns: React.PropTypes.array,
    onColumnsChange: React.PropTypes.func,
    name: React.PropTypes.string
  };

  state = {
    visble: false,
    offlineConfigs: {}
  };

  componentDidMount() {
    const { name, columns } = this.props;
    this.offlineStorge = new OfflineStorge('bmqb_table_column_manage_store');
    this.offlineStorge.get(name).then((offlineConfigs) => {
      let configs = offlineConfigs;
      if (!configs || !_.isArray(configs) ||
        configs.length !== columns.length ||
        this.compareOfflineConfigs(columns, configs).length !== 0) {
        configs = this.processOfflineConfigs(columns);
        this.offlineStorge.add(name, configs);
      }
      this.setState({
        offlineConfigs: configs
      }, () => {
        this.onColumnsChangeProxy();
      });
    });
  }

  onReset() {
    const { columns } = this.props;
    this.setOfflineConfigs(this.processOfflineConfigs(columns));
  }

  onColumnsChangeProxy() {
    const { columns, onColumnsChange } = this.props;
    const { offlineConfigs } = this.state;
    onColumnsChange({
      value: this.filterColumns(this.mergeAndSortColumns(columns, offlineConfigs))
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

  onSwitchChange(dataIndex) {
    return (value) => {
      const { offlineConfigs } = this.state;
      _.find(offlineConfigs, { dataIndex }).show = value;
      this.setOfflineConfigs(offlineConfigs);
    };
  }

  setOfflineConfigs(offlineConfigs) {
    const { name } = this.props;

    this
      .offlineStorge
      .add(name, offlineConfigs)
      .then(() => {
        this.setState({
          offlineConfigs
        }, () => {
          this.onColumnsChangeProxy();
        });
      });
  }

  fieldSortableRef(componentBackingInstance) {
    if (componentBackingInstance) {
      const options = {
        draggable: '.draggable-field',
        sort: true,
        onSort: (evt) => {
          const { oldIndex, newIndex } = evt;
          const { offlineConfigs } = this.state;
          offlineConfigs.splice(newIndex, 0, offlineConfigs.splice(oldIndex, 1)[0]);
          this.setOfflineConfigs(offlineConfigs);
        }
      };
      Sortable.create(componentBackingInstance, options);
    }
  }

  filterColumns(columns) {
    return _.filter(columns, (column) => column.show);
  }

  mergeAndSortColumns(columns, offlineConfigs) {
    return _.cloneDeep(columns)
      .map((column) => (
        _.merge(
          {
            index: _.findIndex(offlineConfigs, { title: column.title })
          },
          column,
          _.find(offlineConfigs, { title: column.title })
        )
      )).sort((a, b) => a.index - b.index);
  }

  processOfflineConfigs(columns) {
    const configs = [];

    _.each(columns, (column) => {
      configs.push({
        dataIndex: column.dataIndex,
        title: column.title,
        show: column.show
      });
    });

    return configs;
  }

  compareOfflineConfigs(columns, configs) {
    return _.differenceWith(
      this.processConfigsForCompare(configs),
      this.processConfigsForCompare(columns),
      _.isEqual
    );
  }

  processConfigsForCompare(columns) {
    const configs = [];

    _.each(columns, (column) => {
      configs.push({
        dataIndex: column.dataIndex,
        title: column.title
      });
    });

    return configs;
  }

  render() {
    const { columns } = this.props;
    const { offlineConfigs } = this.state;
    const columnList = _.map(this.mergeAndSortColumns(columns, offlineConfigs), (column, index) => {
      let className = 'draggable-field';
      let disableSwitch = false;
      if (column.draggable === false) {
        className = 'undraggable';
        disableSwitch = true;
      }
      return (
        <li className={className} key={column.title} >
          <i>
            {index + 1}
          </i>
          <span>{column.title}</span>
          <Switch
            checked={column.show}
            onChange={::this.onSwitchChange(column.dataIndex)}
            disabled={disableSwitch}
          />
        </li>
      );
    });
    const footer = (
      <Button type="primary" onClick={::this.onReset} >重置</Button>
    );
    return (
      <div className={styles.container} >
        <a className={styles.setting} onClick={::this.onShow} >
          <Icon type="setting" />
        </a>
        <Modal
          title="设置显示列及顺序"
          visible={this.state.visible}
          onCancel={::this.onCancel}
          className={styles.modal}
          footer={footer}
        >
          <ul ref={::this.fieldSortableRef} >
            {columnList}
          </ul>
        </Modal>
      </div>
    );
  }

}

export default TableColumnManage;
