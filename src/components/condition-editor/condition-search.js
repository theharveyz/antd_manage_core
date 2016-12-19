import React from 'react';
import { Row, Button, Card, Modal, Col } from 'antd';
import {
  checkInputConditions,
  arrayToStateConditions,
  conditionsToResult,
  conditionsToQueryString,
  parseInputConditions,
  injectItemComponent,
  conditionsValueToNull,
  checkConditionsHasValue,
  valueNotNull
} from './conditions-utils';
import _ from 'lodash';
import ConditionPreview from './blocks/condition-preview';
import ConditionEditor from './condition-editor';
import ConditionHistory from '../condition-editor/condition-history';

import styles from './condition-search.styl';

class ConditionSearch extends React.Component {

  static defaultProps = {
    fieldConfigs: {},
    actionConfigs: {},
    shortcutConfigs: {},
    onSearch: _.noop,
    conditions: [],
    realTime: true,
    advanced: false
  };

  static propTypes = {
    fieldConfigs: React.PropTypes.object,
    actionConfigs: React.PropTypes.object,
    shortcutConfigs: React.PropTypes.any,
    onSearch: React.PropTypes.func,
    conditions: React.PropTypes.any,
    name: React.PropTypes.string,
    realTime: React.PropTypes.bool,
    advanced: React.PropTypes.bool
  };

  state = {
    conditions: [],
    advancedConditions: [],
    visible: false
  };

  componentWillMount() {
    this.prevConditionsString = '';
    this.setInputConditions(this.props.conditions);
  }

  componentDidMount() {
    this.onSearchProxy();
  }

  onShow() {
    this.setState({
      visible: true
    });
  }

  onCancel() {
    const { advancedConditions } = this.state;
    this.refs.conditionEditor.setInputConditions(_.cloneDeep(advancedConditions));
    this.setState({
      visible: false
    });
  }

  onOk() {
    const { realTime } = this.props;
    const advancedConditions = _.cloneDeep(conditionsToResult(
      this.refs.conditionEditor.state.conditions
    ));
    this.setState({
      visible: false,
      advancedConditions
    }, () => {
      if (realTime || !advancedConditions.length) {
        this.onSearchProxy();
      }
    });
  }

  onSearchProxy() {
    const { onSearch } = this.props;
    const { conditions, advancedConditions } = this.state;

    const emitConditions = advancedConditions.length
      ? advancedConditions : conditionsToResult(conditions);
    const type = advancedConditions.length ? 'ConditionEditor' : 'ConditionSearch';

    if (emitConditions.length) {
      this.refs.conditionHistory.addConditions(emitConditions, type);
    }

    if (_.isFunction(onSearch)) {
      onSearch({
        value: {
          conditionResult: emitConditions,
          conditionQuery: conditionsToQueryString(emitConditions)
        }
      });
    }
  }

  onUse(e) {
    const { conditions, type } = e.value;
    const { realTime } = this.props;
    const stateConditions = this.state.conditions;
    // stateConditions只会有一层
    if (type === 'ConditionSearch') {
      _.each(conditions, (condition) => {
        if (valueNotNull(condition)) {
          const cloneCondition = _.clone(condition);
          const value = cloneCondition.value;
          const predicate = cloneCondition.predicate;
          delete cloneCondition.value;
          delete cloneCondition.predicate;
          const stateCondition = _.find(stateConditions, cloneCondition);
          if (stateCondition) {
            stateCondition.value = value;
            stateCondition.predicate = predicate;
          }
        }
      });
      this.setConditions(stateConditions);
    } else {
      if (this.refs.conditionEditor) {
        this.refs.conditionEditor.setInputConditions(conditions);
      }
      this.setState({
        advancedConditions: conditions
      }, () => {
        if (realTime) {
          this.onSearchProxy();
        }
      });
    }
  }

  onClear() {
    const { conditions } = this.state;
    conditionsValueToNull(conditions);
    if (this.refs.conditionEditor) {
      this.refs.conditionEditor.setConditions([]);
    }
    this.prevConditionsString = '';
    this.setState({
      conditions,
      advancedConditions: []
    }, () => {
      this.onSearchProxy();
    });
  }

