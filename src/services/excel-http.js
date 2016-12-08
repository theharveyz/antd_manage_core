import BaseHttp from './base-http';
import { injectable, httpGet, httpPost } from '../decorators';
import manageApi from '../decorators/manage-api';

@injectable()
export default class ExcelHttp extends BaseHttp {

  @manageApi('/v1/excel') api;

}
