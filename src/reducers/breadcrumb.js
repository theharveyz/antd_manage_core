import { SUCCESS } from '../constants/redux_common.js';
import typeToReducer from 'type-to-reducer';
import Immutable from 'immutable';
import { GET_BREADCRUMBS, GET_DEFAULT_BREADCRUMB } from '../constants/breadcrumb';

const initialState = new Immutable.Map({
  breadcrumbs: []
});

const reducerMap = {
  [GET_BREADCRUMBS]: {
    [SUCCESS]: (state, action) => state.set('breadcrumbs', action.payload)
  },
  [GET_DEFAULT_BREADCRUMB]: {
    [SUCCESS]: (state, action) => state.set('breadcrumbs', [action.payload])
  }
};
export default typeToReducer(reducerMap, initialState);
