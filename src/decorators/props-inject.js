import { connect } from 'react-redux';
import _ from 'lodash';
import DI from '../di';

const propsInject = (dependencies) => (target) => (
  connect(() => {
    const props = {};
    _.each(dependencies, (dependency, key) => {
      props[key] = DI.get(dependency);
    });
    return props;
  }, undefined, undefined, { withRef: true })(target)
);

export default propsInject;
