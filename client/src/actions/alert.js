import { v4 as uuid } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType) => {
  const id = uuid;
  return {
    type: SET_ALERT,
    payload: {
      msg,
      alertType,
      id,
    },
  };
};
