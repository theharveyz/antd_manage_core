import React from 'react';
import { Alert } from 'antd';
import _ from 'lodash';
import styles from './alert-error.styl';

/**
 * 支持点击的错误提示组件
 */
const AlertError = ({ message, onClick, visible }) => {
  let content = (<span className={styles.none} ></span>);
  if (visible) {
    content = (<Alert message={message} type="error" />);
  }

  return (
    <div className={styles.container} onClick={onClick} >
      {content}
    </div>
  );
};

AlertError.propTypes = {
  /**
   * 错误信息
   */
  message: React.PropTypes.string.isRequired,
  /**
   * 点击Error后触发事件
   */
  onClick: React.PropTypes.func,
  /**
   * 用于判断是否显示错误信息
   */
  visible: React.PropTypes.bool
};

AlertError.defaultProps = {
  onClick: _.noop,
  visible: false
};
export default AlertError;
