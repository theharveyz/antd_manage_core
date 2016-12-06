import _ from 'lodash';
import React from 'react';
import { generateUUID } from '../../utils/common';
import {
  $AND,
  DEFAULT_PREDICATE,
  PREDICATES,
  DEFAULT_GROUP,
  $OR,
  OPERATION_FIELD,
  OPERATION_ACTION,
  $IS_NOT_NULL,
  $IS_NULL,
  $IN,
  $NOT_IN
} from './condition-constants';
import ConditionRadio from './items/condition-radio';
import ConditionInput from './items/condition-input';
import ConditionNumber from './items/condition-number';
import ConditionSelect from './items/condition-select';
import ConditionDate from './items/condition-date';
import ConditionCustomItem from './items/condition-custom-item';
import qs from 'qs';

export const valueNotNull = (condition) => (
  (_.isArray(condition.value) ? condition.value.length : condition.value) ||
  condition.predicate === $IS_NULL ||
  condition.predicate === $IS_NOT_NULL
);

export const injectItemComponent = (condition) => {
  const c = condition;
  c.key = c.uuid;
  switch (c.type) {
    case 'radio':
      c.component = (<ConditionRadio {...c} />);
      break;
    case 'select':
      c.component = (<ConditionSelect {...c} />);
      break;
    case 'date':
      c.component = (<ConditionDate {...c} />);
      break;
    case 'number':
      c.component = (<ConditionNumber {...c} />);
      break;
    case 'custom':
      c.component = (<ConditionCustomItem {...c} />);
      break;
    default :
      c.component = (<ConditionInput {...c} />);
  }
  return c;
};

export const getPredicates = (excludePredicates) => (
  _.pick(
    PREDICATES,
    _.difference(
      _.keys(PREDICATES),
      excludePredicates
    )
  )
);

export const getConditionSelect = (uuid, conditions) => {
  const conditionSelect = conditions[conditions.length - 1];

  if (conditionSelect.uuid === uuid) {
    return conditionSelect;
  }

  for (let i = 0, l = conditions.length - 1; i < l; i++) {
    const condition = conditions[i];
    if (_.isArray(condition)) {
      const findConditionSelect = getConditionSelect(uuid, condition);
      if (findConditionSelect) {
        return findConditionSelect;
      }
    }
  }
  return null;
};

export const simpleOptimizeConditions = (conditions) => {
  let deleteIndex = -1;
  for (let i = 0, l = conditions.length - 1; i < l; i++) {
    const condition = conditions[i];
    if (_.isArray(condition)) {
      simpleOptimizeConditions(condition);
    }

    if (_.isArray(condition) && condition.length === 1) {
      deleteIndex = i;
    }
  }

  if (deleteIndex !== -1) {
    conditions.splice(deleteIndex, 1);
  }

  if (conditions.length === 1) {
    return [];
  }

  return conditions;
};

export const optimizeConditions = (conditions) => {
  let i = 0;
  const l = conditions.length - 1;
  const currentConditionSelect = conditions[l];
  let newConditions;
  for (; i < l; i++) {
    const condition = conditions[i];
    if (_.isArray(condition)) {
      const childConditionSelectIndex = condition.length - 1;
      const childConditionSelect = condition[childConditionSelectIndex];
      if (childConditionSelect.value === currentConditionSelect.value) {
        const before = conditions.splice(0, i);
        const current = condition.splice(0, childConditionSelectIndex);
        const after = conditions.splice(1);
        newConditions = _.concat(before, current, after);
        break;
      } else {
        conditions.splice(i, 1, optimizeConditions(condition));
      }
    }
  }

  if (newConditions) {
    return optimizeConditions(newConditions);
  }

  return conditions;
};


export const generateConditionSelect = (editor) => (
  ({
    uuid: generateUUID(),
    value: $AND,
    onChange: (event) => {
      const conditions = editor.state.conditions;
      const { uuid, value } = event;
      const conditionSelect = getConditionSelect(uuid, conditions);
      conditionSelect.value = value;
      editor.setConditions(conditions);
    }
  })
);

