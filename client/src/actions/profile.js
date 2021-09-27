import axios from 'axios';
import { setAlert } from './alert';
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
