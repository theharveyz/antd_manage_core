import React from 'react';
import { injectItemComponent } from '../conditions-utils';
import styles from './condition-tree-item.styl';

class ConditionTreeItem extends React.Component {

  static propTypes = {
    condition: React.PropTypes.object,
    path: React.PropTypes.string,
    conditionSortableRef: React.PropTypes.func
  };

  render() {
    const { condition, conditionSortableRef } = this.props;

    injectItemComponent(condition);

    const classNames = `draggable-condition ${styles.container}`;

    return (
      <div
        data-name={condition.name}
        data-uuid={condition.uuid}
        className={classNames}
        ref={conditionSortableRef}
      >
        {condition.component}
      </div>
    );
  }
}

export default ConditionTreeItem;
