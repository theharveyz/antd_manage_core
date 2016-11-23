import OfflineStorage from './offline-storge';
import { injectable } from 'inversify';
import DI  from '../di';

@injectable()
class CommonOfflineStorage extends OfflineStorage {

  constructor() {
    super(DI.get('config').get('core.commonOfflineStorageName'));
  }

}

export default CommonOfflineStorage;
