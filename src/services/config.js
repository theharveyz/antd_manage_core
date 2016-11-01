import _ from 'lodash';
import injectable from '../decorators/injectable';
@injectable()
export default class Config {

  configs = {};

  get(key) {
    return _.get(this.configs, key);
  }

  setConfigs(configs) {
    this.configs = configs;
  }
}
