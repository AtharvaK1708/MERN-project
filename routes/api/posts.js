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

module.exports = router;
