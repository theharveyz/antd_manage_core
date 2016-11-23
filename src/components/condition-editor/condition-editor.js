import React from 'react';
import Sortable from 'sortablejs';
import ConditionTree from './blocks/condition-tree';
import ConditionPanel from './blocks/condition-panel';
import { generateUUID } from '../../utils/common';
import { Row, Col, message } from 'antd';
import _ from 'lodash';
import OfflineStorage from '../../services/offline-storge';
import {
  optimizeConditions,
  simpleOptimizeConditions,
  generateConditionSelect,
  getConditionByPath,
  generateConditionByKey,
  generateConditionByShortcut,
  getCondition,
  arrayToStateConditions,
  insertCondition,
  checkInputConditions,
  conditionsToResult,
  conditionsToQueryString,
  parseInputConditions,
  checkConditionsValueIsNotNull
} from './conditions-utils';
import DI from '../../di';

import { OPERATION_SHORTCUT, $AND } from './condition-constants';

class ConditionEditor extends React.Component {

  static defaultProps = {
    fieldConfigs: {},
    actionConfigs: {},
    shortcutConfigs: {},
    onConditionsChange: _.noop,
    conditions: []
  };

  static propTypes = {
    fieldConfigs: React.PropTypes.object,
    actionConfigs: React.PropTypes.object,
    shortcutConfigs: React.PropTypes.any,
    onConditionsChange: React.PropTypes.func,
    conditions: React.PropTypes.any,
    name: React.PropTypes.string
  };

  constructor(props) {
    super(props);
    this.shortcutSaveStore = new OfflineStorage(DI.get('config').get('core.conditionEditor.shortcutStorageName'));
  }

  state = {
    conditions: [],
    shortcutConfigs: {}
  };

  componentWillMount() {
    this.setInputConditions(this.props.conditions);
    this.mergeStorageStore();
  }

  // 同级交换位置
  onUpdate(e) {
    const conditions = this.state.conditions;
    const currentUuid = e.item.getAttribute('data-uuid');
    const currentPath = e.item.getAttribute('data-path');
    const { parentCondition } = currentUuid ?
      getCondition(currentUuid, conditions) :
      getConditionByPath(currentPath, conditions);

    const temp = parentCondition[e.newIndex];
    parentCondition[e.newIndex] = parentCondition[e.oldIndex];
    parentCondition[e.oldIndex] = temp;
    this.setConditions(conditions);
  }

  onAdd(e) {
    const conditions = this.state.conditions;

    if (!conditions.length) {
      conditions.push(generateConditionSelect(this));
    }

    const targetPath = e.to.getAttribute('data-path');
    const targetUuid = e.to.getAttribute('data-uuid');
    const currentPath = e.item.getAttribute('data-path');

    const sortableType = e.item.getAttribute('data-sortable-type');
    let currentCondition;

    if (sortableType === 'condition-tree-container') {
      currentCondition = getConditionByPath(currentPath, conditions);
    } else {
      currentCondition = this.getCurrentCondition(e.item);
    }

    if (targetPath === null && targetUuid === targetPath) {
      // 移动到root层
      insertCondition(e.newIndex, currentCondition.condition, conditions);
    } else if (targetPath === null && targetUuid) {
      // 插入到object
      const targetCondition = getCondition(targetUuid, conditions);
      const condition = [targetCondition.condition, generateConditionSelect(this)];
      insertCondition(e.newIndex, currentCondition.condition, condition);
      targetCondition.parentCondition.splice(targetCondition.index, 1, condition);
    } else if (targetPath !== null && !targetUuid) {
      // 插入到array
      const targetCondition = getConditionByPath(targetPath, conditions).condition;
      insertCondition(e.newIndex, currentCondition.condition, targetCondition);
    }

    // 如果只是condition内部移动 , 将原先的condition 删除
    if (!e.clone) {
      currentCondition.parentCondition.splice(currentCondition.index, 1);
    }

    this.setConditions(conditions);
  }

  onInputConditions(e) {
    this.setConditions(arrayToStateConditions(e.value, this));
  }

  onCheckInput(e) {
    checkInputConditions(e.value, this);
  }

  onClearConditions() {
    this.setConditions([]);
  }

  onOptimizeConditions() {
    this.setConditions(optimizeConditions(this.state.conditions));
  }

  onRemoveShortcut(e) {
    const key = e.key;
    const { name } = this.props;
    const { shortcutConfigs } = this.state;
    this.shortcutSaveStore
      .get(name)
      .then((shortcuts) => {
        const offlineShortcutsConfigs = shortcuts;
        delete offlineShortcutsConfigs[key];
        this.shortcutSaveStore.add(name, offlineShortcutsConfigs).then(() => {
          delete shortcutConfigs[key];
          message.success('删除成功');
          this.setShortcutConfigs(shortcutConfigs);
        });
      });
  }

