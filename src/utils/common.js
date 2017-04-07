import React from 'react';
import numeral from 'numeral';
import moment from 'moment';
import _ from 'lodash';
import DI from '../di';

export const stringToCamelCase = (string) => (
  string.replace(/[-_][^-_]/g, (match) => match.charAt(1).toUpperCase())
);

export const stringToUnderlineCase = (s) => s.replace(/([A-Z])/g,"_$1").toLowerCase()

export const generateUUID = () => {
  let d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};


export const currencyFormat = (value, digit = 2) => {
  let format = _.padEnd('0,0.', 6, '0');
  if (_.isNumber(digit)) {
    format = _.padEnd('0,0.', 4 + digit, '0');
  }
  return `￥ ${numeral(value).format(format)}`;
};

export const percentFormat = (value, digit) => {
  let d = 2;
  if (_.isNumber(digit)) d = digit
  return `${ (value * 100).toFixed(d)} %`;
};

export const isBooleanTrue = (value) => (
  typeof(value) === 'boolean' && value === true
);


export const unixToMoment = (timestamp) => (
  moment.unix(timestamp)
);

export const datetimeFormat = (value, isTimestamp = false) => (
  value ? moment(isBooleanTrue(isTimestamp) ?
    unixToMoment(value) : value).format('YYYY-MM-DD HH:mm:ss') : value
);

export const timeFormat = (value, isTimestamp = false) => (
  value ? moment(isBooleanTrue(isTimestamp) ?
    unixToMoment(value) : value).format('HH:mm:ss') : value
);

export const dateFormat = (value, isTimestamp = false) => (
  value ? moment(isBooleanTrue(isTimestamp) ?
    unixToMoment(value) : value).format('YYYY-MM-DD') : value
);

export const arrayHydrate = (array, modelPrototype) => (
  _.map(array, (item) => {
    const model = _.clone(modelPrototype);
    model.hydrate(item);
    return model;
  })
);

export const formatFormFields = (fields) => {
  const key = _.first(_.keys(fields));
  return {
    name: key,
    value: fields[key].value
  };
};

export const objectToFormFields = (object) => {
  const map = {};
  _.each(object, (value, key) => {
    map[key] = {
      value
    };
  });
  return map;
};

export const humanizeByName = (arrayOrDIKey, value, defaultValue) => {
  let names = arrayOrDIKey;

  if (_.isString(arrayOrDIKey)) {
    names = DI.get(arrayOrDIKey);
  }

  const object = _.find(names, { value });
  if (object) {
    return object.name;
  }
  return defaultValue || value;
};

export const humanizeByColorName = (arrayOrDIKey, value, defaultValue) => {
  let names = arrayOrDIKey;

  if (_.isString(arrayOrDIKey)) {
    names = DI.get(arrayOrDIKey);
  }

  const object = _.find(names, { value });
  if (object) {
    const style = { color: object.color };
    return <span style={style} >{object.name}</span>;
  }
  return defaultValue || value;
};

export const jsonToObject = (json) => {
  let data;
  try {
    data = JSON.parse(json);
  } catch (e) {
    data = {};
  }
  return data;
};

export const jsonToArray = (json) => {
  let data;
  try {
    data = JSON.parse(json);
  } catch (e) {
    data = [];
  }
  return data;
};

export const formatConditionQuery = (queryObj) => {
  let query = '';
  for (let i = 0; i < queryObj.length - 1; i++) {
    query += `${queryObj[i].operationValue}=${queryObj[i].value}&`;
  }
  return query.slice(0, -1);
};

export const isDecimal = (value) => /^[0-9]*\.?[0-9]+$/.test(value);

export const formDecimalValidator = (rule, value, callback) => {
  if (!isDecimal(value)) {
    callback('请输入一个数字！');
  } else {
    callback();
  }
};

export const getColorByNum = (num) => DI.get('COLORS')[num % DI.get('COLORS').length];

export const queryInjectCondition = (query, condition) => {
  // reset value to undefined to prevent caching last condition value
  _.each(condition, (item) => {
    if(item.operationValue) {
      item.value = undefined;
    }
  });

  _.each(query, (value, key) => {
    const currentCondition = _.find(condition, { operationValue: key });
    if (currentCondition) {
      currentCondition.value = value;
    }
  })
}
