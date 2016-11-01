import _ from 'lodash';
import injectable from '../decorators/injectable';

const KEY = '%reducer-manager-placeholder%';

@injectable()
export default class ReducerManager {

  emitChange = _.noop;

  reducers = {
    [KEY]: () => 1
  };

  registerReducer(key, reducer) {
    this.reducers[key] = reducer;
    this.emitChange(this.getReducers());
  }

  registerReducers(reducers) {
    _.each(reducers, (reducer, key) => (this.registerReducer(key, reducer)));
  }

  getReducers() {
    return this.reducers;
  }

  listener(callback) {
    this.emitChange = callback;
  }
}
