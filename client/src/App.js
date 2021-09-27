import { Fragment, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Alert from './components/layouts/Alert';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/dashboard';
import PrivateRoute from './components/Routing/PrivateRoute';
import CreateProfile from './components/profile-form/CreateProfile';

// ! Redux
import { Provider } from 'react-redux';
import store from './store';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser);
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/Register" component={Register}></Route>
              <Route exact path="/Login" component={Login}></Route>
              <PrivateRoute
                exact
                path="/dashboard"
                component={Dashboard}
              ></PrivateRoute>
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              ></PrivateRoute>
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
