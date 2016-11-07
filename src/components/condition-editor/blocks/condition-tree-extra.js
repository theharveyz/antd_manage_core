import React from 'react';
import { Popconfirm, Popover, Form, Input, Button } from 'antd';
import ConditionPreview from './condition-preview';
import styles from './condition-tree-extra.styl';
const FormItem = Form.Item;

class ConditionTreeExtra extends React.Component {

  static propTypes = {
    conditions: React.PropTypes.array,
    onClearConditions: React.PropTypes.func,
    onSaveShortcut: React.PropTypes.func,
    onOptimizeConditions: React.PropTypes.func,
    form: React.PropTypes.object
  };

  onSave(e) {
    e.preventDefault();
    const { form, onSaveShortcut } = this.props;
    form.validateFields((errors, values) => {
      if (!errors) {
        onSaveShortcut({ value: values });
      }
    });
  }

  render() {
    const { form, conditions, onClearConditions, onOptimizeConditions } = this.props;
    const { getFieldDecorator } = form;
    const labelCol = { span: 8 };
    const wrapperCol = { span: 16 };
    const saveContent = (
      <div>
        <Form horizontal >
          <FormItem
            label="组名："
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            {getFieldDecorator('group', {
              rules: [
                {
                  required: true,
                  message: '请填写组名'
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem
            label="操作名："
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            {getFieldDecorator('text', {
              rules: [
                {
                  required: true,
                  message: '请填写操作名'
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem
            label="帮助信息："
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            {getFieldDecorator('help')(<Input />)}
          </FormItem>
          <FormItem wrapperCol={{ offset: 8 }} style={{ marginTop: 24 }} >
            <Button type="primary" onClick={::this.onSave} >保存</Button>
          </FormItem>
        </Form>
      </div>
    );
    let conditionPreviewContent = (<ConditionPreview conditions={conditions} />);

    return (
      <div className={styles.container} >
        <a onClick={onOptimizeConditions} >优化</a>
        <span className="ant-divider" ></span>
        <Popover placement="bottom" content={conditionPreviewContent} trigger="hover" >
          <a>预览</a>
        </Popover>
        <span className="ant-divider" ></span>
        <Popover placement="bottom" content={saveContent} trigger="click" >
          <a>保存</a>
        </Popover>
        <span className="ant-divider" ></span>
        <Popconfirm placement="bottom" title={'确定要清空条件树吗?'} onConfirm={onClearConditions} >
          <a>清空</a>
        </Popconfirm>
      </div>
    );
  }
}

export default Form.create()(ConditionTreeExtra);
