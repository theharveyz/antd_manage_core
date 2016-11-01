import { SUCCESS } from '../constants/redux_common.js';
import typeToReducer from 'type-to-reducer';
import Immutable from 'immutable';
import {
  GET_ACCOUNT,
  SHOW_ACCOUNT_INFO,
  CLOSE_ACCOUNT_INFO,
  CHECK_TWO_FACTOR_AUTHENTICATION,
  INTERVAL_CHECK_TWO_FACTOR_AUTHENTICATION,
  CLEAR_INTERVAL_CHECK_TWO_FACTOR_AUTHENTICATION
} from '../constants/account-info';

const initialState = new Immutable.Map({
  account: [],
  visible: false,
  intervalId: null
});

const reducerMap = {
  [GET_ACCOUNT]: {
    [SUCCESS]: (state, action) => (
      state.set('account', action.payload)
    )
  },
  [SHOW_ACCOUNT_INFO]: (state, action) => (
    state.set('visible', action.payload)
  ),
  [CLOSE_ACCOUNT_INFO]: (state, action) => (
    state.set('visible', action.payload)
  ),
  [CHECK_TWO_FACTOR_AUTHENTICATION]: {
    [SUCCESS]: (state, action) => (
      state.set('visible', action.payload)
    )
  },
  [INTERVAL_CHECK_TWO_FACTOR_AUTHENTICATION]: (state, action) => (
    state.set('intervalId', action.payload)
  ),
  [CLEAR_INTERVAL_CHECK_TWO_FACTOR_AUTHENTICATION]: (state, action) => (
    state.set('intervalId', action.payload)
  )
};
export default typeToReducer(reducerMap, initialState);
