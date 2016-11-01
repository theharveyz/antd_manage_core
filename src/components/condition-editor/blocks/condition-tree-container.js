import React from 'react';
import ConditionTreeItem from './condition-tree-item';
import ConditionRelationSelect from './../items/condition-relation-select';
import _ from 'lodash';
import styles from './condition-tree-container.styl';

class ConditionTreeContainer extends React.Component {

  static propTypes = {
    conditions: React.PropTypes.array,
    parentPath: React.PropTypes.string,
    conditionSortableRef: React.PropTypes.func
  };

  render() {
    const { conditions, parentPath, conditionSortableRef } = this.props;
    const conditionSelect = conditions[conditions.length - 1];
    const contents = [];
    for (let i = 0, l = conditions.length - 1; i < l; i++) {
      const condition = conditions[i];
      const path = parentPath ? `${parentPath}.${i}` : i.toString();
      if (_.isArray(condition)) {
        contents.push((
          <ConditionTreeContainer
            conditions={condition}
            conditionSortableRef={conditionSortableRef}
            parentPath={path}
            key={path}
          />
        ));
      } else {
        contents.push((
          <ConditionTreeItem
            condition={condition}
            conditionSortableRef={conditionSortableRef}
            key={path}
          />
        ));
      }
    }

    return (
      <div
        ref={conditionSortableRef}
        className="draggable-condition"
        data-sortable-type="condition-tree-container"
        data-path={parentPath}
      >
        <ConditionRelationSelect {...conditionSelect} />
        <div
          data-path={parentPath}
          className={styles.container}
          ref={conditionSortableRef}
        >
          {contents}
        </div>
      </div>
    );
  }
}

export default ConditionTreeContainer;
