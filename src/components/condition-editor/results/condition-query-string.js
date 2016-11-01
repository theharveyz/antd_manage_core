import React from 'react';
import { conditionsToQueryString } from '../conditions-utils';
import copy from 'copy-to-clipboard';
import { Icon, message } from 'antd';
import styles from './condition-query-string.styl';

class ConditionQueryString extends React.Component {

  static propTypes = {
    conditions: React.PropTypes.array
  };

  onCopy() {
    copy(conditionsToQueryString(this.props.conditions));
    message.success('Query string复制成功');
  }

  render() {
    const { conditions } = this.props;
    return (
      <div className={styles.container} >
        <p>{conditionsToQueryString(conditions)}</p>
        <div className={styles.copy} onClick={::this.onCopy} >
          <Icon type="copy" />
        </div>
      </div>
    );
  }
}

export default ConditionQueryString;
