import inversify from 'inversify';
import 'reflect-metadata';

const kernel = new inversify.Kernel();

export default class DI {
  static get(key) {
    return kernel.get(key);
  }

  static bind(key, value) {
    DI.unbind(key);
    kernel.bind(key).to(value).inSingletonScope();
    return this;
  }

  static bindValue(key, value) {
    DI.unbind(key);
    kernel.bind(key).toConstantValue(value);
    return this;
  }

  static bindFactory(key, value) {
    DI.unbind(key);
    kernel.bind(key).toFactory(value);
    return this;
  }

  static getKernel() {
    return kernel;
  }

  static unbind(key) {
    if (kernel.isBound(key)) {
      kernel.unbind(key);
    }
    return this;
  }
}
