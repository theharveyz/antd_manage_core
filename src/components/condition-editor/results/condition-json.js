import React from 'react';
import { conditionsToResult } from '../conditions-utils';
import copy from 'copy-to-clipboard';
import { Icon, message } from 'antd';
import styles from './condition-json.styl';

class ConditionJson extends React.Component {

  static propTypes = {
    conditions: React.PropTypes.array
  };

  onCopy() {
    copy(this.conditionsToJson());
    message.success('JSON复制成功');
  }

  conditionsToJson() {
    const { conditions } = this.props;

    return JSON.stringify(conditionsToResult(conditions), undefined, 4);
  }

  render() {
    return (
      <div className={styles.container} >
        <pre>{this.conditionsToJson()}</pre>
        <div className={styles.copy} onClick={::this.onCopy} >
          <Icon type="copy" />
        </div>
      </div>
    );
  }
}

export default ConditionJson;
