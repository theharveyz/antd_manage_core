import React from 'react';
import _ from 'lodash';
import { Radio, Form, Button, Icon } from 'antd';
import ConditionPredicateSelect from './condition-predicate-select';
import {
  $LIKE,
  $GT,
  $GTE,
  $IN,
  $NOT_IN,
  $LT,
  $LTE,
  $IS_NOT_NULL,
  $IS_NULL
} from '../condition-constants';
import { getPredicates } from '../conditions-utils';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class ConditionRadio extends React.Component {

  static propTypes = {
    text: React.PropTypes.string,
    value: React.PropTypes.string,
    values: React.PropTypes.array,
    predicate: React.PropTypes.string,
    form: React.PropTypes.object,
    uuid: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    predicateOnChange: React.PropTypes.func,
    excludePredicates: React.PropTypes.array
  };

  static defaultExcludePredicates = [
    $LIKE,
    $GT,
    $GTE,
    $IN,
    $NOT_IN,
    $LT,
    $LTE,
    $IS_NOT_NULL,
    $IS_NULL
  ];

  componentWillMount() {
    const { excludePredicates } = this.props;
    this.predicates = getPredicates(
      _.union(
        ConditionRadio.defaultExcludePredicates,
        excludePredicates
      )
    );
  }

  onDeleteProxy() {
    const { uuid, onDelete } = this.props;
    onDelete({ uuid });
  }

  onChangeProxy(e) {
    const { uuid, onChange } = this.props;
    onChange({ value: e.target.value, uuid });
  }

  render() {
    const { value, text, values, form, predicate, predicateOnChange, uuid } = this.props;

    const radioProps = form.getFieldProps(uuid, {
      initialValue: value
    });
    return (
      <Form inline >
        <FormItem label={text} >
          <ConditionPredicateSelect
            uuid={uuid}
            predicate={predicate}
            predicates={this.predicates}
            predicateOnChange={predicateOnChange}
          />
        </FormItem>
        <FormItem>
          <RadioGroup {...radioProps} onChange={::this.onChangeProxy} >
            {_.map(values, (item) => (
              <RadioButton
                key={item.value}
                value={item.value}
              >
                {item.text}
              </RadioButton>
            ))}
          </RadioGroup>
        </FormItem>
        <Button onClick={::this.onDeleteProxy} shape="circle" ><Icon type="delete" /></Button>
      </Form>
    );
  }
}

export default Form.create()(ConditionRadio);
