import React from 'react';
import { Select, Form } from 'antd';
import { $AND, $OR } from '../condition-constants';
import styles from './condition-relation-select.styl';

const Option = Select.Option;

class ConditionRelationSelect extends React.Component {

  static propTypes = {
    value: React.PropTypes.string,
    uuid: React.PropTypes.string,
    onChange: React.PropTypes.func,
    form: React.PropTypes.object
  };

  onChangeProxy(value) {
    const { uuid, onChange } = this.props;
    onChange({ value, uuid });
  }

  render() {
    const { value, form } = this.props;

    const selectStyle = {
      width: '60px'
    };

    return (
      <div className={styles.container} >
        {form.getFieldDecorator('condition', {
          initialValue: value
        })(
          <Select style={selectStyle} onChange={::this.onChangeProxy} >
            <Option value={$AND} >AND</Option>
            <Option value={$OR} >OR</Option>
          </Select>
        )}
      </div>
    );
  }
}

export default Form.create()(ConditionRelationSelect);
