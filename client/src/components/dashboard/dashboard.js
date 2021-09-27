import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layouts/Spinner';
import { Link } from 'react-router-dom';
import { DashboardActions } from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { deleteAccount } from '../../actions/profile';

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return loading && profile === null ? (
    <Spinner></Spinner>
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead"></p>
      <i className="fas fa-user"></i> Welcome {user && user.user.name}
      {profile !== null ? (
        <Fragment>
          <DashboardActions></DashboardActions>
          <Experience experience={profile.profile.experiences}></Experience>
          <Education education={profile.profile.education}></Education>

          <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus"></i>
              Delete My Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>
            You have not setup a profile, please add some information about
            yourself.
          </p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );

  // return <div>Dashboard</div>;
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
