import React from 'react';
import styles from './condition-placeholder.styl';

class ConditionPlaceholder extends React.Component {

  static propTypes = {
    conditionSortableRef: React.PropTypes.func
  };

  render() {
    return (
      <div className={styles.container} >
        <b>
          将条件拖拽到此区域
        </b>
        <div
          ref={this.props.conditionSortableRef}
        >
        </div>
      </div>
    );
  }
}

export default ConditionPlaceholder;
