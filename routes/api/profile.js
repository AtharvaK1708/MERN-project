const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

// @ access  Public
// @route    GET api/profile/ME
// @desc     Get current users profile
router.get('/me', auth, async (req, res) => {
  try {
    // console.log(req.user, 'aaaaaa');
    const profile = await Profile.findOne({ user: req.user }).populate('user', [
      'name',
      'avatar',
    ]);

    if (!profile) {
      res.status(400).json({
        msg: 'There is no profile with such id',
      });
    }
    res.status(200).json({
      profile,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// @ access  Public
// @route    POST api/profile
// @desc     Create a profile
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills are required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubUsername,
      skills,
      youtube,
      facebook,
      twitter,
      linkedin,
      instagram,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubUsername) profileFields.githubUsername = githubUsername;

    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user });
      console.log(req.user, 'aaaaaaaa');

      if (profile) {
        profile = await Profile.findByIdAndUpdate(
          { user: req.user },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      profile = new Profile(profileFields);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  }
);

// @access   Public
// @route    GET api/profile
// @desc     Get all profile
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.status(200).json({
      profiles,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// @access   Public
// @route    GET api/profile/user/:user_id
// @desc     Get profile by user id
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      res.status(404).json({
        msg: 'no profile found',
      });
    }

    res.status(200).json({
      profile,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
