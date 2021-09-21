const express = require('express');
const router = express.Router();

// @ access  Public
// @route    GET api/posts
// @desc     Test
router.get('/', (req, res) => {
  res.send('posts route');
});

module.exports = router;
