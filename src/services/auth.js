import injectable from '../decorators/injectable';
import propertyInjectFactory from '../decorators/property-inject-factory';

@injectable()
export default class Auth {

  @propertyInjectFactory('offlineStorageFactory', ['bmqb_auth_store']) store;

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
    return this.store.add('permission', permission);
  }

  setKeyVerified(keyStatus) {
    return this.getAccount().then((account) => {
      this.setAccount({ ...account, key_verified: keyStatus });
    });
  }

  getKeyVerified() {
    return this.getAccount().then((account) => (account.key_verified));
  }
}