  setConditions(conditions) {
    const { realTime } = this.props;
    let emitCondition = true;

    const conditionsString = this.transformPredicateAndValueString(conditions);
    if (conditions.length === 1 || this.prevConditionsString === conditionsString) {
      emitCondition = false;
    }

    this.prevConditionsString = conditionsString;

    this.setState({
      conditions,
      advancedConditions: []
    }, () => {
      if (realTime && emitCondition) {
        this.onSearchProxy();
      }
    });
  }

  setInputConditions(inputConditions) {
    if (inputConditions) {
      this.setState({
        conditions: arrayToStateConditions(this.parseInputConditions(inputConditions), this)
      });
    }
  }

  // conditions => $lt=3&$gt=4
  transformPredicateAndValueString(conditions) {
    const stringItems = [];
    const lastIndex = conditions.length - 1;
    _.each(conditions, (condition, index) => {
      if (valueNotNull(condition) && index < lastIndex) {
        stringItems.push(`${condition.predicate}=${condition.value}`);
      }
    });
    return stringItems.join('&');
  }

  parseInputConditions(inputConditions) {
    let conditions;
    try {
      conditions = parseInputConditions(inputConditions);
      checkInputConditions(conditions, this);
    } catch (e) {
      conditions = [];
    }
    return conditions;
  }

  render() {
    const { conditions, visible, advancedConditions } = this.state;
    const { fieldConfigs, shortcutConfigs, actionConfigs, name, realTime, advanced } = this.props;
    const conditionEditorWidth = '80%';
    let components;
    if (advancedConditions.length) {
      const parsedAdvancedConditions = arrayToStateConditions(
        advancedConditions, this
      );
      components = (<ConditionPreview conditions={parsedAdvancedConditions} />);
    } else {
      components = _.map(
        _.take(conditions, conditions.length - 1),
        (condition) => (
          <div key={`${condition.value}_${condition.uuid}`} >
            <Col
              xs={24}
              sm={12}
              md={12}
              lg={12}
              className={styles.item}
            >
              {injectItemComponent(condition).component}
            </Col>
          </div>
        )
      );
    }

    let extra = [];
    extra.push((
      <ConditionHistory
        onUse={::this.onUse}
        fieldConfigs={fieldConfigs}
        shortcutConfigs={shortcutConfigs}
        actionConfigs={actionConfigs}
        name={name}
        advanced={advanced}
        ref="conditionHistory"
        key="conditionHistory"
      />
    ));
    if (!advancedConditions.length && advanced) {
      extra.push((
        <span className="ant-divider" key="divider" ></span>
      ));
      extra.push((
        <a
          onClick={::this.onShow}
          key="conditionEditor"
        >
          高级搜索
        </a>
      ));
    }

    let editButton;
    if (advancedConditions.length) {
      editButton = (<Button onClick={::this.onShow} >编辑条件</Button>);
    }

    let searchButton;
    if (!realTime) {
      searchButton = (<Button type="primary" onClick={::this.onSearchProxy} >搜索</Button>);
    }

    let clearButton;
    if (checkConditionsHasValue(conditions) || advancedConditions.length) {
      clearButton = (<Button onClick={::this.onClear} >清空条件</Button>);
    }
    return (
      <div className={styles.container} >
        <Card title="搜索" extra={extra} >
          <Row className={styles.forms} gutter={16} >
            {components}
          </Row>
          <Row>
            <div className={styles.action} >
              {editButton}
              {searchButton}
              {clearButton}
            </div>
          </Row>
        </Card>

        <Modal
          title="高级搜索"
          visible={visible}
          onCancel={::this.onCancel}
          onOk={::this.onOk}
          width={conditionEditorWidth}
        >
          <ConditionEditor
            fieldConfigs={fieldConfigs}
            shortcutConfigs={shortcutConfigs}
            actionConfigs={actionConfigs}
            conditions={advancedConditions}
            name={name}
            ref="conditionEditor"
          />
        </Modal>

      </div>
    );
  }

}

export default ConditionSearch;
