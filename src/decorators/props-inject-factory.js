import { connect } from 'react-redux';
import _ from 'lodash';
import DI from '../di';

const propsInjectFactory = (dependencies) => (target) => (
  connect(() => {
    const props = {};
    _.each(dependencies, (dependency, key) => {
      props[key] = DI.get(dependency.key)(...dependency.params);
    });
    return props;
  }, undefined, undefined, { withRef: true })(target)
);

export default propsInjectFactory;
