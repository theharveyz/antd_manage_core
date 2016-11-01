import { GET_BREADCRUMBS, GET_DEFAULT_BREADCRUMB } from '../constants/breadcrumb';
import DI from '../di';

export const getBreadcrumbs = (path) => (
  (dispatch) => (
    dispatch({
      type: GET_BREADCRUMBS,
      payload: DI.get('navigation').getBreadcrumbs(path)
    })
  )
);

export const getDefaultBreadcrumb = () => (
  (dispatch) => (
    dispatch({
      type: GET_DEFAULT_BREADCRUMB,
      payload: DI.get('navigation').getDefault()
    })
  )
);
