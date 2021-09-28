import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = (experience) => {
  // console.log(experience.experience);
  return (
    <div>
      <h3 className="text-dark">{experience.experience.company}</h3>
      <p>
        <Moment format="YYYY/MM/DD">{experience.experience.from}</Moment> -{' '}
        {!experience.experience.to ? (
          'Now'
        ) : (
          <Moment format="YYYY/MM/DD">{experience.experience.to}</Moment>
        )}
      </p>
      <p>
        <strong>Position: </strong>
        {experience.experience.title}
      </p>

      <p>
        <strong>Description: </strong>
        {experience.experience.description}
      </p>
    </div>
  );
};

ProfileExperience.propTypes = {
  experience: PropTypes.object.isRequired,
};

export default ProfileExperience;
