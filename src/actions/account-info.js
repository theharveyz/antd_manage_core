import {
  GET_ACCOUNT,
  CHECK_TWO_FACTOR_AUTHENTICATION,
  SHOW_ACCOUNT_INFO,
  CLOSE_ACCOUNT_INFO,
  INTERVAL_CHECK_TWO_FACTOR_AUTHENTICATION,
  CLEAR_INTERVAL_CHECK_TWO_FACTOR_AUTHENTICATION
} from '../constants/account-info';
import { replace } from 'react-router-redux';

import DI from '../di';

export const showAccountInfo = () => (
  (dispatch) => (
    dispatch({
      type: SHOW_ACCOUNT_INFO,
      payload: true
    })
  )
);

export const closeAccountInfo = () => (
  (dispatch) => (
    dispatch({
      type: CLOSE_ACCOUNT_INFO,
      payload: false
    })
  )
);

export const getAccount = () => (
  (dispatch) => (
    dispatch({
      type: GET_ACCOUNT,
      payload: DI.get('auth').getAccount()
    })
  )
);

export const checkTwoFactorAuthentication = () => (
  (dispatch, state) => {
    if (!state().get('accountInfo').get('visible')) {
      dispatch({
        type: CHECK_TWO_FACTOR_AUTHENTICATION,
        payload: DI.get('auth')
          .getKeyVerified()
          .then((verified) => verified === 'N')
      });
    }
  }
);

export const clearIntervalCheckTwoFactorAuthentication = () => (
  (dispatch, state) => {
    clearInterval(state().get('accountInfo').get('intervalId'));
    dispatch({
      type: CLEAR_INTERVAL_CHECK_TWO_FACTOR_AUTHENTICATION,
      payload: null
    });
  }
);

export const intervalCheckTwoFactorAuthentication = () => (
  (dispatch) => {
    const twoFactorAuthenticationConfig = DI.get('config')
      .get('core.auth.twoFactorAuthentication');
    if (twoFactorAuthenticationConfig.forceUse) {
      dispatch(checkTwoFactorAuthentication());
      const id = setInterval(() => {
        dispatch(checkTwoFactorAuthentication());
      }, twoFactorAuthenticationConfig.checkDelay);
      dispatch({
        type: INTERVAL_CHECK_TWO_FACTOR_AUTHENTICATION,
        payload: id
      });
    }
  }
);

export const logout = () => (
  (dispatch) => {
    const doClearAndDispatch = () => {
      DI.get('auth').clear().then(() => {
        dispatch(replace('/login'));
      });
    };
    DI.get('authHttp')
      .doLogout()
      .then(doClearAndDispatch)
      .catch(doClearAndDispatch);
  }
);
