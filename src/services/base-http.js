import urijs from 'urijs';
import DI from '../di';
import { HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_PATCH } from '../constants/http';
import 'whatwg-fetch';
import Raven from 'raven-js';
import {
  httpGet,
  httpPost,
  httpDelete,
  httpPut,
  injectable
} from '../decorators';

@injectable()
export default class BaseHttp {

  defaultOptions = {
    method: HTTP_GET,
    mode: 'cors',
    timeout: DI.get('config').get('core.httpRequst.timeout') || 5000
  };

  save(data, primaryKey = 'id') {
    if (data[primaryKey]) {
      return this.update(data, primaryKey);
    }
    return this.create(data);
  }

  @httpGet(true)
  getAll(options = {}) {
    return {
      url: this.api,
      ...options
    };
  }

  @httpPost(true)
  addTableToExcelTask(data, queryString) {
    return {
      url: `${this.api}/tableToExcelTask`,
      body: JSON.stringify(data),
      queryString
    };
  }

  @httpGet(true)
  get(id) {
    return {
      url: `${this.api}/${id}`
    };
  }

  @httpDelete(true)
  delete(id) {
    return {
      url: `${this.api}/${id}`
    };
  }

  @httpPost(true)
  create(data) {
    return {
      url: this.api,
      body: JSON.stringify(data)
    };
  }

  @httpPut(true)
  update(data, primaryKey = 'id') {
    return {
      url: `${this.api}/${data[primaryKey]}`,
      body: JSON.stringify(data)
    };
  }

  checkStatus(response) {
    if (!response.ok) {
      return response.json().then((error) => {
        const err = new Error(error.message);
        err.response = response;
        err.code = error.code;
        Raven.captureException(err);
        throw err;
      });
    }
    return response;
  }

  deserialize(response) {
    const header = response.headers.get('Content-Type');

    if (header) {
      if (header.indexOf('application/json') > -1 || header.indexOf('application/ld+json') > -1) {
        return response.json();
      }
      if (header.indexOf('application/octet-stream') > -1) {
        return response.arrayBuffer();
      }
    }
    return response.text();
  }

  request(url, options) {
    const fetchOptions = { ...this.defaultOptions, ...options, headers: {} };
    let requestUrl = fetchOptions.url || url;
    if (fetchOptions.queryString) {
      requestUrl += `?${fetchOptions.queryString}`;
    }

    const uri = urijs(requestUrl);

    if (fetchOptions.query) {
      uri.addSearch(fetchOptions.query);
    }

    if ([HTTP_POST, HTTP_PUT, HTTP_PATCH].indexOf(fetchOptions.method) !== -1) {
      fetchOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      };
    }

    if (fetchOptions.token) {
      fetchOptions.headers['x-token'] = fetchOptions.token;
    }

    return new Promise((resolve, reject) => {
      if (fetchOptions.timeout) {
        setTimeout(() => reject(new Error('request timeout')), fetchOptions.timeout);
      }
      fetch(uri.toString(), fetchOptions).then(resolve, reject);
    }).then(this.checkStatus)
      .then(this.deserialize);
  }
}
