const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const { findOne } = require('../../models/User');

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

// @access   Private
// @route    DELETE api/profile
// @desc     Delete profile, posts and user
router.delete('/', auth, async (req, res) => {
  try {
    // TODO - remove posts
    await Profile.findOneAndRemove({ user: req.user });
    await User.findOneAndRemove({ _id: req.user });

    res.json({
      msg: 'User deleted',
    });
  } catch (err) {
    res.status(500).send('SERVER ERROR');
  }
});

// @access   Private
// @route    PUT api/profile/experience
// @desc     Add experience
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'title is required').not().isEmpty(),
      check('company', 'company is required').not().isEmpty(),
      check('from', 'from is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: errors.array(),
      });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      // console.log(req);
      const profile = await Profile.findOne({ user: req.user });
      // console.log(profile);
      profile.experiences.unshift(newExp);
      // console.log(profile.experiences.unshift(newExp));
      await profile.save();
      res.json({
        profile,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json('SERVER ERROR');
    }
  }
);

// @access   Private
// @route    DELETE api/profile/experience/:exp_id
// @desc     DELETE experience
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user });
    const removeIndex = profile.experiences
      .map((el) => el.id)
      .indexOf(req.params.exp_id);
    profile.experiences.splice(removeIndex, 1);
    profile.save();
    res.json({ profile });
  } catch (err) {
    console.log(err);
    res.status(500).send('SERvER ERROR');
  }
});

// @access   Private
// @route    PUT api/profile/education
// @desc     Add education
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'school is required').not().isEmpty(),
      check('degree', 'degree is required').not().isEmpty(),
      check('fieldOfStudy', 'fieldOfStudy is required').not().isEmpty(),
      check('from', 'from is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: errors.array(),
      });
    }

    const { school, degree, fieldOfStudy, from, to, current, description } =
      req.body;

    const newEdu = {
      school,
      degree,
      fieldOfStudy,
      from,
      to,
      current,
      description,
    };

    try {
      // console.log(req);
      const profile = await Profile.findOne({ user: req.user });
      // console.log(profile);
      profile.education.unshift(newEdu);
      // console.log(profile.experiences.unshift(newExp));
      await profile.save();
      res.json({
        profile,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json('SERVER ERROR');
    }
  }
);

// @access   Private
// @route    DELETE api/profile/education/:edu_id
// @desc     DELETE education
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user });
    const removeIndex = profile.education
      .map((el) => el.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    profile.save();
    res.json({ profile });
  } catch (err) {
    console.log(err);
    res.status(500).send('SERvER ERROR');
  }
});

// @access   Public
// @route    GET api/profile/github/:username
// @desc     Get users github repo
router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'github_client_id'
      )}&client_secret=${config.get('github_secret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) {
        console.log(error);
      }
      if (response.statusCode !== 200) {
        return res.status(404).json({
          msg: 'no github found',
        });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.log(err);
    res.status(500).json('SERVER ERROR');
  }
});

module.exports = router;
