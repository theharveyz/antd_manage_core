import typeToReducer from 'type-to-reducer';
import Immutable from 'immutable';

import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = new Immutable.Map({
  locationBeforeTransitions: null
});

const reducerMap = {
  [LOCATION_CHANGE]: (state, action) => (
    state.set('locationBeforeTransitions', action.payload)
  )
};
export default typeToReducer(reducerMap, initialState);
