import DI from '../di';
import { HTTP_GET, HTTP_DELETE, HTTP_POST, HTTP_PUT } from '../constants/http';

const request = (method) => (takeManageToken) => (target, prop, descriptor) => {
  const d = descriptor;
  const func = d.value;
  delete d.value;
  delete d.writable;
  // 使用function 保持 this
  /*eslint func-names: ["error", "never"]*/
  d.get = function () {
    return (...args) => {
      const options = func.call(this, ...args);
      options.method = method;
      return DI.get('auth').getToken().then((token) => {
        if (takeManageToken) {
          options.token = token;
        }
        return this.request(null, options).then(options.success || ((f) => f));
      });
    };
  };
};

export const httpGet = request(HTTP_GET);
export const httpPost = request(HTTP_POST);
export const httpPut = request(HTTP_PUT);
export const httpDelete = request(HTTP_DELETE);

