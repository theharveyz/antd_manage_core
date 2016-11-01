import DI from '../di';
const propertyInjectFactory = (key, args) => (target, prop, descriptor) => {
  const d = descriptor;
  delete d.initializer;
  delete d.writable;
  d.get = () => DI.get(key)(...args);
};

export default propertyInjectFactory;
