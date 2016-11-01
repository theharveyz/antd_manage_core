import DI from '../di';
const propertyInject = (key) => (target, prop, descriptor) => {
  const d = descriptor;
  delete d.initializer;
  d.get = () => DI.get(key);
};

export default propertyInject;
