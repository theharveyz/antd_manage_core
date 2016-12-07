import BaseHttp from './base-http';
import { injectable, httpGet, httpPost } from '../decorators';
import manageApi from '../decorators/manage-api';

@injectable()
export default class AuthHttp extends BaseHttp {

  @manageApi('/v1/account') api;

  @httpGet(true)
  doLogout() {
    return {
      url: `${this.api}/logout`
    };
  }

  @httpPost()
  doLogin(mobile, password, code) {
    return {
      url: `${this.api}/login`,
      body: JSON.stringify({ mobile, password, code })
    };
  }

  @httpGet(true)
  checkToken() {
    return {
      url: `${this.api}/token/stats`
    };
  }

  @httpGet(true)
  getResource() {
    return {
      url: `${this.api}/resource`
    };
  }

  @httpGet(true)
  generateKey() {
    return {
      url: `${this.api}/generateKey`
    };
  }

  @httpGet(true)
  resetKey() {
    return {
      url: `${this.api}/resetKey`
    };
  }

  @httpPost(true)
  verifyKey(code) {
    return {
      url: `${this.api}/verifyKey`,
      body: JSON.stringify({ code })
    };
  }
}
