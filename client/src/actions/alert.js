import { v4 as uuid } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

const id = uuid;
export const setAlert = (msg, alertType) => {
  return {
    type: SET_ALERT,
    payload: {
      msg,
      alertType,
      id,
    },
  };
};

export const removeAlert = () => {
  return {
    type: REMOVE_ALERT,
    payload: id,
  };
};
