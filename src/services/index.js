import DI from '../di';
import Navigation from './navigation';
import BaseHttp from './base-http';
import Auth from './auth';
import AuthHttp from './auth-http';
import Permission from './permission';
import Config from './config';
import OfflineStorage from './offline-storge';
import CommonOfflineStorage from './common-offline-storge';
import QiniuUploadHttp from './qiniu-upload-http';
import KvHttp from './kv-http';
import MyTaskHttp from './my-task-http';
import ExcelHttp from './excel-http';
import MyTask from './my-task';

DI.bind('config', Config);

DI.bindFactory('offlineStorageFactory', () => (name) => new OfflineStorage(name));
DI.bindFactory('commonOfflineStorage', () => new CommonOfflineStorage);

DI.bind('navigation', Navigation);
DI.bind('baseHttp', BaseHttp);
DI.bind('authHttp', AuthHttp);
DI.bind('auth', Auth);
DI.bind('qiniuUploadHttp', QiniuUploadHttp);
DI.bind('kvHttp', KvHttp);
DI.bind('permission', Permission);
DI.bind('myTaskHttp', MyTaskHttp);
DI.bind('excelHttp', ExcelHttp);
DI.bind('myTask', MyTask);

export {
  BaseHttp,
  Navigation,
  Auth,
  AuthHttp,
  Permission,
  Config,
  OfflineStorage,
  CommonOfflineStorage,
  QiniuUploadHttp,
  KvHttp
};