  onSaveShortcut(e) {
    const { shortcutConfigs } = this.state;
    const { name } = this.props;
    const value = e.value;
    const key = generateUUID();
    const shortcutConfig = {
      key,
      text: value.text,
      help: value.help,
      group: value.group,
      shortcut: conditionsToResult(this.state.conditions),
      custom: true
    };
    shortcutConfigs[key] = shortcutConfig;

    this.shortcutSaveStore
      .get(name)
      .then((shortcuts) => {
        let offlineShortcutsConfigs = shortcuts;
        if (!offlineShortcutsConfigs) {
          offlineShortcutsConfigs = {};
        }
        offlineShortcutsConfigs[key] = shortcutConfig;
        this.shortcutSaveStore
          .add(name, offlineShortcutsConfigs)
          .then(() => {
            message.success('保存成功');
            this.setShortcutConfigs(shortcutConfigs);
          });
      });
  }

  setShortcutConfigs(shortcutConfigs) {
    this.setState({ shortcutConfigs });
  }

  setConditions(conditions) {
    const { onConditionsChange } = this.props;

    const optimizedConditions = simpleOptimizeConditions(conditions);
    this.setState({ conditions: optimizedConditions }, () => {
      if (checkConditionsValueIsNotNull(optimizedConditions)) {
        if (_.isFunction(onConditionsChange)) {
          onConditionsChange({
            value: {
              conditions: optimizedConditions,
              conditionResult: conditionsToResult(optimizedConditions),
              conditionQuery: conditionsToQueryString(optimizedConditions)
            }
          });
        }
      }
    });
  }

  getCurrentCondition(item) {
    const uuid = item.getAttribute('data-uuid');
    if (uuid) {
      return getCondition(uuid, this.state.conditions);
    }

    const type = item.getAttribute('data-type');
    const typeKey = item.getAttribute('data-type-key');
    let generateFunction = generateConditionByKey;

    if (type === OPERATION_SHORTCUT) {
      generateFunction = generateConditionByShortcut;
    }
    return {
      condition: generateFunction(typeKey, this, type)
    };
  }

  setInputConditions(inputConditions) {
    if (inputConditions) {
      let conditions;
      if (_.isPlainObject(inputConditions[inputConditions.length - 1])) {
        conditions = inputConditions;
      } else {
        conditions = arrayToStateConditions(this.parseInputConditions(inputConditions), this);
      }

      this.setState({
        conditions
      });
    }
  }

  parseInputConditions(inputConditions) {
    let conditions;
    try {
      conditions = parseInputConditions(inputConditions);
      checkInputConditions(conditions, this);
    } catch (e) {
      conditions = [];
    }
    return conditions;
  }

  mergeStorageStore() {
    this.shortcutSaveStore.get(this.props.name).then((offlineShortcutConfigs) => {
      const { shortcutConfigs } = this.props;
      _.each(shortcutConfigs, (shortcutConfig) => {
        const parsedShortcutConfig = shortcutConfig;
        const shortcut = parsedShortcutConfig.shortcut;
        parsedShortcutConfig.shortcut = this.parseInputConditions(
          _.isPlainObject(shortcut) ? [shortcut, $AND] : shortcut
        );
      });
      _.each(offlineShortcutConfigs, (config) => {
        shortcutConfigs[config.key] = config;
      });
      this.setShortcutConfigs(shortcutConfigs);
    });
  }

  conditionSortableRef(componentBackingInstance) {
    if (componentBackingInstance) {
      const options = {
        draggable: '.draggable-condition',
        group: {
          name: 'condition'
        },
        onAdd: ::this.onAdd,
        onUpdate: ::this.onUpdate
      };
      Sortable.create(componentBackingInstance, options);
    }
  }

  render() {
    const key = +new Date;
    const { conditions } = this.state;
    const { fieldConfigs, actionConfigs } = this.props;
    const { shortcutConfigs } = this.state;
    const rightStyle = { marginLeft: '15px' };
    return (
      <Row>
        <Col span={14} >
          <ConditionTree
            conditionSortableRef={::this.conditionSortableRef}
            conditions={conditions}
            key={key}
            onClearConditions={::this.onClearConditions}
            onSaveShortcut={::this.onSaveShortcut}
            onOptimizeConditions={::this.onOptimizeConditions}
          />
        </Col>
        <Col span={9} style={rightStyle} >
          <ConditionPanel
            conditions={conditions}
            shortcutConfigs={shortcutConfigs}
            fieldConfigs={fieldConfigs}
            actionConfigs={actionConfigs}
            onInputConditions={::this.onInputConditions}
            onCheckInput={::this.onCheckInput}
            onRemoveShortcut={::this.onRemoveShortcut}
          />
        </Col>
      </Row>
    );
  }
}

export default ConditionEditor;
