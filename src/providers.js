import DI from './di';
import Navigation from './services/navigation';
import ReducerManager from './services/reduce-manager';
import BaseHttp from './services/base-http';
import Auth from './services/auth';
import AuthHttp from './services/auth-http';
import Permission from './services/permission';
import Config from './services/config';
import OfflineStorage from './services/offline-storge';
import CommonOfflineStorage from './services/common-offline-storge';
import QiniuUploadHttp from './services/qiniu-upload-http';
import KvHttp from './services/kv-http';

DI.bindFactory('offlineStorageFactory', () => (name) => new OfflineStorage(name));
DI.bindValue('commonOfflineStorage', new CommonOfflineStorage);

DI.bind('config', Config);

DI.bind('navigation', Navigation);
DI.bind('reducerManager', ReducerManager);
DI.bind('baseHttp', BaseHttp);
DI.bind('authHttp', AuthHttp);
DI.bind('auth', Auth);
DI.bind('qiniuUploadHttp', QiniuUploadHttp);
DI.bind('kvHttp', KvHttp);
DI.bind('permission', Permission);
