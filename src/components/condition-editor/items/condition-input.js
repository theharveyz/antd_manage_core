import React from 'react';
import _ from 'lodash';
import { Input, Form, Button, Icon, Select } from 'antd';
import ConditionPredicateSelect from './condition-predicate-select';
import { getPredicates } from '../conditions-utils';
import { $IN, $NOT_IN, $IS_NOT_NULL, $IS_NULL } from '../condition-constants';

const FormItem = Form.Item;
const Option = Select.Option;

class ConditionInput extends React.Component {

  static propTypes = {
    text: React.PropTypes.string,
    value: React.PropTypes.any,
    form: React.PropTypes.object,
    subConfig: React.PropTypes.object,
    predicate: React.PropTypes.string,
    uuid: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    predicateOnChange: React.PropTypes.func,
    excludePredicates: React.PropTypes.array
  };

  static defaultExcludePredicates = [];

  componentWillMount() {
    const { excludePredicates } = this.props;
    this.predicates = getPredicates(
      _.union(
        ConditionInput.defaultExcludePredicates,
        excludePredicates)
    );
  }

  onTextareaChangeProxy() {
    const { uuid, form, onChange } = this.props;
    const fieldValue = form.getFieldValue(uuid);
    let values = fieldValue;
    if (fieldValue && typeof fieldValue === 'string') {
      let fieldValues = fieldValue.replace(/\r\n/g, ',').replace(/\n/g, ',');
      fieldValues = fieldValues.replace(/\s/g, ',').split(',');
      values = _.remove(fieldValues, function(n) {
        return n;
      });
    }
    onChange({ value: values, uuid });
  }

  onChangeProxy() {
    const { uuid, form, onChange } = this.props;
    onChange({ value: form.getFieldValue(uuid), uuid });
  }

  onDeleteProxy() {
    const { uuid, onDelete } = this.props;
    onDelete({ uuid });
  }

  onSelectChange(value) {
    const { uuid, onChange } = this.props;
    onChange({ value, uuid });
  }

  render() {
    const { text, value, form, predicate, predicateOnChange, uuid, subConfig } = this.props;
    const tagsMode = true;
    const selectStyle = {
      width: '100%',
      minWidth: '140px'
    };
    const firstOptionContent = '以下是您已输入的...';
    const firstOptionDisabled = true;

    let inputDisabled = false;
    if (predicate === $IS_NOT_NULL || predicate === $IS_NULL) {
      inputDisabled = true;
    }

    let inputForm;
    if (predicate === $IN || predicate === $NOT_IN) {
      const showTextarea = subConfig &&
        (subConfig.typeFor$IN === 'textarea' || subConfig.typeFor$NOT_IN === 'textarea');
      if (showTextarea) {
        inputForm = form.getFieldDecorator(uuid, {
          initialValue: value
        })(
          <Input type="textarea" onBlur={::this.onTextareaChangeProxy} rows={1} />
        );
      } else {
        inputForm = form.getFieldDecorator(uuid, {
          initialValue: value
        })(
          <Select
            style={selectStyle}
            tags={tagsMode}
            onChange={::this.onSelectChange}
          >
            <Option
              disabled={firstOptionDisabled}
              value={firstOptionContent}
            >
              {firstOptionContent}
            </Option>
          </Select>
        );
      }
    } else {
      inputForm = form.getFieldDecorator(uuid, {
        initialValue: value
      })(
        <Input onBlur={::this.onChangeProxy} />
      );
    }

    return (
      <Form layout={'inline'} >
        <FormItem label={text} >
          <ConditionPredicateSelect
            uuid={uuid}
            predicate={predicate}
            predicates={this.predicates}
            predicateOnChange={predicateOnChange}
          />
        </FormItem>
        <FormItem>
          {inputForm}
        </FormItem>
        <Button onClick={::this.onDeleteProxy} shape="circle" ><Icon type="delete" /></Button>
      </Form>
    );
  }
}

export default Form.create()(ConditionInput);
