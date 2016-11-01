import DI from '../di';

const manageApi = (url) => (target, prop, descriptor) => {
  const d = descriptor;
  delete d.initializer;
  d.get = () => `${DI.get('config').get('manage.api')}${url}`;
};

export default manageApi;
