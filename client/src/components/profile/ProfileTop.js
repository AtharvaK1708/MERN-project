import React from 'react';
import PropTypes from 'prop-types';

const ProfileTop = ({ profile }) => {
  console.log(profile.profile.user.avatar);
  return (
    <div className="profile-top bg-primary p-2">
      <img
        className="round-img my-1"
        src={profile.profile.user.avatar}
        alt=""
      />
      <h1 className="large">{profile.profile.user.name}</h1>
      <p className="lead">
        {profile.profile.status} at{' '}
        {profile.profile.company && <span>{profile.profile.company}</span>}
      </p>
      <p>
        {profile.profile.location && <span>{profile.profile.location}</span>}
      </p>

      <div className="icons my-1">
        {profile.profile.website && (
          <a
            href={profile.profile.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-globe fa-2x"></i>
          </a>
        )}
        {profile.profile.social && profile.profile.social.twitter && (
          <a
            href={profile.profile.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-twitter fa-2x"></i>
          </a>
        )}
        {profile.profile.social && profile.profile.social.facebook && (
          <a
            href={profile.profile.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook fa-2x"></i>
          </a>
        )}
        {profile.profile.social && profile.profile.social.linkedin && (
          <a
            href={profile.profile.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-linkedin fa-2x"></i>
          </a>
        )}
        {profile.profile.social && profile.profile.social.youtube && (
          <a
            href={profile.profile.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-youtube fa-2x"></i>
          </a>
        )}
        {profile.profile.social && profile.profile.social.instagram && (
          <a
            href={profile.profile.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram fa-2x"></i>
          </a>
        )}
      </div>
    </div>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileTop;
