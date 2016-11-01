import React from 'react';
import { Icon } from 'antd';
import styles from './select-mobile-system.styl';

const SelectMobileSystem = ({ onSelectMobileSystem }) => (
  <div className={styles.container} >
    <h2>请选择手机系统</h2>
    <div>
      <Icon type="apple" onClick={() => onSelectMobileSystem('ios')} />
      <Icon
        className={styles.android}
        type="android"
        onClick={() => onSelectMobileSystem('android')}
      />
    </div>
  </div>
);

SelectMobileSystem.propTypes = {
  onSelectMobileSystem: React.PropTypes.func
};

export default SelectMobileSystem;
