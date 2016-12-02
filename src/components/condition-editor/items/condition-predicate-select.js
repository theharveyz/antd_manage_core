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
    const selectStyle = {
      width: '80px'
    };
    let selectField = form.getFieldDecorator('predicate', {
      initialValue: predicate
    })(
      <Select style={selectStyle} onChange={::this.predicateOnChangeProxy} >
        {_.map(predicates, (key, value) => (
          <Option key={key} value={value} >{key}</Option>
        ))}
      </Select>
    );
    if (Object.keys(predicates).length === 1 && '$eq' in predicates) {
      selectField = null;
    }
    return selectField;
  }
}

export default Form.create()(ConditionPredicateSelect);
