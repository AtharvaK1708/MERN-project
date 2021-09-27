import axios from 'axios';
import { setAlert, removeAlert } from './alert';
import { GET_PROFILE, PROFILE_ERROR } from './types';

// ! GEt current users profile

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const config = {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    };
    const res = await axios.get('/api/profile/me', config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// ! Create or update profile
export const createProfile =
  (formData, history, edit = false) =>
  async (dispatch) => {
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
      };
      const res = await axios.post('/api/profile', formData, config);
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });

      dispatch(
        setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success')
      );

      if (!edit) {
        history.push('/dashboard');
      }
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => {
          dispatch(setAlert(error.msg, 'danger'));
          setTimeout(() => dispatch(removeAlert()), 4000);
        });
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };
