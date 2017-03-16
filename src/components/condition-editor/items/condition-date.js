import React from 'react';
import _ from 'lodash';
import { Form, Button, Icon, DatePicker } from 'antd';
import ConditionPredicateSelect from './condition-predicate-select';
import { $LIKE, $IN, $NOT_IN, $IS_NOT_NULL, $IS_NULL } from '../condition-constants';
import { getPredicates } from '../conditions-utils';
import moment from 'moment';
const FormItem = Form.Item;

class ConditionDate extends React.Component {

  static propTypes = {
    text: React.PropTypes.string,
    value: React.PropTypes.any,
    form: React.PropTypes.object,
    predicate: React.PropTypes.string,
    uuid: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    predicateOnChange: React.PropTypes.func,
    excludePredicates: React.PropTypes.array,
    showTime: React.PropTypes.bool
  };

  static defaultExcludePredicates = [$LIKE, $IN, $NOT_IN];

  componentWillMount() {
    const { excludePredicates } = this.props;
    this.predicates = getPredicates(
      _.union(
        ConditionDate.defaultExcludePredicates,
        excludePredicates
      )
    );
  }

  onChangeProxy(value) {
    const { uuid, onChange, showTime } = this.props;
    let DateValue = value;
    if (value) {
      if (showTime) {
        DateValue = moment(value).format('YYYY-MM-DD HH:mm:ss');
      } else {
        DateValue = moment(value).format('YYYY-MM-DD');
      }
    }
    onChange({ value: DateValue, uuid });
  }

  onDeleteProxy() {
    const { uuid, onDelete } = this.props;
    onDelete({ uuid });
  }

  render() {
    const { text, value, form, predicate, predicateOnChange, uuid, showTime } = this.props;
    let dateDisabled = false;
    if (predicate === $IS_NOT_NULL || predicate === $IS_NULL) {
      dateDisabled = true;
    }
    let format = 'YYYY-MM-DD';
    if (showTime) {
      format = 'YYYY-MM-DD HH:mm:ss';
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
          {form.getFieldDecorator(uuid, {
            initialValue: value ? moment(value) : value
          })(
            <DatePicker
              showTime={showTime}
              format={format}
              onChange={::this.onChangeProxy}
              disabled={dateDisabled}
            />
          )}
        </FormItem>
        <Button onClick={::this.onDeleteProxy} shape="circle" ><Icon type="delete" /></Button>
      </Form>
    );
  }
}

export default Form.create()(ConditionDate);