export const getConditionByPath = (path, conditions) => {
  const indexes = path.split('.');
  let index;
  let arr = conditions;
  const result = {};
  while (indexes.length) {
    if (indexes.length === 1) {
      result.parentCondition = arr;
    }
    index = indexes.shift();
    arr = arr[index];
    result.condition = arr;
    result.index = index;
  }
  return result;
};

export const getCondition = (uuid, conditions) => {
  for (let i = 0, l = conditions.length - 1; i < l; i++) {
    const condition = conditions[i];
    if (_.isArray(condition)) {
      const findCondition = getCondition(uuid, condition);
      if (findCondition) {
        return findCondition;
      }
    } else if (condition.uuid === uuid) {
      return {
        condition,
        parentCondition: conditions,
        index: i
      };
    }
  }
  return null;
};

export const generateConditionByKey = (key, editor, type) => {
  const configs = editor.props[`${type}Configs`];
  const condition = _.cloneDeep(configs[key]);
  if (condition) {
    condition.operation = type;
    condition.operationValue = key;
    condition.predicate = DEFAULT_PREDICATE;
    condition.uuid = generateUUID();
    condition.onChange = (event) => {
      const uuid = event.uuid;
      const conditions = editor.state.conditions;
      const targetCondition = getCondition(uuid, conditions).condition;
      if (targetCondition.value !== event.value) {
        targetCondition.value = event.value;
        editor.setConditions(conditions);
      }
    };
    condition.predicateOnChange = (event) => {
      const { predicate, uuid } = event;
      const conditions = editor.state.conditions;
      const targetCondition = getCondition(uuid, conditions).condition;

      if (predicate === $IS_NOT_NULL || predicate === $IS_NULL) {
        targetCondition.value = undefined;
      }

      if (predicate === $IN || predicate === $NOT_IN) {
        if (!_.isArray(targetCondition.value)) {
          targetCondition.value = undefined;
        }
      }

      targetCondition.predicate = predicate;
      editor.setConditions(conditions);
    };
    condition.onDelete = (event) => {
      const uuid = event.uuid;
      const conditions = editor.state.conditions;
      const targetCondition = getCondition(uuid, conditions);
      targetCondition.parentCondition.splice(targetCondition.index, 1);
      editor.setConditions(conditions);
    };
  }
  return condition;
};

export const objectToCondition = (object, editor) => {
  const condition = generateConditionByKey(object.operationValue, editor, object.operation);
  if (condition) {
    condition.value = object.value;
    condition.predicate = object.predicate;
  }
  return condition;
};

export const arrayToStateConditions = (items, editor) => {
  let i = 0;
  const l = items.length - 1;
  const conditions = [];

  for (; i < l; i++) {
    const item = items[i];
    if (_.isArray(item)) {
      conditions.push(arrayToStateConditions(item, editor));
    } else {
      const condition = objectToCondition(item, editor);
      if (condition) {
        conditions.push(condition);
      }
    }
  }
  if (conditions.length) {
    const conditionSelect = generateConditionSelect(editor);
    conditionSelect.value = items[l];
    conditions.push(conditionSelect);
  }
  return conditions;
};

export const generateConditionByShortcut = (key, editor) => {
  const { shortcutConfigs } = editor.state;
  const config = _.cloneDeep(shortcutConfigs[key]);
  const shortcut = config.shortcut;
  if (_.isArray(shortcut)) {
    return arrayToStateConditions(shortcut, editor);
  } else if (_.isPlainObject(shortcut)) {
    return objectToCondition(shortcut, editor);
  }
  return {};
};

export const groupBy = (items, name = 'group') => {
  const groups = {};

  _.each(items, (item, key) => {
    const group = item[name] || DEFAULT_GROUP;

    if (!groups[group]) {
      groups[group] = {};
    }
    groups[group][key] = item;
  });

  return groups;
};

export const insertCondition = (newIndex, condition, conditions) => {
  if (newIndex <= conditions.length) {
    conditions.splice(newIndex, 0, condition);
  }
};

export const conditionPredicateToResult = (predicate) => predicate.value;

export const conditionItemToResult = (item) => ({
  predicate: item.predicate,
  value: item.value,
  operation: item.operation,
  operationValue: item.operationValue
});

