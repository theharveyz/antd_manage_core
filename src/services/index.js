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
import UpTaskHttp from './up-task-http';
import UpExcelHttp from './up-excel-http';
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
DI.bind('upTaskHttp', UpTaskHttp);
DI.bind('upExcelHttp', UpExcelHttp);

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
