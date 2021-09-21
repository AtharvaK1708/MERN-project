const express = require('express');
const router = express.Router();

// @ access  Public
// @route    GET api/auth
// @desc     Test
router.get('/', (req, res) => {
  res.send('Auth route');
});

module.exports = router;