export const conditionsValueToNull = (conditions) => {
  let i = 0;

  const l = conditions.length - 1;

  for (; i < l; i++) {
    const condition = conditions[i];
    if (_.isArray(condition)) {
      conditionsValueToNull(condition);
    } else {
      condition.value = null;
    }
  }
};

export const conditionsToResult = (conditions) => {
  const results = [];
  let i = 0;

  const l = conditions.length - 1;

  for (; i < l; i++) {
    const condition = conditions[i];
    if (_.isArray(condition)) {
      const result = conditionsToResult(condition);
      if (result.length) {
        results.push(result);
      }
    } else {
      if (valueNotNull(condition)) {
        results.push(conditionItemToResult(condition));
      }
    }
  }

  if (conditions[l] && results.length) {
    results.push(
      _.isString(conditions[l]) ? conditions[l] : conditionPredicateToResult(conditions[l]));
  }

  return results;
};

export const conditionsToQueryString = (conditions) => (
  qs.stringify({ conditions: conditionsToResult(conditions) })
);

export const checkItem = (item, editor) => {
  if (!_.isPlainObject(item)) {
    throw new Error('item 必须为对象');
  }

  if (!item.predicate) {
    throw new Error('item 必须设置predicate');
  }

  if (!PREDICATES[item.predicate]) {
    throw new Error(`predicate的值${item.predicate}无效`);
  }

  if (!item.operation) {
    throw new Error('item 必须设置operation');
  }

  if ([OPERATION_FIELD, OPERATION_ACTION].indexOf(item.operation) === -1) {
    throw new Error(`operation的值${item.operation}无效`);
  }

  if (!item.operationValue) {
    throw new Error('item 必须设置operationValue');
  }

  const { fieldConfigs, actionConfigs } = editor.props;

  if (item.operation === OPERATION_ACTION && !actionConfigs[item.operationValue]) {
    throw new Error(`operationValue的值${item.operationValue}在actionConfigs里不存在!`);
  }

  if (item.operation === OPERATION_FIELD && !fieldConfigs[item.operationValue]) {
    throw new Error(`operationValue的值${item.operationValue}在fieldConfigs里不存在!`);
  }
};

export const checkPredicate = (predicate) => {
  if ([$OR, $AND].indexOf(predicate) === -1) {
    throw new Error(`predicate 必须为${$AND}或者${$OR}`);
  }
};
export const checkInputConditions = (conditions, editor) => {
  if (!_.isArray(conditions)) {
    throw new Error('条件 必须为数组');
  }

  let i = 0;
  const l = conditions.length - 1;

  for (; i < l; i++) {
    const condition = conditions[i];
    if (_.isArray(condition)) {
      checkInputConditions(condition, editor);
    } else {
      checkItem(condition, editor);
    }
  }

  checkPredicate(conditions[l]);
};

export const parseInputConditions = (value) => {
  let parseValue = undefined;

  if (!_.isString(value)) {
    return value;
  }

  try {
    parseValue = JSON.parse(value);
  } catch (jsonException) {
    try {
      parseValue = qs.parse(value).conditions;
    } catch (qsException) {
      throw qsException;
    }
    if (!parseValue) {
      throw jsonException;
    }
  }
  return parseValue;
};

export const checkConditionsHasValue = (conditions) => {
  let i = 0;
  const l = conditions.length - 1;
  let result = false;
  for (; i < l; i++) {
    const condition = conditions[i];
    if (_.isArray(condition)) {
      if (checkConditionsHasValue(condition)) {
        result = true;
        break;
      }
    } else {
      if (valueNotNull(condition)) {
        result = true;
        break;
      }
    }
  }
  return result;
};

export const checkConditionsValueIsNotNull = (conditions) => {
  let i = 0;
  const l = conditions.length - 1;
  let result = true;
  for (; i < l; i++) {
    const condition = conditions[i];
    if (_.isArray(condition)) {
      if (!checkConditionsValueIsNotNull(condition)) {
        result = false;
        break;
      }
    } else {
      if (!valueNotNull(condition)) {
        result = false;
        break;
      }
    }
  }
  return result;
};
