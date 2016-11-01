import BaseHttp from './base-http';
import { injectable, manageApi, httpPost } from '../decorators';

@injectable()
export default class KvHttp extends BaseHttp {

  @manageApi('/v1/kv') api;

  @httpPost(true)
  createOrUpdate(data) {
    return {
      url: `${this.api}/createOrUpdate`,
      body: JSON.stringify(data)
    };
  }

}
