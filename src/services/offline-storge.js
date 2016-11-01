import localforage from 'localforage';
import { injectable } from 'inversify';

@injectable()
export default class OfflineStorage {

  constructor(name) {
    this.store = localforage.createInstance({
      name
    });
  }

  add(key, value) {
    return this.store.setItem(key, value);
  }

  get(key) {
    return this.store.getItem(key);
  }

  remove(key) {
    return this.store.removeItem(key);
  }

  clear() {
    return this.store.clear();
  }

  getAll() {
    return this.store.keys().then((keys) => {
      const promises = keys.map((key) => this.get(key));
      return Promise.all(promises);
    });
  }
}
