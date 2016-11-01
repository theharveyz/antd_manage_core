import React from 'react';
import _ from 'lodash';
import { Select, Form } from 'antd';
const Option = Select.Option;

class ConditionPredicateSelect extends React.Component {

  static propTypes = {
    predicate: React.PropTypes.string,
    predicates: React.PropTypes.object,
    form: React.PropTypes.object,
    predicateOnChange: React.PropTypes.func,
    uuid: React.PropTypes.string
  };

  predicateOnChangeProxy(value) {
    const { predicateOnChange, uuid } = this.props;
    predicateOnChange({ predicate: value, uuid });
  }

  render() {
    const { form, predicate, predicates } = this.props;
    const predicateProps = form.getFieldProps('predicate', {
      initialValue: predicate
    });
    const selectStyle = {
      width: '80px'
    };

    return (
      <Select style={selectStyle} {...predicateProps} onChange={::this.predicateOnChangeProxy} >
        {_.map(predicates, (key, value) => (
          <Option key={key} value={value} >{key}</Option>
        ))}
      </Select>
    );
  }
}

export default Form.create()(ConditionPredicateSelect);
