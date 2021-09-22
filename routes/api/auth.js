const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

// @ access  Public
// @route    GET api/auth
// @desc     Test
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    res.json({
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// @ access  Public
// @route    POST api/auth
// @desc     Authenticate user and get token
router.post(
  '/',
  [
    check('email', 'please include a valid email').isEmail(),
    check('password', 'Password required ').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email: email });
      console.log(user);
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              message: 'Invalid credentials',
            },
          ],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          errors: [
            {
              message: 'Invalid credentials',
            },
          ],
        });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwt_secret'),
        {
          expiresIn: 3600000,
        },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({
            token,
          });
        }
      );

      console.log(req.body);
      // res.send('User registered');
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
