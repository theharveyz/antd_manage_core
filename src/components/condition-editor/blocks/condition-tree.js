import React from 'react';
import { Card } from 'antd';
import ConditionPlaceholder from './condition-placeholder';
import ConditionTreeContainer from './condition-tree-container';
import ConditionTreeExtra from './condition-tree-extra';
import styles from './condition-tree.styl';

class ConditionTree extends React.Component {

  static propTypes = {
    conditions: React.PropTypes.array,
    conditionSortableRef: React.PropTypes.func,
    onClearConditions: React.PropTypes.func,
    onSaveShortcut: React.PropTypes.func,
    onOptimizeConditions: React.PropTypes.func
  };

  renderConditions(conditions) {
    const conditionSortableRef = this.props.conditionSortableRef;

    if (conditions.length <= 1) {
      return (
        <ConditionPlaceholder
          conditionSortableRef={conditionSortableRef}
        />
      );
    }
    return (
      <ConditionTreeContainer
        conditions={conditions}
        conditionSortableRef={conditionSortableRef}
      />
    );
  }

  render() {
    const { conditions, onClearConditions, onSaveShortcut, onOptimizeConditions } = this.props;

    let extra;

    if (conditions.length > 1) {
      extra = (
        <ConditionTreeExtra
          conditions={conditions}
          onClearConditions={onClearConditions}
          onSaveShortcut={onSaveShortcut}
          onOptimizeConditions={onOptimizeConditions}
        />);
    }

    return (
      <div className={styles.container} >
        <Card title="条件树" extra={extra} >
          {this.renderConditions(conditions)}
        </Card>
      </div>
    );
  }
}

export default ConditionTree;
