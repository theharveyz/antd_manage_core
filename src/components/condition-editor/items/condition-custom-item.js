import React from 'react';
import { Form, Button, Icon } from 'antd';
import { getPredicates } from '../conditions-utils';
import ConditionPredicateSelect from './condition-predicate-select';
const FormItem = Form.Item;

class ConditionCustomItem extends React.Component {

  static propTypes = {
    text: React.PropTypes.string,
    value: React.PropTypes.any,
    values: React.PropTypes.array,
    form: React.PropTypes.object,
    predicate: React.PropTypes.string,
    uuid: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    predicateOnChange: React.PropTypes.func,
    excludePredicates: React.PropTypes.array,
    render: React.PropTypes.func
  };

  componentWillMount() {
    const { excludePredicates } = this.props;
    this.predicates = getPredicates(excludePredicates);
  }

  onChangeProxy(e) {
    const { uuid, onChange } = this.props;
    onChange({ value: e.value, uuid });
  }

  onDeleteProxy() {
    const { uuid, onDelete } = this.props;
    onDelete({ uuid });
  }

  render() {
    const { text, predicate, predicateOnChange, uuid } = this.props;
    const customRender = this.state.render;

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
          {customRender(this)}
        </FormItem>
        <Button onClick={::this.onDeleteProxy} shape="circle" ><Icon type="delete" /></Button>
      </Form>
    );
  }
}

export default Form.create()(ConditionCustomItem);
