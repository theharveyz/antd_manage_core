import React from 'react';
import { Tabs, Card } from 'antd';
import ConditionOperation from './../operations/condition-operation';
import ConditionInput from './../operations/condition-input';
import ConditionJson from './../results/condition-json';
import ConditionQueryString from './../results/condition-query-string';
import { OPERATION_FIELD, OPERATION_SHORTCUT, OPERATION_ACTION } from '../condition-constants';
import styles from './condition-panel.styl';
const TabPane = Tabs.TabPane;

const ConditionPanel = ({
  conditions,
  fieldConfigs,
  onInputConditions,
  shortcutConfigs,
  actionConfigs,
  onCheckInput,
  onRemoveShortcut
}) => {
  const results = [];

  if (conditions.length > 1) {
    results.push((
      <TabPane tab="JSON" key="condition-json-result" >
        <ConditionJson conditions={conditions} />
      </TabPane>
    ), (
      <TabPane tab="Query" key="condition-query-string-result" >
        <ConditionQueryString conditions={conditions} />
      </TabPane>
    ));
  }

  return (
    <div className={styles.container} >
      <Card>
        <Tabs type="card" >
          <TabPane tab="字段" key={OPERATION_FIELD} >
            <ConditionOperation
              configs={fieldConfigs}
              type={OPERATION_FIELD}
            />
          </TabPane>
          <TabPane tab="动作" key={OPERATION_ACTION} >
            <ConditionOperation
              configs={actionConfigs}
              type={OPERATION_ACTION}
            />
          </TabPane>
          <TabPane tab="快捷" key={OPERATION_SHORTCUT} >
            <ConditionOperation
              configs={shortcutConfigs}
              type={OPERATION_SHORTCUT}
              onRemoveShortcut={onRemoveShortcut}
            />
          </TabPane>
          <TabPane tab="输入" key="input" >
            <ConditionInput onInputConditions={onInputConditions} onCheckInput={onCheckInput} />
          </TabPane>
          {results}
        </Tabs>
      </Card>
    </div>
  );
};


ConditionPanel.propTypes = {
  conditions: React.PropTypes.array,
  shortcutConfigs: React.PropTypes.object,
  actionConfigs: React.PropTypes.object,
  fieldConfigs: React.PropTypes.object,
  onInputConditions: React.PropTypes.func,
  onCheckInput: React.PropTypes.func,
  onRemoveShortcut: React.PropTypes.func
};

export default ConditionPanel;
