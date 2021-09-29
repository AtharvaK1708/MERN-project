import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPosts } from '../../actions/post';
import Spinner from '../layouts/Spinner';
import PostItem from './PostItem';
import PostForm from './PostForm';

const Posts = ({ getPosts, post }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);
  console.log(post.posts.map((po) => po._id));
  //   console.log(post.);

  return (
    <Fragment>
      {post.loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="text-primary">Posts</h1>
          <p className="lead">
            <i className="fas fa-user"></i> Welcome To The Community
          </p>
          <PostForm />
          <div className="posts">
            {post.posts.map((post) => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts);
