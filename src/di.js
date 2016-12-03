import inversify from 'inversify';
import 'reflect-metadata';

const container = new inversify.Container();

export default class DI {
  static get(key) {
    return container.get(key);
  }

  static bind(key, value) {
    DI.unbind(key);
    container.bind(key).to(value).inSingletonScope();
    return this;
  }

  static bindValue(key, value) {
    DI.unbind(key);
    container.bind(key).toConstantValue(value);
    return this;
  }

  static bindFactory(key, value) {
    DI.unbind(key);
    container.bind(key).toFactory(value);
    return this;
  }

  static getContainer() {
    return container;
  }

  static unbind(key) {
    if (container.isBound(key)) {
      container.unbind(key);
    }
    return this;
  }
}
