export const $AND = '$and';
export const $OR = '$or';
export const $NEQ = '$neq';
export const $EQ = '$eq';
export const $GT = '$gt';
export const $LT = '$lt';
export const $GTE = '$gte';
export const $LTE = '$lte';
export const $IN = '$in';
export const $NOT_IN = '$not_in';
export const $LIKE = '$like';
export const $IS_NULL = '$is_null';
export const $IS_NOT_NULL = '$is_not_null';

export const PREDICATES = {
  [$NEQ]: '不等于',
  [$EQ]: '等于',
  [$GT]: '大于',
  [$LT]: '小于',
  [$GTE]: '大于等于',
  [$LTE]: '小于等于',
  [$IN]: '包含',
  [$NOT_IN]: '不包含',
  [$LIKE]: '类似',
  [$IS_NULL]: '为空',
  [$IS_NOT_NULL]: '非空'
};

export const RELATIONS = {
  [$AND]: '并且',
  [$OR]: '或者'
};

export const DEFAULT_PREDICATE = $EQ;

export const DEFAULT_GROUP = '其他';

export const OPERATION_FIELD = 'field';
export const OPERATION_ACTION = 'action';
export const OPERATION_SHORTCUT = 'shortcut';
