import DI from '../di';

const reducer = (name, reducers) => () => {
  DI.get('reducerManager').registerReducer(name, reducers);
};
export default reducer;
