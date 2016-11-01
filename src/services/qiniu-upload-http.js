import BaseHttp from './base-http';
import { injectable, httpGet } from '../decorators';
import manageApi from '../decorators/manage-api';

@injectable()
export default class QiniuUploadHttp extends BaseHttp {

  @manageApi('/v1/upload') api;

  @httpGet(true)
  getUptoken() {
    return {
      url: `${this.api}/qiniu/uptoken`
    };
  }
}
