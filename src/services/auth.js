import injectable from '../decorators/injectable';
import DI from '../di';

@injectable()
export default class Auth {
  permissionOnChange = () => {
  };

  constructor() {
    this.store = DI.get('offlineStorageFactory')(DI.get('config').get('core.auth.storageName'))
  }

  isLoggedIn() {
    return this.getToken().then((token) => !!token);
  }

  clear() {
    return Promise.all([
      this.store.remove('token'),
      this.store.remove('account'),
      this.store.remove('permission')
    ]);
  }

  getToken() {
    return this.store.get('token');
  }

  getAccount() {
    return this.store.get('account');
  }

  getPermission() {
    return this.store.get('permission');
  }

  setToken(token) {
    return this.store.add('token', token);
  }

  setAccount(account) {
    return this.store.add('account', account);
  }

  setPermission(permission) {
    return this.store.add('permission', permission).then((data) => {
      this.permissionOnChange();
      return data;
    })
  }

  setKeyVerified(keyStatus) {
    return this.getAccount().then((account) => {
      this.setAccount({ ...account, key_verified: keyStatus });
    });
  }

  getKeyVerified() {
    return this.getAccount().then((account) => (account.key_verified));
  }

  listenPermissionChange(func) {
    this.permissionOnChange = func;
  }
}
