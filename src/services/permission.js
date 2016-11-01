import _ from 'lodash';
import { $AND } from '../constants/common';
import Auth from './auth';
import injectable from '../decorators/injectable';
import DI from '../di';

@injectable()
export default class Permission {

  getConfigPermission(navConfig) {
    const authService = new Auth();
    return Promise.all([
      authService.getPermission(),
      DI.get('config').get('permission.debug')
    ]).then(([userHasPermission, isDebug]) => {
      if (userHasPermission) {
        return this.filterConfig(navConfig, userHasPermission, isDebug);
      }
      return navConfig;
    });
  }

  filterConfig(configs, permission, isDebug) {
    const filterConfigs = [];
    _.each(configs, (config) => {
      if (!config.ignoreChild && _.isArray(config.child)) {
        const childFilterConfigs = this.filterConfig(config.child, permission, isDebug);
        if (childFilterConfigs.length > 0) {
          const c = config;
          c.child = childFilterConfigs;
          filterConfigs.push(c);
        }
      } else {
        if (_.isArray(config.permission) && config.permission.length > 0) {
          if (this.checkPermission(config.permission, permission)) {
            filterConfigs.push(config);
          } else {
            if (isDebug) {
              const c = config;
              c.hasNoPermission = true;
              filterConfigs.push(c);
            }
          }
        } else {
          filterConfigs.push(config);
        }
      }
    });
    return filterConfigs;
  }

  checkPermission(needPermission, userHasPermission) {
    if (_.last(needPermission) === $AND) {
      for (const permission of needPermission) {
        const permissionArray = permission.split('@');
        if (permissionArray.length === 2) {
          if (!this.hasPermission(permissionArray[0], permissionArray[1], userHasPermission)) {
            return false;
          }
        }
        return true;
      }
    } else {
      for (const permission of needPermission) {
        const permissionArray = permission.split('@');
        if (permissionArray.length === 2) {
          if (this.hasPermission(permissionArray[0], permissionArray[1], userHasPermission)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  checkPermissionPromise(needPermission) {
    const authService = new Auth();
    return authService.getPermission().then((userHasPermission) =>
      this.checkPermission(needPermission, userHasPermission)
    );
  }

  hasPermission(method, needPermission, userHasPermission) {
    const methodArray = userHasPermission[method];
    if (!_.isEmpty(methodArray)) {
      for (const eachPermission of userHasPermission[method]) {
        if (eachPermission.indexOf(needPermission) !== -1) {
          return true;
        }
      }
    }
    return false;
  }
}
