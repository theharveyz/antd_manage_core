import _ from 'lodash';
export default class BaseModel {

  constructor(object = {}) {
    if (_.isPlainObject(object)) {
      this.hydrate(object);
    } else {
      this.hydrate({});
    }
  }

  hydrate() {
    throw new Error('BaseModel hydrate方法不能直接使用');
  }

  extract() {
    throw new Error('BaseModel extract方法不能直接使用');
  }

  toString() {
    return JSON.stringify(this, undefined, 4);
  }

  jsonToModel(json, model) {
    let data;
    try {
      data = JSON.parse(json);
    } catch (e) {
      data = {};
    }
    model.hydrate(data);
    return model;
  }

  jsonToObject(json) {
    let data;
    try {
      data = JSON.parse(json);
    } catch (e) {
      data = {};
    }
    return data;
  }

  jsonToArray(json) {
    let data;
    try {
      data = JSON.parse(json);
    } catch (e) {
      data = [];
    }
    return data;
  }

  valueToFormField(value) {
    return {
      value
    };
  }

  formFieldToValue(field) {
    return _.isPlainObject(field) ? field.value : undefined;
  }

  getFormFieldValue(key) {
    return this.formFieldToValue(this[key]);
  }

  extractArrayModel(arr) {
    return _.map(arr, (model) => model.extract());
  }

  hydrateJsonToArrayModel(json, modelPrototype) {
    const arr = this.jsonToArray(json);
    return _.map(arr, (object) => {
      const model = _.cloneDeep(modelPrototype);
      model.hydrate(object);
      return model;
    });
  }

}
