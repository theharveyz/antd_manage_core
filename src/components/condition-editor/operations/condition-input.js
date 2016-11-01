import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { parseInputConditions } from '../conditions-utils';

const FormItem = Form.Item;

class ConditionInput extends React.Component {

  static propTypes = {
    onInputConditions: React.PropTypes.func,
    onCheckInput: React.PropTypes.func,
    form: React.PropTypes.object
  };

  handleSubmit(evt) {
    evt.preventDefault();
    const { form, onInputConditions } = this.props;
    form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      onInputConditions({ value: parseInputConditions(values.input) });
    });
  }

  checkInput(rule, value, callback) {
    try {
      this.props.onCheckInput({ value: parseInputConditions(value) });
      callback();
    } catch (e) {
      callback(e.message);
    }
  }

  render() {
    const { form } = this.props;

    const inputProps = form.getFieldProps('input', {
      rules: [
        {
          validator: ::this.checkInput
        }
      ]
    });

    return (
      <Form>
        <FormItem>
          <Input type="textarea" {...inputProps} rows="10" />
        </FormItem>
        <Row type="flex" justify="center" >
          <Col>
            <Button type="primary" htmlType="submit" onClick={::this.handleSubmit} >生成条件树</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(ConditionInput);
