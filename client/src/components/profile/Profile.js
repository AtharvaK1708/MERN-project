import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layouts/Spinner';
import { getProfileById } from '../../actions/profile';
import { Link } from 'react-router-dom';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';

const Profile = ({
  getProfileById,
  profile: { profile, loading },
  auth,
  match,
}) => {
  useEffect(() => {
    let isCancelled = false;
    console.log(isCancelled);
    if (!isCancelled) {
      getProfileById(match.params.id);
    }

    return () => {
      isCancelled = true;
    };
  }, [getProfileById]);
  // console.log(profile.profile.experiences, 'bbbbbbbbbb');
  // if (profile === null) {
  //   getProfileById(match.params.id);
  // }
  // console.log(match.params.id);
  console.log(profile);
  // console.log(auth);
  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/Profiles" className="btn btn-light">
            Go back
          </Link>
          {auth.isAuthenticated &&
          auth.loading === false &&
          auth.user.user._id === profile.profile.user._id ? (
            <Link to="/edit-profile" className="btn btn-dark">
              Edit Profile
            </Link>
          ) : null}
          <div class="profile-grid my-1">
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className="profile-exp bg-light p-2">
              <h2 className="text-primary">Experience</h2>
              {profile.profile.experiences.length > 0 ? (
                <Fragment>
                  {profile.profile.experiences.map((exp) => (
                    <ProfileExperience key={exp._id} experience={exp} />
                  ))}
                </Fragment>
              ) : (
                <h4>No experiences added</h4>
              )}
            </div>
            <div className="profile-edu bg-light p-2">
              <h2 className="text-primary">Education</h2>
              {profile.profile.education.length > 0 ? (
                <Fragment>
                  {profile.profile.education.map((edu) => (
                    <ProfileEducation key={edu._id} education={edu} />
                  ))}
                </Fragment>
              ) : (
                <h4>No education added</h4>
              )}
            </div>
            {profile.profile.githubUsername && (
              <ProfileGithub username={profile.profile.githubUsername} />
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
