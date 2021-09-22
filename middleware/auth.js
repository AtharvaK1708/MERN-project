const jwt = require('jsonwebtoken');
const config = require('config');

const authUser = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    res.status(401).json({
      message: 'No token, authorization DENIED',
    });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwt_secret'));
    // console.log(decoded.user.id);
    req.user = decoded.user.id;

    next();
  } catch (err) {
    res.status(401).json({
      message: 'token is not valid',
    });
  }
};

module.exports = authUser;
