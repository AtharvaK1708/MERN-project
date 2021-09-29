import axios from 'axios';
import { removeAlert, setAlert } from './alert';
import {
  ADD_COMMENT,
  ADD_POST,
  DELETE_POST,
  GET_POST,
  GET_POSTS,
  POST_ERROR,
  REMOVE_COMMENT,
  UPDATE_LIKES,
} from './types';

// ! GET POSTS
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/posts');
    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// ! Add likes
export const addLike = (post_id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/like/${post_id}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { post_id, likes: res.data },
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// ! REMOVE LIKE
export const removeLike = (post_id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/unlike/${post_id}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { post_id, likes: res.data },
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// ! DELETE POST
export const deletePost = (post_id) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/${post_id}`);
    dispatch({
      type: DELETE_POST,
      payload: post_id,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// ! ADD POST
export const addPost = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };
  try {
    const res = await axios.post(`/api/posts`, formData, config);
    dispatch({
      type: ADD_POST,
      payload: res.data,
    });
    dispatch(setAlert('post created', 'success'));
    dispatch(removeAlert());
    console.log(res.data);
  } catch (err) {
    console.log(err);
    // dispatch({
    //   type: POST_ERROR,
    //   payload: { msg: err.response.statusText, status: err.response.status },
    // });
  }
};

// ! GET POST
export const getPost = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/posts/${id}`);
    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// ! ADD COMMENT
export const addComment = (post_id, formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };
  try {
    const res = await axios.post(
      `/api/posts/comment/${post_id}`,
      formData,
      config
    );
    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    });
    dispatch(setAlert('Comment created', 'success'));
    dispatch(removeAlert());
    console.log(res.data);
  } catch (err) {
    console.log(err);
    // dispatch({
    //   type: POST_ERROR,
    //   payload: { msg: err.response.statusText, status: err.response.status },
    // });
  }
};

// ! DELETE COMMENT
export const deleteComment = (post_id, comment_id) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/comment/${post_id}/${comment_id}`);
    dispatch({
      type: REMOVE_COMMENT,
      payload: comment_id,
    });
    dispatch(setAlert('Comment deleted', 'success'));
    // dispatch(removeAlert());
    // console.log(res.data);
  } catch (err) {
    console.log(err);
    // dispatch({
    //   type: POST_ERROR,
    //   payload: { msg: err.response.statusText, status: err.response.status },
    // });
  }
};
