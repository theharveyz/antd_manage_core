import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { PREDICATES, RELATIONS } from '../condition-constants';
import { valueNotNull } from '../conditions-utils';
import styles from './condition-preview.styl';

class ConditionPreview extends React.Component {

  static defaultProps = {
    format: true
  };

  static propTypes = {
    conditions: React.PropTypes.array,
    userConditions: React.PropTypes.array,
    format: React.PropTypes.bool
  };

  formatValue(value, values) {
    const newValues = _.filter(values, (item) => (
      _.isArray(value) ? value.indexOf(item.value) !== -1 : value === item.value
    ));

    if (!newValues.length) {
      return value;
    }

    if (_.isArray(value)) {
      return _.map(newValues, (item) => item.text);
    }
    return newValues[0].text;
  }

  parseCondition(condition) {
    if (!valueNotNull(condition)) {
      return false;
    }
    let value = condition.value;
    const values = condition.values;
    if (_.isArray(values)) {
      value = this.formatValue(value, values);
    }

    if (_.isArray(value)) {
      value = `(${value})`;
    }

    if (value instanceof Date) {
      value = moment(value).format('YYYY-MM-DD HH:mm:ss');
    }

    return (
      <div key={condition.uuid} >
        <span className={styles.text} >
          {condition.text}
        </span>
        <span className={styles.predicate} >
          {PREDICATES[condition.predicate]}
        </span>
        <span className={styles.value} >
          {value}
        </span>
      </div>
    );
  }

  parseConditions(conditions) {
    let items = [];
    let i = 0;
    if (!conditions) {
      return null;
    }
    const l = conditions.length - 1;

    for (; i < l; i++) {
      const condition = conditions[i];
      if (_.isArray(condition)) {
        const childItems = this.parseConditions(condition);
        if (childItems.length) {
          items.push((
            <div key={i} className={styles.bracket} >
              <div className={styles.left} >
                (
              </div>
              <div>
                {childItems}
              </div>
              <div className={styles.right} >
                )
              </div>
            </div>
          ));
        }
      } else {
        const parsedCondition = this.parseCondition(condition);
        if (parsedCondition) {
          items.push(parsedCondition);
        }
      }
    }

    if (l >= 2) {
      const originItems = items;
      items = [];
      _.each(originItems, (item, index) => {
        items.push(item);
        if (index < (l - 1)) {
          const key = `condition-preview-relation-${index}`;
          items.push((
            <div className={styles.relation} key={key} >
              {RELATIONS[conditions[l].value]}
            </div>
          ));
        }
      });
    }
    return items;
  }

  showConditionsBlock(conditions, type) {

    const { format } = this.props;
    let formatClassName;
    if (format) {
        formatClassName = styles.format;
    }
    let items = this.parseConditions(conditions);
    if (!items) {
      return null;
    }
    const len = items.length;
    let title = '基础维度';
    if (len === 0) {
      items = <div>无</div>;
    }
    if (type === 'user'){
      title = '用户维度';
    }
    return (
      <div className={styles.container} >
        <h4>{title}</h4>
        <div className={formatClassName} >
          {items}
        </div>
      </div>
    );
  }

  render() {
    const { conditions, userConditions } = this.props;
    let userConditionsBlock = null;
    if (userConditions) {
      userConditionsBlock = this.showConditionsBlock(userConditions, 'user');
    }
    return (
      <div>
        {this.showConditionsBlock(conditions, 'basic')}
        { userConditionsBlock }
      </div>
    );
  }
}

export default ConditionPreview;
