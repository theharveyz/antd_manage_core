import OfflineStorage from './offline-storge';
import { injectable } from 'inversify';

@injectable()
class CommonOfflineStorage extends OfflineStorage {

  constructor() {
    super('bmqb_manage_common_store');
  }

}

export default CommonOfflineStorage;
