import React from 'react';
import _ from 'lodash';
import { Collapse, Tooltip, Icon, Popconfirm } from 'antd';
import { groupBy } from '../conditions-utils';
import Sortable from 'sortablejs';
import { OPERATION_SHORTCUT } from '../condition-constants';
import styles from './condition-operation.styl';
const Panel = Collapse.Panel;

class ConditionOperation extends React.Component {

  static propTypes = {
    fieldSortableRef: React.PropTypes.func,
    configs: React.PropTypes.object,
    type: React.PropTypes.string,
    onRemoveShortcut: React.PropTypes.func
  };

  onHelpMouseDown(e) {
    e.preventDefault();
  }

  onRemoveShortcut(key) {
    return () => {
      this.props.onRemoveShortcut({ key });
    };
  }

  fieldSortableRef(componentBackingInstance) {
    if (componentBackingInstance) {
      const options = {
        draggable: '.draggable-condition-operation',
        group: {
          name: 'condition',
          pull: 'clone',
          put: false
        },
        sort: false
      };
      Sortable.create(componentBackingInstance, options);
    }
  }

  render() {
    const { configs, type } = this.props;
    const configGroups = groupBy(configs);

    const defaultActiveKey = _.keys(configGroups)[0];
    return (
      <Collapse accordion defaultActiveKey={defaultActiveKey} >
        {_.map(configGroups, (config, name) => (
          <Panel header={name} key={name} >
            <div className={styles.container} >
              {_.map(config, (condition, key) => {
                let help;
                let divClassName = '';
                if (condition.help) {
                  divClassName += styles.help;
                  help = (
                    <Tooltip
                      placement="top"
                      title={condition.help}
                    >
                      <Icon type="question-circle-o" onMouseDown={this.onHelpMouseDown} />
                    </Tooltip>
                  );
                }
                let remove;
                if (condition.custom && type === OPERATION_SHORTCUT) {
                  divClassName += ` ${styles.remove}`;
                  remove = (
                    <Popconfirm
                      placement="bottom"
                      title={'确定要删除该自定义快捷操作吗?'}
                      onConfirm={::this.onRemoveShortcut(condition.key)}
                    >
                      <Icon type="minus-circle" />
                    </Popconfirm>
                  );
                }
                const div = (
                  <div
                    key={key}
                    ref={::this.fieldSortableRef}
                    className={divClassName}
                  >
                    <span
                      data-type-key={key}
                      data-type={type}
                      className="draggable-condition-operation"
                    >
                      {condition.text}
                    </span>
                    {help}
                    {remove}
                  </div>
                );
                return div;
              })}
            </div>
          </Panel>
        ))}
      </Collapse>
    );
  }
}

export default ConditionOperation;
