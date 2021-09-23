const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @ access  Private
// @route    POST api/posts
// @desc     create a post
router.post(
  '/',
  [auth, [check('text', 'text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    try {
      const user = await User.findById(req.user).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user,
      });

      const post = await newPost.save();
      res.json({ post });
    } catch (err) {
      console.log(err);
      res.status(500).send('SERVER ERROR');
    }
  }
);

// @ access  Private
// @route    GET api/posts
// @desc     Get all posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send('SERVER ERROR');
  }
});

// @ access  Private
// @route    GET api/posts/:id
// @desc     Get all posts by id
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        msg: 'No posts found',
      });
    }
    res.json(post);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'No posts found',
      });
    }
    console.log(err);
    res.status(500).send('SERVER ERROR');
  }
});

// @ access  Private
// @route    DELETE api/posts/:id
// @desc     Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        msg: 'No posts found',
      });
    }

    if (post.user.toString() !== req.user) {
      return res.status(401).json({
        msg: 'User not authorized',
      });
    }

    await post.remove();

    res.json({
      msg: 'Post removed',
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'No posts found',
      });
    }
    console.log(err);
    res.status(500).send('SERVER ERROR');
  }
});

// @ access  Private
// @route    PUT api/posts/like/:id
// @desc     Like a post
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user).length > 0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user });
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.log(err);
    res.status(500).send('SERVER ERROR');
  }
});

// @ access  Private
// @route    PUT api/posts/unlike/:id
// @desc     unlike a post
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user).length ===
      0
    ) {
      return res.status(400).json({ msg: 'Post has not been liked' });
    }

    const removeIndex = post.likes.map((like) =>
      like.user.toString().indexOf(req.user)
    );
    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.log(err);
    res.status(500).send('SERVER ERROR');
  }
});

// @ access  Private
// @route    POST api/posts/comment/:id
// @desc     create a comment
router.post(
  '/comment/:id',
  [auth, [check('text', 'text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    try {
      const user = await User.findById(req.user).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user,
      };

      post.comments.unshift(newComment);
      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.log(err);
      res.status(500).send('SERVER ERROR');
    }
  }
);

// @ access  Private
// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     DElete a comment
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({
        msg: 'No comment found',
      });
    }

    if (comment.user.toString() !== req.user) {
      return res.status(401).json({ msg: 'user not authorised' });
    }

    const removeIndex = post.comments.map((comment) =>
      comment.user.toString().indexOf(req.user)
    );
    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.log(err);
    res.status(500).send('SERVER ERROR');
  }
});

module.exports = router;
