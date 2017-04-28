import React from 'react';
import styles from '../markdown-editor.styl';

const StatusBar = ({ value }) => {
  let lines = 0;
  let words = 0;
  if (value) {
    const line = value.split('\n');
    lines = line.length;
    words = value.length - lines + 1;
  }
  return (
    <div className={styles.statusbar}>
      <span>lines: {lines}</span>
      <span>words: {words}</span>
    </div>
  );
};

StatusBar.propTypes = {
  value: React.PropTypes.string
};

export default StatusBar;

