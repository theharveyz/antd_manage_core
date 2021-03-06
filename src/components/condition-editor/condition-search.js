import React from 'react';
import { Row, Button, Card, Modal, Col, Icon } from 'antd';
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
    userConditions: [],
    userFieldConfigs: {},
    realTime: true,
    advanced: false
  };

  static propTypes = {
    fieldConfigs: React.PropTypes.object,
    userFieldConfigs: React.PropTypes.object,
    actionConfigs: React.PropTypes.object,
    shortcutConfigs: React.PropTypes.any,
    onSearch: React.PropTypes.func,
    conditions: React.PropTypes.any,
    userConditions: React.PropTypes.any,
    name: React.PropTypes.string,
    realTime: React.PropTypes.bool,
    advanced: React.PropTypes.bool
  };

  state = {
    conditions: [],
    userConditions: [],
    advancedConditions: [],
    visible: false,
    userSectionToggle: false
  };

  componentWillMount() {
    this.prevConditionsString = '';
    this.prevUserConditionsString = '';
    this.setInputConditions(this.props.conditions, this.props.userConditions);
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
    this.refs.conditionEditor.setInputConditions(_.cloneDeep(advancedConditions), []);
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
    const { conditions, advancedConditions, userConditions } = this.state;
    const emitConditions = advancedConditions.length
      ? advancedConditions : conditionsToResult(conditions);

    let userConditionsStr = '';
    if (userConditions.length > 1) {
        userConditionsStr = conditionsToResult(userConditions);
    }
    const type = advancedConditions.length ? 'ConditionEditor' : 'ConditionSearch';

    if (emitConditions.length || userConditionsStr.length) {
      this.refs.conditionHistory.addConditions(emitConditions, type, userConditionsStr);
    }
    if (_.isFunction(onSearch)) {
      onSearch({
        value: {
          conditionResult: emitConditions,
          userConditionResult:  userConditionsStr,
          conditionQuery: conditionsToQueryString(emitConditions),
          userConditionQuery: conditionsToQueryString(userConditionsStr, true)
        }
      });
    }
  }

  onUse(e) {
    const { conditions, type, userConditions} = e.value;
    const { realTime } = this.props;

    // stateConditions只会有一层
    if (type === 'ConditionSearch') {
      const stateConditions = this.injectHistoryConditions(conditions, this.state.conditions);
      const stateUserConditions = this.injectHistoryConditions(userConditions, this.state.userConditions);
      this.setConditions(stateConditions, stateUserConditions);
    } else {
      if (this.refs.conditionEditor) {
        this.refs.conditionEditor.setInputConditions(conditions, userConditions);
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
    const { conditions, userConditions } = this.state;
    conditionsValueToNull(conditions);
    conditionsValueToNull(userConditions);
    if (this.refs.conditionEditor) {
      this.refs.conditionEditor.setConditions([], []);
    }
    this.prevConditionsString = '';
    this.prevUserConditionsString = '';
    this.setState({
      conditions,
      userConditions,
      advancedConditions: []
    }, () => {
      this.onSearchProxy();
    });
  }

  onToggleIcon() {
    this.setState({
      userSectionToggle: !this.state.userSectionToggle
    });
  }
  setConditions(conditions, userConditions) {
    const { realTime } = this.props;
    let emitCondition = true;

    const conditionsString = this.transformPredicateAndValueString(conditions);
    const userConditionsString = this.transformPredicateAndValueString(userConditions);

    if (
        (conditions.length === 1 || this.prevConditionsString === conditionsString) &&
        (userConditions.length === 1 || this.userConditionsString === userConditionsString)
    )
    {
      emitCondition = false;
    }

    this.prevConditionsString = conditionsString;
    this.prevUeseConditionsString = userConditionsString;

    this.setState({
      conditions,
      userConditions,
      advancedConditions: []
    }, () => {
      if (realTime && emitCondition) {
        this.onSearchProxy();
      }
    });
  }

  setInputConditions(inputConditions, inputUserConditions) {
    if (inputConditions && inputUserConditions) {
      const conditions = arrayToStateConditions(this.parseInputConditions(inputConditions), this, false);
      const userConditions = arrayToStateConditions(this.parseInputConditions(inputUserConditions), this, true);
      this.setState({
        conditions,
        userConditions
      });
    } else if (inputConditions) {
      this.setState({
        conditions: arrayToStateConditions(this.parseInputConditions(inputConditions), this, false)
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
      // console.warn('parseInputConditions error: ', e);
      conditions = [];
    }
    return conditions;
  }

  injectHistoryConditions(conditionHistroy, conditions) {
    _.each(conditionHistroy, (condition) => {
      if (valueNotNull(condition)) {
        const cloneCondition = _.clone(condition);
        const value = cloneCondition.value;
        const predicate = cloneCondition.predicate;
        delete cloneCondition.value;
        delete cloneCondition.predicate;
        const stateCondition = _.find(conditions, cloneCondition);
        if (stateCondition) {
          stateCondition.value = value;
          stateCondition.predicate = predicate;
        }
      }
    });
    return conditions;
  }

  getConditionsComponents = (userConditions) => (
    _.map(
      _.take(userConditions, userConditions.length - 1),
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
    )
  )

  render() {
    const { conditions, visible, advancedConditions, userConditions, userSectionToggle } = this.state;
    const { fieldConfigs, userFieldConfigs, shortcutConfigs, actionConfigs, name, realTime, advanced } = this.props;
    const conditionEditorWidth = '80%';
    let components, userConditionsComponents, searchInputCoponent;
    let toggleIcon, userSectionClassName;
    if (userSectionToggle) {
      toggleIcon = <Icon
          type="up-circle-o"
          className={`${styles.toggleIcon} ${styles.toggleIconActive}`}
          onClick={::this.onToggleIcon}
      />;
      userSectionClassName = '';
    } else {
      toggleIcon = <Icon type="down-circle-o" className={styles.toggleIcon}  onClick={::this.onToggleIcon} />;
      userSectionClassName = styles.userSearchToggle;
    }
    if (advancedConditions.length) {
      const parsedAdvancedConditions = arrayToStateConditions(
        advancedConditions, this
      );
      searchInputCoponent = (<ConditionPreview conditions={parsedAdvancedConditions} />);
    } else {
      components = this.getConditionsComponents(conditions);
      userConditionsComponents = this.getConditionsComponents(userConditions);
      if (conditions.length > 0 && userConditions.length > 0) {
        searchInputCoponent = (
          <div>
            <section className={styles.userSearch}>
              <div className={styles.userSearchTitle}>
                基础维度
              </div>
              <Row className={styles.forms} gutter={16} >
                  {components}
              </Row>
            </section>
            <section className={styles.userSearch}>
              <div className={styles.userSearchTitle}>
                用户维度
              </div>
              <Row className={`${styles.forms} ${userSectionClassName}`} gutter={16} >
                {userConditionsComponents}
              </Row>
              {toggleIcon}
            </section>
          </div>
        );
      } else if (conditions.length > 0) {
        searchInputCoponent = (
          <Row className={styles.forms} gutter={16} >
            {components}
          </Row>
        );
      }
    }

    let extra = [];
    extra.push((
      <ConditionHistory
        onUse={::this.onUse}
        fieldConfigs={fieldConfigs}
        userFieldConfigs={userFieldConfigs}
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
    if (checkConditionsHasValue(conditions) ||
        checkConditionsHasValue(userConditions) ||
        advancedConditions.length) {
      clearButton = (<Button onClick={::this.onClear} >清空条件</Button>);
    }
    return (
      <div className={styles.container} >
        <Card title="搜索" extra={extra} >
          {searchInputCoponent}
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
