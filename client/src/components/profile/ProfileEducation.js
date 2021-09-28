import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = (education) => {
  // console.log(education.education);
  return (
    <div>
      <h3 className="text-dark">{education.education.school}</h3>
      <p>
        <Moment format="YYYY/MM/DD">{education.education.from}</Moment> -{' '}
        {!education.education.to ? (
          'Now'
        ) : (
          <Moment format="YYYY/MM/DD">{education.education.to}</Moment>
        )}
      </p>
      <p>
        <strong>Degree: </strong>
        {education.education.degree}
      </p>
      <p>
        <strong>Field Of Study: </strong>
        {education.education.fieldOfStudy}
      </p>
      <p>
        <strong>Description: </strong>
        {education.education.description}
      </p>
    </div>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired,
};

export default ProfileEducation;
