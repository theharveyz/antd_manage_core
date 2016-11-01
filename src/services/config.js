import _ from 'lodash';
import configs from '../../../configs/config';
import injectable from '../decorators/injectable';
@injectable()
export default class Config {

  get(key) {
    return _.get(configs, key);
  }

}
