import React from 'react';
import { Tooltip, Icon } from 'antd';
import styles from '../markdown-editor.styl';

export default class ToolBarTemp extends React.Component {
  static propTypes = {
    trigger: React.PropTypes.func,
    icon: React.PropTypes.string,
    iconActive: React.PropTypes.string,
    helper: React.PropTypes.string
  };

  state = { active: false };

  onTrigger() {
    const { trigger, iconActive } = this.props;
    const { active } = this.state;
    const triggerFunc = trigger || function noop() {};
    if (iconActive) {
      this.setState({ active: !active }, triggerFunc());
    }
    triggerFunc();
  }

  render() {
    const { icon, iconActive, helper } = this.props;
    const { active } = this.state;
    const delay = 0.3;
    return (
      <span className={styles.tool}>
        <Tooltip
          placement="bottom"
          title={helper}
          mouseEnterDelay={delay}
        >
          <a onClick={::this.onTrigger}>
            {
              active ? <Icon type={iconActive} /> : <Icon type={icon} />
            }
          </a>
        </Tooltip>
      </span>
    );
  }
}

